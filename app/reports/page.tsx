import * as React from "react";
import {
  CheckCircle2,
  TrendingUp,
  Sparkles,
  MessageSquare,
  Clock,
  CreditCard,
  ArrowRight,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { getCurrentUser, getTodaysBriefing } from "@/lib/data";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const metrics = [
  { label: "Tasks completed", value: "2,847", delta: "+18%", icon: CheckCircle2, tone: "success" as const },
  { label: "Work approved", value: "1,924", delta: "+12%", icon: CheckCircle2, tone: "accent" as const },
  { label: "Leads captured", value: "248", delta: "+24%", icon: TrendingUp, tone: "accent" as const },
  { label: "Customer questions", value: "892", delta: "+8%", icon: MessageSquare, tone: "warning" as const },
  { label: "Content created", value: "164", delta: "+31%", icon: Sparkles, tone: "accent" as const },
  { label: "Time saved", value: "142h", delta: "+24h", icon: Clock, tone: "success" as const },
  { label: "Credits used", value: "18.4k", delta: "−4%", icon: CreditCard, tone: "muted" as const },
];

const toneClass: Record<typeof metrics[number]["tone"], string> = {
  success: "text-success",
  accent: "text-accent",
  warning: "text-warning",
  muted: "text-secondary",
};

export default async function ReportsPage() {
  const user = await getCurrentUser();
  const briefing = await getTodaysBriefing(user.id);

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={0} />

        <main className="flex-1 px-5 pb-32 pt-8 md:px-10 md:pb-12 md:pt-10">
          {/* Header */}
          <div className="mb-8 max-w-3xl">
            <h1 className="page-title">Reports</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-secondary">
              How your AI team is performing. Simple numbers, no jargon.
            </p>
          </div>

          {/* Metric grid */}
          <section className="mb-10">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
              {metrics.map((m) => {
                const Icon = m.icon;
                return (
                  <Panel key={m.label} className="p-5">
                    <Icon size={16} className="text-muted-text" />
                    <p className="mt-3 font-mono text-[24px] font-semibold leading-none text-text tabular-nums">
                      {m.value}
                    </p>
                    <p className="mt-2 text-[12.5px] text-muted-text">{m.label}</p>
                    <p className={cn("mt-2 font-mono text-[11px] tabular-nums", toneClass[m.tone])}>
                      {m.delta} vs last week
                    </p>
                  </Panel>
                );
              })}
            </div>
          </section>

          {/* What improved + What needs attention */}
          <div className="mb-10 grid gap-5 lg:grid-cols-2">
            {/* What improved this week */}
            <Panel className="p-0">
              <div className="flex items-center gap-2 border-b border-border px-6 py-4">
                <Lightbulb size={14} className="text-success" />
                <h2 className="text-[15px] font-semibold text-text">What improved this week</h2>
              </div>
              <ul className="divide-y divide-border">
                {[
                  "Lead capture up 24% — your Sales Employee found 32 more prospects",
                  "Customer reply time dropped to under 3 hours",
                  "Content drafts are 31% higher this month",
                  "Your Marketing Employee posted 12 pieces without needing edits",
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3 px-6 py-3.5">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-success" />
                    <p className="text-[14px] leading-snug text-text">{text}</p>
                  </li>
                ))}
              </ul>
            </Panel>

            {/* What needs attention */}
            <Panel className="p-0">
              <div className="flex items-center gap-2 border-b border-border px-6 py-4">
                <AlertTriangle size={14} className="text-warning" />
                <h2 className="text-[15px] font-semibold text-text">What needs attention</h2>
              </div>
              <ul className="divide-y divide-border">
                {[
                  "5 social posts are waiting for approval",
                  "24 leads haven't been followed up in over 7 days",
                  "Pricing page hasn't been refreshed this month",
                  "Your refund policy isn't in the knowledge base yet",
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3 px-6 py-3.5">
                    <AlertTriangle size={14} className="mt-0.5 shrink-0 text-warning" />
                    <p className="text-[14px] leading-snug text-text">{text}</p>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          {/* CEO briefing inline */}
          <section>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="section-title">CEO briefing</h2>
                <p className="mt-1 text-[13.5px] text-secondary">
                  A short summary from your AI CEO.
                </p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Panel className="p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-accent">
                  What happened
                </p>
                <p className="mt-3 text-[14.5px] leading-relaxed text-text">
                  {briefing.summary}
                </p>
              </Panel>

              <Panel className="p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-success">
                  Recommended next actions
                </p>
                <ul className="mt-3 space-y-2.5">
                  {briefing.recommendations.slice(0, 3).map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[14px] leading-snug text-text">
                      <ArrowRight size={13} className="mt-1 shrink-0 text-accent" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-5">
                  <a href="/hq/tasks">
                    Create Task
                    <ArrowRight size={13} />
                  </a>
                </Button>
              </Panel>
            </div>
          </section>
        </main>

        <MobileBottomNav />
      </div>
    </div>
  );
}