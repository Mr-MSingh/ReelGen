import { describe, expect, it } from "vitest";
import { isWithinMonthlyVideoLimit } from "./limits";

describe("isWithinMonthlyVideoLimit", () => {
  it("allows when under limit", () => {
    expect(isWithinMonthlyVideoLimit(3, 5)).toBe(true);
  });

  it("blocks when limit reached", () => {
    expect(isWithinMonthlyVideoLimit(5, 5)).toBe(false);
  });
});
