import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@reelgen/db";
import { requireWorkspace } from "@/lib/api";
import { recordAuditLog } from "@/lib/audit";

const createSchema = z.object({
  name: z.string().min(2),
  niche: z.string().min(2),
  formatType: z.string().min(2),
  targetDurationSec: z.number().int().min(5),
  tone: z.string().min(2),
  artStyle: z.string().min(2),
  voiceStyle: z.string().min(2),
  musicMode: z.string().min(2),
  postingCadence: z.string().min(2),
  defaultCaptionTemplate: z.string().optional(),
  defaultHashtags: z.array(z.string()).optional(),
  defaultPlatforms: z.array(z.enum(["youtube", "instagram", "tiktok"])).optional(),
});

export async function GET() {
  const auth = await requireWorkspace();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const series = await prisma.series.findMany({
    where: { workspaceId: auth.workspaceId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(series);
}

export async function POST(request: Request) {
  const auth = await requireWorkspace();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const created = await prisma.series.create({
    data: {
      workspaceId: auth.workspaceId,
      status: "active",
      defaultHashtags: [],
      defaultPlatforms: ["youtube"],
      ...parsed.data,
    },
  });

  await recordAuditLog({
    workspaceId: auth.workspaceId,
    actorUserId: auth.userId,
    eventType: "series.created",
    entityType: "Series",
    entityId: created.id,
  });

  return NextResponse.json({ id: created.id });
}
