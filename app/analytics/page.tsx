import * as React from "react";
import { BarChart3, TrendingUp, Activity, Users } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { getCurrentUser, getDepartmentStats } from "@/lib/data";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  const depts = await getDepartmentStats();

  const tasksPerDay = [42, 58, 67, 71, 89, 124, 142];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={0} />
        <main className="flex-1 px-5 pb-32 pt-8 md:px-10 md:pb-12 md:pt-10">
          <div className="mb-8 max-w-3xl">
            <h1 className="page-title">Analytics</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-secondary">
              Visualize AI company performance across departments and time.
            </p>
          </div>

          {/* Top metrics */}
          <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            <KPI label="Tasks / day" value="142" icon={Activity} delta="+18%" tone="success" />
            <KPI label="Avg performance" value="89" icon={BarChart3} delta="+3" tone="success" />
            <KPI label="Active employees" value="42" icon={Users} delta="+5" tone="accent" />
            <KPI label="Cost / task" value="$0.04" icon={TrendingUp} delta="-12%" tone="success" />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {/* Department performance */}
            <Panel className="p-6">
              <h2 className="section-title mb-1">Department performance</h2>
              <p className="mb-5 text-[12.5px] text-muted-text">Score out of 100</p>
              <div className="space-y-3">
                {[...depts]
                  .sort((a, b) => b.performance - a.performance)
                  .map((d) => (
                    <div key={d.slug}>
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="flex items-center gap-2">
                          <span className="text-base">{d.emoji}</span>
                          <span className="text-text">{d.name}</span>
                        </span>
                        <span className="font-mono font-semibold text-text tabular-nums">
                          {d.performance}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-accent transition-all"
                          style={{ width: `${d.performance}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </Panel>

            {/* Tasks per day */}
            <Panel className="p-6">
              <h2 className="section-title mb-1">Tasks completed</h2>
              <p className="mb-5 text-[12.5px] text-muted-text">Last 7 days</p>
              <div className="flex h-44 items-end justify-between gap-2">
                {tasksPerDay.map((v, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-accent transition-all"
                      style={{ height: `${(v / 142) * 100}%` }}
                    />
                    <span className="text-[10.5px] font-medium text-muted-text">
                      {days[i]}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-secondary">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}

function KPI({
  label,
  value,
  icon: Icon,
  delta,
  tone,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  delta: string;
  tone: "success" | "accent";
}) {
  return (
    <Panel className="p-5">
      <Icon size={14} className="text-muted-text" />
      <p className="mt-3 font-mono text-[22px] font-semibold leading-none text-text tabular-nums">
        {value}
      </p>
      <p className="mt-1.5 text-[12.5px] text-muted-text">{label}</p>
      <p
        className={cn(
          "mt-2 font-mono text-[11px] tabular-nums",
          tone === "success" ? "text-success" : "text-accent",
        )}
      >
        {delta} vs last week
      </p>
    </Panel>
  );
}