import { NextResponse } from "next/server";
import { prisma } from "@reelgen/db";
import { requireWorkspace } from "@/lib/api";

export async function GET() {
  const auth = await requireWorkspace();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const schedules = await prisma.publishSchedule.findMany({
    where: { workspaceId: auth.workspaceId },
    orderBy: { scheduledAt: "asc" },
  });

  return NextResponse.json(schedules);
}
