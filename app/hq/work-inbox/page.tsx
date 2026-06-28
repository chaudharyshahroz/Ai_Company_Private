import * as React from "react";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { WorkReviewClient, type WorkItem } from "@/components/dashboard/WorkReviewClient";
import { getCurrentUser, listWorkInbox } from "@/lib/data";
import { MOCK_WORK_INBOX } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function WorkInboxPage() {
  const user = await getCurrentUser();
  const items = await listWorkInbox(user.id);

  // Normalize mock items into the shape the client expects.
  const initialItems: WorkItem[] = items.map((it) => {
    const meta = MOCK_WORK_INBOX.find((m) => m.id === it.id);
    return {
      id: it.id,
      employeeName: it.employeeName,
      department: it.department,
      type: (meta?.type as WorkItem["type"]) ?? "ready_to_publish",
      title: it.title,
      output: it.output,
      preview: meta?.preview,
      credits: it.credits,
      createdAt: it.createdAt,
      status: "needs_approval",
    };
  });

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={0} />
        <main className="flex-1 px-5 pb-32 pt-8 md:px-10 md:pb-12 md:pt-10">
          <WorkReviewClient initialItems={initialItems} />
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}