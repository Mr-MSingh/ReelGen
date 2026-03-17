import { NextResponse } from "next/server";
import { prisma } from "@reelgen/db";
import { requireWorkspace } from "@/lib/api";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireWorkspace();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const video = await prisma.videoProject.findFirst({
    where: { id: params.id, workspaceId: auth.workspaceId },
    include: {
      scripts: { orderBy: { createdAt: "desc" }, take: 1 },
      storyboards: { orderBy: { createdAt: "desc" }, take: 1 },
      renderSpecs: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!video) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(video);
}
