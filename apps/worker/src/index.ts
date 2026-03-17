import { Worker } from "bullmq";
import { prisma } from "@reelgen/db";
import {
  createPublishingQueue,
  createRedisConnection,
  QUEUE_NAMES,
} from "@reelgen/queue";
import { YouTubePublisher } from "@reelgen/social";
import { buildFfmpegCommand } from "@reelgen/video";

const connection = createRedisConnection();

const worker = new Worker(
  QUEUE_NAMES.generation,
  async (job) => {
    console.log(`[worker] received job ${job.name} ${job.id}`);

    if (job.name === "render-video") {
      const { videoProjectId, workspaceId } = job.data as {
        videoProjectId: string;
        workspaceId: string;
      };

      const renderSpec = await prisma.renderSpec.findFirst({
        where: { videoProjectId },
        orderBy: { createdAt: "desc" },
      });

      if (!renderSpec) {
        return;
      }

      const command = buildFfmpegCommand({
        width: renderSpec.width,
        height: renderSpec.height,
        fps: renderSpec.fps,
        scenes: renderSpec.scenes as Array<{
          sceneNumber: number;
          narrationText: string;
          visualPrompt: string;
          captionText: string;
          durationSec: number;
          transition: string;
          animationHint: string;
        }>,
      });

      console.log(`[worker] render command: ${command.join(" ")}`);

      const outputAsset = await prisma.asset.create({
        data: {
          workspaceId,
          ownerType: "videoProject",
          ownerId: videoProjectId,
          type: "video",
          source: "generated",
          storageKey: `renders/${videoProjectId}.mp4`,
          mimeType: "video/mp4",
          sizeBytes: 0,
        },
      });

      const thumbnailAsset = await prisma.asset.create({
        data: {
          workspaceId,
          ownerType: "videoProject",
          ownerId: videoProjectId,
          type: "thumbnail",
          source: "generated",
          storageKey: `renders/${videoProjectId}.jpg`,
          mimeType: "image/jpeg",
          sizeBytes: 0,
        },
      });

      await prisma.videoProject.update({
        where: { id: videoProjectId },
        data: {
          status: "ready",
          outputAssetId: outputAsset.id,
          thumbnailAssetId: thumbnailAsset.id,
        },
      });

      return;
    }

    if (job.name !== "generate-video") {
      return;
    }

    const { videoProjectId, workspaceId, seriesId } = job.data as {
      videoProjectId: string;
      workspaceId: string;
      seriesId: string;
    };

    await prisma.videoProject.update({
      where: { id: videoProjectId },
      data: { status: "generating_script" },
    });

    await prisma.generationJob.updateMany({
      where: { videoProjectId, state: "queued" },
      data: { state: "running", startedAt: new Date() },
    });

    const series = await prisma.series.findUnique({
      where: { id: seriesId },
    });

    const script = await prisma.scriptVersion.create({
      data: {
        videoProjectId,
        rawPrompt: series?.niche ?? "general",
        title: series ? `${series.name} — Draft` : "Draft video",
        hook: "Did you know this changes everything?",
        body: "Here is a quick breakdown of the topic in three short beats.",
        cta: "Follow for more daily shorts.",
        caption: "New short ready to publish.",
        hashtags: series?.defaultHashtags ?? ["#shorts"],
      },
    });

    await prisma.videoProject.update({
      where: { id: videoProjectId },
      data: { status: "generating_storyboard", currentScriptId: script.id },
    });

    const storyboard = await prisma.storyboardVersion.create({
      data: {
        videoProjectId,
        totalDurationSec: series?.targetDurationSec ?? 45,
        scenes: [
          {
            sceneNumber: 1,
            narrationText: script.hook,
            visualPrompt: "Minimal abstract shapes on gradient background.",
            captionText: script.caption,
            durationSec: series?.targetDurationSec ?? 45,
            transition: "fade",
            animationHint: "slow-zoom",
          },
        ],
      },
    });

    await prisma.videoProject.update({
      where: { id: videoProjectId },
      data: {
        status: "rendering",
        currentStoryboardId: storyboard.id,
      },
    });

    const renderSpec = await prisma.renderSpec.create({
      data: {
        videoProjectId,
        width: 1080,
        height: 1920,
        fps: 30,
        scenes: storyboard.scenes,
      },
    });

    await prisma.videoProject.update({
      where: { id: videoProjectId },
      data: { status: "ready", currentRenderSpecId: renderSpec.id },
    });

    await prisma.generationJob.updateMany({
      where: { videoProjectId },
      data: { state: "completed", completedAt: new Date() },
    });
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`[worker] completed job ${job.name} ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`[worker] failed job ${job?.name} ${job?.id}`, err);
});

const publishWorker = new Worker(
  QUEUE_NAMES.publishing,
  async (job) => {
    if (job.name !== "publish") {
      return;
    }

    const { publishScheduleId } = job.data as { publishScheduleId: string };
    const schedule = await prisma.publishSchedule.findUnique({
      where: { id: publishScheduleId },
    });

    if (!schedule) {
      return;
    }

    await prisma.publishSchedule.update({
      where: { id: publishScheduleId },
      data: { status: "publishing" },
    });

    const publisher = new YouTubePublisher();
    const result = await publisher.publish({
      videoAssetKey: "mock-key",
      title: "ReelGen Short",
      description: schedule.captionOverride ?? undefined,
    });

    await prisma.publishAttempt.create({
      data: {
        publishScheduleId,
        platform: schedule.platform,
        requestPayload: { scheduleId: publishScheduleId },
        responsePayload: result,
        remotePostId: result.remotePostId,
        postUrl: result.postUrl,
        status: "published",
      },
    });

    await prisma.publishSchedule.update({
      where: { id: publishScheduleId },
      data: { status: "published" },
    });

    await prisma.videoProject.update({
      where: { id: schedule.videoProjectId },
      data: { status: "published" },
    });
  },
  { connection }
);

publishWorker.on("completed", (job) => {
  console.log(`[worker] completed publish job ${job.name} ${job.id}`);
});

publishWorker.on("failed", (job, err) => {
  console.error(`[worker] failed publish job ${job?.name} ${job?.id}`, err);
});

async function sweepScheduledPublishes() {
  const due = await prisma.publishSchedule.findMany({
    where: {
      status: "pending",
      scheduledAt: { lte: new Date() },
    },
    take: 10,
  });

  if (due.length === 0) {
    return;
  }

  const queue = createPublishingQueue();
  for (const schedule of due) {
    await prisma.publishSchedule.update({
      where: { id: schedule.id },
      data: { status: "queued" },
    });
    await queue.add(
      "publish",
      { publishScheduleId: schedule.id },
      { attempts: 3, removeOnComplete: true, removeOnFail: false }
    );
  }
}

async function cleanupExpiredAssets() {
  const now = new Date();
  await prisma.asset.deleteMany({
    where: {
      retentionUntil: { lte: now },
    },
  });
}

setInterval(() => {
  sweepScheduledPublishes().catch((err) =>
    console.error("[worker] schedule sweep failed", err)
  );
  cleanupExpiredAssets().catch((err) =>
    console.error("[worker] cleanup failed", err)
  );
}, 30_000);
