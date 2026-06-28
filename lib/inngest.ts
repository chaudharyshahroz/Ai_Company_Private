/**
 * Inngest (background jobs) stub.
 *
 * Functions: weekly board report + proactive research + delegated task chains.
 * In demo mode, we run synchronously when triggered. With Inngest wired up,
 * these functions become Inngest functions invoked by cron or events.
 */

import { isDemoMode } from "./demo";
import { runAgentTask } from "./agent-engine";

export async function generateWeeklyBoardReport(userId: string): Promise<void> {
  // TODO: real implementation — call CEO agent, gather task stats, build report
  if (isDemoMode()) {
    // eslint-disable-next-line no-console
    console.log(`[inngest:weekly-report] generated for user ${userId} (demo)`);
    return;
  }
}

export async function runProactiveResearch(userId: string): Promise<void> {
  if (isDemoMode()) {
    // eslint-disable-next-line no-console
    console.log(`[inngest:proactive-research] scanned for user ${userId} (demo)`);
    return;
  }
}

export async function delegateAndChain(parentTaskId: string, childAgentSlug: string, childTask: string): Promise<void> {
  // TODO: create child task, link to parent, run via runAgentTask
  if (isDemoMode()) {
    // eslint-disable-next-line no-console
    console.log(`[inngest:delegate] parent=${parentTaskId} → ${childAgentSlug} (demo)`);
    return;
  }
}

// Re-export for convenience
export { runAgentTask };