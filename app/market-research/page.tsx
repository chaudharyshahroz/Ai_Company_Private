import * as React from "react";
import { Search, Sparkles } from "lucide-react";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { MarketResearchClient, type MarketReportView } from "@/components/dashboard/MarketResearchClient";
import { getCurrentUser, listMarketReports } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function MarketResearchPage() {
  const user = await getCurrentUser();
  const reports = await listMarketReports(user.id);
  const view: MarketReportView[] = reports.map((r) => ({
    id: r.id,
    topic: r.topic,
    region: r.region,
    depth: r.depth,
    status: r.status,
    generatedAt: r.generatedAt,
    marketSize: r.marketSize,
    growthRate: r.growthRate,
    trends: r.trends,
    segments: r.segments,
    demandSignals: r.demandSignals,
    gaps: r.gaps,
    recommendation: r.recommendation,
    risks: r.risks,
  }));

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={0} />
        <main className="flex-1 px-5 pb-32 pt-8 md:px-10 md:pb-12 md:pt-10">
          <div className="mb-6 flex items-start justify-between gap-6">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs">
                <Search size={12} className="text-accent" />
                <span className="font-semibold uppercase tracking-wider text-accent">Market Research</span>
                <span className="ml-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-success">
                  Live
                </span>
              </div>
              <h1 className="text-page text-text">Know your market before you spend a dollar.</h1>
              <p className="mt-3 max-w-2xl text-body text-secondary">
                Deep-dive reports on demand, trends, customer segments, and gaps — generated from your
                Business DNA in under 60 seconds.
              </p>
            </div>
          </div>
          <MarketResearchClient initialReports={view} />
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
