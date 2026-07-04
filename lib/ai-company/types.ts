/**
 * AI Company Engine — shared types.
 *
 * The engine operates on these core concepts:
 *   Company → Mission → Goal → Department Goal → Task → Agent Run → Work Review Item → Approval
 *
 * Every AI employee run flows through `employee-runner.ts` which checks permissions,
 * checks budget, retrieves memory, calls the LLM, evaluates output, creates a work
 * review item, and writes an audit log.
 */

import type { departmentEnum, workReviewKindEnum } from "@/lib/db/schema";

export type Department = (typeof departmentEnum.enumValues)[number];
export type WorkReviewKind = (typeof workReviewKindEnum.enumValues)[number];

export type PermissionLevel = 1 | 2 | 3 | 4;

export type EmployeeStatus =
  | "active"
  | "working"
  | "waiting_approval"
  | "paused"
  | "budget_reached"
  | "needs_training"
  | "error"
  | "completed";

/** Risk category — drives whether approval is required. */
export type ActionRisk =
  | "safe" // free to run
  | "draft" // save to work review, low priority
  | "external" // needs approval (sending, publishing)
  | "destructive" // needs approval + log
  | "legal" // needs approval + disclaimer
  | "finance" // needs approval + disclaimer
  | "integration" // needs approval + log
  | "data_delete"; // needs approval + log

/** The decision an evaluator makes on a task output. */
export interface EvaluatorVerdict {
  qualityScore: number; // 0-100
  relevanceScore: number;
  safetyScore: number;
  confidenceScore: number;
  passed: boolean;
  notes: string;
  regenerateReason?: string;
}

/** Result of a memory retrieval query. */
export interface MemoryHit {
  id: string;
  title: string;
  snippet: string; // short excerpt used by the LLM
  source: string;
  scope: string;
  confidence: number;
  score: number; // retrieval score 0-1
}

/** Permission decision returned by permission-checker. */
export interface PermissionDecision {
  allowed: boolean;
  reason: string;
  effectiveLevel: PermissionLevel;
  requiresApproval: boolean;
  approvalReason?: string;
}

/** Budget decision returned by budget-checker. */
export interface BudgetDecision {
  allowed: boolean;
  reason: string;
  creditsRemaining: number;
  creditsRequested: number;
  suggestedAction?: "increase_budget" | "wait_next_period" | "skip";
}

/** Result of a full employee run. */
export interface EmployeeRunResult {
  ok: boolean;
  agentRunId: string;
  workReviewItemId?: string;
  status: "completed" | "needs_approval" | "failed";
  output: string;
  outputStructured?: Record<string, unknown>;
  evaluator: EvaluatorVerdict;
  durationMs: number;
  creditsUsed: number;
  error?: string;
}

/** CEO plan output — the structured breakdown of a goal. */
export interface CeoPlan {
  rationale: string;
  risks: string[];
  departmentBreakdown: Array<{
    department: Department;
    departmentName: string;
    reasoning: string;
    tasks: Array<{
      title: string;
      objective: string;
      suggestedEmployeeSlug: string;
      suggestedSkill: string;
      estimatedCredits: number;
      requiresApproval: boolean;
      scheduledWithinDays: number;
      riskLevel: ActionRisk;
    }>;
  }>;
}

/** Daily CEO briefing shape. */
export interface DailyBriefing {
  date: string;
  greeting: string;
  topPriorities: Array<{
    title: string;
    why: string;
    owner: string;
    link?: string;
  }>;
  winsToday: Array<{ headline: string; metric?: string; link?: string }>;
  needsAttention: Array<{ headline: string; reason: string; link?: string }>;
  pendingApprovals: number;
  risks: Array<{ headline: string; severity: "low" | "medium" | "high" }>;
  opportunities: Array<{ headline: string; employee: string; link?: string }>;
  metrics: {
    tasksCompletedToday: number;
    workApprovedToday: number;
    leadsCapturedToday: number;
    creditsUsedToday: number;
    hoursSavedToday: number;
  };
}

/** Weekly CEO report shape. */
export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  summary: string;
  wins: string[];
  needsAttention: string[];
  opportunities: string[];
  risks: string[];
  recommendedNextActions: string[];
  metrics: {
    tasksCompleted: number;
    workApproved: number;
    workRejected: number;
    leadsCaptured: number;
    conversationsHandled: number;
    contentCreated: number;
    researchGenerated: number;
    creditsUsed: number;
    hoursSaved: number;
  };
  byDepartment: Array<{
    department: string;
    tasksCompleted: number;
    topPerformer?: string;
  }>;
  byEmployee: Array<{
    employeeSlug: string;
    employeeName: string;
    tasksCompleted: number;
    workApproved: number;
    qualityAvg: number;
  }>;
  companyScoreDelta: number;
}