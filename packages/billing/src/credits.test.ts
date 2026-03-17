import { describe, expect, it } from "vitest";
import { computeBalanceAfter } from "./credits";

describe("computeBalanceAfter", () => {
  it("applies positive delta", () => {
    expect(computeBalanceAfter(10, 5)).toBe(15);
  });

  it("applies negative delta", () => {
    expect(computeBalanceAfter(10, -3)).toBe(7);
  });
});
