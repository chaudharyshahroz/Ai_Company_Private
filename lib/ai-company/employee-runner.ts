/**
 * Employee Runner — the core pipeline that every AI employee task flows through.
 *
 *   1. Resolve the employee (slug → catalog entry)
 *   2. Check permission (employee level × action risk)
 *   3. Check budget (company + employee remaining)
 *   4. Retrieve memory (semantic + scope filtering)
 *   5. Build the final system prompt (employee role + business memory)
 *   6. Call the LLM (real OpenRouter in prod, mock in demo)
 *   7. Evaluate output (quality, relevance, safety, confidence)
 *   8. If poor, regenerate once. If still poor, surface warning.
 *   9. Create an Agent Run record (with step-by-step trace)
 *  10. Create a Work Review Item (if approval required)
 *  11. Write Audit Log
 *  12. Update credit usage
 *
 * In demo mode, the LLM call uses the per-template mock outputs from
 * `lib/openrouter.ts`. With a real OPENROUTER_API_KEY, the same call goes
 * to OpenRouter.
 */

import { isDemoMode, DEMO_USER } from "@/lib/demo";
import { getBusinessBrain } from "@/lib/data";
import { runAgent } from "@/lib/openrouter";
import { getEmployee } from "@/lib/employees";
import { estimateCredits, checkBudget } from "./budget-checker";
import { checkPermission, inferActionRisk } from "./permission-checker";
import {
  retrieveMemoryForTask,
  formatMemoryForPrompt,
  recordMemoryUsage,
} from "./memory-retriever";
import { evaluateOutput } from "./evaluator";
import { buildWorkReviewItem, fromRunResult, suggestNextAction } from "./work-review-generator";
import type { EmployeeRunResult, ActionRisk, Department, WorkReviewKind } from "./types";
import { kindFromEmployee } from "./work-review-generator";
import {
  MOCK_KNOWLEDGE_BASE_ITEMS,
  MOCK_AGENT_RUNS,
  MOCK_AGENT_RUN_STEPS,
  MOCK_WORK_REVIEW_ITEMS,
  MOCK_AUDIT_LOGS,
  MOCK_CREDIT_USAGE_LOG,
} from "@/lib/mock-data";

export interface RunEmployeeOptions {
  userId: string;
  employeeSlug: string;
  taskTitle: string;
  taskDescription: string;
  /** Optional goal + department-goal context. */
  goalId?: string;
  departmentGoalId?: string;
  /** Optional input context (e.g. conversation text, lead info). */
  inputContext?: Record<string, unknown>;
  /** Action risk override; otherwise inferred from the task. */
  actionRisk?: ActionRisk;
  /** Already approved by user for recurring safe runs. */
  previouslyApproved?: boolean;
  /** Optional kind override. */
  kind?: WorkReviewKind;
  /** Optional hiring context. */
  hiredAgentId?: string;
  /** Optional priority. */
  priority?: "low" | "normal" | "high" | "urgent";
}

