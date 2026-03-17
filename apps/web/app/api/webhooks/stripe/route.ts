import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@reelgen/db";
import { resolvePlan } from "@reelgen/billing";
import { stripe } from "@/lib/billing/stripe";
import { verifyStripeSignature } from "@/lib/billing/webhook";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const workspaceId = subscription.metadata?.workspaceId;
  if (!workspaceId) {
    return;
  }

  const planCode = subscription.metadata?.planCode ?? "free";
  const plan = resolvePlan(planCode);

  await prisma.subscription.upsert({
    where: { workspaceId },
    create: {
      workspaceId,
      stripeCustomerId: subscription.customer.toString(),
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      planCode: plan.code,
      renewalAt: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null,
      monthlyVideoLimit: plan.monthlyVideoLimit,
      monthlyCreditsIncluded: plan.monthlyCreditsIncluded,
    },
    update: {
      stripeCustomerId: subscription.customer.toString(),
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      planCode: plan.code,
      renewalAt: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null,
      monthlyVideoLimit: plan.monthlyVideoLimit,
      monthlyCreditsIncluded: plan.monthlyCreditsIncluded,
    },
  });

  await prisma.workspace.update({
    where: { id: workspaceId },
    data: { planId: plan.code },
  });
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = verifyStripeSignature(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription.toString()
        );
        await handleSubscriptionUpdate(subscription);
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdate(subscription);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
