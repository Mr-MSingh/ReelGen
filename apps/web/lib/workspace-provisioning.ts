import { prisma } from "@reelgen/db";

type ProvisionUserInput = {
  userId: string;
  email: string;
  name?: string | null;
};

const DEFAULT_PLAN = {
  status: "trial",
  planCode: "free",
  monthlyVideoLimit: 5,
  monthlyCreditsIncluded: 50,
} as const;

export async function ensureWorkspaceForUser(input: ProvisionUserInput) {
  const existingWorkspace = await prisma.workspace.findFirst({
    where: { ownerUserId: input.userId },
    select: { id: true },
  });

  if (existingWorkspace) {
    return existingWorkspace;
  }

  const baseName = input.name ?? input.email.split("@")[0] ?? "Workspace";

  const workspace = await prisma.workspace.create({
    data: {
      ownerUserId: input.userId,
      name: `${baseName} Workspace`,
      timezone: "UTC",
      defaultLanguage: "en",
      planId: "free",
      subscription: {
        create: {
          status: DEFAULT_PLAN.status,
          planCode: DEFAULT_PLAN.planCode,
          monthlyVideoLimit: DEFAULT_PLAN.monthlyVideoLimit,
          monthlyCreditsIncluded: DEFAULT_PLAN.monthlyCreditsIncluded,
        },
      },
    },
    select: { id: true },
  });

  await prisma.creditLedger.create({
    data: {
      workspaceId: workspace.id,
      type: "monthly",
      delta: DEFAULT_PLAN.monthlyCreditsIncluded,
      balanceAfter: DEFAULT_PLAN.monthlyCreditsIncluded,
      reason: "Initial credit grant",
    },
  });

  return workspace;
}
