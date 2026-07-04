import { NextResponse } from "next/server";
import { getCurrentUser, listAuditLogs } from "@/lib/data";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  const url = new URL(req.url);
  const limit = url.searchParams.get("limit")
    ? Number(url.searchParams.get("limit"))
    : 100;
  const action = url.searchParams.get("action") ?? undefined;
  const logs = await listAuditLogs(user.id, { limit, action });
  return NextResponse.json({ logs });
}