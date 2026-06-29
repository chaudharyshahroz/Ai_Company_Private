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
