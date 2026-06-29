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
  Gauge,
  Target,
  Rocket,
  Lightbulb,
  AlertTriangle,
  ChevronRight,
  Dna,
  Package,
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
  getBusinessDna,
  getBusinessScore,
  listWeeklyTasks,
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
  const dna = await getBusinessDna(user.id);
  const score = await getBusinessScore(user.id);
  const weeklyTasks = await listWeeklyTasks(user.id);

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
              Welcome back. Your AI company is growing your business.
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-secondary">
              Your AI CEO coordinated <strong className="font-semibold text-text">18 tasks</strong> today.
              Research analyzed <strong className="font-semibold text-text">5 competitors</strong>,{" "}
              Marketing drafted <strong className="font-semibold text-text">7 posts</strong>, Sales
              prepared <strong className="font-semibold text-text">24 lead messages</strong>, and the
              AI CEO found <strong className="font-semibold text-accent">3 new growth opportunities</strong>.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <HomeActions />
            </div>
          </section>

          {/* ── Section 1b: Next Best Action (always-on hero widget) ── */}
          {weeklyTasks[0] && (
            <section className="mb-10">
              <Link
                href={weeklyTasks[0].oneClickAction || "/weekly-tasks"}
                className="block transition-opacity hover:opacity-95"
              >
                <Panel className="relative overflow-hidden p-7">
                  <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 0% 0%, rgba(94,106,210,1) 0%, transparent 60%)",
                    }}
                  />
                  <div className="relative flex items-start justify-between gap-6">
                    <div className="flex items-start gap-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-accent/30 bg-accent/10">
                        <Sparkles size={20} className="text-accent" />
                      </div>
                      <div>
                        <div className="mb-1 flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-accent">
                          Next Best Action · from your AI CEO
                        </div>
                        <h2 className="text-[20px] font-semibold leading-tight text-text">
                          {weeklyTasks[0].task}
                        </h2>
                        <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-secondary">
                          <span className="font-medium text-text">Why:</span>{" "}
                          {weeklyTasks[0].reason}
                          <span className="mx-2 text-border">·</span>
                          <span className="font-medium text-text">Expected:</span>{" "}
                          {weeklyTasks[0].expectedResult}
                        </p>
                        <div className="mt-4 flex items-center gap-3 text-[12px] text-muted-text">
                          <span className="rounded-full border border-border bg-surface-2 px-2 py-0.5 uppercase tracking-wider">
                            {weeklyTasks[0].assignedDepartment}
                          </span>
                          {weeklyTasks[0].dueDate && (
                            <span>
                              Due{" "}
                              {new Date(weeklyTasks[0].dueDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button size="md" className="shrink-0">
                      Generate Output
                      <ArrowRight size={13} />
                    </Button>
                  </div>
                </Panel>
              </Link>
            </section>
          )}

          {/* ── Section 1c: Top-level growth widgets (4 across) ──────── */}
          <section className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/business-score" className="block">
              <Panel hoverable className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-text">
                    <Gauge size={12} className="text-accent" />
                    Business Score
                  </div>
                  <ChevronRight size={14} className="text-muted-text" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-mono text-[36px] font-semibold leading-none tabular-nums text-text">
                    {score.overall}
                  </span>
                  <span className="text-[13px] text-muted-text">/ 100</span>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[12px] text-success">
                  <TrendingUp size={11} />
                  +{score.overall - 62} since first score
                </div>
              </Panel>
            </Link>

            <Link href="/business-dna" className="block">
              <Panel hoverable className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-text">
                    <Dna size={12} className="text-accent" />
                    Business Stage
                  </div>
                  <ChevronRight size={14} className="text-muted-text" />
                </div>
                <div className="mt-3 text-[28px] font-semibold leading-none capitalize text-text">
                  {dna.stage}
                </div>
                <div className="mt-2 truncate text-[12px] text-secondary">
                  {dna.businessName}
                </div>
              </Panel>
            </Link>

            <Link href="/leads" className="block">
              <Panel hoverable className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-text">
                    <Users size={12} className="text-accent" />
                    Leads Captured
                  </div>
                  <ChevronRight size={14} className="text-muted-text" />
                </div>
                <div className="mt-3 font-mono text-[36px] font-semibold leading-none tabular-nums text-text">
                  24
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[12px] text-success">
                  <TrendingUp size={11} />
                  +8 this week
                </div>
              </Panel>
            </Link>

            <Link href="/campaigns" className="block">
              <Panel hoverable className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-text">
                    <Megaphone size={12} className="text-accent" />
                    Campaigns Ready
                  </div>
                  <ChevronRight size={14} className="text-muted-text" />
                </div>
                <div className="mt-3 font-mono text-[36px] font-semibold leading-none tabular-nums text-text">
                  7
                </div>
                <div className="mt-2 text-[12px] text-secondary">
                  3 awaiting approval
                </div>
              </Panel>
            </Link>
          </section>

          {/* ── Section 1d: Opportunities & Risks row ───────────────── */}
          <section className="mb-10 grid gap-4 md:grid-cols-2">
            <Panel className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb size={14} className="text-success" />
                  <h2 className="text-[13px] font-semibold uppercase tracking-wider text-text">
                    Opportunities Found
                  </h2>
                </div>
                <span className="rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-success">
                  3
                </span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 border-l-2 border-success/40 pl-3">
                  <div>
                    <div className="text-[13px] font-medium text-text">
                      New niche: AI appointment automation for dental clinics
                    </div>
                    <div className="mt-0.5 text-[12px] text-muted-text">
                      Research Department · 2 hours ago
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3 border-l-2 border-success/40 pl-3">
                  <div>
                    <div className="text-[13px] font-medium text-text">
                      Local SEO gap: 12 keywords competitors aren't bidding on
                    </div>
                    <div className="mt-0.5 text-[12px] text-muted-text">
                      Marketing Department · Yesterday
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3 border-l-2 border-success/40 pl-3">
                  <div>
                    <div className="text-[13px] font-medium text-text">
                      Untapped channel: WhatsApp CTA on landing page
                    </div>
                    <div className="mt-0.5 text-[12px] text-muted-text">
                      Product & Website · 3 days ago
                    </div>
                  </div>
                </li>
              </ul>
            </Panel>

            <Panel className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-warning" />
                  <h2 className="text-[13px] font-semibold uppercase tracking-wider text-text">
                    Risks Detected
                  </h2>
                </div>
                <span className="rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-warning">
                  1
                </span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 border-l-2 border-warning/40 pl-3">
                  <div>
                    <div className="text-[13px] font-medium text-text">
                      Offer landing page conversion rate dropped 12% this week
                    </div>
                    <div className="mt-0.5 text-[12px] text-muted-text">
                      AI CEO · Today
                    </div>
                    <Link
                      href="/website"
                      className="mt-1 inline-flex items-center gap-1 text-[12px] font-medium text-accent hover:underline"
                    >
                      Fix with Product & Website
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </li>
              </ul>
              <div className="mt-5 border-t border-border pt-4">
                <div className="text-[11px] font-medium uppercase tracking-wider text-muted-text">
                  Time Saved This Month
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-mono text-[24px] font-semibold tabular-nums text-text">
                    47h
                  </span>
                  <span className="text-[12px] text-muted-text">across all AI employees</span>
                </div>
              </div>
            </Panel>
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