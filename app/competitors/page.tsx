import * as React from "react";
import { Swords, Sparkles } from "lucide-react";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { CompetitorsClient, type CompetitorView } from "@/components/dashboard/CompetitorsClient";
import { getCurrentUser, listCompetitors } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CompetitorsPage() {
  const user = await getCurrentUser();
  const comps = await listCompetitors(user.id);
  const view: CompetitorView[] = comps.map((c) => ({
    id: c.id,
    name: c.name,
    website: c.website,
    positioning: c.positioning,
    pricing: c.pricing,
    strengths: c.strengths,
    weaknesses: c.weaknesses,
    gap: c.gap,
    howToBeat: c.howToBeat,
    copiedMoves: c.copiedMoves,
    doBetter: c.doBetter,
    status: c.status,
    createdAt: c.createdAt,
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
                <Swords size={12} className="text-accent" />
                <span className="font-semibold uppercase tracking-wider text-accent">Competitor Analysis</span>
                <span className="ml-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-success">
                  Live
                </span>
              </div>
              <h1 className="text-page text-text">See exactly how to beat every competitor.</h1>
              <p className="mt-3 max-w-2xl text-body text-secondary">
                For each competitor: positioning, pricing, strengths, weaknesses, and the gap you can
                exploit. Plus a "how to beat them" playbook.
              </p>
            </div>
          </div>
          <CompetitorsClient initial={view} />
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
