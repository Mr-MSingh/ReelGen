import { prisma } from "@reelgen/db";
import { getSession } from "@/lib/session";

export default async function SettingsPage() {
  const session = await getSession();
  const workspaceId = session?.user?.workspaceId;

  const workspace = workspaceId
    ? await prisma.workspace.findUnique({
        where: { id: workspaceId },
      })
    : null;

  if (!workspace) {
    return null;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Workspace settings</h1>
        <p className="mt-1 text-sm text-slate-300">
          Manage workspace defaults.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-900 bg-slate-900/50 p-6 text-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-slate-400">Name</p>
            <p className="mt-1 font-medium">{workspace.name}</p>
          </div>
          <div>
            <p className="text-slate-400">Timezone</p>
            <p className="mt-1 font-medium">{workspace.timezone}</p>
          </div>
          <div>
            <p className="text-slate-400">Language</p>
            <p className="mt-1 font-medium">{workspace.defaultLanguage}</p>
          </div>
          <div>
            <p className="text-slate-400">Plan</p>
            <p className="mt-1 font-medium">{workspace.planId ?? "free"}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
