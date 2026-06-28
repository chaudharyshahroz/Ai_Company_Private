import { NextResponse } from "next/server";
import { getCurrentUser, getBusinessBrain } from "@/lib/data";
import { MOCK_BUSINESS_BRAIN } from "@/lib/mock-data";

export async function GET() {
  const user = await getCurrentUser();
  const brain = (await getBusinessBrain(user.id)) ?? MOCK_BUSINESS_BRAIN;
  return NextResponse.json({ brain });
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  const updates = await req.json();
  const brain = (await getBusinessBrain(user.id)) ?? MOCK_BUSINESS_BRAIN;
  const updated = { ...brain, ...updates, updatedAt: new Date().toISOString() };
  return NextResponse.json({ brain: updated });
}