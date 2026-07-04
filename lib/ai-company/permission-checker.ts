/**
 * Permission checker — enforces employee permission levels.
 *
 * Permission levels (per the Reklu spec):
 *   1 — Draft Only:        can create drafts and suggestions, never executes.
 *   2 — Needs Approval:    can prepare actions, but user must approve before execution.
 *   3 — Auto Work:         can perform approved recurring safe tasks without prompting.
 *   4 — Admin Power:       advanced actions only with strict logs (used by CEO/COO).
 *
 * Default for newly hired employees: Level 2.
 *
 * Action risk categories — drive whether approval is required regardless of level:
 *   safe, draft, external (send/publish), destructive, legal, finance, integration, data_delete
 */

import type { PermissionLevel, ActionRisk, PermissionDecision } from "./types";

/** Map action risk → minimum required approval level. */
const RISKY_ACTIONS: ActionRisk[] = [
  "external",
  "destructive",
  "legal",
  "finance",
  "integration",
  "data_delete",
];

const RISK_LABEL: Record<ActionRisk, string> = {
  safe: "Safe action",
  draft: "Draft only",
  external: "External send (email, publish, reply)",
  destructive: "Destructive (delete, disconnect)",
  legal: "Legal output — must be reviewed by counsel",
  finance: "Finance output — must be reviewed by a finance professional",
  integration: "Integration change",
  data_delete: "Data deletion",
};

export function checkPermission(opts: {
  employeeLevel: PermissionLevel;
  actionRisk: ActionRisk;
  /** Whether the action has been previously approved by the user (recurring tasks). */
  previouslyApproved?: boolean;
}): PermissionDecision {
  const { employeeLevel, actionRisk, previouslyApproved = false } = opts;

  // Risky actions always require approval, regardless of level.
  if (RISKY_ACTIONS.includes(actionRisk)) {
    return {
      allowed: true, // allowed to PREPARE the draft
      reason: `Action is "${RISK_LABEL[actionRisk]}" — requires human approval before execution.`,
      effectiveLevel: employeeLevel,
      requiresApproval: true,
      approvalReason: RISK_LABEL[actionRisk],
    };
  }

  // Level 1 — Draft only. Always needs approval.
  if (employeeLevel <= 1) {
    return {
      allowed: true,
      reason: "Employee is Draft Only — every output goes to Work Review for approval.",
      effectiveLevel: employeeLevel,
      requiresApproval: true,
      approvalReason: "Draft-only role",
    };
  }

  // Level 2 — Needs approval. Everything goes to Work Review.
  if (employeeLevel === 2) {
    return {
      allowed: true,
      reason: "Employee is set to Needs Approval — output goes to Work Review.",
      effectiveLevel: employeeLevel,
      requiresApproval: true,
      approvalReason: "Standard approval gate",
    };
  }

  // Level 3 — Auto Work. Can run approved recurring safe tasks.
  if (employeeLevel === 3) {
    if (actionRisk === "safe" && previouslyApproved) {
      return {
        allowed: true,
        reason: "Auto Work on a previously-approved safe recurring task.",
        effectiveLevel: employeeLevel,
        requiresApproval: false,
      };
    }
    return {
      allowed: true,
      reason: "Auto Work, but first run / non-safe — requires approval.",
      effectiveLevel: employeeLevel,
      requiresApproval: true,
      approvalReason: "First run of recurring task",
    };
  }

  // Level 4 — Admin Power. Allowed with strict logs.
  return {
    allowed: true,
    reason: "Admin Power — action logged with strict audit trail.",
    effectiveLevel: employeeLevel,
    requiresApproval: actionRisk !== "safe",
    approvalReason: actionRisk !== "safe" ? RISK_LABEL[actionRisk] : undefined,
  };
}

/** Infer the action risk for a given kind of output. */
export function inferActionRisk(kind: string): ActionRisk {
  const k = kind.toLowerCase();
  if (k.includes("email") || k.includes("send") || k.includes("publish") || k.includes("reply"))
    return "external";
  if (k.includes("legal") || k.includes("terms") || k.includes("privacy")) return "legal";
  if (k.includes("price") || k.includes("budget") || k.includes("revenue") || k.includes("finance"))
    return "finance";
  if (k.includes("integration") || k.includes("connect")) return "integration";
  if (k.includes("delete")) return "destructive";
  if (k.includes("plan") || k.includes("draft") || k.includes("research") || k.includes("content"))
    return "draft";
  return "safe";
}

export function humanLabelForRisk(risk: ActionRisk): string {
  return RISK_LABEL[risk];
}