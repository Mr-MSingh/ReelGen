"use client";

import { useState } from "react";

export default function BillingActions({ planCode }: { planCode: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planCode: code }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error ?? "Checkout failed");
      }
      window.location.href = payload.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const openPortal = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error ?? "Portal failed");
      }
      window.location.href = payload.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={() => startCheckout("starter")}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 disabled:opacity-60"
        >
          Upgrade to Starter
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => startCheckout("pro")}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 disabled:opacity-60"
        >
          Upgrade to Pro
        </button>
        {planCode !== "free" ? (
          <button
            type="button"
            disabled={loading}
            onClick={openPortal}
            className="rounded-lg border border-slate-800 px-4 py-2 text-sm font-medium text-slate-300 disabled:opacity-60"
          >
            Manage subscription
          </button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
