import * as React from "react";
import { Compass } from "lucide-react";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { GrowthClient } from "@/components/dashboard/GrowthClient";
import {
  getCurrentUser,
  listGrowthMetrics,
  listGrowthChannels,
  listGrowthExperiments,
  getLatestGrowthCommentary,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function GrowthPage() {
  const user = await getCurrentUser();
  const [metrics, channels, experiments, commentary] = await Promise.all([
    listGrowthMetrics(user.id),
    listGrowthChannels(user.id),
    listGrowthExperiments(user.id),
    getLatestGrowthCommentary(user.id),
  ]);

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={0} />
        <main className="flex-1 px-5 pb-32 pt-8 md:px-10 md:pb-12 md:pt-10">
          <div className="mb-6 flex items-start justify-between gap-6">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs">
                <Compass size={12} className="text-accent" />
                <span className="font-semibold uppercase tracking-wider text-accent">Growth Command Center</span>
                <span className="ml-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-success">
                  Live
                </span>
              </div>
              <h1 className="text-page text-text">The single screen for growing your business.</h1>
              <p className="mt-3 max-w-2xl text-body text-secondary">
                All growth metrics, experiments, channels, and opportunities in one mission-control
                view. See what's working, what's not, and what to do next.
              </p>
            </div>
          </div>
          <GrowthClient
            metrics={metrics}
            channels={channels}
            experiments={experiments}
            commentary={commentary}
          />
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
