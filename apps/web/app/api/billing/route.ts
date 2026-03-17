import { NextResponse } from "next/server";
import { prisma } from "@reelgen/db";
import { getLatestBalance } from "@reelgen/billing";
import { requireWorkspace } from "@/lib/api";

export async function GET() {
  const auth = await requireWorkspace();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { workspaceId: auth.workspaceId },
  });
  const credits = await getLatestBalance(auth.workspaceId);

  return NextResponse.json({ subscription, credits });
}
