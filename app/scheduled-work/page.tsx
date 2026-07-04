import * as React from "react";
import Link from "next/link";
import {
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Coins,
  Pause,
  Play,
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { getCurrentUser, listScheduledWork } from "@/lib/data";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const frequencyLabel: Record<string, string> = {
  hourly: "Every hour",
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Every 2 weeks",
  monthly: "Monthly",
};

const frequencyTone: Record<string, string> = {
  hourly: "border-warning/40 bg-warning/10 text-warning",
  daily: "border-accent/40 bg-accent/10 text-accent-hover",
  weekly: "border-primary/40 bg-primary/10 text-primary",
  biweekly: "border-accent-warm/40 bg-accent-warm/10 text-accent-warm",
  monthly: "border-border bg-muted text-secondary",
};

export default async function ScheduledWorkPage() {
  const user = await getCurrentUser();
  const items = await listScheduledWork(user.id);

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={0} />
        <main className="flex-1 px-5 pb-32 pt-8 md:px-10 md:pb-12 md:pt-10">
          <div className="mb-7 max-w-3xl">
            <h1 className="page-title">Scheduled Work</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-secondary">
              Your AI employees run on a schedule. These jobs fire automatically — daily briefings,
              weekly competitor scans, monthly pricing reviews. Every run lands in{" "}
              <Link href="/work-review" className="font-medium text-accent hover:underline">
                Work Review
              </Link>{" "}
              if it produces something you should see.
            </p>
          </div>

          {/* Summary strip */}
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <Panel className="p-5">
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-text">
                <Clock size={12} className="text-accent" />
                Active Schedules
              </div>
              <div className="mt-2 font-mono text-[28px] font-semibold tabular-nums text-text">
                {items.filter((i) => i.isEnabled).length}
              </div>
              <p className="mt-1 text-[12px] text-muted-text">
                of {items.length} total
              </p>
            </Panel>
            <Panel className="p-5">
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-text">
                <Calendar size={12} className="text-accent" />
                Next Run
              </div>
              <div className="mt-2 text-[16px] font-semibold text-text">
                {items
                  .filter((i) => i.isEnabled && i.nextRunAt)
                  .sort(
                    (a, b) =>
                      new Date(a.nextRunAt!).getTime() - new Date(b.nextRunAt!).getTime(),
                  )[0]?.employeeName ?? "—"}
              </div>
              <p className="mt-1 text-[12px] text-muted-text">
                {(() => {
                  const next = items
                    .filter((i) => i.isEnabled && i.nextRunAt)
                    .sort(
                      (a, b) =>
                        new Date(a.nextRunAt!).getTime() - new Date(b.nextRunAt!).getTime(),
                    )[0];
                  if (!next) return "No upcoming runs";
                  const dt = new Date(next.nextRunAt!);
                  return dt.toLocaleString(undefined, {
                    weekday: "short",
                    hour: "numeric",
                    minute: "2-digit",
                  });
                })()}
              </p>
            </Panel>
            <Panel className="p-5">
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-text">
                <Coins size={12} className="text-success" />
                Total Budget
              </div>
              <div className="mt-2 font-mono text-[28px] font-semibold tabular-nums text-text">
                {items.reduce((sum, i) => sum + i.budgetPerRun, 0)}
              </div>
              <p className="mt-1 text-[12px] text-muted-text">
                credits per cycle
              </p>
            </Panel>
          </div>

          {items.length === 0 ? (
            <Panel className="px-6 py-16 text-center">
              <Clock size={32} className="mx-auto text-muted-text" />
              <h2 className="mt-3 text-[16px] font-semibold text-text">
                No scheduled work yet
              </h2>
              <p className="mt-2 text-[13px] text-secondary">
                Schedule a recurring task for any AI employee. They'll run it automatically.
              </p>
            </Panel>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const lastStatus = item.lastRunStatus;
                const isOk = lastStatus === "completed";
                const isError = lastStatus === "failed";
                const lastRun = item.lastRunAt
                  ? new Date(item.lastRunAt)
                  : null;
                const nextRun = item.nextRunAt ? new Date(item.nextRunAt) : null;
                return (
                  <Panel key={item.id} className="p-0">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-2 px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-bg">
                          {item.isEnabled ? (
                            <Play size={14} className="text-success" />
                          ) : (
                            <Pause size={14} className="text-muted-text" />
                          )}
                        </div>
                        <div>
                          <p className="text-[14.5px] font-semibold text-text">
                            {item.title}
                          </p>
                          <p className="text-[12px] text-muted-text">
                            {item.employeeName} · {item.timezone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider",
                            frequencyTone[item.frequency] ?? frequencyTone.daily,
                          )}
                        >
                          {frequencyLabel[item.frequency] ?? item.frequency}
                        </span>
                        {lastStatus ? (
                          isOk ? (
                            <span className="flex items-center gap-1 rounded-full border border-success/40 bg-success/10 px-2 py-0.5 text-[10.5px] font-medium text-success">
                              <CheckCircle2 size={10} />
                              Last ok
                            </span>
                          ) : isError ? (
                            <span className="flex items-center gap-1 rounded-full border border-danger/40 bg-danger/10 px-2 py-0.5 text-[10.5px] font-medium text-danger">
                              <AlertCircle size={10} />
                              Failed
                            </span>
                          ) : lastStatus === "needs_approval" ? (
                            <span className="flex items-center gap-1 rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 text-[10.5px] font-medium text-warning">
                              <AlertCircle size={10} />
                              Awaiting review
                            </span>
                          ) : null
                        ) : null}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-x-8 gap-y-3 px-5 py-4 md:grid-cols-3 md:px-6">
                      <div>
                        <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-text">
                          Description
                        </p>
                        <p className="mt-1 text-[13px] text-text">
                          {item.description}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-text">
                          Schedule
                        </p>
                        <p className="mt-1 text-[13px] text-text">
                          {item.frequency === "weekly" && item.dayOfWeek !== null
                            ? `Every ${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][item.dayOfWeek]} at ${item.timeOfDay}`
                            : item.frequency === "monthly" && item.dayOfMonth
                              ? `Day ${item.dayOfMonth} of month at ${item.timeOfDay}`
                              : `Every day at ${item.timeOfDay}`}
                        </p>
                        {nextRun ? (
                          <p className="mt-0.5 text-[12px] text-muted-text">
                            Next:{" "}
                            {nextRun.toLocaleString(undefined, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        ) : null}
                      </div>
                      <div>
                        <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-text">
                          Budget & Approval
                        </p>
                        <p className="mt-1 text-[13px] text-text">
                          {item.budgetPerRun} credits / run
                        </p>
                        <p className="mt-0.5 text-[12px] text-muted-text">
                          {item.requiresApproval
                            ? "Outputs go to Work Review"
                            : "Auto-completed (safe)"}
                        </p>
                        {lastRun ? (
                          <p className="mt-0.5 text-[12px] text-muted-text">
                            Last:{" "}
                            {lastRun.toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </Panel>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between rounded-md border border-border bg-surface-2 px-5 py-4">
            <div>
              <p className="text-[14px] font-semibold text-text">
                Need more automation?
              </p>
              <p className="mt-1 text-[12.5px] text-secondary">
                Schedule any task to run hourly, daily, weekly, or monthly. All heartbeats respect
                employee permission levels and credit budgets.
              </p>
            </div>
            <Link
              href="/employees"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-[#FFFFFF] px-4 text-[13px] font-medium text-[#0A0B0C] shadow-button hover:bg-white"
            >
              Hire an employee
              <ChevronRight size={12} />
            </Link>
          </div>
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}