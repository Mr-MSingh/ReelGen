import { prisma } from "@reelgen/db";
import { getLatestBalance } from "@reelgen/billing";
import { getSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await getSession();
  const workspaceId = session?.user?.workspaceId;

  const [seriesCount, recentVideos, credits, queuedJobs] = workspaceId
    ? await Promise.all([
        prisma.series.count({ where: { workspaceId } }),
        prisma.videoProject.findMany({
          where: { workspaceId },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
        getLatestBalance(workspaceId),
        prisma.generationJob.count({
          where: { workspaceId, state: { in: ["queued", "running"] } },
        }),
      ])
    : [0, [], 0, 0];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-300">
          Track recent activity and generation progress.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-900 bg-slate-900/50 p-6">
          <p className="text-xs uppercase text-slate-400">Series</p>
          <p className="mt-3 text-2xl font-semibold">{seriesCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-900/50 p-6">
          <p className="text-xs uppercase text-slate-400">Credits</p>
          <p className="mt-3 text-2xl font-semibold">{credits}</p>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-900/50 p-6">
          <p className="text-xs uppercase text-slate-400">Jobs queued</p>
          <p className="mt-3 text-2xl font-semibold">{queuedJobs}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-900 bg-slate-900/50 p-6">
        <h2 className="text-lg font-semibold">Recent videos</h2>
        <div className="mt-4 space-y-3">
          {recentVideos.length === 0 ? (
            <p className="text-sm text-slate-400">No videos yet.</p>
          ) : (
            recentVideos.map((video) => (
              <div
                key={video.id}
                className="flex items-center justify-between rounded-lg border border-slate-800 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{video.title}</p>
                  <p className="text-xs text-slate-400">{video.status}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
