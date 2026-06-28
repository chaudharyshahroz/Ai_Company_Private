import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { formatUsd } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

const metrics = [
  { label: "MRR", value: 15842, delta: "+18.2%" },
  { label: "ARR", value: 190104, delta: "+218%" },
  { label: "New MRR (this month)", value: 4280, delta: "+32%" },
  { label: "Churned MRR", value: 612, delta: "−4%" },
  { label: "Net new MRR", value: 3668, delta: "+22%" },
  { label: "ARPU", value: 79, delta: "stable" },
];

export default function AdminRevenuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Revenue</h1>
        <p className="mt-1 text-sm text-text-secondary">
          MRR, ARR, churn — the financial pulse of Reklu.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {metrics.map((m) => (
          <GlassCard key={m.label} className="p-4">
            <div className="text-xs uppercase tracking-wider text-text-tertiary">{m.label}</div>
            <div className="mt-2 font-display text-2xl font-bold tabular-nums text-text-primary">
              {formatUsd(m.value)}
            </div>
            <div className="mt-1 inline-flex items-center gap-0.5 text-[11px] text-accent">
              <TrendingUp size={10} />
              {m.delta}
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-7">
        <h2 className="mb-4 text-sm font-semibold text-text-primary">Subscriptions</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">User</th>
              <th className="py-2 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">Plan</th>
              <th className="py-2 text-right text-xs font-medium uppercase tracking-wider text-text-tertiary">Amount</th>
              <th className="py-2 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">Started</th>
              <th className="py-2 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">Next billing</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {[
              { user: "Maya Chen", plan: "Growth", amount: 79, started: "2025-12-01", next: "2026-07-01" },
              { user: "Lena Park", plan: "Company", amount: 149, started: "2025-11-08", next: "2026-07-08" },
              { user: "Tom Wright", plan: "Growth", amount: 79, started: "2026-02-22", next: "2026-07-22" },
              { user: "Jordan Patel", plan: "Starter", amount: 29, started: "2026-01-12", next: "2026-07-12" },
              { user: "Aisha Patel", plan: "Starter", amount: 29, started: "2026-03-15", next: "2026-07-15" },
            ].map((s, i) => (
              <tr key={i}>
                <td className="py-2.5 text-text-primary">{s.user}</td>
                <td className="py-2.5 text-text-secondary">{s.plan}</td>
                <td className="py-2.5 text-right text-text-primary">{formatUsd(s.amount)}</td>
                <td className="py-2.5 text-text-tertiary">{s.started}</td>
                <td className="py-2.5 text-text-tertiary">{s.next}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}