import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  RefreshCw,
  X,
  Check,
  Clock,
  User,
  Zap,
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { TaskActions } from "@/components/dashboard/TaskActions";
import { getCurrentUser, getTask, listEnrichedHiredAgents } from "@/lib/data";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TaskDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  const task = await getTask(params.id);
  if (!task) notFound();

  const agents = await listEnrichedHiredAgents(user.id);
  const agent = agents.find((a) => a.id === task.hiredAgentId);
  const template = agent?.template;

  const meta = (() => {
    switch (task.status) {
      case "completed":
        return { label: "Completed", tone: "success" as const };
      case "running":
        return { label: "In Progress", tone: "accent" as const };
      case "queued":
        return { label: "Queued", tone: "muted" as const };
      case "failed":
        return { label: "Failed", tone: "danger" as const };
      case "cancelled":
        return { label: "Cancelled", tone: "muted" as const };
      default:
        return { label: task.status, tone: "muted" as const };
    }
  })() as { label: string; tone: "success" | "accent" | "muted" | "danger" | "warning" };

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={0} />
        <main className="flex-1 px-5 pb-32 pt-8 md:px-10 md:pb-12 md:pt-10">
          <Link
            href="/hq/tasks"
            className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-secondary transition-colors hover:text-text"
          >
            <ChevronLeft size={14} />
            Back to Tasks
          </Link>

          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider",
                    meta.tone === "success" && "border-success/40 bg-success/10 text-success",
                    meta.tone === "accent" && "border-accent/40 bg-accent/10 text-accent-hover",
                    meta.tone === "warning" && "border-warning/40 bg-warning/10 text-warning",
                    meta.tone === "danger" && "border-danger/40 bg-danger/10 text-danger",
                    meta.tone === "muted" && "border-border bg-muted text-secondary",
                  )}
                >
                  {meta.label}
                </span>
                <span className="font-mono text-[12px] text-muted-text">#{task.id}</span>
              </div>
              <h1 className="page-title">{task.title}</h1>
              {task.description && (
                <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-secondary">
                  {task.description}
                </p>
              )}
            </div>

            <TaskActions taskId={task.id} status={task.status} />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {/* Main output */}
            <div className="lg:col-span-2 space-y-5">
              <Panel className="p-6">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-text">
                  Output
                </p>
                {task.output ? (
                  <div className="whitespace-pre-wrap text-[14.5px] leading-relaxed text-text">
                    {task.output}
                  </div>
                ) : (
                  <p className="text-[14px] italic text-muted-text">
                    No output yet — your AI employee hasn't finished this one.
                  </p>
                )}
              </Panel>

              {task.errorMessage && (
                <Panel className="border-l-2 border-l-danger p-6">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-danger">
                    Error
                  </p>
                  <p className="font-mono text-[13px] leading-relaxed text-text">
                    {task.errorMessage}
                  </p>
                </Panel>
              )}

              {task.outputMetadata && (
                <Panel className="p-6">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-text">
                    Run details
                  </p>
                  <dl className="grid grid-cols-2 gap-3 text-[13px] md:grid-cols-4">
                    <Row label="Words" value={task.outputMetadata.wordCount?.toString() ?? "—"} />
                    <Row label="Tokens" value={task.tokensUsed?.toString() ?? "—"} />
                    <Row label="Duration" value={task.durationMs ? `${(task.durationMs / 1000).toFixed(1)}s` : "—"} />
                    <Row label="Model" value={task.modelUsed ?? "—"} />
                  </dl>
                </Panel>
              )}
            </div>

            {/* Sidebar meta */}
            <div className="space-y-5">
              <Panel className="p-5">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-text">
                  Assigned to
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface-2 text-xl">
                    {template?.avatarEmoji ?? "🤖"}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-text">
                      {template?.name?.split(" — ")[0] ?? "Unassigned"}
                    </p>
                    <p className="text-[12px] text-muted-text">{template?.role ?? "—"}</p>
                  </div>
                </div>
              </Panel>

              <Panel className="p-5">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-text">
                  Timeline
                </p>
                <ul className="space-y-3 text-[13px]">
                  <Row icon={<Clock size={12} />} label="Created" value={formatDateTime(task.createdAt)} />
                  {task.startedAt && (
                    <Row icon={<Zap size={12} />} label="Started" value={formatDateTime(task.startedAt)} />
                  )}
                  {task.completedAt && (
                    <Row icon={<Check size={12} />} label="Completed" value={formatDateTime(task.completedAt)} />
                  )}
                </ul>
              </Panel>

              <Panel className="p-5">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-text">
                  Settings
                </p>
                <dl className="space-y-2 text-[13px]">
                  <Row icon={<User size={12} />} label="Priority" value={task.priority} />
                  <Row label="Credits used" value={task.tokensUsed ? `~${Math.ceil(task.tokensUsed / 1000)}k` : "—"} />
                </dl>
              </Panel>
            </div>
          </div>
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-muted-text">
        {icon}
        {label}
      </dt>
      <dd className="mt-0.5 text-text">{value}</dd>
    </div>
  );
}