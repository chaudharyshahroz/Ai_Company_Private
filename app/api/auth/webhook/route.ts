import { NextResponse } from "next/server";

// Clerk webhook stub. In production, verify the signature and upsert the user.
export async function POST(req: Request) {
  const event = await req.json();
  // eslint-disable-next-line no-console
  console.log("[auth/webhook] received", event.type);
  return NextResponse.json({ ok: true });
}