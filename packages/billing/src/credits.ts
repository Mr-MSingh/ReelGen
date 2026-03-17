import { prisma } from "@reelgen/db";

export async function getLatestBalance(workspaceId: string) {
  const latest = await prisma.creditLedger.findFirst({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
  });

  return latest?.balanceAfter ?? 0;
}

export async function applyCreditDelta(params: {
  workspaceId: string;
  delta: number;
  type: "monthly" | "purchased" | "bonus" | "adjustment";
  reason: string;
  referenceType?: string;
  referenceId?: string;
}) {
  const balanceBefore = await getLatestBalance(params.workspaceId);
  const balanceAfter = computeBalanceAfter(balanceBefore, params.delta);

  return prisma.creditLedger.create({
    data: {
      workspaceId: params.workspaceId,
      type: params.type,
      delta: params.delta,
      balanceAfter,
      reason: params.reason,
      referenceType: params.referenceType,
      referenceId: params.referenceId,
    },
  });
}

export async function debitCredits(params: {
  workspaceId: string;
  amount: number;
  reason: string;
  referenceType?: string;
  referenceId?: string;
}) {
  return applyCreditDelta({
    workspaceId: params.workspaceId,
    delta: -Math.abs(params.amount),
    type: "adjustment",
    reason: params.reason,
    referenceType: params.referenceType,
    referenceId: params.referenceId,
  });
}

export function computeBalanceAfter(balanceBefore: number, delta: number) {
  return balanceBefore + delta;
}
