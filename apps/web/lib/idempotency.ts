import { prisma } from "@reelgen/db";

export async function checkIdempotency(params: {
  workspaceId: string;
  scope: string;
  key?: string | null;
}) {
  if (!params.key) {
    return { ok: true } as const;
  }

  const existing = await prisma.idempotencyKey.findFirst({
    where: {
      workspaceId: params.workspaceId,
      scope: params.scope,
      key: params.key,
    },
  });

  if (existing) {
    return { ok: false } as const;
  }

  await prisma.idempotencyKey.create({
    data: {
      workspaceId: params.workspaceId,
      scope: params.scope,
      key: params.key,
    },
  });

  return { ok: true } as const;
}
