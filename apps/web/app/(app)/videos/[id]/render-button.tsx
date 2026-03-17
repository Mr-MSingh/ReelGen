"use client";

import { useState } from "react";

export default function RenderButton({ videoId }: { videoId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startRender = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/videos/${videoId}/render`, {
        method: "POST",
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error ?? "Render failed");
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
      <button
        type="button"
        onClick={startRender}
        disabled={loading}
        className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 disabled:opacity-60"
      >
        {loading ? "Rendering..." : "Render video"}
      </button>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
