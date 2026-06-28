import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Users, DollarSign, ListChecks, Activity, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

const stats = [
  { label: "Total users", value: 524, delta: "+12 today", icon: Users },
  { label: "Active subscribers", value: 198, delta: "+8 this week", icon: Activity },
  { label: "MRR", value: 15842, delta: "+18.2%", icon: DollarSign, prefix: "$" },
  { label: "Tasks run today", value: 1842, delta: "Avg 142/user", icon: ListChecks },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Platform health, growth, and revenue at a glance.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <GlassCard key={s.label} className="p-5">
              <div className="flex items-center justify-between">
                <Icon size={16} className="text-text-tertiary" />
                <TrendingUp size={12} className="text-accent" />
              </div>
              <div className="mt-3 font-display text-2xl font-bold tabular-nums text-text-primary">
                {s.prefix}
                <AnimatedCounter value={s.value} />
              </div>
              <div className="mt-0.5 text-xs text-text-tertiary">{s.label}</div>
              <div className="mt-1 text-[11px] text-accent">{s.delta}</div>
            </GlassCard>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent signups */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-sm font-semibold text-text-primary">Recent signups</h2>
          <ul className="space-y-3">
            {[
              { name: "Maya Chen", email: "maya@tidepool.app", plan: "growth", minutes: 4 },
              { name: "Jordan Patel", email: "jordan@loophole.dev", plan: "starter", minutes: 22 },
              { name: "Sam Rivera", email: "sam@quiver.io", plan: "free", minutes: 38 },
              { name: "Lena Park", email: "lena@lucent.co", plan: "company", minutes: 51 },
              { name: "Tom Wright", email: "tom@bootscats.com", plan: "growth", minutes: 67 },
            ].map((u) => (
              <li key={u.email} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-warm text-xs font-semibold text-white">
                    {u.name[0]}
                  </div>
                  <div>
                    <div className="text-text-primary">{u.name}</div>
                    <div className="text-xs text-text-tertiary">{u.email}</div>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-medium uppercase tracking-wider text-text-secondary">{u.plan}</div>
                  <div className="text-text-tertiary">{u.minutes}m ago</div>
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>

        {/* System health */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-sm font-semibold text-text-primary">System health</h2>
          <div className="space-y-4">
            <HealthRow label="API latency" value="142ms" status="ok" />
            <HealthRow label="Error rate" value="0.12%" status="ok" />
            <HealthRow label="DB connections" value="38 / 100" status="ok" />
            <HealthRow label="OpenRouter" value="OK" status="ok" />
            <HealthRow label="Task queue depth" value="6" status="warn" />
            <HealthRow label="Paddle webhooks" value="0 backlog" status="ok" />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function HealthRow({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: "ok" | "warn" | "fail";
}) {
  const dot =
    status === "ok"
      ? "bg-accent"
      : status === "warn"
      ? "bg-amber-400"
      : "bg-accent-warm";
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        <span className="text-text-secondary">{label}</span>
      </div>
      <span className="font-mono text-xs text-text-primary">{value}</span>
    </div>
  );
}