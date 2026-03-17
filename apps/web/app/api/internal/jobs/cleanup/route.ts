import { NextResponse } from "next/server";
import { prisma } from "@reelgen/db";

export async function POST() {
  const now = new Date();
  const result = await prisma.asset.deleteMany({
    where: { retentionUntil: { lte: now } },
  });

  return NextResponse.json({ deleted: result.count });
}
