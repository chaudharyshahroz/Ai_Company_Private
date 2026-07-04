import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/data";
import { approvePlan } from "@/lib/ai-company";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  const body = await req.json();
  const { goalId } = body ?? {};
  if (!goalId) {
    return NextResponse.json({ error: "goalId is required" }, { status: 400 });
  }
  const goal = await approvePlan(goalId);
  if (!goal) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  }
  return NextResponse.json({ goal });
}