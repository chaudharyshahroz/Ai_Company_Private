import * as React from "react";
import { Megaphone, Sparkles } from "lucide-react";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { AdsClient, type AdCampaignView } from "@/components/dashboard/AdsClient";
import { getCurrentUser, listAdCampaigns } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdsPage() {
  const user = await getCurrentUser();
  const campaigns = await listAdCampaigns(user.id);

  const view: AdCampaignView[] = campaigns.map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type,
    channel: c.channel,
    status: c.status,
    goal: c.goal,
    audience: c.audience,
    hook: c.hook,
    cta: c.cta,
    postsCount: c.postsCount,
    leads: c.leads,
    conversions: c.conversions,
    budget: c.budget,
    startedAt: c.startedAt,
    createdAt: c.createdAt,
    content: c.content,
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
                <Megaphone size={12} className="text-accent" />
                <span className="font-semibold uppercase tracking-wider text-accent">Ads & Content</span>
                <span className="ml-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-success">
                  Live
                </span>
              </div>
              <h1 className="text-page text-text">Campaigns, not random posts.</h1>
              <p className="mt-3 max-w-2xl text-body text-secondary">
                Generate complete campaigns — 7-day launches, 14-day lead gen, 30-day calendars, Facebook
                ads, Instagram reels, LinkedIn, X, email, WhatsApp. Every campaign has a goal, audience,
                offer, channel, hooks, captions, CTA, schedule, and expected outcome.
              </p>
            </div>
          </div>
          <AdsClient initial={view} />
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
