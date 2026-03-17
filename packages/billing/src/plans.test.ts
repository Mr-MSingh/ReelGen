import { describe, expect, it } from "vitest";
import { resolvePlan } from "./plans";

describe("resolvePlan", () => {
  it("returns free plan by default", () => {
    const plan = resolvePlan();
    expect(plan.code).toBe("free");
  });

  it("returns free plan for unknown code", () => {
    const plan = resolvePlan("unknown");
    expect(plan.code).toBe("free");
  });

  it("returns requested plan", () => {
    const plan = resolvePlan("starter");
    expect(plan.code).toBe("starter");
  });
});
