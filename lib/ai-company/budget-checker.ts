/**
 * Budget checker — enforces credit & employee-level budgets.
 *
 * Before every AI run, this answers: can the user afford this?
 *
 * Tracks:
 *   - company-level monthly credit balance
 *   - employee-level monthly budget (set at hire time, adjustable)
 *   - per-task estimated cost
 *
 * Decisions:
 *   - allow → run
 *   - block + reason → pause employee, surface "increase budget" or "wait for period"
 *
 * In demo mode, balances live in the mock store. Real DB mode uses `credit_balances`
 * and `credit_usage_log`.
 */

import type { BudgetDecision } from "./types";

export interface BudgetState {
  companyAllowance: number;
  companyUsed: number;
  employeeMonthlyBudget: number;
  employeeUsed: number;
  periodEnd: string;
}

const CREDIT_COSTS = {
  memory_retrieval: 1,
  evaluation: 2,
  simple_task: 8, // small drafts
  standard_task: 25, // blog post, email, research
  complex_task: 60, // multi-section reports
  ceo_plan: 80,
  weekly_report: 50,
  daily_briefing: 20,
} as const;

export type TaskKind = keyof typeof CREDIT_COSTS;

/** Estimate credits for a task. */
export function estimateCredits(kind: TaskKind | "custom", custom?: number): number {
  if (kind === "custom" && typeof custom === "number") return Math.max(1, Math.round(custom));
  return CREDIT_COSTS[kind as TaskKind] ?? CREDIT_COSTS.standard_task;
}

/** Check whether a run is allowed given current budget state. */
export function checkBudget(opts: {
  state: BudgetState;
  estimatedCredits: number;
}): BudgetDecision {
  const { state, estimatedCredits } = opts;
  const companyRemaining = state.companyAllowance - state.companyUsed;
  const employeeRemaining = state.employeeMonthlyBudget - state.employeeUsed;

  if (companyRemaining < estimatedCredits) {
    return {
      allowed: false,
      reason: `Company has ${companyRemaining} credits left this period; task needs ${estimatedCredits}.`,
      creditsRemaining: companyRemaining,
      creditsRequested: estimatedCredits,
      suggestedAction: "increase_budget",
    };
  }

  if (employeeRemaining < estimatedCredits) {
    return {
      allowed: false,
      reason: `Employee has ${employeeRemaining} credits left this month; task needs ${estimatedCredits}.`,
      creditsRemaining: employeeRemaining,
      creditsRequested: estimatedCredits,
      suggestedAction: "increase_budget",
    };
  }

  // Warn at <20% remaining (not blocking).
  const warnPct = state.companyAllowance > 0 ? companyRemaining / state.companyAllowance : 0;
  if (warnPct < 0.2) {
    return {
      allowed: true,
      reason: `Allowed, but only ${companyRemaining} credits (${Math.round(warnPct * 100)}%) remain this period.`,
      creditsRemaining: companyRemaining,
      creditsRequested: estimatedCredits,
    };
  }

  return {
    allowed: true,
    reason: "Within budget.",
    creditsRemaining: companyRemaining,
    creditsRequested: estimatedCredits,
  };
}

/** Compute the cost of a task based on its kind and output size. */
export function costFor(opts: {
  kind: TaskKind | "custom";
  outputChars?: number;
  customCredits?: number;
}): number {
  const base = estimateCredits(opts.kind, opts.customCredits);
  // Add a small marginal cost for very long outputs (LLM tokens scale with length).
  if (opts.outputChars && opts.outputChars > 4000) {
    const extra = Math.ceil((opts.outputChars - 4000) / 1000) * 4;
    return base + extra;
  }
  return base;
}

/** Resolve an employee "status" given the latest budget decision. */
export function deriveEmployeeStatusFromBudget(decision: BudgetDecision) {
  if (!decision.allowed) return "budget_reached" as const;
  if (decision.creditsRemaining < 100) return "active" as const;
  return "active" as const;
}