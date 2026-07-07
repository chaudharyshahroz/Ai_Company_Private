"use client";

import * as React from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Calendar,
  Briefcase,
  TrendingUp,
  Megaphone,
  Globe,
  Code,
  Users,
  Heart,
  Wallet,
  X,
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export type WeeklyTaskStatus = "todo" | "in_progress" | "done" | "skipped";

export interface WeeklyTaskView {
  id: string;
  weekStart: string;
  task: string;
  reason: string;
  expectedResult: string;
  assignedDepartment: string;
  dueDate: string;
  status: WeeklyTaskStatus;
  oneClickAction: string;
  createdAt: string;
}

const deptIcon: Record<string, React.ElementType> = {
  marketing: Megaphone,
  sales: TrendingUp,
  "product-website": Globe,
  content: Sparkles,
  operations: Briefcase,
  finance: Wallet,
  research: Code,
  hr: Users,
  support: Heart,
  executive: Calendar,
};

const deptColor: Record<string, string> = {
  marketing: "text-accent border-accent/30 bg-accent/10",
  sales: "text-success border-success/30 bg-success/10",
  "product-website": "text-primary border-primary/30 bg-primary/10",
  content: "text-accent-warm border-accent-warm/30 bg-accent-warm/10",
  operations: "text-secondary border-secondary/30 bg-secondary/10",
  finance: "text-warning border-warning/30 bg-warning/10",
  research: "text-info border-info/30 bg-info/10",
  hr: "text-secondary border-secondary/30 bg-secondary/10",
  support: "text-success border-success/30 bg-success/10",
  executive: "text-warning border-warning/30 bg-warning/10",
};

const statusMeta: Record<WeeklyTaskStatus, { label: string; tone: string; icon: React.ElementType }> = {
  todo: { label: "To do", tone: "text-muted-text border-border bg-surface-2", icon: Circle },
  in_progress: { label: "In progress", tone: "text-accent border-accent/30 bg-accent/10", icon: Clock },
  done: { label: "Done", tone: "text-success border-success/30 bg-success/10", icon: CheckCircle2 },
  skipped: { label: "Skipped", tone: "text-muted-text border-border bg-surface-1", icon: X },
};

export function WeeklyTasksClient({ initialTasks }: { initialTasks: WeeklyTaskView[] }) {
  const toast = useToast();
  const [tasks, setTasks] = React.useState<WeeklyTaskView[]>(initialTasks);
  const [filter, setFilter] = React.useState<"all" | WeeklyTaskStatus>("all");

  const visible = React.useMemo(
    () => (filter === "all" ? tasks : tasks.filter((t) => t.status === filter)),
    [tasks, filter],
  );

  const stats = React.useMemo(() => {
    const done = tasks.filter((t) => t.status === "done").length;
    const ip = tasks.filter((t) => t.status === "in_progress").length;
    const todo = tasks.filter((t) => t.status === "todo").length;
    const pct = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
    return { done, ip, todo, pct };
  }, [tasks]);

  const cycleStatus = (id: string) => {
    const order: WeeklyTaskStatus[] = ["todo", "in_progress", "done"];
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    const next = order[(order.indexOf(t.status) + 1) % order.length];
    setTasks((prev) => prev.map((x) => (x.id === id ? { ...x, status: next } : x)));
    toast.push({
      tone: next === "done" ? "success" : "info",
      title: `${t.task.slice(0, 40)}… → ${statusMeta[next].label}`,
    });
  };

  const skip = (id: string) => {
    const t = tasks.find((x) => x.id === id);
    setTasks((prev) => prev.map((x) => (x.id === id ? { ...x, status: "skipped" } : x)));
    if (t) {
      toast.push({ tone: "info", title: "Task skipped", description: "AI CEO will re-prioritize next week." });
    }
  };

  const regenerate = () => {
    toast.push({
      tone: "info",
      title: "AI CEO generating fresh priorities",
      description: "Atlas is analyzing this week's results and will post 3-5 new high-leverage tasks in 30 seconds.",
    });
  };

  const daysLeft = (date: string) => {
    const diff = new Date(date).getTime() - Date.now();
    return Math.ceil(diff / 86_400_000);
  };

  return (
    <div className="space-y-6">
      {/* Week header */}
      <Panel className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
              <Calendar size={11} />
              Week of {tasks[0]?.weekStart}
            </div>
            <h2 className="mt-2 text-[20px] font-medium text-text">3-5 next-best-actions, every week.</h2>
            <p className="mt-1 text-[13px] text-secondary">
              Your AI CEO has read every department report, your offer, and your business score. These are the
              highest-leverage moves for the week. Skip the noise.
            </p>
          </div>
          <div className="text-right">
            <div className="font-mono text-[36px] font-semibold leading-none text-accent">{stats.pct}%</div>
            <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-text">Week complete</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
          <Stat label="To do" value={stats.todo} tone="text-muted-text" />
          <Stat label="In progress" value={stats.ip} tone="text-accent" />
          <Stat label="Done" value={stats.done} tone="text-success" />
        </div>
      </Panel>

      {/* Filters + actions */}
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "todo", "in_progress", "done", "skipped"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-md px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider transition-colors",
              filter === f
                ? "bg-surface-2 text-text"
                : "text-muted-text hover:text-text",
            )}
          >
            {f === "all" ? "All" : statusMeta[f].label}
            <span className="ml-1.5 font-mono text-[10px] text-muted-text">
              {f === "all" ? tasks.length : tasks.filter((t) => t.status === f).length}
            </span>
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <Button variant="secondary" size="md" onClick={regenerate}>
            <RefreshCw size={13} />
            Regenerate
          </Button>
        </div>
      </div>

      {/* Task list */}
      {visible.length === 0 ? (
        <EmptyState
          title="No tasks in this filter"
          description="Switch filters or ask AI CEO to regenerate this week's priorities."
          action={
            <Button size="md" onClick={regenerate}>
              <RefreshCw size={13} /> Regenerate
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {visible.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              daysLeft={daysLeft(t.dueDate)}
              onCycle={() => cycleStatus(t.id)}
              onSkip={() => skip(t.id)}
            />
          ))}
        </div>
      )}
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

