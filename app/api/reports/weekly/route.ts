import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/data";
import { generateWeeklyReport } from "@/lib/ai-company";

export async function GET() {
  const user = await getCurrentUser();
  const report = generateWeeklyReport(user.id);
  return NextResponse.json({ report });
}