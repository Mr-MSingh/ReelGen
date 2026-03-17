import { NextResponse } from "next/server";
import { prisma } from "@reelgen/db";
import { requireWorkspace } from "@/lib/api";
import { recordAuditLog } from "@/lib/audit";
import { encryptText } from "@reelgen/utils";

export async function POST(request: Request) {
  const auth = await requireWorkspace();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json().catch(() => ({}));
  const code = payload.code as string | undefined;

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  // TODO: Exchange code for tokens with YouTube OAuth.
  const accessToken = encryptText(`mock_access_${code}`);
  const refreshToken = encryptText(`mock_refresh_${code}`);

  const account = await prisma.connectedAccount.create({
    data: {
      workspaceId: auth.workspaceId,
      platform: "youtube",
      platformAccountId: `yt_${Date.now()}`,
      channelName: "Mock Channel",
      scopes: ["youtube.upload"],
      encryptedTokenRef: accessToken,
      encryptedRefreshTokenRef: refreshToken,
      status: "active",
      lastValidatedAt: new Date(),
    },
  });

  await recordAuditLog({
    workspaceId: auth.workspaceId,
    actorUserId: auth.userId,
    eventType: "integration.connected",
    entityType: "ConnectedAccount",
    entityId: account.id,
    payload: { platform: "youtube" },
  });

  return NextResponse.json({ id: account.id });
}
