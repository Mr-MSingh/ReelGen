import { PLANS } from "@reelgen/billing";

export const STRIPE_PRICE_MAP: Record<string, string> = {
  starter: process.env.STRIPE_PRICE_STARTER ?? "",
  pro: process.env.STRIPE_PRICE_PRO ?? "",
};

export function listBillingPlans() {
  return Object.values(PLANS);
}
