import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@reelgen/db";
import { resolvePlan } from "@reelgen/billing";
import { requireWorkspace } from "@/lib/api";
import { checkIdempotency } from "@/lib/idempotency";
import { recordAuditLog } from "@/lib/audit";
import { stripe } from "@/lib/billing/stripe";
import { STRIPE_PRICE_MAP } from "@/lib/billing/plans";

const inputSchema = z.object({
  planCode: z.string().min(2),
});

export async function POST(request: Request) {
  const auth = await requireWorkspace();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const idempotencyKey = request.headers.get("Idempotency-Key");
  const idempotency = await checkIdempotency({
    workspaceId: auth.workspaceId,
    scope: "billing-checkout",
    key: idempotencyKey,
  });
  if (!idempotency.ok) {
    return NextResponse.json({ error: "Duplicate request" }, { status: 409 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const plan = resolvePlan(parsed.data.planCode);
  if (plan.code === "free") {
    return NextResponse.json({ error: "Free plan does not require checkout" }, { status: 400 });
  }

  const priceId = STRIPE_PRICE_MAP[plan.code];
  if (!priceId) {
    return NextResponse.json({ error: "Missing Stripe price mapping" }, { status: 400 });
  }

  const workspace = await prisma.workspace.findUnique({
    where: { id: auth.workspaceId },
    include: { subscription: true },
  });

  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: workspace.subscription?.stripeCustomerId ?? undefined,
    client_reference_id: auth.workspaceId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.APP_BASE_URL}/billing?success=true`,
    cancel_url: `${process.env.APP_BASE_URL}/billing?canceled=true`,
    metadata: {
      workspaceId: auth.workspaceId,
      planCode: plan.code,
    },
  });

  await recordAuditLog({
    workspaceId: auth.workspaceId,
    actorUserId: auth.userId,
    eventType: "billing.checkout",
    entityType: "Workspace",
    entityId: auth.workspaceId,
    payload: { planCode: plan.code },
  });

  return NextResponse.json({ url: session.url });
}
