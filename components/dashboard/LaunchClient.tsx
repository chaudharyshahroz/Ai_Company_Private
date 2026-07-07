"use client";

import * as React from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ArrowRight,
  Rocket,
  RefreshCw,
  Briefcase,
  Megaphone,
  TrendingUp,
  Globe,
  Calendar,
  Wallet,
  Code,
  Users,
  Heart,
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export type LaunchStatus = "todo" | "in_progress" | "done";

export interface LaunchDayView {
  day: number;
  task: string;
  objective: string;
  whyItMatters: string;
  department: string;
  employee: string;
  difficulty: "easy" | "medium" | "hard";
  expectedResult: string;
  status: LaunchStatus;
}

const deptIcon: Record<string, React.ElementType> = {
  Marketing: Megaphone,
  Sales: TrendingUp,
  "Product & Website": Globe,
  Research: Code,
  Operations: Briefcase,
  Executive: Calendar,
  Finance: Wallet,
  HR: Users,
  Support: Heart,
};

const deptColor: Record<string, string> = {
  Marketing: "border-accent/40 bg-accent/5 text-accent",
  Sales: "border-success/40 bg-success/5 text-success",
  "Product & Website": "border-primary/40 bg-primary/5 text-primary",
  Research: "border-info/40 bg-info/5 text-info",
  Operations: "border-secondary/40 bg-secondary/5 text-secondary",
  Executive: "border-warning/40 bg-warning/5 text-warning",
  Finance: "border-warning/40 bg-warning/5 text-warning",
  HR: "border-secondary/40 bg-secondary/5 text-secondary",
  Support: "border-success/40 bg-success/5 text-success",
};

const difficultyCopy: Record<LaunchDayView["difficulty"], { label: string; tone: string }> = {
  easy: { label: "Easy", tone: "text-success" },
  medium: { label: "Medium", tone: "text-warning" },
  hard: { label: "Hard", tone: "text-danger" },
};

const statusMeta: Record<LaunchStatus, { label: string; tone: string; icon: React.ElementType }> = {
  todo: { label: "To do", tone: "text-muted-text border-border bg-surface-2", icon: Circle },
  in_progress: { label: "In progress", tone: "text-accent border-accent/30 bg-accent/10", icon: Clock },
  done: { label: "Done", tone: "text-success border-success/30 bg-success/10", icon: CheckCircle2 },
};

