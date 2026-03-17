import { NextResponse } from "next/server";
import { prisma } from "@reelgen/db";
import { requireWorkspace } from "@/lib/api";
import { recordAuditLog } from "@/lib/audit";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireWorkspace();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await prisma.connectedAccount.deleteMany({
    where: { id: params.id, workspaceId: auth.workspaceId },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await recordAuditLog({
    workspaceId: auth.workspaceId,
    actorUserId: auth.userId,
    eventType: "integration.disconnected",
    entityType: "ConnectedAccount",
    entityId: params.id,
  });

  return NextResponse.json({ ok: true });
}
