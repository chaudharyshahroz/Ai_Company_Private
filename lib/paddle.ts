/**
 * Paddle (payments) integration stub.
 *
 * In production: create Paddle checkout sessions, manage subscriptions via webhook.
 * In demo mode: returns a fake checkout URL and lets the upgrade flow advance
 * without real billing — useful for demos.
 */

import { env, isDemoMode } from "./demo";

export interface CheckoutSessionInput {
  userId: string;
  email: string;
  planId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSession {
  url: string;
  id: string;
}

export async function createCheckoutSession(
  input: CheckoutSessionInput,
): Promise<CheckoutSession> {
  if (isDemoMode() || !env.paddle) {
    return {
      id: `demo_cs_${Date.now()}`,
      url: `${input.successUrl}?demo=1&plan=${input.planId}`,
    };
  }

  // Real Paddle call
  const res = await fetch("https://api.paddle.com/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [{ price_id: input.planId, quantity: 1 }],
      customer_email: input.email,
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
    }),
  });
  if (!res.ok) throw new Error(`Paddle ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { data: { id: string; url: string } };
  return { id: data.data.id, url: data.data.url };
}

export async function getCustomerPortalUrl(userId: string): Promise<string> {
  if (isDemoMode() || !env.paddle) {
    return `/dashboard/billing?demo_portal=1`;
  }
  // Real Paddle customer portal call
  return `https://customer-portal.paddle.com/${userId}`;
}