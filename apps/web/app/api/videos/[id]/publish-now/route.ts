import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@reelgen/db";
import { createPublishingQueue } from "@reelgen/queue";
import { requireWorkspace } from "@/lib/api";
import { recordAuditLog } from "@/lib/audit";
import { checkIdempotency } from "@/lib/idempotency";
import { rateLimit } from "@/lib/rate-limit";

const inputSchema = z.object({
  connectedAccountId: z.string().min(2),
  captionOverride: z.string().optional(),
  hashtagsOverride: z.array(z.string()).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireWorkspace();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = rateLimit(`publish:${auth.workspaceId}`, 10, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const idempotencyKey = request.headers.get("Idempotency-Key");
  const idempotency = await checkIdempotency({
    workspaceId: auth.workspaceId,
    scope: "publish-now",
    key: idempotencyKey,
  });
  if (!idempotency.ok) {
    return NextResponse.json({ error: "Duplicate request" }, { status: 409 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const video = await prisma.videoProject.findFirst({
    where: { id: params.id, workspaceId: auth.workspaceId },
  });

  if (!video) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }

  const account = await prisma.connectedAccount.findFirst({
    where: {
      id: parsed.data.connectedAccountId,
      workspaceId: auth.workspaceId,
      status: "active",
    },
  });

  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const schedule = await prisma.publishSchedule.create({
    data: {
      workspaceId: auth.workspaceId,
      videoProjectId: video.id,
      platform: account.platform,
      connectedAccountId: account.id,
      scheduledAt: new Date(),
      timezone: "UTC",
      captionOverride: parsed.data.captionOverride,
      hashtagsOverride: parsed.data.hashtagsOverride,
      status: "queued",
    },
  });

  const queue = createPublishingQueue();
  await queue.add(
    "publish",
    { publishScheduleId: schedule.id },
    { attempts: 3, removeOnComplete: true, removeOnFail: false }
  );

  await prisma.videoProject.update({
    where: { id: video.id },
    data: { status: "publishing" },
  });

  await recordAuditLog({
    workspaceId: auth.workspaceId,
    actorUserId: auth.userId,
    eventType: "video.publish_now",
    entityType: "PublishSchedule",
    entityId: schedule.id,
    payload: { videoProjectId: video.id },
  });

  return NextResponse.json({ id: schedule.id });
}
