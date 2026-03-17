import { notFound } from "next/navigation";
import { prisma } from "@reelgen/db";
import { getSession } from "@/lib/session";
import { createDownloadUrl } from "@/lib/storage";
import RenderButton from "./render-button";

interface PageProps {
  params: { id: string };
}

export default async function VideoDetailPage({ params }: PageProps) {
  const session = await getSession();
  const workspaceId = session?.user?.workspaceId;
  if (!workspaceId) {
    notFound();
  }

  const video = await prisma.videoProject.findFirst({
    where: { id: params.id, workspaceId },
    include: {
      scripts: { orderBy: { createdAt: "desc" }, take: 1 },
      storyboards: { orderBy: { createdAt: "desc" }, take: 1 },
      outputAsset: true,
      thumbnailAsset: true,
    },
  });

  if (!video) {
    notFound();
  }

  const script = video.scripts[0];
  const storyboard = video.storyboards[0];
  const outputUrl = video.outputAsset
    ? await createDownloadUrl(video.outputAsset.storageKey)
    : null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">{video.title}</h1>
        <p className="mt-1 text-sm text-slate-300">{video.status}</p>
      </header>
      <section className="rounded-2xl border border-slate-900 bg-slate-900/50 p-6">
        <h2 className="text-lg font-semibold">Render</h2>
        <p className="mt-1 text-sm text-slate-400">
          Queue the render pipeline for this video.
        </p>
        <div className="mt-4">
          <RenderButton videoId={video.id} />
        </div>
        {outputUrl ? (
          <div className="mt-4 text-sm">
            <a className="text-emerald-300 underline" href={outputUrl}>
              Download latest render
            </a>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-900 bg-slate-900/50 p-6">
        <h2 className="text-lg font-semibold">Script</h2>
        {script ? (
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <p className="text-slate-200">{script.hook}</p>
            <p>{script.body}</p>
            <p className="text-slate-400">{script.cta}</p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-400">Script not ready.</p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-900 bg-slate-900/50 p-6">
        <h2 className="text-lg font-semibold">Storyboard</h2>
        {storyboard ? (
          <div className="mt-3 space-y-3 text-sm">
            {(storyboard.scenes as Array<{
              sceneNumber: number;
              narrationText: string;
              visualPrompt: string;
            }>).map((scene) => (
              <div
                key={scene.sceneNumber}
                className="rounded-lg border border-slate-800 bg-slate-950/60 p-4"
              >
                <p className="text-xs text-slate-400">Scene {scene.sceneNumber}</p>
                <p className="mt-2 text-slate-200">{scene.narrationText}</p>
                <p className="mt-1 text-slate-500">{scene.visualPrompt}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-400">Storyboard not ready.</p>
        )}
      </section>
    </div>
  );
}