export function LaunchClient({ initialItems, weekStart }: { initialItems: LaunchDayView[]; weekStart: string }) {
  const toast = useToast();
  const [items, setItems] = React.useState<LaunchDayView[]>(initialItems);

  const stats = React.useMemo(() => {
    const done = items.filter((i) => i.status === "done").length;
    const ip = items.filter((i) => i.status === "in_progress").length;
    const pct = items.length > 0 ? Math.round((done / items.length) * 100) : 0;
    return { done, ip, pct };
  }, [items]);

  const cycle = (day: number) => {
    const order: LaunchStatus[] = ["todo", "in_progress", "done"];
    setItems((prev) =>
      prev.map((i) => {
        if (i.day !== day) return i;
        const next = order[(order.indexOf(i.status) + 1) % order.length];
        return { ...i, status: next };
      }),
    );
    const t = items.find((i) => i.day === day);
    if (t) {
      toast.push({
        tone: t.status === "todo" ? "info" : "success",
        title: `Day ${day} → ${statusMeta[order[(order.indexOf(t.status) + 1) % order.length]].label}`,
      });
    }
  };

  const runDay = (day: number) => {
    const t = items.find((i) => i.day === day);
    if (!t) return;
    toast.push({
      tone: "info",
      title: `AI generating Day ${day} output`,
      description: `${t.employee} is drafting "${t.task}" — will appear in your Work Inbox for approval.`,
      action: { label: "View Work Inbox", href: "/work-review" },
    });
  };

  const regenerate = () => {
    toast.push({
      tone: "info",
      title: "AI regenerating your 7-day launch",
      description: "Atlas is rewriting the plan based on your Business DNA and current progress.",
    });
  };

  return (
    <div className="space-y-4">
      <Panel className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
              <Rocket size={11} />
              7-Day Launch Plan · starting {weekStart}
            </div>
            <h2 className="mt-2 text-[20px] font-medium text-text">Your launch, day-by-day.</h2>
            <p className="mt-1 text-[13px] text-secondary">
              Generated from your Business DNA. Every day has a clear task, owner, and expected outcome.
              Hit publish on day 7.
            </p>
          </div>
          <div className="text-right">
            <div className="font-mono text-[36px] font-semibold leading-none text-accent">D{stats.done + stats.ip}/{items.length}</div>
            <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-text">{stats.pct}% complete</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
          <Stat label="Done" value={stats.done} tone="text-success" />
          <Stat label="In progress" value={stats.ip} tone="text-accent" />
          <Stat label="To do" value={items.length - stats.done - stats.ip} tone="text-muted-text" />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" onClick={regenerate}>
            <RefreshCw size={12} /> Regenerate plan
          </Button>
          <a
            href="/roadmap"
            className="inline-flex items-center gap-1 text-[12px] text-accent hover:underline"
          >
            Open Growth Roadmap
            <ArrowRight size={11} />
          </a>
        </div>
      </Panel>

      <div className="grid gap-3">
        {items.map((item) => {
          const Icon = deptIcon[item.department] ?? Briefcase;
          const StatusIcon = statusMeta[item.status].icon;
          return (
            <Panel
              key={item.day}
              hoverable
              className={cn(
                "p-4 transition-opacity",
                item.status === "done" && "opacity-70",
              )}
            >
              <div className="flex items-start gap-4">
                {/* Day number */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => cycle(item.day)}
                    className={cn(
                      "rounded-full p-1 transition-colors",
                      item.status === "done" ? "text-success" : "text-muted-text hover:text-accent",
                    )}
                    aria-label="Mark complete"
                  >
                    <StatusIcon size={22} />
                  </button>
                  <div
                    className={cn(
                      "mt-2 flex h-12 w-12 items-center justify-center rounded-lg border-2 font-mono text-[18px] font-semibold",
                      item.status === "done"
                        ? "border-success/30 bg-success/10 text-success"
                        : item.status === "in_progress"
                          ? "border-accent/30 bg-accent/10 text-accent"
                          : "border-border bg-surface-1 text-muted-text",
                    )}
                  >
                    D{item.day}
                  </div>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={cn(
                        "text-[15px] font-medium text-text",
                        item.status === "done" && "line-through",
                      )}
                    >
                      {item.task}
                    </h3>
                    <div
                      className={cn(
                        "flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium",
                        deptColor[item.department] ?? "text-secondary border-border bg-surface-2",
                      )}
                    >
                      <Icon size={9} />
                      {item.department}
                    </div>
                    <div
                      className={cn(
                        "rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase",
                        statusMeta[item.status].tone,
                      )}
                    >
                      {statusMeta[item.status].label}
                    </div>
                    <div
                      className={cn(
                        "rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium",
                        difficultyCopy[item.difficulty].tone,
                      )}
                    >
                      {difficultyCopy[item.difficulty].label}
                    </div>
                  </div>
                  <p className="mt-1 text-[12px] text-secondary">
                    <span className="text-text">Objective:</span> {item.objective}
                  </p>
                  <p className="mt-0.5 text-[12px] text-muted-text">
                    <span className="text-secondary">Why it matters:</span> {item.whyItMatters}
                  </p>
                  <p className="mt-0.5 text-[12px] text-muted-text">
                    <span className="text-secondary">Expected result:</span> {item.expectedResult}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="rounded border border-border bg-surface-2 px-2 py-0.5 text-muted-text">
                      Owner: <span className="text-text">{item.employee}</span>
                    </span>
                    {item.status !== "done" && (
                      <button
                        onClick={() => runDay(item.day)}
                        className="inline-flex items-center gap-1 rounded border border-accent/30 bg-accent/5 px-2 py-0.5 text-accent hover:bg-accent/10"
                      >
                        <Sparkles size={10} />
                        Generate Day {item.day} output
                        <ArrowRight size={10} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">{label}</div>
      <div className={cn("mt-1 font-mono text-2xl font-semibold", tone)}>{value}</div>
    </div>
  );
}
