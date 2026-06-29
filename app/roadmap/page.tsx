import * as React from "react";
import {
  TrendingUp,
  CheckCircle2,
  Circle,
  Sparkles,
  Calendar,
  Users,
  Briefcase,
  Target,
  RefreshCw,
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { getCurrentUser, getGrowthRoadmap } from "@/lib/data";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const deptColor: Record<string, string> = {
  Marketing: "border-accent/40 bg-accent/5 text-accent",
  Sales: "border-success/40 bg-success/5 text-success",
  "Product & Website": "border-primary/40 bg-primary/5 text-primary",
  Executive: "border-warning/40 bg-warning/5 text-warning",
  Research: "border-secondary/40 bg-secondary/5 text-secondary",
  Operations: "border-secondary/40 bg-secondary/5 text-secondary",
};

const difficultyCopy: Record<string, { label: string; color: string }> = {
  easy: { label: "Easy", color: "text-success" },
  medium: { label: "Medium", color: "text-warning" },
  hard: { label: "Hard", color: "text-danger" },
};

const statusIcon: Record<string, React.ElementType> = {
  done: CheckCircle2,
  in_progress: Circle,
  todo: Circle,
};

const statusColor: Record<string, string> = {
  done: "text-success",
  in_progress: "text-accent",
  todo: "text-muted-text",
};

const statusLabel: Record<string, string> = {
  done: "Done",
  in_progress: "In progress",
  todo: "To do",
};

export default async function GrowthRoadmapPage() {
  const user = await getCurrentUser();
  const roadmap = await getGrowthRoadmap(user.id, "launch_7");

  const completed = roadmap.items.filter((i) => i.status === "done").length;
  const inProgress = roadmap.items.filter((i) => i.status === "in_progress").length;
  const total = roadmap.items.length;
  const pct = Math.round((completed / total) * 100);

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={0} />

        <main className="flex-1 px-8 py-8">
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-8 flex items-start justify-between gap-6">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs">
                  <TrendingUp size={12} className="text-accent" />
                  <span className="font-semibold uppercase tracking-wider text-accent">
                    Growth Roadmap
                  </span>
                  <span className="ml-1 rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-text">
                    7-Day Launch
                  </span>
                </div>
                <h1 className="text-page text-text">{roadmap.title}</h1>
                <p className="mt-3 max-w-2xl text-body text-secondary">{roadmap.summary}</p>
              </div>
              <Button variant="secondary" size="md">
                <RefreshCw size={13} />
                Regenerate
              </Button>
            </div>

            {/* Progress */}
            <Panel className="mb-8 p-6">
              <div className="mb-3 flex items-center justify-between text-[13px]">
                <span className="font-medium text-text">Progress</span>
                <span className="font-mono tabular-nums text-muted-text">
                  {completed} of {total} tasks · {pct}%
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/40">
                <div
                  className="h-full bg-success transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-mono text-2xl font-semibold tabular-nums text-success">
                    {completed}
                  </div>
                  <div className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-text">
                    Done
                  </div>
                </div>
                <div>
                  <div className="font-mono text-2xl font-semibold tabular-nums text-accent">
                    {inProgress}
                  </div>
                  <div className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-text">
                    In progress
                  </div>
                </div>
                <div>
                  <div className="font-mono text-2xl font-semibold tabular-nums text-muted-text">
                    {total - completed - inProgress}
                  </div>
                  <div className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-text">
                    To do
                  </div>
                </div>
              </div>
            </Panel>

            {/* Timeline */}
            <div className="space-y-4">
              {roadmap.items.map((item) => {
                const Icon = statusIcon[item.status] ?? Circle;
                const dept = deptColor[item.department] ?? "border-border bg-surface-2 text-muted-text";
                const diff = difficultyCopy[item.difficulty] ?? difficultyCopy.medium;
                return (
                  <Panel key={item.day} className="p-6">
                    <div className="flex items-start gap-5">
                      {/* Day badge */}
                      <div className="flex shrink-0 flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface-2 font-mono text-[14px] font-semibold tabular-nums text-text">
                          D{item.day}
                        </div>
                      </div>

                      {/* Body */}
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <Icon
                            size={14}
                            className={cn(statusColor[item.status])}
                            strokeWidth={2.5}
                          />
                          <h3 className="text-[15px] font-medium text-text">{item.task}</h3>
                          <span
                            className={cn(
                              "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                              dept,
                            )}
                          >
                            {item.department}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] font-medium uppercase tracking-wider",
                              diff.color,
                            )}
                          >
                            · {diff.label}
                          </span>
                        </div>

                        <div className="mb-3 grid gap-4 md:grid-cols-2">
                          <div>
                            <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-text">
                              Objective
                            </div>
                            <p className="text-[13px] text-secondary">{item.objective}</p>
                          </div>
                          <div>
                            <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-text">
                              Why it matters
                            </div>
                            <p className="text-[13px] text-secondary">{item.whyItMatters}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 text-[12px]">
                          <div className="flex items-center gap-4 text-muted-text">
                            <span className="flex items-center gap-1.5">
                              <Users size={11} />
                              {item.employee}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Briefcase size={11} />
                              {item.department}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Target size={11} />
                              {item.expectedResult}
                            </span>
                          </div>
                          <span
                            className={cn(
                              "rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                              statusColor[item.status],
                            )}
                          >
                            {statusLabel[item.status]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Panel>
                );
              })}
            </div>

            {/* Switch */}
            <Panel className="mt-8 p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-accent" />
                  <div>
                    <div className="text-[13px] font-medium text-text">
                      Want a longer plan?
                    </div>
                    <div className="text-[12px] text-muted-text">
                      Generate a 30-day growth plan or a 90-day scaling plan.
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    30-Day Growth
                  </Button>
                  <Button size="sm">
                    <Sparkles size={12} />
                    90-Day Scaling
                  </Button>
                </div>
              </div>
            </Panel>
          </div>
        </main>
      </div>
    </div>
  );
}
