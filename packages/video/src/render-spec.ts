export type RenderScene = {
  sceneNumber: number;
  narrationText: string;
  visualPrompt: string;
  captionText: string;
  durationSec: number;
  transition: string;
  animationHint: string;
};

export type RenderSpecInput = {
  width: number;
  height: number;
  fps: number;
  scenes: RenderScene[];
};

export function buildRenderSpec(input: RenderSpecInput) {
  return {
    ...input,
    totalDurationSec: input.scenes.reduce(
      (acc, scene) => acc + scene.durationSec,
      0
    ),
  };
}
