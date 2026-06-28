import { NextResponse } from "next/server";
import { getCurrentUser, listNotifications } from "@/lib/data";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  const url = new URL(req.url);
  const unreadOnly = url.searchParams.get("unread") === "1";
  const notifications = await listNotifications(user.id, { unreadOnly });
  return NextResponse.json({ notifications });
}