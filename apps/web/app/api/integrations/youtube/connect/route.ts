import { NextResponse } from "next/server";
import { requireWorkspace } from "@/lib/api";
import { recordAuditLog } from "@/lib/audit";

export async function POST() {
  const auth = await requireWorkspace();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: Replace with real OAuth URL.
  const url = `${process.env.APP_BASE_URL}/api/integrations/youtube/callback?code=mock`;

  await recordAuditLog({
    workspaceId: auth.workspaceId,
    actorUserId: auth.userId,
    eventType: "integration.connect_start",
    entityType: "ConnectedAccount",
    entityId: "youtube",
    payload: { platform: "youtube" },
  });

  return NextResponse.json({ url });
}
