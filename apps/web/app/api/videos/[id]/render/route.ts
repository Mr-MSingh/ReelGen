import { NextResponse } from "next/server";
import { prisma } from "@reelgen/db";
import { createGenerationQueue } from "@reelgen/queue";
import { requireWorkspace } from "@/lib/api";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireWorkspace();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const video = await prisma.videoProject.findFirst({
    where: { id: params.id, workspaceId: auth.workspaceId },
  });

  if (!video) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }

  await prisma.videoProject.update({
    where: { id: video.id },
    data: { status: "rendering" },
  });

  const queue = createGenerationQueue();
  await queue.add(
    "render-video",
    { videoProjectId: video.id, workspaceId: auth.workspaceId },
    { attempts: 2, removeOnComplete: true, removeOnFail: false }
  );

  return NextResponse.json({ ok: true });
}
