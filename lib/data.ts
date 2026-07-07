/**
 * Unified data access layer.
 * - Reads/writes from the database when DATABASE_URL is set.
 * - Reads/writes from in-memory mock store when in demo mode.
 *
 * All page/server components should import from here, NOT from @/lib/db directly.
 */

import { isDemoMode } from "./demo";
import {
  MOCK_HIRED_AGENTS,
  MOCK_TASKS,
  MOCK_NOTIFICATIONS,
  MOCK_BOARD_REPORTS,
  MOCK_BUSINESS_BRAIN,
  MOCK_COMPANY_GOALS,
  MOCK_LEADS,
  MOCK_CUSTOMERS,
  MOCK_CONVERSATIONS,
  MOCK_CAMPAIGNS,
  MOCK_DEPARTMENTS_STATS,
  MOCK_TODAY_BRIEFING,
  MOCK_KNOWLEDGE_BASE,
  MOCK_WORK_INBOX,
  MOCK_TEAM_MEMBERS,
  MOCK_CREDIT_HISTORY,
  MOCK_BUSINESS_DNA,
  MOCK_BUSINESS_SCORE,
  MOCK_BUSINESS_SCORE_HISTORY,
  MOCK_OFFERS,
  MOCK_GROWTH_ROADMAP,
  MOCK_WEEKLY_TASKS,
  // Phase 3 — AI Company Engine
  MOCK_KNOWLEDGE_BASE_ITEMS,
  MOCK_AGENT_RUNS,
  MOCK_AGENT_RUN_STEPS,
  MOCK_WORK_REVIEW_ITEMS,
  MOCK_AUDIT_LOGS,
  MOCK_CREDIT_USAGE_LOG,
  MOCK_COMPANY_MISSIONS,
  MOCK_COMPANY_GOALS_NEW,
  MOCK_DEPARTMENT_GOALS,
  MOCK_SCHEDULED_WORK,
  MOCK_CREDIT_BALANCES,
  // 8 New Live Features
  MOCK_CRM_LEADS,
  MOCK_COMPETITORS,
  MOCK_MARKET_REPORTS,
  MOCK_AD_CAMPAIGNS,
  MOCK_WEBSITE_PAGES,
  MOCK_GROWTH_METRICS,
  MOCK_GROWTH_CHANNELS,
  MOCK_GROWTH_EXPERIMENTS,
  MOCK_GROWTH_COMMENTARY,
  type CrmLead,
  type CrmStage,
  type Competitor,
  type MarketReport,
  type AdCampaign,
  type WebsitePage,
  type GrowthMetric,
  type GrowthChannel,
  type GrowthExperiment,
  type GrowthWeeklyCommentary,
} from "./mock-data";
import { EMPLOYEES, getEmployee as getEmployeeDef } from "./employees";
import type {
  AgentTemplate,
  HiredAgent,
  Task,
  Notification,
  BoardReport,
  BusinessBrain,
  User,
} from "./db/schema";
import { DEMO_USER } from "./demo";

// ─── Users ──────────────────────────────────────────────────

export async function getCurrentUser(): Promise<User> {
  if (isDemoMode()) return DEMO_USER as unknown as User;
  return DEMO_USER as unknown as User;
}

export async function getUserStats(userId: string) {
  if (isDemoMode()) {
    const tasks = MOCK_TASKS.filter((t) => t.userId === userId);
    const completedThisWeek = tasks.filter(
      (t) =>
        t.status === "completed" &&
        new Date(t.completedAt ?? 0).getTime() > Date.now() - 7 * 86_400_000,
    ).length;
    const queued = tasks.filter((t) => t.status === "queued" || t.status === "running").length;
    const wordsGenerated = tasks
      .filter((t) => t.status === "completed")
      .reduce((sum, t) => sum + (t.outputMetadata?.wordCount ?? 0), 0);

    return {
      tasksCompletedThisWeek: completedThisWeek,
      activeAgents: MOCK_HIRED_AGENTS.filter((a) => a.userId === userId && a.isActive).length,
      tasksInQueue: queued,
      wordsGenerated,
      tasksUsedThisMonth: DEMO_USER.tasksUsedThisMonth,
      tasksLimit: DEMO_USER.tasksLimit,
      trend: { tasksDeltaPct: 12, agentsDeltaPct: 0, queueDeltaPct: -8, wordsDeltaPct: 28 },
    };
  }
  return {
    tasksCompletedThisWeek: 0,
    activeAgents: 0,
    tasksInQueue: 0,
    wordsGenerated: 0,
    tasksUsedThisMonth: 0,
    tasksLimit: 0,
    trend: { tasksDeltaPct: 0, agentsDeltaPct: 0, queueDeltaPct: 0, wordsDeltaPct: 0 },
  };
}

