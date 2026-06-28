import * as React from "react";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { TasksClient, type TaskListItem } from "@/components/dashboard/TasksClient";
import { getCurrentUser, listTasks, listEnrichedHiredAgents } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const user = await getCurrentUser();
  const tasks = await listTasks(user.id);
  const agents = await listEnrichedHiredAgents(user.id);

  const items: TaskListItem[] = tasks.map((t) => {
    const agent = agents.find((a) => a.id === t.hiredAgentId);
    return {
      id: t.id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      employeeName: agent?.template?.name?.split(" — ")[0] ?? "Unassigned",
      employeeEmoji: agent?.template?.avatarEmoji ?? "🤖",
      dueLabel: t.scheduledAt
        ? new Date(t.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : null,
      createdAt: t.createdAt,
    };
  });

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={0} />
        <main className="flex-1 px-5 pb-32 pt-8 md:px-10 md:pb-12 md:pt-10">
          <TasksClient tasks={items} />
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}