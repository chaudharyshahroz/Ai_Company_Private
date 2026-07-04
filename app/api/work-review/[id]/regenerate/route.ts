import { NextResponse } from "next/server";
import { getCurrentUser, getWorkReviewItem } from "@/lib/data";
import { runEmployee } from "@/lib/ai-company";
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

  // Re-run the employee with a regenerate instruction.
  const result = await runEmployee({
    userId: user.id,
    employeeSlug: item.employeeSlug,
    taskTitle: item.title,
    taskDescription: `${item.body}\n\n## REGENERATION REQUESTED\nProduce a stronger version. Address evaluator notes: ${item.evaluatorNotes ?? "no specific notes"}`,
    goalId: item.goalId ?? undefined,
    departmentGoalId: item.departmentGoalId ?? undefined,
    hiredAgentId: item.hiredAgentId ?? undefined,
    previouslyApproved: false,
  });

  item.regenerationCount += 1;
  item.updatedAt = NOW();

  MOCK_AUDIT_LOGS.push({
    id: `audit-${Math.random().toString(36).slice(2, 10)}`,
    userId: user.id,
    actor: "user",
    action: "work_review_regenerated",
    targetType: "work_review_item",
    targetId: item.id,
    metadata: { employeeSlug: item.employeeSlug, regenerationCount: item.regenerationCount },
    note: `Regenerated "${item.title}" (attempt #${item.regenerationCount})`,
    ipAddress: null,
    createdAt: NOW(),
  });

  return NextResponse.json({ item, agentRunId: result.agentRunId, output: result.output });
}