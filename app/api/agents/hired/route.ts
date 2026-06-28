import { NextResponse } from "next/server";
import { getCurrentUser, listEnrichedHiredAgents } from "@/lib/data";

export async function GET() {
  const user = await getCurrentUser();
  const agents = await listEnrichedHiredAgents(user.id);
  return NextResponse.json({ agents });
}