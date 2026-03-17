import { describe, expect, it } from "vitest";
import { canTransition } from "./video";

describe("canTransition", () => {
  it("allows queued -> generating_script", () => {
    expect(canTransition("queued", "generating_script")).toBe(true);
  });

  it("rejects published -> draft", () => {
    expect(canTransition("published", "draft")).toBe(false);
  });
});
