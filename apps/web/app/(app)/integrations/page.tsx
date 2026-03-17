import { prisma } from "@reelgen/db";
import { getSession } from "@/lib/session";
import IntegrationsActions from "./integrations-actions";

export default async function IntegrationsPage() {
  const session = await getSession();
  const workspaceId = session?.user?.workspaceId;

  if (!workspaceId) {
    return null;
  }

  const accounts = await prisma.connectedAccount.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Integrations</h1>
        <p className="mt-1 text-sm text-slate-300">
          Connect social accounts for publishing.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-900 bg-slate-900/50 p-6">
        <IntegrationsActions />
      </section>

      <section className="rounded-2xl border border-slate-900 bg-slate-900/50 p-6">
        <h2 className="text-lg font-semibold">Connected accounts</h2>
        <div className="mt-4 space-y-3">
          {accounts.length === 0 ? (
            <p className="text-sm text-slate-400">No accounts connected.</p>
          ) : (
            accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between rounded-lg border border-slate-800 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">
                    {account.platform} — {account.channelName ?? "Unknown"}
                  </p>
                  <p className="text-xs text-slate-400">{account.status}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
