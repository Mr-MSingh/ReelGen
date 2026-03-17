import { prisma } from "@reelgen/db";
import { getLatestBalance, PLANS } from "@reelgen/billing";
import { getSession } from "@/lib/session";
import BillingActions from "./billing-actions";

export default async function BillingPage() {
  const session = await getSession();
  const workspaceId = session?.user?.workspaceId;

  if (!workspaceId) {
    return null;
  }

  const [subscription, credits] = await Promise.all([
    prisma.subscription.findUnique({ where: { workspaceId } }),
    getLatestBalance(workspaceId),
  ]);

  const plan = PLANS[subscription?.planCode ?? "free"] ?? PLANS.free;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Billing</h1>
        <p className="mt-1 text-sm text-slate-300">
          Manage your plan, credits, and subscription.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-900 bg-slate-900/50 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase text-slate-400">Current plan</p>
            <p className="mt-2 text-lg font-semibold">{plan.name}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-400">Credits</p>
            <p className="mt-2 text-lg font-semibold">{credits}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-400">Video limit</p>
            <p className="mt-2 text-lg font-semibold">
              {plan.monthlyVideoLimit} / month
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-900 bg-slate-900/50 p-6">
        <h2 className="text-lg font-semibold">Upgrade options</h2>
        <p className="mt-1 text-sm text-slate-400">
          Switch plans instantly with Stripe Checkout.
        </p>
        <div className="mt-4">
          <BillingActions planCode={plan.code} />
        </div>
      </section>
    </div>
  );
}