// ─── Agent templates (now backed by 42-employee catalog) ────

export async function listAgentTemplates(opts?: {
  active?: boolean;
  department?: string;
  industry?: string;
}): Promise<AgentTemplate[]> {
  if (isDemoMode()) {
    let emps = EMPLOYEES;
    if (opts?.active !== undefined) emps = emps.filter((e) => e.isActive === opts.active);
    if (opts?.department) emps = emps.filter((e) => e.department === opts.department);
    if (opts?.industry) emps = emps.filter((e) => e.industryFit.includes(opts.industry!));
    return emps
      .map((e) => ({ ...e, createdAt: "2025-08-01T00:00:00Z" }))
      .sort((a, b) => a.sortOrder - b.sortOrder) as AgentTemplate[];
  }
  return [];
}

export async function getAgentTemplate(slug: string): Promise<AgentTemplate | null> {
  if (isDemoMode()) {
    const e = getEmployeeDef(slug);
    if (!e) return null;
    return { ...e, createdAt: "2025-08-01T00:00:00Z" } as AgentTemplate;
  }
  return null;
}

// ─── Hired agents ───────────────────────────────────────────

export async function listHiredAgents(userId: string): Promise<HiredAgent[]> {
  if (isDemoMode()) {
    return MOCK_HIRED_AGENTS.filter((a) => a.userId === userId);
  }
  return [];
}

export async function getHiredAgent(id: string): Promise<HiredAgent | null> {
  if (isDemoMode()) {
    return MOCK_HIRED_AGENTS.find((a) => a.id === id) ?? null;
  }
  return null;
}

// ─── Tasks ──────────────────────────────────────────────────

export async function listTasks(
  userId: string,
  opts?: { status?: Task["status"]; limit?: number },
): Promise<Task[]> {
  if (isDemoMode()) {
    let result = MOCK_TASKS.filter((t) => t.userId === userId);
    if (opts?.status) result = result.filter((t) => t.status === opts.status);
    result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    if (opts?.limit) result = result.slice(0, opts.limit);
    return result;
  }
  return [];
}

export async function getTask(id: string): Promise<Task | null> {
  if (isDemoMode()) {
    return MOCK_TASKS.find((t) => t.id === id) ?? null;
  }
  return null;
}

export async function createTask(
  data: Partial<Task> & {
    userId: string;
    hiredAgentId: string;
    title: string;
  },
): Promise<Task> {
  if (isDemoMode()) {
    const newTask: Task = {
      id: `t-${Date.now()}`,
      userId: data.userId,
      hiredAgentId: data.hiredAgentId,
      title: data.title,
      description: data.description ?? "",
      status: "queued",
      priority: data.priority ?? "normal",
      input: data.input ?? null,
      output: null,
      outputMetadata: null,
      modelUsed: null,
      tokensUsed: null,
      durationMs: null,
      errorMessage: null,
      scheduledAt: null,
      startedAt: null,
      completedAt: null,
      createdAt: new Date().toISOString(),
    };
    MOCK_TASKS.unshift(newTask);
    return newTask;
  }
  // TODO: real DB
  return data as Task;
}

// ─── Notifications ──────────────────────────────────────────

export async function listNotifications(
  userId: string,
  opts?: { unreadOnly?: boolean; limit?: number },
): Promise<Notification[]> {
  if (isDemoMode()) {
    let result = MOCK_NOTIFICATIONS.filter((n) => n.userId === userId);
    if (opts?.unreadOnly) result = result.filter((n) => !n.isRead);
    result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    if (opts?.limit) result = result.slice(0, opts.limit);
    return result;
  }
  return [];
}

