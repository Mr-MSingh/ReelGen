"use client";

import { useState } from "react";

type Option = {
  id: string;
  label: string;
};

export default function PublishingActions({
  videos,
  accounts,
}: {
  videos: Option[];
  accounts: Option[];
}) {
  const [videoId, setVideoId] = useState(videos[0]?.id ?? "");
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (mode: "publish" | "schedule") => {
    if (!videoId || !accountId) {
      setError("Select a video and account");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const url =
        mode === "publish"
          ? `/api/videos/${videoId}/publish-now`
          : `/api/videos/${videoId}/schedule`;

      const body =
        mode === "publish"
          ? { connectedAccountId: accountId }
          : {
              connectedAccountId: accountId,
              scheduledAt: scheduledAt || new Date().toISOString(),
              timezone: "UTC",
            };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error ?? "Request failed");
      }

      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          <span className="text-slate-300">Video</span>
          <select
            className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
            value={videoId}
            onChange={(event) => setVideoId(event.target.value)}
          >
            {videos.map((video) => (
              <option key={video.id} value={video.id}>
                {video.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="text-slate-300">Account</span>
          <select
            className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
            value={accountId}
            onChange={(event) => setAccountId(event.target.value)}
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="text-slate-300">Schedule time (optional)</span>
          <input
            type="datetime-local"
            className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
            value={scheduledAt}
            onChange={(event) => setScheduledAt(event.target.value)}
          />
        </label>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={() => submit("publish")}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 disabled:opacity-60"
        >
          Publish now
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => submit("schedule")}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 disabled:opacity-60"
        >
          Schedule
        </button>
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
