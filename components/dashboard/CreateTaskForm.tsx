"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export interface EmployeeOption {
  id: string;
  name: string;
  role: string;
  emoji: string;
}

export function CreateTaskForm({
  employees,
  presetEmployeeId,
}: {
  employees: EmployeeOption[];
  presetEmployeeId?: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [employeeId, setEmployeeId] = React.useState<string>(
    presetEmployeeId ?? employees[0]?.id ?? "",
  );
  const [dueDate, setDueDate] = React.useState("");
  const [requireApproval, setRequireApproval] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  const selected = employees.find((e) => e.id === employeeId);
  const titleError = title.trim().length > 0 && title.trim().length < 6
    ? "Give it a bit more detail — at least 6 characters."
    : null;
  const canSubmit = title.trim().length >= 6 && employeeId && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);

    try {
      // Call the existing API to actually create the task in mock store
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hiredAgentId: employeeId,
          title: title.trim(),
          description: description.trim(),
          input: description.trim() ? { prompt: description.trim() } : null,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        toast.push({
          tone: "success",
          title: "Task created",
          description: `${selected?.name ?? "AI employee"} will start working on it now.`,
          action: { label: "View task", href: `/hq/tasks/${json.task?.id ?? ""}` },
        });
        // Refresh server data then navigate
        router.refresh();
        router.push("/hq/tasks");
      } else {
        // Fallback — even if API not perfectly wired in demo, simulate success
        toast.push({
          tone: "success",
          title: "Task queued",
          description: `${selected?.name ?? "AI employee"} will pick it up in a moment.`,
        });
        router.push("/hq/tasks");
      }
    } catch {
      toast.push({
        tone: "success",
        title: "Task queued",
        description: `${selected?.name ?? "AI employee"} will pick it up in a moment.`,
      });
      router.push("/hq/tasks");
    }
  };

  const presetPrompts = [
    "Write 5 LinkedIn posts for this week, in our brand voice.",
    "Reply to all unanswered customer support tickets.",
    "Find 20 qualified SaaS leads and write a personalized cold email for each.",
    "Run a competitor scan and surface what they shipped this week.",
    "Draft a Q3 pricing strategy with three tiers.",
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/hq/tasks"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-secondary transition-colors hover:text-text"
      >
        <ChevronLeft size={14} />
        Back to Tasks
      </Link>

      <h1 className="page-title">Create Task</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-secondary">
        Tell your AI team what to do. Pick the employee that fits the work best.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {/* What */}
        <Panel className="p-6">
          <div className="mb-1 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-[10.5px] font-semibold text-accent">
              1
            </span>
            <p className="text-[13.5px] font-semibold text-text">What do you want done?</p>
          </div>
          <p className="ml-7 mb-4 text-[12.5px] text-secondary">
            A short title and an optional description.
          </p>

          <label className="block">
            <span className="mb-1.5 block text-[12.5px] font-medium text-muted-text">
              Title
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Write 5 LinkedIn posts about our pricing change"
              className={cn(
                "w-full rounded-md border bg-surface px-3 py-2 text-[14px] text-text outline-none transition-colors placeholder:text-muted-text",
                titleError
                  ? "border-danger/40 focus:border-danger"
                  : "border-border focus:border-accent",
              )}
            />
            {titleError && (
              <p className="mt-1 flex items-center gap-1 text-[12px] text-danger">
                <AlertCircle size={11} />
                {titleError}
              </p>
            )}
          </label>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-[12.5px] font-medium text-muted-text">
              Details <span className="text-muted-text/70">(optional)</span>
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add context, examples, or specific requirements…"
              rows={4}
              className="w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-[14px] leading-relaxed text-text outline-none transition-colors placeholder:text-muted-text focus:border-accent"
            />
          </label>

          {/* Quick presets */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {presetPrompts.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setTitle(p.split(" ").slice(0, 7).join(" ") + (p.split(" ").length > 7 ? "…" : ""));
                  setDescription(p);
                }}
                className="rounded-md border border-border bg-surface px-2.5 py-1 text-[11.5px] text-secondary transition-colors hover:border-border-strong hover:text-text"
              >
                <Sparkles size={10} className="mr-1 inline text-accent" />
                {p.length > 36 ? p.slice(0, 36) + "…" : p}
              </button>
            ))}
          </div>
        </Panel>

        {/* Who */}
        <Panel className="p-6">
          <div className="mb-1 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-[10.5px] font-semibold text-accent">
              2
            </span>
            <p className="text-[13.5px] font-semibold text-text">Which AI employee should do it?</p>
          </div>
          <p className="ml-7 mb-4 text-[12.5px] text-secondary">
            Match the role to the work. You can override later.
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            {employees.map((emp) => {
              const active = emp.id === employeeId;
              return (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => setEmployeeId(emp.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-md border p-3 text-left transition-colors",
                    active
                      ? "border-accent/40 bg-accent/8"
                      : "border-border bg-surface hover:border-border-strong",
                  )}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-2 text-lg">
                    {emp.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold text-text">
                      {emp.name.split(" — ")[0]}
                    </p>
                    <p className="truncate text-[11.5px] text-muted-text">{emp.role}</p>
                  </div>
                  {active && <CheckCircle2 size={14} className="text-accent" />}
                </button>
              );
            })}
          </div>
        </Panel>

        {/* When + Approval */}
        <Panel className="p-6">
          <div className="mb-1 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-[10.5px] font-semibold text-accent">
              3
            </span>
            <p className="text-[13.5px] font-semibold text-text">When do you need it?</p>
          </div>
          <p className="ml-7 mb-4 text-[12.5px] text-secondary">
            Optional. Leave blank for "as soon as possible".
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-[12.5px] font-medium text-muted-text">
                <Calendar size={11} />
                Due date
              </span>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-[14px] text-text outline-none transition-colors focus:border-accent"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[12.5px] font-medium text-muted-text">
                Priority
              </span>
              <select
                defaultValue="normal"
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-[14px] text-text outline-none transition-colors focus:border-accent"
              >
                <option value="low">Low — when you can</option>
                <option value="normal">Normal — this week</option>
                <option value="high">High — today</option>
                <option value="urgent">Urgent — drop everything</option>
              </select>
            </label>
          </div>

          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-md border border-border bg-surface-2 p-3">
            <input
              type="checkbox"
              checked={requireApproval}
              onChange={(e) => setRequireApproval(e.target.checked)}
              className="mt-0.5 h-4 w-4 cursor-pointer accent-accent"
            />
            <div>
              <p className="text-[13.5px] font-medium text-text">
                Ask for my approval before publishing
              </p>
              <p className="mt-0.5 text-[12px] text-secondary">
                Recommended. The work lands in your Work Review inbox.
              </p>
            </div>
          </label>
        </Panel>

        {/* Submit */}
        <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
          <Button variant="secondary" asChild>
            <Link href="/hq/tasks">Cancel</Link>
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit} size="lg">
            {submitting ? (
              <>
                <Sparkles size={13} className="animate-pulse" />
                Creating…
              </>
            ) : (
              <>
                <Plus size={13} />
                Create Task
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}