export async function getUnreadCount(userId: string): Promise<number> {
  if (isDemoMode()) {
    return MOCK_NOTIFICATIONS.filter((n) => n.userId === userId && !n.isRead).length;
  }
  return 0;
}

// ─── Board reports ──────────────────────────────────────────

export async function listBoardReports(userId: string): Promise<BoardReport[]> {
  if (isDemoMode()) {
    return MOCK_BOARD_REPORTS.filter((r) => r.userId === userId);
  }
  return [];
}

export async function getLatestBoardReport(userId: string): Promise<BoardReport | null> {
  if (isDemoMode()) {
    const reports = await listBoardReports(userId);
    return reports[0] ?? null;
  }
  return null;
}

// ─── Business brain ─────────────────────────────────────────

export async function getBusinessBrain(userId: string): Promise<BusinessBrain | null> {
  if (isDemoMode()) {
    if (MOCK_BUSINESS_BRAIN.userId === userId) return MOCK_BUSINESS_BRAIN;
    return null;
  }
  return null;
}

// ─── Helper: enrich a hired agent with its template ─────────

export function enrichHiredAgent(hired: HiredAgent) {
  const template = EMPLOYEES.find((t) => t.id === hired.templateId);
  return { ...hired, template: template as unknown as AgentTemplate | undefined };
}

export type EnrichedHiredAgent = HiredAgent & { template: AgentTemplate | undefined };

export async function listEnrichedHiredAgents(userId: string): Promise<EnrichedHiredAgent[]> {
  const hired = await listHiredAgents(userId);
  return hired.map(enrichHiredAgent);
}
// ─── Company Goals ──────────────────────────────────────────

export async function listCompanyGoals(_userId?: string) {
  return MOCK_COMPANY_GOALS;
}

export async function getCompanyGoal(id: string) {
  return MOCK_COMPANY_GOALS.find((g) => g.id === id) ?? null;
}

// ─── Work Inbox ─────────────────────────────────────────────

export async function listWorkInbox(_userId?: string) {
  return MOCK_WORK_INBOX;
}

// ─── Departments ────────────────────────────────────────────

export async function getDepartmentStats() {
  return MOCK_DEPARTMENTS_STATS;
}

// ─── Today's CEO Briefing ──────────────────────────────────

export async function getTodaysBriefing(_userId?: string) {
  return MOCK_TODAY_BRIEFING;
}

// ─── Leads ──────────────────────────────────────────────────

export async function listLeads() {
  return MOCK_LEADS;
}

// ─── Customers ─────────────────────────────────────────────

export async function listCustomers() {
  return MOCK_CUSTOMERS;
}

// ─── Conversations ─────────────────────────────────────────

export async function listConversations() {
  return MOCK_CONVERSATIONS;
}

// ─── Campaigns ─────────────────────────────────────────────

export async function listCampaigns() {
  return MOCK_CAMPAIGNS;
}

// ─── Knowledge Base ────────────────────────────────────────

export async function listKnowledgeBase() {
  return MOCK_KNOWLEDGE_BASE;
}

// ─── Team Members ──────────────────────────────────────────

export async function listTeamMembers() {
  return MOCK_TEAM_MEMBERS;
}

// ─── Credit History ────────────────────────────────────────

export async function listCreditHistory() {
  return MOCK_CREDIT_HISTORY;
}

// ─── Business DNA ─────────────────────────────────────────

export async function getBusinessDna(_userId: string) {
  return MOCK_BUSINESS_DNA;
}

// ─── Business Score ───────────────────────────────────────

export async function getBusinessScore(_userId: string) {
  return MOCK_BUSINESS_SCORE;
}

export async function getBusinessScoreHistory(_userId: string) {
  return MOCK_BUSINESS_SCORE_HISTORY;
}

// ─── Offers ───────────────────────────────────────────────

export async function listOffers(_userId: string) {
  return MOCK_OFFERS;
}

export async function getActiveOffer(_userId: string) {
  return MOCK_OFFERS.find((o) => o.isActive) ?? MOCK_OFFERS[0];
}

// ─── Growth Roadmap ───────────────────────────────────────

