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

  const attempt = await prisma.publishAttempt.findFirst({
    where: { id: params.id },
    include: {
      schedule: true,
    },
  });

  if (!attempt || attempt.schedule.workspaceId !== auth.workspaceId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(attempt);
}
