import { NextResponse } from "next/server";
import { getCurrentUser, listScheduledWork } from "@/lib/data";

export async function GET() {
  const user = await getCurrentUser();
  const items = await listScheduledWork(user.id);
  return NextResponse.json({ items });
}