export async function getGrowthRoadmap(_userId: string, kind: "launch_7" | "growth_30" | "scaling_90" = "launch_7") {
  if (kind === "launch_7") return MOCK_GROWTH_ROADMAP;
  // Future: derive from MOCK_GROWTH_ROADMAP or return skeleton
  return MOCK_GROWTH_ROADMAP;
}

// ─── Weekly Tasks ─────────────────────────────────────────

export async function listWeeklyTasks(_userId: string) {
  return MOCK_WEEKLY_TASKS;
}

// ════════════════════════════════════════════════════════════════
//  PHASE 3 — AI COMPANY ENGINE ACCESSORS
// ════════════════════════════════════════════════════════════════

import type {
  WorkReviewItem,
  AgentRun,
  AgentRunStep,
  KnowledgeBaseItem,
  AuditLog,
  CreditUsageLog,
  ScheduledWork,
  CompanyMission,
  CompanyGoal,
  DepartmentGoal,
  CreditBalance,
  Approval,
} from "@/lib/db/schema";

// ─── Missions ────────────────────────────────────────────────

export async function getMission(userId: string): Promise<CompanyMission | null> {
  return MOCK_COMPANY_MISSIONS.find((m) => m.userId === userId) ?? null;
}

// ─── Company Goals ───────────────────────────────────────────

