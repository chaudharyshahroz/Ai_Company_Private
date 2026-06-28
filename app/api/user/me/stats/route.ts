import { NextResponse } from "next/server";
import { getCurrentUser, getUserStats } from "@/lib/data";

export async function GET() {
  const user = await getCurrentUser();
  const stats = await getUserStats(user.id);
  return NextResponse.json({ stats });
}