"use client";

import { useState } from "react";

export default function IntegrationsActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectYouTube = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/integrations/youtube/connect", {
        method: "POST",
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error ?? "Failed to connect");
      }
      window.location.href = payload.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const mockCallback = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/integrations/youtube/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: "local" }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error ?? "Callback failed");
      }
      window.location.reload();
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
          onClick={connectYouTube}
          disabled={loading}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 disabled:opacity-60"
        >
          Connect YouTube
        </button>
        <button
          type="button"
          onClick={mockCallback}
          disabled={loading}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 disabled:opacity-60"
        >
          Mock callback
        </button>
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
