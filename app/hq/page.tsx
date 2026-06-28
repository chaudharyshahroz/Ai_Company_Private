import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  Megaphone,
  FileText,
  TrendingUp,
  Sparkles,
  ListChecks,
  Plus,
  Users,
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { HomeActions } from "@/components/dashboard/HomeActions";
import { RecommendationCard } from "@/components/dashboard/RecommendationCard";
import {
  getCurrentUser,
  getTodaysBriefing,
  listWorkInbox,
  listEnrichedHiredAgents,
} from "@/lib/data";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const employeeMeta: Record<string, { emoji: string; role: string; what: string }> = {
  "emp-ceo": {
    emoji: "🎯",
    role: "AI CEO",
    what: "Plans priorities and reviews your work",
  },
  "emp-sales-manager": {
    emoji: "💼",
    role: "Sales Manager",
    what: "Finds leads and writes outreach",
  },
  "emp-support-manager": {
    emoji: "💬",
    role: "Support Manager",
    what: "Answers customer questions",
  },
  "emp-marketing-manager": {
    emoji: "📣",
    role: "Marketing Manager",
    what: "Creates posts and content drafts",
  },
  "emp-research-manager": {
    emoji: "🔍",
    role: "Research Analyst",
    what: "Watches competitors and trends",
  },
};

