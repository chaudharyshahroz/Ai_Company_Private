import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/data";
import { generateDailyBriefing } from "@/lib/ai-company";

export async function GET() {
  const user = await getCurrentUser();
  const briefing = generateDailyBriefing(user.id);
  return NextResponse.json({ briefing });
}