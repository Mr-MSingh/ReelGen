import Link from "next/link";
import { prisma } from "@reelgen/db";
import { getSession } from "@/lib/session";

export default async function SeriesPage() {
  const session = await getSession();
  const workspaceId = session?.user?.workspaceId;

  const series = workspaceId
    ? await prisma.series.findMany({
        where: { workspaceId },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Series</h1>
          <p className="mt-1 text-sm text-slate-300">
            Manage content series and defaults.
          </p>
        </div>
        <Link
          href="/series/new"
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900"
        >
          New series
        </Link>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {series.length === 0 ? (
          <div className="rounded-2xl border border-slate-900 bg-slate-900/50 p-6">
            <p className="text-sm text-slate-300">No series yet.</p>
          </div>
        ) : (
          series.map((item) => (
            <Link
              key={item.id}
              href={`/series/${item.id}`}
              className="rounded-2xl border border-slate-900 bg-slate-900/50 p-6 hover:border-slate-700"
            >
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="mt-2 text-sm text-slate-400">{item.niche}</p>
              <p className="mt-1 text-xs text-slate-500">{item.status}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
