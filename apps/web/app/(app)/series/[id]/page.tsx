import { notFound } from "next/navigation";
import { prisma } from "@reelgen/db";
import { getSession } from "@/lib/session";
import GenerateButton from "./generate-button";

interface PageProps {
  params: { id: string };
}

export default async function SeriesDetailPage({ params }: PageProps) {
  const session = await getSession();
  const workspaceId = session?.user?.workspaceId;
  if (!workspaceId) {
    notFound();
  }

  const series = await prisma.series.findFirst({
    where: { id: params.id, workspaceId },
  });

  if (!series) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">{series.name}</h1>
        <p className="mt-1 text-sm text-slate-300">{series.niche}</p>
      </header>
      <section className="rounded-2xl border border-slate-900 bg-slate-900/50 p-6">
        <dl className="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <dt className="text-slate-400">Format</dt>
            <dd className="mt-1 font-medium">{series.formatType}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Tone</dt>
            <dd className="mt-1 font-medium">{series.tone}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Voice style</dt>
            <dd className="mt-1 font-medium">{series.voiceStyle}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Cadence</dt>
            <dd className="mt-1 font-medium">{series.postingCadence}</dd>
          </div>
        </dl>
      </section>
      <section className="rounded-2xl border border-slate-900 bg-slate-900/50 p-6">
        <h2 className="text-lg font-semibold">Generate a new video</h2>
        <p className="mt-1 text-sm text-slate-400">
          This queues a background job using the current series defaults.
        </p>
        <div className="mt-4">
          <GenerateButton seriesId={series.id} />
        </div>
      </section>
    </div>
  );
}
