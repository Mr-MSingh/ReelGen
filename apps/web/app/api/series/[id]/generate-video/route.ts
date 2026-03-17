import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@reelgen/db";
import { createGenerationQueue } from "@reelgen/queue";
import {
  debitCredits,
  getLatestBalance,
  isWithinMonthlyVideoLimit,
  resolvePlan,
} from "@reelgen/billing";
import { requireWorkspace } from "@/lib/api";
import { recordAuditLog } from "@/lib/audit";
import { checkIdempotency } from "@/lib/idempotency";
import { rateLimit } from "@/lib/rate-limit";

const inputSchema = z.object({
  topicPrompt: z.string().min(3).optional(),
  language: z.string().min(2).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireWorkspace();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = rateLimit(`generate:${auth.workspaceId}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const idempotencyKey = request.headers.get("Idempotency-Key");
  const idempotency = await checkIdempotency({
    workspaceId: auth.workspaceId,
    scope: "generate-video",
    key: idempotencyKey,
  });
  if (!idempotency.ok) {
    return NextResponse.json({ error: "Duplicate request" }, { status: 409 });
  }

  const series = await prisma.series.findFirst({
    where: { id: params.id, workspaceId: auth.workspaceId },
  });

  if (!series) {
    return NextResponse.json({ error: "Series not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const workspace = await prisma.workspace.findUnique({
    where: { id: auth.workspaceId },
    include: { subscription: true },
  });

  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  const planCode = workspace.subscription?.planCode ?? workspace.planId ?? "free";
  const plan = resolvePlan(planCode);
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const usedThisMonth = await prisma.videoProject.count({
    where: {
      workspaceId: auth.workspaceId,
      createdAt: { gte: startOfMonth, lt: endOfMonth },
    },
  });

  if (!isWithinMonthlyVideoLimit(usedThisMonth, plan.monthlyVideoLimit)) {
    return NextResponse.json({ error: "Monthly video limit reached" }, { status: 403 });
  }

  const balance = await getLatestBalance(auth.workspaceId);
  if (balance <= 0) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  const video = await prisma.videoProject.create({
    data: {
      workspaceId: auth.workspaceId,
      seriesId: series.id,
      title: `${series.name} — Draft`,
      topicPrompt: parsed.data.topicPrompt ?? null,
      language: parsed.data.language ?? workspace.defaultLanguage ?? "en",
      status: "queued",
      reviewState: "pending",
      generationVersion: 1,
    },
  });

  await prisma.generationJob.create({
    data: {
      workspaceId: auth.workspaceId,
      videoProjectId: video.id,
      jobType: "generate-video",
      state: "queued",
      attempts: 0,
      inputPayload: parsed.data,
    },
  });

  await debitCredits({
    workspaceId: auth.workspaceId,
    amount: 1,
    reason: "Video generation",
    referenceType: "videoProject",
    referenceId: video.id,
  });

  await recordAuditLog({
    workspaceId: auth.workspaceId,
    actorUserId: auth.userId,
    eventType: "video.generate",
    entityType: "VideoProject",
    entityId: video.id,
    payload: { seriesId: series.id },
  });

  const queue = createGenerationQueue();
  await queue.add(
    "generate-video",
    {
      videoProjectId: video.id,
      workspaceId: auth.workspaceId,
      seriesId: series.id,
    },
    { attempts: 3, removeOnComplete: true, removeOnFail: false }
  );

  return NextResponse.json({ id: video.id });
}
