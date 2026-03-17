import { getSession } from "@/lib/session";

export async function requireWorkspace() {
  const session = await getSession();
  const userId = session?.user?.id;
  const workspaceId = session?.user?.workspaceId;

  if (!userId || !workspaceId) {
    return null;
  }

  return { userId, workspaceId };
}
