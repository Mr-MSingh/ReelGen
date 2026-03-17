import { describe, expect, it } from "vitest";
import { buildFfmpegCommand } from "./ffmpeg";

describe("buildFfmpegCommand", () => {
  it("builds a command with dimensions and fps", () => {
    const command = buildFfmpegCommand({
      width: 1080,
      height: 1920,
      fps: 30,
      scenes: [
        {
          sceneNumber: 1,
          narrationText: "Hello",
          visualPrompt: "Minimal",
          captionText: "Hello",
          durationSec: 5,
          transition: "fade",
          animationHint: "zoom",
        },
      ],
    });

    expect(command.join(" ")).toContain("1080x1920");
    expect(command.join(" ")).toContain("-r 30");
  });
});