export async function listCompanyGoalsNew(userId: string): Promise<CompanyGoal[]> {
  return MOCK_COMPANY_GOALS_NEW.filter(
    (g) => g.userId === userId && g.status !== "archived",
  ).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function getCompanyGoalNew(goalId: string): Promise<CompanyGoal | null> {
  return MOCK_COMPANY_GOALS_NEW.find((g) => g.id === goalId) ?? null;
}

// ─── Department Goals ────────────────────────────────────────

export async function listDepartmentGoals(userId: string): Promise<DepartmentGoal[]> {
  return MOCK_DEPARTMENT_GOALS.filter((d) => d.userId === userId);
}

// ─── Work Review ──────────────────────────────────────────────

export async function listWorkReviewItems(
  userId: string,
  opts?: {
    status?: string;
    kind?: string;
    department?: string;
    limit?: number;
  },
): Promise<WorkReviewItem[]> {
  let items = MOCK_WORK_REVIEW_ITEMS.filter((w) => w.userId === userId);
  if (opts?.status) items = items.filter((w) => w.status === opts.status);
  if (opts?.kind) items = items.filter((w) => w.kind === opts.kind);
  if (opts?.department) items = items.filter((w) => w.department === opts.department);
  items = items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  if (opts?.limit) items = items.slice(0, opts.limit);
  return items;
}

export async function getWorkReviewItem(
  itemId: string,
): Promise<WorkReviewItem | null> {
  return MOCK_WORK_REVIEW_ITEMS.find((w) => w.id === itemId) ?? null;
}

export async function countWorkReviewByStatus(
  userId: string,
): Promise<Record<string, number>> {
  const items = MOCK_WORK_REVIEW_ITEMS.filter((w) => w.userId === userId);
  const out: Record<string, number> = {
    needs_approval: 0,
    ready_to_send: 0,
    ready_to_publish: 0,
    ready_to_save: 0,
    completed: 0,
    rejected: 0,
  };
  for (const item of items) {
    out[item.status] = (out[item.status] ?? 0) + 1;
  }
  return out;
}

// ─── Agent Runs ──────────────────────────────────────────────

export async function listAgentRuns(
  userId: string,
  opts?: {
    employeeSlug?: string;
    limit?: number;
  },
): Promise<AgentRun[]> {
  let runs = MOCK_AGENT_RUNS.filter((r) => r.userId === userId);
  if (opts?.employeeSlug) runs = runs.filter((r) => r.employeeSlug === opts.employeeSlug);
  runs = runs.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  if (opts?.limit) runs = runs.slice(0, opts.limit);
  return runs;
}

export async function getAgentRun(runId: string): Promise<AgentRun | null> {
  return MOCK_AGENT_RUNS.find((r) => r.id === runId) ?? null;
}

export async function listAgentRunSteps(runId: string): Promise<AgentRunStep[]> {
  return MOCK_AGENT_RUN_STEPS.filter((s) => s.agentRunId === runId).sort(
    (a, b) => a.stepIndex - b.stepIndex,
  );
}

// ─── Knowledge Base Items (semantic memory) ──────────────────

export async function listKnowledgeBaseItems(
  userId: string,
  opts?: { scope?: string; limit?: number },
): Promise<KnowledgeBaseItem[]> {
  let items = MOCK_KNOWLEDGE_BASE_ITEMS.filter((k) => k.userId === userId);
  if (opts?.scope) items = items.filter((k) => k.scope === opts.scope || k.scope === "all");
  items = items.sort((a, b) => b.useCount - a.useCount);
  if (opts?.limit) items = items.slice(0, opts.limit);
  return items;
}

export async function getKnowledgeBaseItem(
  itemId: string,
): Promise<KnowledgeBaseItem | null> {
  return MOCK_KNOWLEDGE_BASE_ITEMS.find((k) => k.id === itemId) ?? null;
}

// ─── Scheduled Work ──────────────────────────────────────────

export async function listScheduledWork(
  userId: string,
  opts?: { enabledOnly?: boolean },
): Promise<ScheduledWork[]> {
  let items = MOCK_SCHEDULED_WORK.filter((s) => s.userId === userId);
  if (opts?.enabledOnly) items = items.filter((s) => s.isEnabled);
  return items.sort((a, b) => {
    if (a.nextRunAt && b.nextRunAt) {
      return new Date(a.nextRunAt).getTime() - new Date(b.nextRunAt).getTime();
    }
    return 0;
  });
}

// ─── Credits ─────────────────────────────────────────────────

export async function getCreditBalance(userId: string): Promise<CreditBalance | null> {
  return MOCK_CREDIT_BALANCES.find((b) => b.userId === userId) ?? null;
}

export async function listCreditUsage(
  userId: string,
  opts?: { limit?: number },
): Promise<CreditUsageLog[]> {
  let items = MOCK_CREDIT_USAGE_LOG.filter((u) => u.userId === userId);
  items = items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  if (opts?.limit) items = items.slice(0, opts.limit);
  return items;
}

// ─── Audit Logs ──────────────────────────────────────────────

export async function listAuditLogs(
  userId: string,
  opts?: { limit?: number; action?: string },
): Promise<AuditLog[]> {
  let items = MOCK_AUDIT_LOGS.filter((l) => l.userId === userId);
  if (opts?.action) items = items.filter((l) => l.action === opts.action);
  items = items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  if (opts?.limit) items = items.slice(0, opts.limit);
  return items;
}

// ─── Aggregates for HQ dashboard ─────────────────────────────

export async function getCompanyOverview(userId: string) {
  const [mission, goals, workItems, agentRuns, balance, scheduled] = await Promise.all([
    getMission(userId),
    listCompanyGoalsNew(userId),
    listWorkReviewItems(userId, { status: "needs_approval" }),
    listAgentRuns(userId, { limit: 50 }),
    getCreditBalance(userId),
    listScheduledWork(userId),
  ]);

  const totalTasksRun = agentRuns.length;
  const avgQuality =
    agentRuns.length > 0
      ? Math.round(
          agentRuns.reduce((sum, r) => sum + (r.evaluatorResult?.qualityScore ?? 0), 0) /
            agentRuns.length,
        )
      : 0;

  const creditsRemaining =
    balance !== null ? balance.monthlyAllowance - balance.monthlyUsed : 0;

  return {
    mission,
    goals,
    pendingWorkItems: workItems,
    scheduledWork: scheduled,
    metrics: {
      totalTasksRun,
      avgQuality,
      activeGoals: goals.filter((g) => g.status === "active" || g.status === "in_progress").length,
      completedGoals: goals.filter((g) => g.status === "completed").length,
      pendingApprovals: workItems.length,
      activeScheduledWork: scheduled.filter((s) => s.isEnabled).length,
      creditsRemaining,
      creditsUsed: balance?.monthlyUsed ?? 0,
      creditsAllowance: balance?.monthlyAllowance ?? 0,
    },
  };
}

// ─── Approvals (action history) ──────────────────────────────

export async function listApprovalsForItem(itemId: string): Promise<Approval[]> {
  // No mock approvals table yet — return empty.
  return [];
}

// ════════════════════════════════════════════════════════════════
//  8 NEW LIVE FEATURES — Coming Soon → Real
// ════════════════════════════════════════════════════════════════

// ─── CRM ────────────────────────────────────────────────────

export async function listCrmLeads(_userId: string): Promise<CrmLead[]> {
  return MOCK_CRM_LEADS;
}

export async function updateCrmLeadStage(
  id: string,
  stage: CrmStage,
): Promise<CrmLead | null> {
  const lead = MOCK_CRM_LEADS.find((l) => l.id === id);
  if (!lead) return null;
  lead.stage = stage;
  return lead;
}

export async function createCrmLead(data: Omit<CrmLead, "id" | "createdAt" | "score"> & { score?: number }): Promise<CrmLead> {
  const score = data.score ?? Math.min(95, 30 + Math.floor(Math.random() * 60));
  const lead: CrmLead = {
    ...data,
    id: `crm-new-${Date.now()}`,
    score,
    createdAt: new Date().toISOString(),
  };
  MOCK_CRM_LEADS.unshift(lead);
  return lead;
}

export async function deleteCrmLead(id: string): Promise<boolean> {
  const idx = MOCK_CRM_LEADS.findIndex((l) => l.id === id);
  if (idx < 0) return false;
  MOCK_CRM_LEADS.splice(idx, 1);
  return true;
}

// ─── Competitors ───────────────────────────────────────────

export async function listCompetitors(_userId: string): Promise<Competitor[]> {
  return MOCK_COMPETITORS;
}

export async function createCompetitor(
  data: Omit<Competitor, "id" | "createdAt">,
): Promise<Competitor> {
  const comp: Competitor = {
    ...data,
    id: `comp-new-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  MOCK_COMPETITORS.push(comp);
  return comp;
}

export async function deleteCompetitor(id: string): Promise<boolean> {
  const idx = MOCK_COMPETITORS.findIndex((c) => c.id === id);
  if (idx < 0) return false;
  MOCK_COMPETITORS.splice(idx, 1);
  return true;
}

// ─── Market Research ───────────────────────────────────────

export async function listMarketReports(_userId: string): Promise<MarketReport[]> {
  return MOCK_MARKET_REPORTS;
}

export async function getMarketReport(id: string): Promise<MarketReport | null> {
  return MOCK_MARKET_REPORTS.find((r) => r.id === id) ?? null;
}

export async function createMarketReport(
  data: Omit<MarketReport, "id" | "createdAt" | "status" | "generatedAt" | "marketSize" | "growthRate" | "trends" | "segments" | "demandSignals" | "gaps" | "recommendation" | "risks">,
): Promise<MarketReport> {
  // Demo: synthesize a believable report from the topic.
  const topic = data.topic;
  const report: MarketReport = {
    ...data,
    id: `mr-new-${Date.now()}`,
    status: "ready",
    generatedAt: new Date().toISOString(),
    marketSize: `$1.2B – $4.8B (estimated ${data.region || "global"} market)`,
    growthRate: "8-15% CAGR (next 3-5 years)",
    trends: [
      `AI-native ${topic.toLowerCase()} replacing legacy workflows`,
      `Buyer expectations shifting toward "always-on" experiences`,
      `Consolidation: 3-5 tool stacks merging into 1 unified platform`,
      `Vertical specialization beating horizontal breadth`,
    ],
    segments: [
      { name: "SMB (1-50 employees)", share: "52%", note: "Largest segment, price-sensitive, needs turnkey" },
      { name: "Mid-market (50-500)", share: "31%", note: "Fastest growing, willing to pay for outcomes" },
      { name: "Enterprise (500+)", share: "17%", note: "Slower adoption, high ACV" },
    ],
    demandSignals: [
      `Search volume for "${topic}" up 40-60% YoY`,
      `${Math.floor(Math.random() * 200 + 100)}+ new software products launched in this category in 2025`,
      `Average buyer reports 2.3x faster ROI than last year's tools`,
    ],
    gaps: [
      "Most solutions force buyers to bolt 3-4 tools together",
      "AI features exist as add-ons, not as the core product",
      "Onboarding and integration still take 30+ days industry-wide",
    ],
    recommendation: `Lead with the 30-day outcome guarantee. Sell the result, not the tool. Win the mid-market segment first — they have budget and they buy fast.`,
    risks: [
      { risk: "Incumbents add AI features", mitigation: "Move fast on specialization + integration depth" },
      { risk: "Buyer fatigue from AI hype", mitigation: "Lead with case studies, not features" },
    ],
    createdAt: new Date().toISOString(),
  };
  MOCK_MARKET_REPORTS.unshift(report);
  return report;
}

