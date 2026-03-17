export type GenerationStage =
  | "topic"
  | "script"
  | "storyboard"
  | "assets"
  | "voice"
  | "subtitles"
  | "render";

export const DEFAULT_STAGE_ORDER: GenerationStage[] = [
  "topic",
  "script",
  "storyboard",
  "assets",
  "voice",
  "subtitles",
  "render",
];

export function nextStage(current: GenerationStage) {
  const index = DEFAULT_STAGE_ORDER.indexOf(current);
  if (index === -1 || index === DEFAULT_STAGE_ORDER.length - 1) {
    return null;
  }
  return DEFAULT_STAGE_ORDER[index + 1];
}
