import { NextResponse } from "next/server";
import { prisma } from "@reelgen/db";
import { requireWorkspace } from "@/lib/api";

export async function GET() {
  const auth = await requireWorkspace();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accounts = await prisma.connectedAccount.findMany({
    where: { workspaceId: auth.workspaceId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(accounts);
}
