import * as React from "react";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import {
  WorkReviewClientV2,
  type WorkItemV2,
} from "@/components/dashboard/WorkReviewClientV2";
import {
  getCurrentUser,
  listWorkReviewItems,
  listCompanyGoalsNew,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function WorkReviewPage() {
  const user = await getCurrentUser();
  const [items, goals] = await Promise.all([
    listWorkReviewItems(user.id),
    listCompanyGoalsNew(user.id),
  ]);

  const goalsById: Record<string, string> = {};
  for (const g of goals) goalsById[g.id] = g.title;

  const initialItems: WorkItemV2[] = items.map((it) => ({
    id: it.id,
    title: it.title,
    summary: it.summary,
    body: it.body,
    kind: it.kind as WorkItemV2["kind"],
    status: it.status as WorkItemV2["status"],
    priority: it.priority,
    employeeName: it.employeeName,
    employeeSlug: it.employeeSlug,
    department: it.department,
    qualityScore: it.qualityScore,
    relevanceScore: it.relevanceScore,
    safetyScore: it.safetyScore,
    confidenceScore: it.confidenceScore,
    evaluatorNotes: it.evaluatorNotes,
    creditsEstimated: it.creditsEstimated,
    requiresApproval: it.requiresApproval,
    approvalReason: it.approvalReason,
    suggestedNextAction: it.suggestedNextAction,
    regenerationCount: it.regenerationCount,
    createdAt: it.createdAt,
    goalTitle: it.goalId ? goalsById[it.goalId] : undefined,
  }));

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={0} />
        <main className="flex-1 px-5 pb-32 pt-8 md:px-10 md:pb-12 md:pt-10">
          <WorkReviewClientV2
            initialItems={initialItems}
            goalsById={goalsById}
          />
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}