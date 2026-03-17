import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@reelgen/db";
import { requireWorkspace } from "@/lib/api";
import { recordAuditLog } from "@/lib/audit";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  niche: z.string().min(2).optional(),
  formatType: z.string().min(2).optional(),
  targetDurationSec: z.number().int().min(5).optional(),
  tone: z.string().min(2).optional(),
  artStyle: z.string().min(2).optional(),
  voiceStyle: z.string().min(2).optional(),
  musicMode: z.string().min(2).optional(),
  postingCadence: z.string().min(2).optional(),
  defaultCaptionTemplate: z.string().optional(),
  defaultHashtags: z.array(z.string()).optional(),
  defaultPlatforms: z.array(z.enum(["youtube", "instagram", "tiktok"])).optional(),
  status: z.string().min(2).optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireWorkspace();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const series = await prisma.series.findFirst({
    where: { id: params.id, workspaceId: auth.workspaceId },
  });

  if (!series) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(series);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireWorkspace();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.series.updateMany({
    where: { id: params.id, workspaceId: auth.workspaceId },
    data: parsed.data,
  });

  if (updated.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await recordAuditLog({
    workspaceId: auth.workspaceId,
    actorUserId: auth.userId,
    eventType: "series.updated",
    entityType: "Series",
    entityId: params.id,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireWorkspace();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deleted = await prisma.series.deleteMany({
    where: { id: params.id, workspaceId: auth.workspaceId },
  });

  if (deleted.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await recordAuditLog({
    workspaceId: auth.workspaceId,
    actorUserId: auth.userId,
    eventType: "series.deleted",
    entityType: "Series",
    entityId: params.id,
  });

  return NextResponse.json({ ok: true });
}
