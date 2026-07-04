import { NextResponse } from "next/server";
import { getCurrentUser, getWorkReviewItem } from "@/lib/data";
import { MOCK_AUDIT_LOGS, MOCK_KNOWLEDGE_BASE_ITEMS } from "@/lib/mock-data";

const NOW = () => new Date().toISOString();

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> | { id: string } },
) {
  const { id } = await Promise.resolve(ctx.params as never);
  const user = await getCurrentUser();
  const item = await getWorkReviewItem(id);
  if (!item || item.userId !== user.id) {
    return NextResponse.json({ error: "Work review item not found" }, { status: 404 });
  }

  // Promote to knowledge base — makes it available for future employee memory.
  const newKbItem = {
    id: `kb-item-saved-${Math.random().toString(36).slice(2, 10)}`,
    userId: user.id,
    title: `Approved — ${item.title}`,
    content: item.body,
    source: "approved_work" as const,
    sourceRef: item.id,
    tags: [item.kind, item.department, "approved", "saved-from-work-review"],
    scope: item.department === "executive" ? "all" : item.department,
    embedding: null,
    trainingWeight: 90,
    confidence: 95,
    createdBy: "ai" as const,
    lastUsedAt: null,
    useCount: 0,
    createdAt: NOW(),
    updatedAt: NOW(),
  };
  MOCK_KNOWLEDGE_BASE_ITEMS.push(newKbItem);

  item.status = "completed";
  item.approvedAt = NOW();
  item.updatedAt = NOW();

  MOCK_AUDIT_LOGS.push({
    id: `audit-${Math.random().toString(36).slice(2, 10)}`,
    userId: user.id,
    actor: "user",
    action: "work_review_saved_to_kb",
    targetType: "work_review_item",
    targetId: item.id,
    metadata: { employeeSlug: item.employeeSlug, knowledgeItemId: newKbItem.id },
    note: `Saved "${item.title}" to Knowledge Base`,
    ipAddress: null,
    createdAt: NOW(),
  });

  return NextResponse.json({ item, knowledgeItem: newKbItem });
}