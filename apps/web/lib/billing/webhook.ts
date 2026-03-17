import Stripe from "stripe";
import { stripe } from "@/lib/billing/stripe";

export function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret);
}
