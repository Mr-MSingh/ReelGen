import { describe, expect, it, vi } from "vitest";
import { verifyStripeSignature } from "./webhook";

vi.mock("@/lib/billing/stripe", () => ({
  stripe: {
    webhooks: {
      constructEvent: vi.fn(() => ({ id: "evt_test" })),
    },
  },
}));

describe("verifyStripeSignature", () => {
  it("delegates to Stripe constructEvent", () => {
    const event = verifyStripeSignature("payload", "sig", "secret");
    expect(event).toEqual({ id: "evt_test" });
  });
});
