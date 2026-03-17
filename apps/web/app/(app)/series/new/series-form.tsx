"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FormState = {
  name: string;
  niche: string;
  formatType: string;
  targetDurationSec: number;
  tone: string;
  artStyle: string;
  voiceStyle: string;
  musicMode: string;
  postingCadence: string;
};

const initialState: FormState = {
  name: "",
  niche: "",
  formatType: "narrated",
  targetDurationSec: 45,
  tone: "informative",
  artStyle: "minimal",
  voiceStyle: "calm",
  musicMode: "light",
  postingCadence: "daily",
};

export default function SeriesForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = (key: keyof FormState, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/series", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.error ?? "Failed to create series");
      }

      const payload = await res.json();
      router.push(`/series/${payload.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-900 bg-slate-900/50 p-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          <span className="text-slate-300">Series name</span>
          <input
            className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            required
          />
        </label>
        <label className="text-sm">
          <span className="text-slate-300">Niche</span>
          <input
            className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
            value={form.niche}
            onChange={(e) => onChange("niche", e.target.value)}
            required
          />
        </label>
        <label className="text-sm">
          <span className="text-slate-300">Format type</span>
          <input
            className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
            value={form.formatType}
            onChange={(e) => onChange("formatType", e.target.value)}
            required
          />
        </label>
        <label className="text-sm">
          <span className="text-slate-300">Target duration (sec)</span>
          <input
            type="number"
            min={5}
            className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
            value={form.targetDurationSec}
            onChange={(e) => onChange("targetDurationSec", Number(e.target.value))}
            required
          />
        </label>
        <label className="text-sm">
          <span className="text-slate-300">Tone</span>
          <input
            className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
            value={form.tone}
            onChange={(e) => onChange("tone", e.target.value)}
            required
          />
        </label>
        <label className="text-sm">
          <span className="text-slate-300">Art style</span>
          <input
            className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
            value={form.artStyle}
            onChange={(e) => onChange("artStyle", e.target.value)}
            required
          />
        </label>
        <label className="text-sm">
          <span className="text-slate-300">Voice style</span>
          <input
            className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
            value={form.voiceStyle}
            onChange={(e) => onChange("voiceStyle", e.target.value)}
            required
          />
        </label>
        <label className="text-sm">
          <span className="text-slate-300">Music mode</span>
          <input
            className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
            value={form.musicMode}
            onChange={(e) => onChange("musicMode", e.target.value)}
            required
          />
        </label>
        <label className="text-sm">
          <span className="text-slate-300">Posting cadence</span>
          <input
            className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
            value={form.postingCadence}
            onChange={(e) => onChange("postingCadence", e.target.value)}
            required
          />
        </label>
      </div>

      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create series"}
        </button>
      </div>
    </form>
  );
}
