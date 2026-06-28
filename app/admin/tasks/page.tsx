import { GlassCard } from "@/components/ui/GlassCard";
import { MOCK_TASKS } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusStyles = {
  completed: "border-accent/40 bg-accent/10 text-accent",
  running: "border-primary/40 bg-primary/10 text-primary-light",
  queued: "border-text-tertiary/40 bg-surface-2 text-text-secondary",
  failed: "border-accent-warm/40 bg-accent-warm/10 text-accent-warm",
  cancelled: "border-text-tertiary/40 bg-surface-2 text-text-tertiary",
} as const;

export default function AdminTasksPage() {
  const stats = {
    running: MOCK_TASKS.filter((t) => t.status === "running").length,
    failedToday: 3,
    avgDuration: 5.2,
    tokensToday: 142837,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Live task monitor across all users
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatBox label="Running now" value={stats.running} color="text-primary-light" />
        <StatBox label="Failed today" value={stats.failedToday} color="text-accent-warm" />
        <StatBox label="Avg duration" value={`${stats.avgDuration}s`} color="text-text-primary" />
        <StatBox label="Tokens today" value={stats.tokensToday.toLocaleString()} color="text-accent" />
      </div>

      <GlassCard className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2/40">
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">User</th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">Task</th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">Status</th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">Model</th>
              <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-tertiary">Tokens</th>
              <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-tertiary">When</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {MOCK_TASKS.map((t) => (
              <tr key={t.id} className="hover:bg-surface-2/30">
                <td className="px-5 py-3 text-text-secondary">demo@reklu.app</td>
                <td className="px-5 py-3 text-text-primary">{t.title}</td>
                <td className="px-5 py-3">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                    statusStyles[t.status],
                  )}>
                    {t.status}
                  </span>
                </td>
                <td className="px-5 py-3 font-mono text-xs text-text-tertiary">{t.modelUsed ?? "—"}</td>
                <td className="px-5 py-3 text-right font-mono text-xs text-text-primary">
                  {t.tokensUsed?.toLocaleString() ?? "—"}
                </td>
                <td className="px-5 py-3 text-right text-xs text-text-tertiary">{formatRelativeTime(t.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface/60 p-4">
      <div className={`text-2xl font-bold tabular-nums ${color}`}>{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-text-tertiary">{label}</div>
    </div>
  );
}