/** Main entry — run an employee task through the full pipeline. */
export async function runEmployee(opts: RunEmployeeOptions): Promise<EmployeeRunResult> {
  const start = Date.now();
  const steps: Array<{
    stepIndex: number;
    stepName: string;
    startedAt: string;
    completedAt?: string;
    durationMs: number;
    input: Record<string, unknown>;
    output: Record<string, unknown>;
    status: "running" | "completed" | "failed";
    errorMessage?: string;
  }> = [];

  function pushStep(name: string, input: Record<string, unknown>) {
    const idx = steps.length;
    const startedAt = new Date().toISOString();
    const step = {
      stepIndex: idx,
      stepName: name,
      startedAt,
      durationMs: 0,
      input,
      output: {},
      status: "running" as const,
    };
    steps.push(step);
    return step;
  }

  function completeStep(step: typeof steps[number], output: Record<string, unknown>) {
    const completedAt = new Date().toISOString();
    step.completedAt = completedAt;
    step.durationMs = Date.now() - new Date(step.startedAt).getTime();
    step.output = output;
    step.status = "completed";
  }

  function failStep(step: typeof steps[number], err: unknown) {
    step.completedAt = new Date().toISOString();
    step.durationMs = Date.now() - new Date(step.startedAt).getTime();
    step.status = "failed";
    step.errorMessage = err instanceof Error ? err.message : String(err);
  }

  // ─── 1. Resolve employee
  const employee = getEmployee(opts.employeeSlug);
  if (!employee) {
    return {
      ok: false,
      agentRunId: "",
      status: "failed",
      output: "",
      evaluator: {
        qualityScore: 0,
        relevanceScore: 0,
        safetyScore: 0,
        confidenceScore: 0,
        passed: false,
        notes: `Unknown employee slug: ${opts.employeeSlug}`,
      },
      durationMs: Date.now() - start,
      creditsUsed: 0,
      error: `Unknown employee: ${opts.employeeSlug}`,
    };
  }

  // ─── 2. Permission
  const permStep = pushStep("permission_check", {
    employeeLevel: employee.permissionLevel,
    actionRisk: opts.actionRisk ?? inferActionRisk(opts.taskTitle),
    previouslyApproved: opts.previouslyApproved ?? false,
  });
  const permission = checkPermission({
    employeeLevel: employee.permissionLevel,
    actionRisk: opts.actionRisk ?? inferActionRisk(opts.taskTitle),
    previouslyApproved: opts.previouslyApproved,
  });
  completeStep(permStep, permission as unknown as Record<string, unknown>);

  // ─── 3. Budget
  const credits = estimateCredits("standard_task");
  const budgetStep = pushStep("budget_check", { estimatedCredits: credits });
  const budget = checkBudget({
    state: {
      companyAllowance: 10000,
      companyUsed: 1200,
      employeeMonthlyBudget: 2000,
      employeeUsed: 250,
      periodEnd: "2026-07-31",
    },
    estimatedCredits: credits,
  });
  completeStep(budgetStep, budget as unknown as Record<string, unknown>);

  if (!budget.allowed) {
    const failResult: EmployeeRunResult = {
      ok: false,
      agentRunId: "",
      status: "failed",
      output: "",
      evaluator: {
        qualityScore: 0,
        relevanceScore: 0,
        safetyScore: 0,
        confidenceScore: 0,
        passed: false,
        notes: `Budget exceeded: ${budget.reason}`,
      },
      durationMs: Date.now() - start,
      creditsUsed: 0,
      error: budget.reason,
    };
    await writeAudit({
      userId: opts.userId,
      action: "credits_budget_reached",
      actor: "system",
      note: budget.reason,
      metadata: { employeeSlug: employee.slug, credits, budget: budget as unknown as Record<string, unknown> },
    });
    return failResult;
  }

  // ─── 4. Memory retrieval
  const memStep = pushStep("memory_retrieval", { query: opts.taskDescription });
  const memoryHits = retrieveMemoryForTask({
    allItems: MOCK_KNOWLEDGE_BASE_ITEMS,
    department: employee.department,
    query: `${opts.taskTitle}\n${opts.taskDescription}`,
    limit: 6,
  });
  completeStep(memStep, { hitCount: memoryHits.length, hits: memoryHits });

  // ─── 5. Build final system prompt
  const brain = await getBusinessBrain(opts.userId);
  const memoryBlock = formatMemoryForPrompt(memoryHits);

  const basePrompt = employee.systemPrompt;
  const businessContext = brain
    ? `\n\n## Company Context\n- Business: ${DEMO_USER.businessName ?? "Your business"}\n- Type: ${DEMO_USER.businessType ?? "saas"}\n- Voice: ${DEMO_USER.brandVoice ?? "bold"}\n- USP: ${brain.usp ?? "n/a"}\n- Target audience: ${brain.targetKeywords?.join(", ") ?? "n/a"}`
    : "";
  const finalSystemPrompt = `${basePrompt}${businessContext}${memoryBlock}`;

  // ─── 6. Call LLM
  const llmStep = pushStep("llm_call", {
    model: employee.model,
    userMessage: opts.taskDescription,
  });

  let output = "";
  let tokens = { input: 0, output: 0 };
  let modelUsed = employee.model;
  let durationMs = 0;
  let llmOk = true;
  let llmError: string | undefined;

  try {
    const result = await runAgent({
      templateId: employee.id,
      systemPrompt: finalSystemPrompt,
      userMessage: opts.taskDescription,
      model: employee.model,
    });
    output = result.output;
    tokens = result.tokens;
    modelUsed = result.modelUsed;
    durationMs = result.durationMs;
    completeStep(llmStep, { modelUsed, tokens, outputLength: output.length });
  } catch (err) {
    llmOk = false;
    llmError = err instanceof Error ? err.message : String(err);
    failStep(llmStep, err);
  }

  if (!llmOk) {
    const failedResult: EmployeeRunResult = {
      ok: false,
      agentRunId: "",
      status: "failed",
      output: "",
      evaluator: {
        qualityScore: 0,
        relevanceScore: 0,
        safetyScore: 0,
        confidenceScore: 0,
        passed: false,
        notes: llmError ?? "LLM call failed",
      },
      durationMs: Date.now() - start,
      creditsUsed: 0,
      error: llmError,
    };
    await writeAudit({
      userId: opts.userId,
      action: "task_failed",
      actor: "ai",
      note: llmError,
      metadata: { employeeSlug: employee.slug, taskTitle: opts.taskTitle },
    });
    return failedResult;
  }

  // ─── 7. Evaluate
  const evalStep = pushStep("evaluation", { outputLength: output.length });
  let verdict = evaluateOutput({
    output,
    taskDescription: opts.taskDescription,
    employeeRole: employee.role,
    memoryHits,
    previouslyApprovedCount: opts.previouslyApproved ? 1 : 0,
  });

  // ─── 8. Regenerate once if poor quality
  if (!verdict.passed && opts.employeeSlug !== "ceo") {
    completeStep(evalStep, { attempt: 1, passed: false, verdict, regenerateReason: verdict.regenerateReason });
    const regenStep = pushStep("regeneration", { reason: verdict.regenerateReason });
    try {
      const regenResult = await runAgent({
        templateId: employee.id,
        systemPrompt: `${finalSystemPrompt}\n\n## REGENERATION NOTE\nYour previous output did not pass quality checks. Reason: ${verdict.regenerateReason}\nImprove specifically on: specificity, structure, and brand-voice consistency.`,
        userMessage: opts.taskDescription,
        model: employee.model,
      });
      output = regenResult.output;
      tokens.input += regenResult.tokens.input;
      tokens.output += regenResult.tokens.output;
      verdict = evaluateOutput({
        output,
        taskDescription: opts.taskDescription,
        employeeRole: employee.role,
        memoryHits,
        previouslyApprovedCount: opts.previouslyApproved ? 1 : 0,
      });
      completeStep(regenStep, { regenerated: true, newLength: output.length, passed: verdict.passed });
      const evalStep2 = pushStep("evaluation", { attempt: 2 });
      completeStep(evalStep2, { verdict });
    } catch (err) {
      failStep(regenStep, err);
    }
  } else {
    completeStep(evalStep, { attempt: 1, passed: verdict.passed, verdict });
  }

  // ─── 9. Agent Run record
  const agentRunId = `run-${Math.random().toString(36).slice(2, 10)}`;
  const totalCredits = credits;
  const totalDuration = Date.now() - start;

  if (isDemoMode()) {
    MOCK_AGENT_RUNS.push({
      id: agentRunId,
      userId: opts.userId,
      companyId: null,
      hiredAgentId: opts.hiredAgentId ?? null,
      taskId: null,
      goalId: opts.goalId ?? null,
      workReviewItemId: null,
      scheduledWorkId: null,
      employeeSlug: employee.slug,
      employeeName: employee.name,
      department: employee.department,
      modelProvider: "openrouter",
      modelName: modelUsed,
      promptVersion: "v1",
      input: { title: opts.taskTitle, description: opts.taskDescription, ...opts.inputContext },
      memoryUsed: memoryHits.map((h) => ({ source: h.source, title: h.title, snippet: h.snippet })),
      toolsUsed: [],
      output,
      outputStructured: null,
      evaluatorResult: {
        qualityScore: verdict.qualityScore,
        relevanceScore: verdict.relevanceScore,
        safetyScore: verdict.safetyScore,
        confidenceScore: verdict.confidenceScore,
        notes: verdict.notes,
        passed: verdict.passed,
      },
      creditsEstimated: totalCredits,
      creditsActual: totalCredits,
      durationMs: totalDuration,
      status: permission.requiresApproval ? "needs_approval" : "completed",
      errorMessage: null,
      errorStack: null,
      startedAt: new Date(start).toISOString(),
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    MOCK_AGENT_RUN_STEPS.push(
      ...steps.map((s) => ({
        id: `step-${agentRunId}-${s.stepIndex}`,
        agentRunId,
        stepIndex: s.stepIndex,
        stepName: s.stepName,
        startedAt: s.startedAt,
        completedAt: s.completedAt ?? new Date().toISOString(),
        durationMs: s.durationMs,
        input: s.input,
        output: s.output,
        status: s.status,
        errorMessage: s.errorMessage ?? null,
      })),
    );

    // Mark memory items as recently used.
    for (const hit of memoryHits) {
      const item = MOCK_KNOWLEDGE_BASE_ITEMS.find((i) => i.id === hit.id);
      if (item) {
        item.useCount += 1;
        item.lastUsedAt = new Date().toISOString();
      }
    }
  }

  // ─── 10. Work Review item (if approval required)
  let workReviewItemId: string | undefined;
  if (permission.requiresApproval) {
    const kind = opts.kind ?? kindFromEmployee({ slug: employee.slug, role: employee.role });
    const summary = makeSummary(output);
    const item = buildWorkReviewItem({
      userId: opts.userId,
      taskId: null,
      goalId: opts.goalId ?? null,
      departmentGoalId: opts.departmentGoalId ?? null,
      agentRunId,
      hiredAgentId: opts.hiredAgentId ?? null,
      title: opts.taskTitle,
      summary,
      body: output,
      kind,
      priority: opts.priority ?? "normal",
      employeeName: employee.name,
      employeeSlug: employee.slug,
      department: employee.department as Department,
      evaluator: verdict,
      creditsEstimated: totalCredits,
      requiresApproval: true,
      approvalReason: permission.approvalReason ?? "Standard approval gate",
      suggestedNextAction: suggestNextAction({ kind, evaluatorPassed: verdict.passed }),
    });
    workReviewItemId = item.id;
    if (isDemoMode()) {
      MOCK_WORK_REVIEW_ITEMS.push(item);
    }
  }

  // ─── 11. Audit log
  await writeAudit({
    userId: opts.userId,
    action: "task_completed",
    actor: "ai",
    targetType: "task",
    targetId: agentRunId,
    note: `${employee.name} produced output for "${opts.taskTitle}"`,
    metadata: {
      employeeSlug: employee.slug,
      department: employee.department,
      creditsUsed: totalCredits,
      durationMs: totalDuration,
      requiresApproval: permission.requiresApproval,
      qualityScore: verdict.qualityScore,
    },
  });

  // ─── 12. Credit usage
  if (isDemoMode()) {
    MOCK_CREDIT_USAGE_LOG.push({
      id: `cu-${Math.random().toString(36).slice(2, 10)}`,
      userId: opts.userId,
      agentRunId,
      employeeSlug: employee.slug,
      department: employee.department,
      credits: totalCredits,
      purpose: "task_run",
      createdAt: new Date().toISOString(),
    });
  }

  return {
    ok: true,
    agentRunId,
    workReviewItemId,
    status: permission.requiresApproval ? "needs_approval" : "completed",
    output,
    outputStructured: undefined,
    evaluator: verdict,
    durationMs: totalDuration,
    creditsUsed: totalCredits,
  };
}

/** Make a 1-2 sentence summary of an output for the Work Review queue. */
function makeSummary(output: string): string {
  const stripped = output.replace(/^#+\s.*$/gm, "").trim();
  const firstPara = stripped.split(/\n\n/)[0] ?? stripped;
  const sentence = firstPara.split(/(?<=[.!?])\s/)[0] ?? firstPara;
  if (sentence.length <= 240) return sentence;
  return sentence.slice(0, 237) + "...";
}

interface AuditEntry {
  userId: string;
  action: string;
  actor: "user" | "ai" | "system";
  targetType?: string;
  targetId?: string;
  note?: string;
  metadata?: Record<string, unknown>;
}

async function writeAudit(entry: AuditEntry) {
  if (!isDemoMode()) return;
  MOCK_AUDIT_LOGS.push({
    id: `audit-${Math.random().toString(36).slice(2, 10)}`,
    userId: entry.userId,
    actor: entry.actor,
    action: entry.action as never,
    targetType: entry.targetType ?? null,
    targetId: entry.targetId ?? null,
    metadata: entry.metadata ?? {},
    note: entry.note ?? null,
    ipAddress: null,
    createdAt: new Date().toISOString(),
  });
}

/** Convenience: run a CEO plan generation. */
export async function runCeoPlanner(opts: {
  userId: string;
  goalId: string;
  taskTitle: string;
  taskDescription: string;
  goalContext: Record<string, unknown>;
}): Promise<EmployeeRunResult> {
  return runEmployee({
    userId: opts.userId,
    employeeSlug: "ceo",
    taskTitle: opts.taskTitle,
    taskDescription: opts.taskDescription,
    goalId: opts.goalId,
    inputContext: opts.goalContext,
    actionRisk: "draft",
    kind: "plan",
    previouslyApproved: true,
  });
}