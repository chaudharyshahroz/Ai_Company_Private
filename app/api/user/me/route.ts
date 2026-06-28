import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/data";

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  const body = await req.json();
  // TODO: real DB update — for demo, just echo back
  return NextResponse.json({ user: { ...user, ...body } });
}