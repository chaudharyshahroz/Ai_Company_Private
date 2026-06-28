"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { listEnrichedHiredAgents } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function NewTaskPage() {
  const router = useRouter();
  const [agents, setAgents] = React.useState<any[]>([]);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [agentId, setAgentId] = React.useState("");
  const [priority, setPriority] = React.useState<"low" | "normal" | "high" | "urgent">("normal");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/agents/hired")
      .then((r) => r.json())
      .then((d) => {
        setAgents(d.agents ?? []);
        if (d.agents?.[0]) setAgentId(d.agents[0].id);
      });
  }, []);

  const submit = async () => {
    if (!title.trim() || !agentId) return;
    setSubmitting(true);
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, hiredAgentId: agentId, priority }),
    });
    const data = await res.json();
    if (data.task?.id) router.push(`/dashboard/tasks/${data.task.id}`);
    setSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">New task</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Brief an agent like a senior hire.
        </p>
      </div>

      <GlassCard className="space-y-6 p-8">
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-tertiary">
            Which agent?
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            {agents.map((a: any) => (
              <button
                key={a.id}
                onClick={() => setAgentId(a.id)}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
                  agentId === a.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-surface hover:border-primary/30",
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-lg",
                    a.template?.avatarColor,
                  )}
                >
                  {a.template?.avatarEmoji}
                </div>
                <div>
                  <div className="text-sm font-medium text-text-primary">
                    {a.customName ?? a.template?.name}
                  </div>
                  <div className="text-xs text-text-tertiary">{a.template?.role}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-tertiary">
            Task title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Write a LinkedIn post about our Q3 launch"
            className="input"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-tertiary">
            Brief
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does good look like? Match the voice of [paste sample]. Lead with the contrarian take..."
            rows={6}
            className="input resize-none"
          />
          <p className="mt-1 text-xs text-text-tertiary">
            Vague in, vague out. Brief like a senior hire.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-tertiary">
            Priority
          </label>
          <div className="flex gap-2">
            {(["low", "normal", "high", "urgent"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider transition-colors",
                  priority === p
                    ? "border-primary bg-primary/15 text-primary-light"
                    : "border-border bg-surface text-text-secondary hover:text-text-primary",
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border pt-6">
          <button
            onClick={() => router.back()}
            className="rounded-lg px-4 py-2 text-sm text-text-secondary hover:text-text-primary"
          >
            Cancel
          </button>
          <GlowButton onClick={submit} disabled={submitting || !title || !agentId}>
            <Sparkles size={14} />
            {submitting ? "Running..." : "Run task"}
            <ArrowRight size={14} />
          </GlowButton>
        </div>
      </GlassCard>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          background-color: rgba(17, 17, 24, 0.6);
          border: 1px solid #2a2a3e;
          border-radius: 0.5rem;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: #f0eeff;
          outline: none;
          transition: border-color 0.15s;
        }
        :global(.input:focus) {
          border-color: #7c5cfc;
          box-shadow: 0 0 0 3px rgba(124, 92, 252, 0.15);
        }
      `}</style>
    </div>
  );
}