import * as React from "react";
import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { getCurrentUser } from "@/lib/data";
import { EMPLOYEES } from "@/lib/employees";
import { cn, formatUsd } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface SearchParams {
  searchParams: { tab?: string };
}

// Begin-friendly category names + which department slugs they map to.
// The user said: avoid tech jargon like "agent runtime", "orchestration"...
// so we group employees by what they DO, not by internal department naming.
const tabs = [
  { id: "all", label: "All Employees" },
  { id: "sales", label: "Sales" },
  { id: "support", label: "Support" },
  { id: "marketing", label: "Marketing" },
  { id: "research", label: "Research" },
  { id: "finance", label: "Finance" },
  { id: "operations", label: "Operations" },
];

const tabToDept: Record<string, string | null> = {
  all: null,
  sales: "sales",
  support: "support",
  marketing: "marketing",
  research: "research",
  finance: "finance",
  operations: "operations",
};

// Plain-English "what this employee does" lines for the 5 most common employees.
// (Avoids the spec's forbidden words: agent runtime, prompt config, orchestration,
//  execution pipeline, vector memory, tool permission.)
const whatTheyDo: Record<string, string> = {
  ceo: "Sets priorities for the week, breaks goals into tasks, and reviews everything your AI team produces.",
  "sales-manager": "Finds new leads, writes outreach messages, and follows up so you don't lose opportunities.",
  "lead-researcher": "Builds qualified lead lists based on your ideal customer profile.",
  "outreach-employee": "Writes personalized cold emails and follow-up sequences.",
  "sales-closer": "Drafts sales scripts, proposals, and closing emails.",
  "appointment-setter": "Books discovery calls and meetings into your calendar.",
  "support-manager": "Answers customer questions 24/7 and escalates the tricky ones to you.",
  "support-employee": "Replies to common customer questions using your FAQ and policies.",
  "faq-builder": "Turns real support tickets into FAQs so customers help themselves.",
  "feedback-analyst": "Reads every customer message and surfaces themes and complaints.",
  "marketing-manager": "Plans campaigns, writes posts, and keeps your brand voice consistent.",
  "content-writer": "Writes blog posts, articles, and website copy in your brand voice.",
  "social-media-manager": "Drafts posts for Instagram, LinkedIn, X, and Facebook — ready for your review.",
  "ad-copywriter": "Writes ad copy and headlines for Meta, Google, and LinkedIn.",
  "email-marketer": "Creates email sequences for welcome, nurture, sales, and re-engagement.",
  "research-manager": "Watches competitors and trends so you don't fall behind.",
  "competitor-researcher": "Tracks what your competitors are doing and how they're positioning.",
  "market-researcher": "Studies your market and surfaces opportunities before everyone else.",
  "trend-finder": "Spots trending topics in your industry and suggests content ideas.",
  cfo: "Tracks revenue, expenses, and pricing so you know if the business is healthy.",
  "pricing-analyst": "Reviews your pricing and suggests experiments to grow revenue.",
  "operations-manager": "Designs workflows, SOPs, and automations so things run without you.",
  "product-manager": "Plans features and improvements based on what your customers actually need.",
};

const bestFor: Record<string, string> = {
  ceo: "Every business",
  "sales-manager": "B2B, agencies, services",
  "lead-researcher": "B2B, SaaS, agencies",
  "outreach-employee": "B2B, SaaS",
  "support-manager": "Any business with customers",
  "support-employee": "Any business with customers",
  "marketing-manager": "Every business that markets online",
  "content-writer": "Every business with a blog",
  "social-media-manager": "DTC, ecommerce, creators",
  "research-manager": "B2B, SaaS, agencies",
  cfo: "Businesses doing $10k+/month",
  "operations-manager": "Any business with repeat processes",
  "product-manager": "SaaS, ecommerce, agencies",
};

