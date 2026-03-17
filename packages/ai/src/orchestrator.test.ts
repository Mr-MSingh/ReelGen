import { describe, expect, it } from "vitest";
import { nextStage } from "./orchestrator";

describe("nextStage", () => {
  it("advances through stages", () => {
    expect(nextStage("topic")).toBe("script");
    expect(nextStage("render")).toBe(null);
  });
});
