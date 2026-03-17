"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GenerateButton({ seriesId }: { seriesId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/series/${seriesId}/generate-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.error ?? "Failed to generate video");
      }

      const payload = await res.json();
      router.push(`/videos/${payload.id}`);
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
        onClick={onGenerate}
        disabled={loading}
        className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 disabled:opacity-60"
      >
        {loading ? "Queueing..." : "Generate video"}
      </button>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
