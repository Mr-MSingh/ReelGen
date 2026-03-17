import Link from "next/link";
import { PLANS } from "@reelgen/billing";

export default function PricingPage() {
  const plans = Object.values(PLANS);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-5xl px-6 py-16">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
            Pricing
          </p>
          <h1 className="text-4xl font-semibold">Pick a plan that scales.</h1>
          <p className="text-sm text-slate-300">
            Upgrade anytime. Credits reset monthly.
          </p>
        </header>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.code}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
            >
              <h2 className="text-lg font-semibold">{plan.name}</h2>
              <p className="mt-2 text-sm text-slate-300">
                {plan.monthlyVideoLimit} videos / month
              </p>
              <p className="text-sm text-slate-400">
                {plan.monthlyCreditsIncluded} credits included
              </p>
              <Link
                href="/sign-in"
                className="mt-4 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900"
              >
                Get started
              </Link>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
