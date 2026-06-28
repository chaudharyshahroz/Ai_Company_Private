"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Copy, Download, RotateCw, Sparkles, Clock, Zap, Cpu } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { cn } from "@/lib/utils";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  const [task, setTask] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchTask = async () => {
      const res = await fetch(`/api/tasks/${taskId}`);
      const data = await res.json();
      setTask(data.task);
      setLoading(false);
      // Poll while running
      if (data.task?.status === "running" || data.task?.status === "queued") {
        interval = setTimeout(fetchTask, 1500);
      }
    };
    fetchTask();
    return () => clearTimeout(interval);
  }, [taskId]);

  if (loading) {
    return <div className="text-sm text-text-tertiary">Loading...</div>;
  }
  if (!task) {
    return <div className="text-sm text-text-tertiary">Task not found.</div>;
  }

  const copy = () => {
    navigator.clipboard.writeText(task.output ?? "");
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={14} />
        Back to tasks
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-text-primary">{task.title}</h1>
            <StatusBadge status={task.status} />
          </div>
          <p className="mt-2 text-sm text-text-secondary">{task.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {task.output && (
            <>
              <button
                onClick={copy}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary"
              >
                <Copy size={13} />
                Copy
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary">
                <Download size={13} />
                Download
              </button>
            </>
          )}
          <GlowButton size="sm">
            <RotateCw size={13} />
            Re-run
          </GlowButton>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-3 text-xs">
        {task.modelUsed && (
          <MetaPill icon={Cpu} label="Model" value={task.modelUsed} mono />
        )}
        {task.tokensUsed && (
          <MetaPill icon={Zap} label="Tokens" value={task.tokensUsed.toLocaleString()} />
        )}
        {task.durationMs && (
          <MetaPill icon={Clock} label="Duration" value={`${(task.durationMs / 1000).toFixed(2)}s`} />
        )}
      </div>

      {/* Output */}
      <GlassCard className="p-8">
        {task.status === "running" || task.status === "queued" ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="relative">
              <Sparkles size={32} className="animate-pulse text-primary-light" />
              <span className="absolute inset-0 animate-ping opacity-50">
                <Sparkles size={32} className="text-primary-light" />
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-text-primary">
                {task.status === "queued" ? "Task queued" : "Agent is working..."}
              </div>
              <div className="mt-1 text-xs text-text-tertiary">
                Output will appear here when the agent finishes.
              </div>
            </div>
          </div>
        ) : task.errorMessage ? (
          <div className="rounded-lg border border-accent-warm/30 bg-accent-warm/10 p-4 text-sm text-accent-warm">
            <strong>Error:</strong> {task.errorMessage}
          </div>
        ) : task.output ? (
          <div className="prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-text-primary">
              {task.output}
            </pre>
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-text-tertiary">No output yet.</div>
        )}
      </GlassCard>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map = {
    completed: "border-accent/40 bg-accent/10 text-accent",
    running: "border-primary/40 bg-primary/10 text-primary-light",
    queued: "border-text-tertiary/40 bg-surface-2 text-text-secondary",
    failed: "border-accent-warm/40 bg-accent-warm/10 text-accent-warm",
    cancelled: "border-text-tertiary/40 bg-surface-2 text-text-tertiary",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        map[status as keyof typeof map] ?? map.queued,
      )}
    >
      {status}
    </span>
  );
}

function MetaPill({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1">
      <Icon size={12} className="text-text-tertiary" />
      <span className="text-text-tertiary">{label}:</span>
      <span className={cn("text-text-primary", mono && "font-mono text-[11px]")}>{value}</span>
    </div>
  );
}