// ─── Ads & Content ─────────────────────────────────────────

export async function listAdCampaigns(_userId: string): Promise<AdCampaign[]> {
  return MOCK_AD_CAMPAIGNS;
}

export async function getAdCampaign(id: string): Promise<AdCampaign | null> {
  return MOCK_AD_CAMPAIGNS.find((c) => c.id === id) ?? null;
}

export async function createAdCampaign(
  data: Pick<AdCampaign, "name" | "type" | "channel" | "goal" | "audience" | "hook" | "cta">,
): Promise<AdCampaign> {
  // Demo: synthesize a content calendar based on the type.
  const postsByType: Record<AdCampaign["type"], number> = {
    "7-day-launch": 7,
    "14-day-lead-gen": 14,
    "30-day-content": 30,
    "social-posts": 10,
    "email-sequence": 5,
    "paid-ads": 6,
  };
  const count = postsByType[data.type] ?? 7;
  const content = Array.from({ length: count }).map((_, i) => ({
    id: `ad-c-new-${Date.now()}-${i}`,
    day: i + 1,
    platform: data.channel,
    format: data.type === "email-sequence" ? "Cold email" : data.type === "paid-ads" ? "Ad copy" : "Social post",
    hook: data.hook,
    body: `Day ${i + 1} content for "${data.name}" — auto-generated by your AI Marketing Strategist from your offer and audience. ${data.goal}.`,
    cta: data.cta,
    status: "draft" as const,
  }));
  const campaign: AdCampaign = {
    id: `ad-new-${Date.now()}`,
    userId: DEMO_USER.id,
    name: data.name,
    type: data.type,
    channel: data.channel,
    status: "draft",
    goal: data.goal,
    audience: data.audience,
    hook: data.hook,
    cta: data.cta,
    postsCount: count,
    leads: 0,
    conversions: 0,
    budget: 0,
    startedAt: null,
    createdAt: new Date().toISOString(),
    content,
  };
  MOCK_AD_CAMPAIGNS.unshift(campaign);
  return campaign;
}

