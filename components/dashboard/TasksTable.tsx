"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { formatRelativeTime as fmt } from "@/lib/format";
import type { Task } from "@/lib/db/schema";
import type { EnrichedHiredAgent } from "@/lib/data";

interface Props {
  tasks: Task[];
  agents: EnrichedHiredAgent[];
}

type Tab = "all" | "queued" | "running" | "completed" | "failed";

const tabs: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "queued", label: "Queued" },
  { id: "running", label: "Running" },
  { id: "completed", label: "Completed" },
  { id: "failed", label: "Failed" },
];

export function TasksTable({ tasks, agents }: Props) {
  const [tab, setTab] = React.useState<Tab>("all");

  const filtered = React.useMemo(() => {
    if (tab === "all") return tasks;
    return tasks.filter((t) => t.status === tab);
  }, [tab, tasks]);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {tabs.map((t) => {
          const count =
            t.id === "all" ? tasks.length : tasks.filter((x) => x.status === t.id).length;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors",
                tab === t.id
                  ? "text-text-primary"
                  : "text-text-secondary hover:text-text-primary",
              )}
            >
              {t.label}
              <span className="rounded-full bg-surface-2 px-1.5 py-0.5 text-[10px] tabular-nums text-text-tertiary">
                {count}
              </span>
              {tab === t.id && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-t-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <GlassCard className="p-10 text-center">
            <p className="text-sm text-text-tertiary">No tasks in this view yet.</p>
          </GlassCard>
        ) : (
          filtered.map((task) => {
            const agent = agents.find((a) => a.id === task.hiredAgentId);
            return (
              <Link key={task.id} href={`/dashboard/tasks/${task.id}`}>
                <GlassCard hoverable className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-lg",
                        agent?.template?.avatarColor ?? "from-primary to-accent-warm",
                      )}
                    >
                      {agent?.template?.avatarEmoji ?? "🤖"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-text-primary">{task.title}</span>
                        <StatusBadge status={task.status} />
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-tertiary">
                        <span>{agent?.template?.name ?? "Agent"}</span>
                        <span>·</span>
                        <span>{fmt(task.createdAt)}</span>
                        {task.durationMs && (
                          <>
                            <span>·</span>
                            <span>{(task.durationMs / 1000).toFixed(1)}s</span>
                          </>
                        )}
                        {task.modelUsed && (
                          <>
                            <span>·</span>
                            <span className="font-mono">{task.modelUsed}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={14} className="mt-2 text-text-tertiary" />
                  </div>
                </GlassCard>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Task["status"] }) {
  const map = {
    completed: { color: "border-accent/40 bg-accent/10 text-accent", label: "Done" },
    running: { color: "border-primary/40 bg-primary/10 text-primary-light", label: "Running" },
    queued: { color: "border-text-tertiary/40 bg-surface-2 text-text-secondary", label: "Queued" },
    failed: { color: "border-accent-warm/40 bg-accent-warm/10 text-accent-warm", label: "Failed" },
    cancelled: { color: "border-text-tertiary/40 bg-surface-2 text-text-tertiary", label: "Cancelled" },
  } as const;
  const s = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        s.color,
      )}
    >
      {status === "running" && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {s.label}
    </span>
  );
}