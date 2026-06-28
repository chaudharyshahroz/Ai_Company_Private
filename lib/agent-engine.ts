/**
 * Agent execution engine.
 *
 * Wires together:
 *  - brain variable injection into the agent's system prompt
 *  - OpenRouter execution (real or mock)
 *  - task status lifecycle (queued → running → completed/failed)
 *  - delegation handling (when one agent's output triggers another)
 *
 * In demo mode, all of this happens synchronously after a simulated latency.
 * With Inngest wired up, the same `runAgentTask` function gets called from an
 * Inngest job — the engine doesn't care.
 */

import { runAgent } from "./openrouter";
import { getBusinessBrain, getTask } from "./data";
import { MOCK_AGENT_TEMPLATES, MOCK_HIRED_AGENTS, MOCK_TASKS } from "./mock-data";
import type { Task } from "./db/schema";

const BRAIN_VAR_MAP: Record<string, string> = {
  "{{business_name}}": "business_name",
  "{{business_type}}": "business_type",
  "{{brand_voice}}": "brand_voice",
  "{{business_description}}": "business_description",
  "{{target_audience}}": "target_audience",
  "{{usp}}": "usp",
};

/**
 * Resolve {{brain_variables}} inside a system prompt against the user's business brain.
 */
function injectBrainVariables(
  systemPrompt: string,
  brain: Awaited<ReturnType<typeof getBusinessBrain>> | null,
  userProfile: { businessName?: string | null; businessType?: string | null; brandVoice?: string | null },
): string {
  let result = systemPrompt;

  // Map the simple scalar variables
  const scalarMap: Record<string, string> = {
    business_name: userProfile.businessName ?? "your business",
    business_type: userProfile.businessType ?? "saas",
    brand_voice: userProfile.brandVoice ?? "bold, modern",
    business_description: brain?.customContext ?? "",
    target_audience: brain?.targetKeywords?.join(", ") ?? "",
    usp: brain?.usp ?? "",
    products: brain?.products?.map((p) => p.name).join(", ") ?? "",
    competitors: brain?.competitors?.map((c) => c.name).join(", ") ?? "",
    keywords: brain?.targetKeywords?.join(", ") ?? "",
  };

  for (const [token, key] of Object.entries(BRAIN_VAR_MAP)) {
    const value = scalarMap[key];
    if (value) result = result.split(token).join(value);
  }

  // Also handle the {{products}} / {{competitors}} / {{keywords}} direct tokens
  for (const [token, value] of Object.entries(scalarMap)) {
    if (value) result = result.split(`{{${token}}}`).join(value);
  }

  return result;
}

/**
 * Run a task: load agent template + brain, inject variables, call OpenRouter, save output.
 * Updates the task status as it progresses.
 */
export async function runAgentTask(taskId: string): Promise<void> {
  if (isDemoMode()) {
    await runTaskDemo(taskId);
    return;
  }
  // TODO: real DB write path
  await runTaskDemo(taskId);
}

function isDemoMode(): boolean {
  return !process.env.DATABASE_URL;
}

async function runTaskDemo(taskId: string): Promise<void> {
  const task = MOCK_TASKS.find((t) => t.id === taskId);
  if (!task) throw new Error(`Task ${taskId} not found`);

  const hired = MOCK_HIRED_AGENTS.find((a) => a.id === task.hiredAgentId);
  if (!hired) throw new Error(`Hired agent ${task.hiredAgentId} not found`);

  const template = MOCK_AGENT_TEMPLATES.find((t) => t.id === hired.templateId);
  if (!template) throw new Error(`Template ${hired.templateId} not found`);

  const brain = await getBusinessBrain(task.userId);

  const finalSystemPrompt = injectBrainVariables(template.systemPrompt, brain, {
    businessName: "Acme Studios",
    businessType: "saas",
    brandVoice: "bold",
  });

  // Mark running
  task.status = "running";
  task.startedAt = new Date().toISOString();
  task.modelUsed = template.model;

  try {
    const result = await runAgent({
      templateId: template.id,
      systemPrompt: finalSystemPrompt,
      userMessage: task.description ?? task.title,
      model: template.model,
    });

    task.status = "completed";
    task.output = result.output;
    task.outputMetadata = {
      wordCount: Math.ceil(result.output.split(/\s+/).length),
      modelUsed: result.modelUsed,
      tokens: result.tokens,
      durationMs: result.durationMs,
    };
    task.tokensUsed = result.tokens.input + result.tokens.output;
    task.durationMs = result.durationMs;
    task.completedAt = new Date().toISOString();
  } catch (err) {
    task.status = "failed";
    task.errorMessage = err instanceof Error ? err.message : String(err);
    task.completedAt = new Date().toISOString();
  }
}

/**
 * Detect delegation markers in agent output and spawn child tasks.
 * Simple heuristic for v1 — looks for "Delegate to <agent>: <task>" lines.
 */
export function detectDelegations(output: string): Array<{ toAgentSlug: string; task: string }> {
  const lines = output.split("\n");
  const delegations: Array<{ toAgentSlug: string; task: string }> = [];
  for (const line of lines) {
    const m = line.match(/Delegate to (\w[-\w]+):\s*(.+)/i);
    if (m && m[1] && m[2]) {
      delegations.push({ toAgentSlug: m[1].toLowerCase(), task: m[2].trim() });
    }
  }
  return delegations;
}

export { injectBrainVariables };