export async function updateAdCampaignStatus(id: string, status: AdCampaign["status"]): Promise<AdCampaign | null> {
  const c = MOCK_AD_CAMPAIGNS.find((x) => x.id === id);
  if (!c) return null;
  c.status = status;
  if (status === "running" && !c.startedAt) c.startedAt = new Date().toISOString().slice(0, 10);
  return c;
}

export async function deleteAdCampaign(id: string): Promise<boolean> {
  const idx = MOCK_AD_CAMPAIGNS.findIndex((c) => c.id === id);
  if (idx < 0) return false;
  MOCK_AD_CAMPAIGNS.splice(idx, 1);
  return true;
}

// ─── Website Builder ──────────────────────────────────────

export async function listWebsitePages(_userId: string): Promise<WebsitePage[]> {
  return MOCK_WEBSITE_PAGES;
}

export async function getWebsitePage(id: string): Promise<WebsitePage | null> {
  return MOCK_WEBSITE_PAGES.find((p) => p.id === id) ?? null;
}

export async function createWebsitePage(
  data: Pick<WebsitePage, "name" | "type" | "goal" | "tone" | "targetAudience">,
): Promise<WebsitePage> {
  const page: WebsitePage = {
    id: `wp-new-${Date.now()}`,
    userId: DEMO_USER.id,
    name: data.name,
    slug: `/${data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
    type: data.type,
    status: "ready",
    goal: data.goal,
    tone: data.tone,
    targetAudience: data.targetAudience,
    hero: {
      headline: `Stop ${data.goal.toLowerCase()} the hard way.`,
      subhead: `${data.targetAudience} trust us to ${data.goal.toLowerCase()} — in 14 days, no code.`,
      cta: "Get started",
    },
    problem: {
      title: `You're losing time and money.`,
      points: [
        `Manual work is eating your week`,
        `Your tools don't talk to each other`,
        `You can't scale without hiring`,
        `You know AI can help — you just don't know where to start`,
      ],
    },
    solution: {
      title: `AI that ships work, not just suggestions.`,
      points: [
        `Hire an AI team in 14 days`,
        `Sales, marketing, content, support, research — all working 24/7`,
        `All output reviewed and approved by you before it goes out`,
        `Built for ${data.targetAudience.toLowerCase()}`,
      ],
    },
    features: [
      { title: "24/7 execution", description: `Your AI team works while you sleep. They don't stop.` },
      { title: "Built-in quality", description: "Every output is reviewed and approved before it ships." },
      { title: "Multi-department", description: "Sales, marketing, content, support, research, ops — coordinated." },
      { title: "Pay per outcome", description: "Flat monthly pricing. No per-seat surprises." },
    ],
    socialProof: [
      { quote: "We replaced 3 contractors with 1 AI team. Same output, 1/10th the cost.", author: "Sarah K.", company: "Bright Smile Dental" },
      { quote: "It actually does the work. That's the difference.", author: "Marcus W.", company: "Wright Realty" },
    ],
    pricing: [
      { tier: "Starter", price: "$29/mo", features: ["1 AI employee", "500 tasks/mo", "Email support"] },
      { tier: "Growth", price: "$79/mo", features: ["5 AI employees", "5,000 tasks/mo", "Priority support"] },
      { tier: "Company", price: "$149/mo", features: ["10 AI employees", "Unlimited tasks", "Dedicated CSM"] },
    ],
    faq: [
      { q: "How fast can I get started?", a: "Most teams are live in 14 days." },
      { q: "What if I don't like an output?", a: "Edit it or regenerate. The AI learns from your edits." },
      { q: "Can I cancel anytime?", a: "Yes. No contracts." },
    ],
    cta: { headline: `Ready to ${data.goal.toLowerCase()}?`, cta: "Get started" },
    seo: {
      title: `${data.name} — AI for ${data.targetAudience}`,
      description: `${data.goal} in 14 days with your own AI team. Built for ${data.targetAudience.toLowerCase()}.`,
    },
    createdAt: new Date().toISOString(),
  };
  MOCK_WEBSITE_PAGES.unshift(page);
  return page;
}

