import * as React from "react";
import { CalendarCheck, Sparkles, ListChecks } from "lucide-react";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { WeeklyTasksClient, type WeeklyTaskView } from "@/components/dashboard/WeeklyTasksClient";
import { getCurrentUser, listWeeklyTasks } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function WeeklyTasksPage() {
  const user = await getCurrentUser();
  const tasks = await listWeeklyTasks(user.id);

  const view: WeeklyTaskView[] = tasks.map((t) => ({
    id: t.id,
    weekStart: t.weekStart,
    task: t.task,
    reason: t.reason,
    expectedResult: t.expectedResult,
    assignedDepartment: t.assignedDepartment,
    dueDate: t.dueDate ?? t.weekStart,
    status: (t.status as WeeklyTaskView["status"]) ?? "todo",
    oneClickAction: t.oneClickAction ?? "/hq",
    createdAt: t.createdAt,
  }));

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={0} />
        <main className="flex-1 px-5 pb-32 pt-8 md:px-10 md:pb-12 md:pt-10">
          <div className="mb-6 flex items-start justify-between gap-6">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs">
                <CalendarCheck size={12} className="text-accent" />
                <span className="font-semibold uppercase tracking-wider text-accent">Weekly Tasks</span>
                <span className="ml-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-success">
                  Live
                </span>
              </div>
              <h1 className="text-page text-text">3-5 next-best-actions, every week.</h1>
              <p className="mt-3 max-w-2xl text-body text-secondary">
                Your AI CEO generates 3-5 high-leverage tasks each week, with reason, expected result, owner,
                and one-click output generation. Skip the noise.
              </p>
            </div>
          </div>
          <WeeklyTasksClient initialTasks={view} />
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
