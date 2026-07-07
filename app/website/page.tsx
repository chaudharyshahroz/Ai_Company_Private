import * as React from "react";
import { Globe, Sparkles } from "lucide-react";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { WebsiteBuilderClient, type WebsitePageView } from "@/components/dashboard/WebsiteBuilderClient";
import { getCurrentUser, listWebsitePages } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function WebsiteBuilderPage() {
  const user = await getCurrentUser();
  const pages = await listWebsitePages(user.id);

  const view: WebsitePageView[] = pages.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    type: p.type,
    status: p.status,
    goal: p.goal,
    tone: p.tone,
    targetAudience: p.targetAudience,
    hero: p.hero,
    problem: p.problem,
    solution: p.solution,
    features: p.features,
    socialProof: p.socialProof,
    pricing: p.pricing,
    faq: p.faq,
    cta: p.cta,
    seo: p.seo,
    createdAt: p.createdAt,
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
                <Globe size={12} className="text-accent" />
                <span className="font-semibold uppercase tracking-wider text-accent">Website Builder</span>
                <span className="ml-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-success">
                  Live
                </span>
              </div>
              <h1 className="text-page text-text">Your landing page, generated and ready to ship.</h1>
              <p className="mt-3 max-w-2xl text-body text-secondary">
                Hero, problem, solution, features, pricing, FAQ, final CTA — generated from your
                Business DNA and Offer Builder output. Export to HTML or Next.js.
              </p>
            </div>
          </div>
          <WebsiteBuilderClient initial={view} />
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
