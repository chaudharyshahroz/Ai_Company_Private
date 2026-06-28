import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/data";
import { createCheckoutSession } from "@/lib/paddle";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  const body = await req.json();
  const session = await createCheckoutSession({
    userId: user.id,
    email: user.email,
    planId: body.planId,
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?upgraded=1`,
    cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
  });
  return NextResponse.json(session);
}