/**
 * Company Engine — the top-level orchestrator that ties everything together.
 *
 * This is the brain that the rest of the app calls. It hides the complexity of
 *   ceo-planner → department-router → employee-runner → work-review-generator
 * behind simple operations like `createGoal`, `approvePlan`, `runGoalExecution`.
 *
 * Used by:
 *   - API routes (POST /api/ceo/plan, POST /api/goals, POST /api/work-review/[id]/approve)
 *   - Server actions
 *   - The dashboard's "Run this goal" button
 *
 * All operations are synchronous from the API's perspective; the long-running
 * work is delegated to Inngest in production. In demo mode, everything runs inline.
 */

import { isDemoMode } from "@/lib/demo";
import {
  MOCK_COMPANY_MISSIONS,
  MOCK_COMPANY_GOALS_NEW,
  MOCK_DEPARTMENT_GOALS,
  MOCK_AUDIT_LOGS,
} from "@/lib/mock-data";
import { generateCeoPlan, planToStoredShape, pickEmployeeForTask } from "./ceo-planner";
import { runEmployee } from "./employee-runner";
import type { CompanyMission, CompanyGoal, DepartmentGoal } from "@/lib/db/schema";

const NOW = () => new Date().toISOString();

// ─── Mission ─────────────────────────────────────────────────

export async function setMission(userId: string, mission: string, vision?: string) {
  const existing = MOCK_COMPANY_MISSIONS.find((m) => m.userId === userId);
  if (existing) {
    existing.mission = mission;
    existing.vision = vision ?? existing.vision;
    existing.updatedAt = NOW();
    writeAudit(userId, "mission_set", "user", { mission });
    return existing;
  }
  const created: CompanyMission = {
    id: `mission-${Math.random().toString(36).slice(2, 10)}`,
    userId,
    mission,
    vision: vision ?? null,
    cadence: "ongoing",
    northStarMetric: null,
    northStarTarget: null,
    values: [],
    createdAt: NOW(),
    updatedAt: NOW(),
  };
  MOCK_COMPANY_MISSIONS.push(created);
  writeAudit(userId, "mission_set", "user", { mission });
  return created;
}

export async function getMission(userId: string): Promise<CompanyMission | null> {
  return MOCK_COMPANY_MISSIONS.find((m) => m.userId === userId) ?? null;
}

// ─── Goals ───────────────────────────────────────────────────

export async function createGoal(opts: {
  userId: string;
  title: string;
  description?: string;
  horizon?: "30_day" | "90_day" | "annual";
  successMetric?: string;
  successTarget?: string;
}): Promise<CompanyGoal> {
  const mission = await getMission(opts.userId);
  const created: CompanyGoal = {
    id: `goal-${Math.random().toString(36).slice(2, 10)}`,
    userId: opts.userId,
    missionId: mission?.id ?? null,
    title: opts.title,
    description: opts.description ?? null,
    horizon: opts.horizon ?? "30_day",
    status: "draft",
    successMetric: opts.successMetric ?? null,
    successTarget: opts.successTarget ?? null,
    progressPct: 0,
    ceoPlan: {
      rationale: "",
      risks: [],
      departmentBreakdown: [],
    },
    planApprovedAt: null,
    planApprovedBy: null,
    dueDate: null,
    completedAt: null,
    archivedAt: null,
    createdAt: NOW(),
    updatedAt: NOW(),
  };
  MOCK_COMPANY_GOALS_NEW.push(created);
  writeAudit(opts.userId, "goal_created", "user", { goalId: created.id, title: created.title });
  return created;
}

export async function getGoal(goalId: string): Promise<CompanyGoal | null> {
  return MOCK_COMPANY_GOALS_NEW.find((g) => g.id === goalId) ?? null;
}