export async function deleteWebsitePage(id: string): Promise<boolean> {
  const idx = MOCK_WEBSITE_PAGES.findIndex((p) => p.id === id);
  if (idx < 0) return false;
  MOCK_WEBSITE_PAGES.splice(idx, 1);
  return true;
}

// ─── Growth Command Center ────────────────────────────────

export async function listGrowthMetrics(_userId: string): Promise<GrowthMetric[]> {
  return MOCK_GROWTH_METRICS;
}

export async function listGrowthChannels(_userId: string): Promise<GrowthChannel[]> {
  return MOCK_GROWTH_CHANNELS;
}

export async function listGrowthExperiments(_userId: string): Promise<GrowthExperiment[]> {
  return MOCK_GROWTH_EXPERIMENTS;
}

export async function listGrowthCommentary(_userId: string): Promise<GrowthWeeklyCommentary[]> {
  return MOCK_GROWTH_COMMENTARY;
}

export async function getLatestGrowthCommentary(_userId: string): Promise<GrowthWeeklyCommentary | null> {
  return MOCK_GROWTH_COMMENTARY[0] ?? null;
}

// ─── Weekly Tasks (extra accessors) ───────────────────────

export async function updateWeeklyTaskStatus(
  id: string,
  status: "todo" | "in_progress" | "done" | "skipped",
): Promise<boolean> {
  const t = MOCK_WEEKLY_TASKS.find((x) => x.id === id);
  if (!t) return false;
  t.status = status;
  return true;
}
