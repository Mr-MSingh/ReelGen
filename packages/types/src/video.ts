export const VIDEO_STATUS = [
  "draft",
  "queued",
  "generating_script",
  "generating_storyboard",
  "generating_assets",
  "generating_voice",
  "rendering",
  "ready",
  "scheduled",
  "publishing",
  "published",
  "failed",
] as const;

export type VideoProjectStatus = (typeof VIDEO_STATUS)[number];

const TRANSITIONS: Record<VideoProjectStatus, VideoProjectStatus[]> = {
  draft: ["queued"],
  queued: ["generating_script", "failed"],
  generating_script: ["generating_storyboard", "failed"],
  generating_storyboard: ["generating_assets", "failed"],
  generating_assets: ["generating_voice", "failed"],
  generating_voice: ["rendering", "failed"],
  rendering: ["ready", "failed"],
  ready: ["scheduled", "publishing"],
  scheduled: ["publishing", "failed"],
  publishing: ["published", "failed"],
  published: [],
  failed: [],
};

export function canTransition(
  from: VideoProjectStatus,
  to: VideoProjectStatus
) {
  return TRANSITIONS[from].includes(to);
}
