import { NextResponse } from "next/server";
import { getCurrentUser, listWorkReviewItems, countWorkReviewByStatus } from "@/lib/data";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? undefined;
  const kind = url.searchParams.get("kind") ?? undefined;
  const department = url.searchParams.get("department") ?? undefined;
  const limit = url.searchParams.get("limit")
    ? Number(url.searchParams.get("limit"))
    : undefined;

  const items = await listWorkReviewItems(user.id, { status, kind, department, limit });
  const counts = await countWorkReviewByStatus(user.id);

  return NextResponse.json({ items, counts });
}