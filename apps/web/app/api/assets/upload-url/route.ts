import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@reelgen/db";
import { requireWorkspace } from "@/lib/api";
import { createUploadUrl } from "@/lib/storage";

const inputSchema = z.object({
  ownerType: z.string().min(2),
  ownerId: z.string().min(2),
  type: z.enum(["image", "audio", "subtitle", "video", "thumbnail", "transcript", "music"]),
  mimeType: z.string().min(3),
  sizeBytes: z.number().int().min(1),
});

export async function POST(request: Request) {
  const auth = await requireWorkspace();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const upload = await createUploadUrl({
    workspaceId: auth.workspaceId,
    contentType: parsed.data.mimeType,
  });

  const asset = await prisma.asset.create({
    data: {
      workspaceId: auth.workspaceId,
      ownerType: parsed.data.ownerType,
      ownerId: parsed.data.ownerId,
      type: parsed.data.type,
      source: "uploaded",
      storageKey: upload.key,
      mimeType: parsed.data.mimeType,
      sizeBytes: parsed.data.sizeBytes,
    },
  });

  return NextResponse.json({
    uploadUrl: upload.url,
    assetId: asset.id,
    storageKey: asset.storageKey,
  });
}
