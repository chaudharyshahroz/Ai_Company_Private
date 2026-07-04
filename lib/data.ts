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