function TaskRow({
  task,
  daysLeft,
  onCycle,
  onSkip,
}: {
  task: WeeklyTaskView;
  daysLeft: number;
  onCycle: () => void;
  onSkip: () => void;
}) {
  const Icon = deptIcon[task.assignedDepartment] ?? Briefcase;
  const StatusIcon = statusMeta[task.status].icon;
  const isDone = task.status === "done";
  const isSkipped = task.status === "skipped";

  return (
    <Panel
      hoverable
      className={cn(
        "p-4 transition-opacity",
        isDone && "opacity-60",
        isSkipped && "opacity-40",
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onCycle}
          className={cn(
            "mt-0.5 shrink-0 rounded-full p-0.5 transition-colors",
            isDone ? "text-success" : "text-muted-text hover:text-accent",
          )}
          aria-label="Toggle status"
        >
          <StatusIcon size={20} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={cn(
                "text-[14px] font-medium text-text",
                isDone && "line-through",
              )}
            >
              {task.task}
            </h3>
            <div
              className={cn(
                "flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium",
                deptColor[task.assignedDepartment] ?? "text-secondary border-border bg-surface-2",
              )}
            >
              <Icon size={9} />
              {task.assignedDepartment}
            </div>
            <div
              className={cn(
                "rounded border px-1.5 py-0.5 text-[10px] font-medium",
                statusMeta[task.status].tone,
              )}
            >
              {statusMeta[task.status].label}
            </div>
          </div>
          <p className="mt-1.5 text-[12px] leading-relaxed text-secondary">
            <span className="text-text">Why:</span> {task.reason}
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-muted-text">
            <span className="text-secondary">Expected:</span> {task.expectedResult}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
            <span
              className={cn(
                "rounded border px-2 py-0.5",
                daysLeft < 0
                  ? "border-danger/30 text-danger"
                  : daysLeft <= 1
                    ? "border-warning/30 text-warning"
                    : "border-border text-muted-text",
              )}
            >
              {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? "Due today" : `Due in ${daysLeft}d`}
              <span className="ml-1.5 text-muted-text">({task.dueDate})</span>
            </span>
            {task.oneClickAction && (
              <a
                href={task.oneClickAction}
                className="inline-flex items-center gap-1 rounded border border-accent/30 bg-accent/5 px-2 py-0.5 text-accent hover:bg-accent/10"
              >
                <Sparkles size={9} />
                Open action
                <ArrowRight size={9} />
              </a>
            )}
            <button
              onClick={onSkip}
              className="ml-auto text-[11px] text-muted-text hover:text-text"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </Panel>
  );
}