export default async function HomePage() {
  const user = await getCurrentUser();
  const workInbox = await listWorkInbox(user.id);
  const agents = await listEnrichedHiredAgents(user.id);

  // Surface the top 5 most important hired agents (or fewer if not hired)
  const priorityIds = [
    "emp-ceo",
    "emp-sales-manager",
    "emp-support-manager",
    "emp-marketing-manager",
    "emp-research-manager",
  ];
  const featuredEmployees = priorityIds
    .map((id) => agents.find((a) => a.template?.id === id))
    .filter(Boolean) as typeof agents;

  // Pull 3-5 attention items from work inbox
  const attentionItems = workInbox.slice(0, 5).map((w) => ({
    id: w.id,
    icon: w.type === "customer_reply" ? MessageSquare : w.type === "ready_to_publish" ? Megaphone : FileText,
    title: w.title,
    who: w.employeeName,
    description: w.output?.slice(0, 90) ?? "Ready for your review",
  }));

  const greeting =
    new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={0} />

        <main className="flex-1 px-5 pb-32 pt-8 md:px-10 md:pb-12 md:pt-10">
          {/* ── Section 1: Welcome + 3 CTAs ─────────────────────────── */}
          <section className="mb-10 max-w-4xl">
            <p className="mb-1 text-[13px] font-medium uppercase tracking-[0.06em] text-muted-text">
              {greeting}
            </p>
            <h1 className="page-title">
              Welcome back. Your AI team worked while you were away.
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-secondary">
              Review completed work, approve important tasks, and assign your AI employees what to do next.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <HomeActions />
            </div>
          </section>

          {/* ── Section 2: Today's AI Team Summary ──────────────────── */}
          <section className="mb-10">
            <Panel className="px-6 py-6 md:px-8 md:py-7">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-muted-text">
                    Today's AI Team Summary
                  </p>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-text">
                    Your AI employees completed <strong className="font-semibold">12 tasks</strong>,
                    created <strong className="font-semibold">7 content drafts</strong>, found{" "}
                    <strong className="font-semibold">24 leads</strong>, and answered{" "}
                    <strong className="font-semibold">8 customer questions</strong>.{" "}
                    <strong className="font-semibold text-warning">5 items need your approval.</strong>
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-6">
                <Stat label="Tasks completed" value="12" icon={CheckCircle2} tone="success" />
                <Stat label="Need approval" value="5" icon={ListChecks} tone="warning" />
                <Stat label="Leads found" value="24" icon={TrendingUp} tone="accent" />
              </div>

              <div className="mt-6 flex justify-end">
                <Button asChild>
                  <Link href="/hq/work-inbox">
                    Review Work
                    <ArrowRight size={13} />
                  </Link>
                </Button>
              </div>
            </Panel>
          </section>

          {/* ── Section 3: What Needs Your Attention ────────────────── */}
          <section className="mb-10">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="section-title">What needs your attention</h2>
                <p className="mt-1 text-[13.5px] text-secondary">
                  Review these before they pile up.
                </p>
              </div>
              <Link
                href="/hq/work-inbox"
                className="text-[13px] font-medium text-secondary transition-colors hover:text-text"
              >
                See all →
              </Link>
            </div>

            {attentionItems.length === 0 ? (
              <Panel className="px-6 py-14 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-2 text-2xl">
                  ✨
                </div>
                <h3 className="text-[16px] font-semibold text-text">All caught up</h3>
                <p className="mt-1 text-[14px] text-secondary">
                  Your AI team has no work waiting for you right now.
                </p>
                <Button asChild className="mt-5">
                  <Link href="/hq/tasks">
                    <Plus size={13} />
                    Assign a task
                  </Link>
                </Button>
              </Panel>
            ) : (
              <Panel className="overflow-hidden p-0">
                <ul className="divide-y divide-border">
                  {attentionItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.id}>
                        <Link
                          href="/hq/work-inbox"
                          className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-hover md:px-6"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2 text-secondary">
                            <Icon size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-[14.5px] font-medium text-text">
                                {item.title}
                              </p>
                            </div>
                            <p className="mt-0.5 truncate text-[13px] text-secondary">
                              From <span className="text-text">{item.who}</span> · {item.description}
                            </p>
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="shrink-0 opacity-90 group-hover:opacity-100"
                          >
                            Review
                            <ArrowRight size={12} />
                          </Button>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </Panel>
            )}
          </section>

          {/* ── Section 4: Your AI Employees ─────────────────────────── */}
          <section className="mb-10">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="section-title">Your AI employees</h2>
                <p className="mt-1 text-[13.5px] text-secondary">
                  The team working for you right now.
                </p>
              </div>
              <Link
                href="/employees"
                className="text-[13px] font-medium text-secondary transition-colors hover:text-text"
              >
                Manage team →
              </Link>
            </div>

            {featuredEmployees.length === 0 ? (
              <Panel className="px-6 py-14 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-2 text-2xl">
                  🤖
                </div>
                <h3 className="text-[16px] font-semibold text-text">No AI employees yet</h3>
                <p className="mt-1 text-[14px] text-secondary">
                  Hire your first AI employee to start getting work done.
                </p>
                <Button asChild className="mt-5">
                  <Link href="/employees">
                    <Plus size={13} />
                    Hire First Employee
                  </Link>
                </Button>
              </Panel>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {featuredEmployees.slice(0, 5).map((agent) => {
                  const meta = employeeMeta[agent.template?.id ?? ""] ?? {
                    emoji: agent.template?.avatarEmoji ?? "🤖",
                    role: agent.template?.role ?? "AI Employee",
                    what: agent.template?.description?.slice(0, 70) ?? "",
                  };
                  const isActive = agent.isActive ?? true;
                  return (
                    <Panel key={agent.id} hoverable className="flex flex-col gap-3 p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface-2 text-xl">
                          {meta.emoji}
                        </div>
                        <StatusDot active={isActive} />
                      </div>
                      <div>
                        <p className="text-[14.5px] font-semibold text-text">
                          {agent.template?.name?.split(" — ")[0] ?? "AI Employee"}
                        </p>
                        <p className="mt-0.5 text-[12.5px] text-muted-text">{meta.role}</p>
                      </div>
                      <p className="line-clamp-2 text-[13px] leading-snug text-secondary">
                        {meta.what}
                      </p>
                      <Link
                        href={`/employees/${agent.template?.slug ?? ""}`}
                        className="mt-auto text-[13px] font-medium text-accent hover:underline"
                      >
                        View work →
                      </Link>
                    </Panel>
                  );
                })}
              </div>
            )}
          </section>

          {/* ── Section 5: Recommended Next Step ─────────────────────── */}
          <section>
            <RecommendationCard
              headline="Create a 5-message follow-up sequence for new leads"
              detail="Your website has leads coming in, but no follow-up campaign. Ask your Marketing Employee to create a 5-message follow-up sequence."
              ctaLabel="Create Follow-Up Task"
            />
          </section>
        </main>

        <MobileBottomNav />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  tone: "success" | "warning" | "accent";
}) {
  const toneClass = {
    success: "text-success",
    warning: "text-warning",
    accent: "text-accent",
  }[tone];
  return (
    <div className="flex items-baseline gap-3">
      <Icon size={18} className={cn(toneClass)} />
      <div className="flex flex-col">
        <span className={cn("font-mono text-[26px] font-semibold tabular-nums leading-none", toneClass)}>
          {value}
        </span>
        <span className="mt-1 text-[12.5px] text-secondary">{label}</span>
      </div>
    </div>
  );
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-muted-text">
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          active ? "bg-success animate-pulse-status" : "bg-muted-text",
        )}
      />
      {active ? "Working" : "Idle"}
    </span>
  );
}