import { NextResponse } from "next/server";
import { prisma } from "@reelgen/db";
import { requireWorkspace } from "@/lib/api";
import { stripe } from "@/lib/billing/stripe";

export async function POST() {
  const auth = await requireWorkspace();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { workspaceId: auth.workspaceId },
  });

  if (!subscription?.stripeCustomerId) {
    return NextResponse.json({ error: "No billing customer" }, { status: 400 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${process.env.APP_BASE_URL}/billing`,
  });

  return NextResponse.json({ url: session.url });
}