export async function listGoals(userId: string): Promise<CompanyGoal[]> {
  return MOCK_COMPANY_GOALS_NEW.filter(
    (g) => g.userId === userId && g.status !== "archived",
  ).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

// ─── CEO Plan ────────────────────────────────────────────────

export async function generatePlanForGoal(goalId: string): Promise<CompanyGoal | null> {
  const goal = await getGoal(goalId);
  if (!goal) return null;

  const plan = generateCeoPlan({
    title: goal.title,
    description: goal.description ?? undefined,
    successMetric: goal.successMetric ?? undefined,
    successTarget: goal.successTarget ?? undefined,
  });

  goal.ceoPlan = planToStoredShape(plan);
  goal.status = "planning";
  goal.updatedAt = NOW();
  writeAudit(goal.userId, "plan_generated", "ai", {
    goalId,
    departmentCount: plan.departmentBreakdown.length,
    taskCount: plan.departmentBreakdown.reduce((sum, d) => sum + d.tasks.length, 0),
  });
  return goal;
}

export async function approvePlan(goalId: string): Promise<CompanyGoal | null> {
  const goal = await getGoal(goalId);
  if (!goal) return null;
  goal.planApprovedAt = NOW();
  goal.planApprovedBy = "user";
  goal.status = "active";
  goal.updatedAt = NOW();

  // Materialize department goals
  const plan = goal.ceoPlan;
  if (plan?.departmentBreakdown) {
    for (const breakdown of plan.departmentBreakdown) {
      const dpg: DepartmentGoal = {
        id: `dpg-${Math.random().toString(36).slice(2, 10)}`,
        userId: goal.userId,
        companyGoalId: goal.id,
        department: breakdown.department as never,
        objective: breakdown.tasks.map((t) => t.title).join(" · "),
        metric: null,
        targetValue: null,
        progressPct: 0,
        status: "active",
        createdAt: NOW(),
      };
      MOCK_DEPARTMENT_GOALS.push(dpg);
    }
  }

  writeAudit(goal.userId, "plan_approved", "user", { goalId });
  return goal;
}

// ─── Goal execution ──────────────────────────────────────────

export async function executeGoalTasks(goalId: string) {
  const goal = await getGoal(goalId);
  if (!goal) return null;
  if (!goal.ceoPlan?.departmentBreakdown) return goal;

  // For each department's tasks, route to the right employee and run.
  const results: Array<{ department: string; task: string; result: unknown }> = [];

  for (const breakdown of goal.ceoPlan.departmentBreakdown as Array<{
    department: string;
    tasks: Array<{
      title: string;
      objective: string;
      suggestedEmployeeSlug: string;
      estimatedCredits: number;
      requiresApproval: boolean;
    }>;
  }>) {
    for (const task of breakdown.tasks) {
      const employee = pickEmployeeForTask({
        suggestedEmployeeSlug: task.suggestedEmployeeSlug,
        department: breakdown.department,
      });
      if (!employee) continue;

      const result = await runEmployee({
        userId: goal.userId,
        employeeSlug: employee.slug,
        taskTitle: task.title,
        taskDescription: task.objective,
        goalId: goal.id,
        previouslyApproved: !task.requiresApproval,
      });

      results.push({
        department: breakdown.department,
        task: task.title,
        result: {
          ok: result.ok,
          workReviewItemId: result.workReviewItemId,
          status: result.status,
          qualityScore: result.evaluator.qualityScore,
        },
      });
    }
  }

  return { goal, results };
}

// ─── Audit ───────────────────────────────────────────────────

function writeAudit(
  userId: string,
  action: string,
  actor: "user" | "ai" | "system",
  metadata: Record<string, unknown>,
) {
  if (!isDemoMode()) return;
  MOCK_AUDIT_LOGS.push({
    id: `audit-${Math.random().toString(36).slice(2, 10)}`,
    userId,
    actor,
    action: action as never,
    targetType: null,
    targetId: null,
    metadata,
    note: null,
    ipAddress: null,
    createdAt: NOW(),
  });
}

/** Get audit logs for a user, optionally filtered by action. */
export async function listAuditLogs(
  userId: string,
  opts?: { action?: string; limit?: number },
) {
  let logs = MOCK_AUDIT_LOGS.filter((l) => l.userId === userId);
  if (opts?.action) logs = logs.filter((l) => l.action === opts.action);
  logs = logs.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  if (opts?.limit) logs = logs.slice(0, opts.limit);
  return logs;
}