const produces: Record<string, string> = {
  ceo: "Weekly priorities, task lists, daily briefing",
  "sales-manager": "Lead lists, cold emails, follow-up sequences",
  "lead-researcher": "Qualified lead lists",
  "outreach-employee": "Cold email + follow-up sequences",
  "sales-closer": "Sales scripts, proposals",
  "appointment-setter": "Booked meetings",
  "support-manager": "Customer replies, FAQ updates",
  "support-employee": "Customer replies",
  "faq-builder": "FAQ documents",
  "feedback-analyst": "Customer insight reports",
  "marketing-manager": "Campaign plans, content calendars",
  "content-writer": "Blog posts, articles",
  "social-media-manager": "Social posts ready for review",
  "ad-copywriter": "Ad headlines + descriptions",
  "email-marketer": "Email sequences",
  "research-manager": "Competitor reports, trend reports",
  "competitor-researcher": "Competitor reports",
  "market-researcher": "Market opportunities",
  "trend-finder": "Trending topic ideas",
  cfo: "Financial summaries",
  "pricing-analyst": "Pricing recommendations",
  "operations-manager": "SOPs, workflows",
  "product-manager": "Roadmaps, PRDs",
};

export default async function EmployeesPage({ searchParams }: SearchParams) {
  const user = await getCurrentUser();
  const activeTab = searchParams.tab ?? "all";
  const dept = tabToDept[activeTab] ?? null;

  let filtered = EMPLOYEES;
  if (dept) filtered = filtered.filter((e) => e.department === dept);
  // Most popular / most useful first
  filtered = [...filtered].sort((a, b) => b.popularity - a.popularity);

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={0} />

        <main className="flex-1 px-5 pb-32 pt-8 md:px-10 md:pb-12 md:pt-10">
          {/* Header */}
          <div className="mb-7 max-w-3xl">
            <h1 className="page-title">Your AI Team</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-secondary">
              Browse AI employees by what they do. Pick one to assign work, or hire them onto your team.
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-5 -mx-1 flex flex-wrap items-center gap-1.5 overflow-x-auto px-1 pb-1">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={`/employees?tab=${tab.id}`}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-md border px-3 py-1.5 text-[13px] font-medium transition-colors",
                  activeTab === tab.id
                    ? "border-border bg-surface-2 text-text"
                    : "border-transparent bg-transparent text-secondary hover:text-text",
                )}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {/* Search */}
          <div className="mb-6 flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2">
            <Search size={14} className="text-muted-text" />
            <input
              placeholder="Search employees…"
              className="flex-1 bg-transparent text-[14px] text-text outline-none placeholder:text-muted-text"
            />
          </div>

          {/* Employee grid */}
          {filtered.length === 0 ? (
            <Panel className="px-6 py-16 text-center">
              <p className="text-[16px] font-semibold text-text">No employees in this category yet</p>
              <p className="mt-1 text-[14px] text-secondary">Try another tab.</p>
            </Panel>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((emp) => {
                const what = whatTheyDo[emp.slug] ?? emp.description ?? "";
                const best = bestFor[emp.slug] ?? "Any business";
                const producesText = produces[emp.slug] ?? "Business work";
                return (
                  <Panel key={emp.slug} className="flex flex-col gap-4 p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2 text-2xl">
                        {emp.avatarEmoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-semibold text-text">
                          {emp.name.split(" — ")[0]}
                        </p>
                        <p className="text-[12.5px] text-muted-text">{emp.role}</p>
                      </div>
                      <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-secondary">
                        {formatUsd(emp.monthlyPriceUsd)}/mo
                      </span>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-text">
                        What this employee does
                      </p>
                      <p className="mt-1 text-[13.5px] leading-snug text-text">{what}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[12.5px]">
                      <div>
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.04em] text-muted-text">
                          Best for
                        </p>
                        <p className="mt-1 text-secondary">{best}</p>
                      </div>
                      <div>
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.04em] text-muted-text">
                          Produces
                        </p>
                        <p className="mt-1 text-secondary">{producesText}</p>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center gap-2 pt-2">
                      <Button asChild size="sm">
                        <Link href={`/hq/tasks/new?for=${emp.id}`}>
                          <Plus size={12} />
                          Assign Task
                        </Link>
                      </Button>
                      <Button variant="secondary" size="sm" asChild>
                        <Link href={`/employees/${emp.slug}`}>View Work</Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/knowledge-base`}>Train</Link>
                      </Button>
                    </div>
                  </Panel>
                );
              })}
            </div>
          )}
        </main>

        <MobileBottomNav />
      </div>
    </div>
  );
}