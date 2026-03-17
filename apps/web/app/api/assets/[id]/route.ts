import { NextResponse } from "next/server";
import { prisma } from "@reelgen/db";
import { requireWorkspace } from "@/lib/api";
import { createDownloadUrl } from "@/lib/storage";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireWorkspace();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const asset = await prisma.asset.findFirst({
    where: { id: params.id, workspaceId: auth.workspaceId },
  });

  if (!asset) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const downloadUrl = await createDownloadUrl(asset.storageKey);

  return NextResponse.json({ asset, downloadUrl });
}
