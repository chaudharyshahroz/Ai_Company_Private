/**
 * Work Review generator — turns employee task outputs into structured
 * Work Review items that appear in the approval queue.
 *
 * Each item carries:
 *   - structured fields (title, summary, body)
 *   - employee + department
 *   - evaluation scores
 *   - estimated credits
 *   - approval gating
 *   - suggested next action
 *
 * In demo mode, items are appended to the in-memory mock store. With a real DB
 * they get inserted into `work_review_items`.
 */

import type {
  WorkReviewItem,
} from "@/lib/db/schema";
import type { EvaluatorVerdict, EmployeeRunResult, Department, WorkReviewKind } from "./types";

const NOW = () => new Date().toISOString();

export interface BuildReviewItemInput {
  userId: string;
  taskId?: string | null;
  goalId?: string | null;
  departmentGoalId?: string | null;
  agentRunId: string;
  hiredAgentId?: string | null;
  title: string;
  summary: string;
  body: string;
  bodyStructured?: Record<string, unknown>;
  kind: WorkReviewKind;
  priority?: "low" | "normal" | "high" | "urgent";
  employeeName: string;
  employeeSlug: string;
  department: Department;
  evaluator: EvaluatorVerdict;
  creditsEstimated: number;
  requiresApproval: boolean;
  approvalReason?: string;
  suggestedNextAction?: string;
}

export function buildWorkReviewItem(input: BuildReviewItemInput): WorkReviewItem {
  const now = NOW();
  return {
    id: `wri-${Math.random().toString(36).slice(2, 10)}`,
    userId: input.userId,
    taskId: input.taskId ?? null,
    goalId: input.goalId ?? null,
    departmentGoalId: input.departmentGoalId ?? null,
    agentRunId: input.agentRunId,
    hiredAgentId: input.hiredAgentId ?? null,
    title: input.title,
    summary: input.summary,
    body: input.body,
    bodyStructured: input.bodyStructured ?? {},
    kind: input.kind,
    status: input.requiresApproval ? "needs_approval" : "completed",
    priority: input.priority ?? "normal",
    employeeName: input.employeeName,
    employeeSlug: input.employeeSlug,
    department: input.department,
    qualityScore: input.evaluator.qualityScore,
    relevanceScore: input.evaluator.relevanceScore,
    safetyScore: input.evaluator.safetyScore,
    confidenceScore: input.evaluator.confidenceScore,
    evaluatorNotes: input.evaluator.notes,
    regenerationCount: 0,
    creditsEstimated: input.creditsEstimated,
    requiresApproval: input.requiresApproval,
    approvalReason: input.approvalReason ?? null,
    suggestedNextAction: input.suggestedNextAction ?? null,
    approvedAt: null,
    rejectedAt: null,
    publishedAt: null,
    sentAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

/** Decide what to suggest as the next action, given the kind + status. */
export function suggestNextAction(opts: {
  kind: WorkReviewKind;
  evaluatorPassed: boolean;
}): string {
  const { kind, evaluatorPassed } = opts;
  if (!evaluatorPassed) return "Review — output did not pass quality check.";
  switch (kind) {
    case "outreach":
      return "Approve to send via Outreach employee, or edit before sending.";
    case "content":
      return "Approve to publish to campaign assets, or schedule for later.";
    case "reply":
      return "Approve to send to customer, or edit first.";
    case "research":
      return "Approve to save to Knowledge Base so the whole team can use it.";
    case "plan":
      return "Approve plan to assign tasks to departments.";
    case "report":
      return "Approve to deliver as the weekly briefing.";
    case "campaign":
      return "Approve to launch the campaign.";
    case "legal_draft":
      return "Review with a qualified lawyer before publishing.";
    case "finance_draft":
      return "Review with a finance professional before publishing.";
    case "analysis":
      return "Approve to save insights to reports.";
    case "draft":
    default:
      return "Approve to save, or edit before saving.";
  }
}

/** Map employee role → work review kind. */
export function kindFromEmployee(opts: {
  slug: string;
  role: string;
}): WorkReviewKind {
  const { slug, role } = opts;
  if (slug.includes("ceo") || slug.includes("planner")) return "plan";
  if (slug.includes("content") || slug.includes("social") || slug.includes("email") || slug.includes("seo"))
    return "content";
  if (slug.includes("outreach") || slug.includes("sales") || slug.includes("appointment"))
    return "outreach";
  if (slug.includes("support") || slug.includes("faq") || slug.includes("onboarding"))
    return "reply";
  if (slug.includes("research") || slug.includes("competitor") || slug.includes("market") || slug.includes("trend"))
    return "research";
  if (slug.includes("legal") || slug.includes("compliance") || slug.includes("terms") || slug.includes("privacy"))
    return "legal_draft";
  if (slug.includes("finance") || slug.includes("cfo") || slug.includes("pricing") || slug.includes("revenue"))
    return "finance_draft";
  if (slug.includes("ad") || slug.includes("campaign")) return "campaign";
  if (slug.includes("report") || role.toLowerCase().includes("report")) return "report";
  if (slug.includes("analysis") || slug.includes("feedback")) return "analysis";
  return "draft";
}

/** Construct an in-memory Work Review Item from an EmployeeRunResult. */
export function fromRunResult(opts: {
  userId: string;
  run: EmployeeRunResult;
  title: string;
  summary: string;
  body: string;
  bodyStructured?: Record<string, unknown>;
  kind: WorkReviewKind;
  employeeName: string;
  employeeSlug: string;
  department: Department;
  taskId?: string | null;
  goalId?: string | null;
  departmentGoalId?: string | null;
  hiredAgentId?: string | null;
  requiresApproval: boolean;
  approvalReason?: string;
  suggestedNextAction?: string;
}): WorkReviewItem {
  return buildWorkReviewItem({
    userId: opts.userId,
    taskId: opts.taskId ?? null,
    goalId: opts.goalId ?? null,
    departmentGoalId: opts.departmentGoalId ?? null,
    agentRunId: opts.run.agentRunId,
    hiredAgentId: opts.hiredAgentId ?? null,
    title: opts.title,
    summary: opts.summary,
    body: opts.body,
    bodyStructured: opts.bodyStructured,
    kind: opts.kind,
    employeeName: opts.employeeName,
    employeeSlug: opts.employeeSlug,
    department: opts.department,
    evaluator: opts.run.evaluator,
    creditsEstimated: opts.run.creditsUsed,
    requiresApproval: opts.requiresApproval,
    approvalReason: opts.approvalReason,
    suggestedNextAction: opts.suggestedNextAction ?? suggestNextAction({
      kind: opts.kind,
      evaluatorPassed: opts.run.evaluator.passed,
    }),
  });
}