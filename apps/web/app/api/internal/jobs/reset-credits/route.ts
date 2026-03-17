import { NextResponse } from "next/server";
import { prisma } from "@reelgen/db";
import { applyCreditDelta, resolvePlan } from "@reelgen/billing";
import { recordAuditLog } from "@/lib/audit";

export async function POST() {
  const workspaces = await prisma.workspace.findMany({
    include: { subscription: true },
  });

  for (const workspace of workspaces) {
    const planCode = workspace.subscription?.planCode ?? workspace.planId ?? "free";
    const plan = resolvePlan(planCode);
    await applyCreditDelta({
      workspaceId: workspace.id,
      delta: plan.monthlyCreditsIncluded,
      type: "monthly",
      reason: "Monthly credit reset",
    });

    await recordAuditLog({
      workspaceId: workspace.id,
      eventType: "credits.reset",
      entityType: "Workspace",
      entityId: workspace.id,
      payload: { planCode, credits: plan.monthlyCreditsIncluded },
    });
  }

  return NextResponse.json({ ok: true, count: workspaces.length });
}
