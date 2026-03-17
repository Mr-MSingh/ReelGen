import Link from "next/link";
import { prisma } from "@reelgen/db";
import { getSession } from "@/lib/session";

export default async function VideosPage() {
  const session = await getSession();
  const workspaceId = session?.user?.workspaceId;

  const videos = workspaceId
    ? await prisma.videoProject.findMany({
        where: { workspaceId },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Videos</h1>
        <p className="mt-1 text-sm text-slate-300">
          Track generated videos and status.
        </p>
      </header>

      <div className="space-y-3">
        {videos.length === 0 ? (
          <div className="rounded-2xl border border-slate-900 bg-slate-900/50 p-6">
            <p className="text-sm text-slate-300">No videos yet.</p>
          </div>
        ) : (
          videos.map((video) => (
            <Link
              key={video.id}
              href={`/videos/${video.id}`}
              className="block rounded-2xl border border-slate-900 bg-slate-900/50 p-6 hover:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{video.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">{video.status}</p>
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(video.createdAt).toLocaleString()}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
