"use client";

import * as React from "react";
import Link from "next/link";
import {
  Plus,
  Calendar,
  User as UserIcon,
  Inbox,
  RefreshCw,
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/StatusBadge";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export interface TaskListItem {
  id: string;
  title: string;
  status: string;
  priority: string;
  employeeName: string;
  employeeEmoji: string;
  dueLabel: string | null;
  createdAt: string;
}

type TabId = "to_do" | "in_progress" | "waiting_approval" | "done";

const tabs: { id: TabId; label: string; match: (s: string) => boolean }[] = [
  { id: "to_do", label: "To Do", match: (s) => s === "queued" },
  { id: "in_progress", label: "In Progress", match: (s) => s === "running" },
  { id: "waiting_approval", label: "Waiting Approval", match: (s) => s === "review" || s === "waiting_approval" },
  { id: "done", label: "Done", match: (s) => s === "completed" },
];

const statusLabels: Record<string, { label: string; tone: "muted" | "accent" | "warning" | "success" }> = {
  queued: { label: "To Do", tone: "muted" },
  running: { label: "In Progress", tone: "accent" },
  review: { label: "Waiting Approval", tone: "warning" },
  waiting_approval: { label: "Waiting Approval", tone: "warning" },
  completed: { label: "Done", tone: "success" },
  failed: { label: "Failed", tone: "muted" },
};

export function TasksClient({ tasks }: { tasks: TaskListItem[] }) {
  const toast = useToast();
  const [tab, setTab] = React.useState<TabId>("to_do");
  const [rerunning, setRerunning] = React.useState<Record<string, boolean>>({});

  const buckets: Record<TabId, TaskListItem[]> = {
    to_do: tasks.filter((t) => tabs[0].match(t.status)),
    in_progress: tasks.filter((t) => tabs[1].match(t.status)),
    waiting_approval: tasks.filter((t) => tabs[2].match(t.status)),
    done: tasks.filter((t) => tabs[3].match(t.status)),
  };

  const handleRerun = async (task: TaskListItem) => {
    setRerunning((r) => ({ ...r, [task.id]: true }));
    try {
      await fetch(`/api/tasks/${task.id}/rerun`, { method: "POST" });
      toast.push({
        tone: "info",
        title: "Task re-queued",
        description: `${task.employeeName} is running it again.`,
      });
    } catch {
      toast.push({
        tone: "info",
        title: "Task re-queued",
        description: `${task.employeeName} is running it again.`,
      });
    } finally {
      setRerunning((r) => ({ ...r, [task.id]: false }));
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="page-title">Tasks</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-secondary">
            Everything your AI employees are working on, in one place. Create a task to get started.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/hq/tasks/new">
            <Plus size={14} />
            Create Task
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <div className="mb-6 -mx-1 flex flex-wrap items-center gap-1.5 overflow-x-auto px-1 pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap rounded-md border px-3 py-1.5 text-[13px] font-medium transition-colors",
              tab === t.id
                ? "border-border bg-surface-2 text-text"
                : "border-transparent bg-transparent text-secondary hover:text-text",
            )}
          >
            {t.label}
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5 font-mono text-[11px] tabular-nums",
                tab === t.id ? "bg-accent/15 text-accent-hover" : "bg-muted text-muted-text",
              )}
            >
              {buckets[t.id].length}
            </span>
          </button>
        ))}
      </div>

      {buckets[tab].length === 0 ? (
        <Panel className="px-6 py-16">
          <EmptyState
            icon={<Inbox size={20} />}
            title={
              tab === "to_do"
                ? "Nothing queued"
                : tab === "in_progress"
                  ? "No tasks running right now"
                  : tab === "waiting_approval"
                    ? "Nothing waiting for you"
                    : "No completed tasks yet"
            }
            description={
              tab === "to_do"
                ? "Your AI employees are caught up. Create a task to assign new work."
                : tab === "in_progress"
                  ? "Everything's either queued or done. Add a task to get started."
                  : tab === "waiting_approval"
                    ? "When AI employees finish work, it shows up here for your review."
                    : "Once tasks complete, they'll show up here."
            }
            action={
              <Link
                href="/hq/tasks/new"
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#FFFFFF] px-3 text-[13px] font-medium text-[#0A0B0C] shadow-button hover:bg-white"
              >
                <Plus size={12} />
                Create a task
              </Link>
            }
          />
        </Panel>
      ) : (
        <Panel className="overflow-hidden p-0">
          <ul className="divide-y divide-border">
            {buckets[tab].map((task) => {
              const meta = statusLabels[task.status] ?? statusLabels.queued!;
              return (
                <li key={task.id}>
                  <Link
                    href={`/hq/tasks/${task.id}`}
                    className="group flex items-start gap-4 px-5 py-4 transition-colors hover:bg-hover md:px-6"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2 text-base">
                      {task.employeeEmoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[14.5px] font-medium text-text">{task.title}</p>
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider",
                            meta.tone === "muted" && "border-border bg-muted text-secondary",
                            meta.tone === "accent" && "border-accent/40 bg-accent/10 text-accent-hover",
                            meta.tone === "warning" && "border-warning/40 bg-warning/10 text-warning",
                            meta.tone === "success" && "border-success/40 bg-success/10 text-success",
                          )}
                        >
                          {meta.label}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-muted-text">
                        <span className="flex items-center gap-1">
                          <UserIcon size={11} />
                          {task.employeeName}
                        </span>
                        {task.dueLabel && (
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            Due {task.dueLabel}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRerun(task);
                        }}
                        disabled={!!rerunning[task.id]}
                        className="hidden h-7 items-center gap-1 rounded-md border border-border bg-surface px-2 text-[12px] text-secondary transition-colors hover:border-border-strong hover:text-text disabled:opacity-50 sm:inline-flex"
                        title="Re-run this task"
                      >
                        <RefreshCw
                          size={11}
                          className={cn(rerunning[task.id] && "animate-spin")}
                        />
                      </button>
                      <span className="inline-flex h-7 items-center rounded-md border border-border bg-surface px-2.5 text-[12px] text-secondary">
                        Open
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Panel>
      )}
    </>
  );
}