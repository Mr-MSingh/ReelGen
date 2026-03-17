import { prisma } from "@reelgen/db";
import { getSession } from "@/lib/session";
import PublishingActions from "./publishing-actions";

export default async function PublishingPage() {
  const session = await getSession();
  const workspaceId = session?.user?.workspaceId;

  if (!workspaceId) {
    return null;
  }

  const [schedules, videos, accounts] = await Promise.all([
    prisma.publishSchedule.findMany({
      where: { workspaceId },
      orderBy: { scheduledAt: "asc" },
    }),
    prisma.videoProject.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.connectedAccount.findMany({
      where: { workspaceId, status: "active" },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const videoOptions = videos.map((video) => ({
    id: video.id,
    label: `${video.title} (${video.status})`,
  }));
  const accountOptions = accounts.map((account) => ({
    id: account.id,
    label: `${account.platform} — ${account.channelName ?? "Unknown"}`,
  }));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Publishing</h1>
        <p className="mt-1 text-sm text-slate-300">
          Schedule or publish videos to connected platforms.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-900 bg-slate-900/50 p-6">
        <h2 className="text-lg font-semibold">Publish a video</h2>
        {videoOptions.length === 0 || accountOptions.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">
            Add a video and connect a platform to start publishing.
          </p>
        ) : (
          <div className="mt-4">
            <PublishingActions videos={videoOptions} accounts={accountOptions} />
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-900 bg-slate-900/50 p-6">
        <h2 className="text-lg font-semibold">Upcoming schedule</h2>
        <div className="mt-4 space-y-3">
          {schedules.length === 0 ? (
            <p className="text-sm text-slate-400">No scheduled posts.</p>
          ) : (
            schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between rounded-lg border border-slate-800 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{schedule.platform}</p>
                  <p className="text-xs text-slate-400">{schedule.status}</p>
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(schedule.scheduledAt).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
