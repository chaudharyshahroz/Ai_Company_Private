import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, AlertTriangle, TrendingUp } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { getCurrentUser, getTodaysBriefing } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function BriefingPage() {
  const user = await getCurrentUser();
  const briefing = await getTodaysBriefing(user.id);

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={3} />
        <main className="flex-1 px-8 py-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center gap-2 text-xs">
              <Sparkles size={12} className="text-accent" />
              <span className="font-semibold uppercase tracking-wider text-accent">
                AI CEO Briefing · {briefing.date}
              </span>
            </div>
            <h1 className="text-page text-text">
              {briefing.greeting}, {user.name?.split(" ")[0] ?? "founder"}.
            </h1>
            <p className="mt-3 text-body text-secondary">
              {briefing.summary}
            </p>

            <div className="mt-10">
              <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-muted-text">
                What your departments did today
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {briefing.highlights.map((h, i) => (
                  <Panel key={i} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2 text-lg">
                        {h.icon}
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">
                          {h.dept}
                        </div>
                        <p className="mt-0.5 text-[13px] leading-snug text-text">{h.text}</p>
                      </div>
                    </div>
                  </Panel>
                ))}
              </div>
            </div>

            {briefing.risks.length > 0 && (
              <div className="mt-10">
                <h2 className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-text">
                  <AlertTriangle size={11} className="text-warning" />
                  Risks & alerts
                </h2>
                {briefing.risks.map((r, i) => (
                  <Panel key={i} className="border-l-2 border-l-warning p-4">
                    <p className="text-[13px] text-text">{r.text}</p>
                  </Panel>
                ))}
              </div>
            )}

            <div className="mt-10">
              <h2 className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-text">
                <TrendingUp size={11} className="text-accent" />
                CEO recommendations
              </h2>
              <div className="space-y-2">
                {briefing.recommendations.map((r, i) => (
                  <Panel key={i} hoverable className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-xs text-secondary">
                        {i + 1}
                      </div>
                      <p className="flex-1 text-[13px] text-text">{r}</p>
                      <ArrowRight size={13} className="text-muted-text" />
                    </div>
                  </Panel>
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/hq/work-inbox">
                  Review {briefing.needsApproval} items
                  <ArrowRight size={13} />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/hq/goals">View goals</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}