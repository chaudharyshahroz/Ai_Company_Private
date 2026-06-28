import * as React from "react";
import Link from "next/link";
import { Target, Plus, Calendar, CheckCircle2, Clock } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { getCurrentUser, listCompanyGoals } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusTone = {
  in_progress: { tone: "accent" as const, label: "In progress" },
  completed: { tone: "success" as const, label: "Completed" },
  queued: { tone: "muted" as const, label: "Queued" },
  blocked: { tone: "danger" as const, label: "Blocked" },
};

export default async function GoalsPage() {
  const user = await getCurrentUser();
  const goals = await listCompanyGoals(user.id);

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={3} />
        <main className="flex-1 px-8 py-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-page text-text">Company Goals</h1>
              <p className="mt-1 text-body text-secondary">
                Tell your AI CEO what to achieve. The CEO breaks each goal into tasks and assigns them to departments.
              </p>
            </div>
            <Button asChild>
              <Link href="/hq/goals/new">
                <Plus size={13} />
                New goal
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {goals.map((goal) => {
              const s = statusTone[goal.status as keyof typeof statusTone] ?? statusTone.queued;
              return (
                <Panel key={goal.id}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Target size={14} className="text-accent" />
                        <StatusBadge tone={s.tone} dot>{s.label}</StatusBadge>
                        <span className="text-xs text-muted-text">
                          Owner: {goal.owner}
                        </span>
                      </div>
                      <h2 className="mt-2 text-card text-text">{goal.title}</h2>
                      <p className="mt-1 text-body text-secondary">{goal.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-wider text-muted-text">Deadline</div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[13px] text-text">
                        <Calendar size={11} />
                        {formatDate(goal.deadline)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-secondary">Progress</span>
                      <span className="font-mono text-text">
                        {goal.kpi.current} / {goal.kpi.target} {goal.kpi.unit}
                      </span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-accent transition-all"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>

                  {goal.plan.length > 0 && (
                    <div className="mt-6">
                      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-text">
                        AI CEO's plan
                      </h3>
                      <ol className="space-y-1">
                        {goal.plan.map((p, i) => {
                          const emp = (p as any).employee;
                          return (
                            <li
                              key={p.id}
                              className="flex items-center gap-3 rounded-md border border-border bg-surface-2 px-3 py-2"
                            >
                              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-muted font-mono text-[10px] text-secondary">
                                {i + 1}
                              </div>
                              {p.status === "completed" ? (
                                <CheckCircle2 size={13} className="shrink-0 text-success" />
                              ) : p.status === "in_progress" ? (
                                <Clock size={13} className="shrink-0 text-accent" />
                              ) : (
                                <div className="h-3 w-3 shrink-0 rounded-full border border-text-tertiary" />
                              )}
                              <span
                                className={cn(
                                  "flex-1 text-[13px]",
                                  p.status === "completed"
                                    ? "text-muted-text line-through"
                                    : "text-text",
                                )}
                              >
                                {p.title}
                              </span>
                              <span className="rounded border border-border bg-surface px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-text">
                                {emp}
                              </span>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  )}
                </Panel>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}