import { prisma } from "@reelgen/db";

export async function recordAuditLog(params: {
  workspaceId: string;
  actorUserId?: string;
  eventType: string;
  entityType: string;
  entityId: string;
  payload?: Record<string, unknown>;
}) {
  return prisma.auditLog.create({
    data: {
      workspaceId: params.workspaceId,
      actorUserId: params.actorUserId,
      eventType: params.eventType,
      entityType: params.entityType,
      entityId: params.entityId,
      payload: params.payload ?? {},
    },
  });
}
