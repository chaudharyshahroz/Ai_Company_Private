import { NextResponse } from "next/server";
import { getCurrentUser, getWorkReviewItem } from "@/lib/data";
import { MOCK_AUDIT_LOGS } from "@/lib/mock-data";

const NOW = () => new Date().toISOString();

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> | { id: string } },
) {
  const { id } = await Promise.resolve(ctx.params as never);
  const user = await getCurrentUser();
  const item = await getWorkReviewItem(id);
  if (!item || item.userId !== user.id) {
    return NextResponse.json({ error: "Work review item not found" }, { status: 404 });
  }

  let note: string | undefined;
  try {
    const body = await req.json();
    note = body?.note;
  } catch {
    // empty body ok
  }

  item.status = "rejected";
  item.rejectedAt = NOW();
  item.updatedAt = NOW();

  MOCK_AUDIT_LOGS.push({
    id: `audit-${Math.random().toString(36).slice(2, 10)}`,
    userId: user.id,
    actor: "user",
    action: "work_review_rejected",
    targetType: "work_review_item",
    targetId: item.id,
    metadata: { employeeSlug: item.employeeSlug, note },
    note: note ?? `Rejected "${item.title}"`,
    ipAddress: null,
    createdAt: NOW(),
  });

  return NextResponse.json({ item });
}