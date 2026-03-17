import type { RenderSpecInput } from "./render-spec";

export function buildFfmpegCommand(spec: RenderSpecInput) {
  const duration = spec.scenes.reduce((sum, scene) => sum + scene.durationSec, 0);
  return [
    "ffmpeg",
    "-y",
    "-f",
    "lavfi",
    `-i color=c=black:s=${spec.width}x${spec.height}:d=${duration}`,
    "-r",
    String(spec.fps),
    "-pix_fmt",
    "yuv420p",
    "output.mp4",
  ];
}
