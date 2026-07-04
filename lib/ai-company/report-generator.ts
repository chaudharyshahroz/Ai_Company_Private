/**
 * Report generator — produces the daily CEO briefing and the weekly CEO report.
 *
 * Daily briefing shape:
 *   - greeting
 *   - top priorities
 *   - wins today
 *   - needs attention (approvals waiting, blocked tasks, etc.)
 *   - risks
 *   - opportunities
 *   - metrics
 *
 * Weekly report adds:
 *   - summary paragraph
 *   - wins / needs attention / opportunities / risks
 *   - recommended next actions
 *   - by-department breakdown
 *   - by-employee breakdown
 *   - company score delta
 *
 * In demo mode, both reports are derived from the in-memory mock store.
 * With a real DB they query `tasks`, `work_review_items`, `agent_runs`,
 * `leads`, `conversations`, and aggregate the metrics.
 */

import type { DailyBriefing, WeeklyReport } from "./types";
import {
  MOCK_TASKS,
  MOCK_WORK_REVIEW_ITEMS,
  MOCK_AGENT_RUNS,
  MOCK_LEADS,
  MOCK_CONVERSATIONS,
  MOCK_KNOWLEDGE_BASE,
  MOCK_TODAY_BRIEFING,
  MOCK_BOARD_REPORTS,
} from "@/lib/mock-data";

const NOW = () => new Date().toISOString();

/** Build today's CEO briefing from current state. */
export function generateDailyBriefing(userId: string): DailyBriefing {
  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const tasksCompletedToday = MOCK_TASKS.filter(
    (t) =>
      t.status === "completed" &&
      t.completedAt &&
      new Date(t.completedAt).toDateString() === today.toDateString(),
  );

  const workApprovedToday = MOCK_WORK_REVIEW_ITEMS.filter(
    (w) => w.approvedAt && new Date(w.approvedAt).toDateString() === today.toDateString(),
  );

  const pendingApprovals = MOCK_WORK_REVIEW_ITEMS.filter(
    (w) => w.status === "needs_approval",
  ).length;

  const leadsCapturedToday = MOCK_LEADS.length; // simplified for demo

  const creditsUsedToday = MOCK_AGENT_RUNS.filter(
    (r) => new Date(r.createdAt).toDateString() === today.toDateString(),
  ).reduce((sum, r) => sum + (r.creditsActual ?? 0), 0);

  return {
    date: dateLabel,
    greeting:
      pendingApprovals > 0
        ? `Good morning. Your AI company produced ${tasksCompletedToday.length} tasks and is waiting on ${pendingApprovals} approval${pendingApprovals === 1 ? "" : "s"}.`
        : `Good morning. Your AI company is humming — ${tasksCompletedToday.length} tasks completed yesterday and ${pendingApprovals} need your attention.`,
    topPriorities: [
      {
        title: pendingApprovals > 0 ? `Review ${pendingApprovals} pending approvals` : "Approve next batch of work",
        why: "Approvals unblock employees from executing their next batch.",
        owner: "You",
        link: "/work-review",
      },
      {
        title: "Check today's content calendar",
        why: "Marketing has 2 posts scheduled for today.",
        owner: "Maya — Marketing Manager",
        link: "/campaigns",
      },
      {
        title: "Follow up on 3 hot leads",
        why: "Sales Closer qualified them yesterday — they need outreach today.",
        owner: "Echo — Outreach Specialist",
        link: "/leads",
      },
    ],
    winsToday: [
      {
        headline: `${tasksCompletedToday.length} tasks completed`,
        metric: `${workApprovedToday.length} work items approved`,
        link: "/work-review",
      },
      {
        headline: `${leadsCapturedToday} active leads in pipeline`,
        link: "/leads",
      },
      {
        headline: `${MOCK_KNOWLEDGE_BASE.length} knowledge items training the team`,
        link: "/knowledge-base",
      },
    ],
    needsAttention: [
      ...(pendingApprovals > 0
        ? [
            {
              headline: `${pendingApprovals} work items awaiting your approval`,
              reason: "Anything older than 48h will start costing morale.",
              link: "/work-review",
            },
          ]
        : []),
      {
        headline: "2 employees near budget cap",
        reason: "Consider raising their monthly credit limits.",
        link: "/employees",
      },
    ],
    pendingApprovals,
    risks: [
      {
        headline: "Competitor launched a similar AI feature this week",
        severity: "medium" as const,
      },
      {
        headline: "Email reply rate dropped 8% last week",
        severity: "low" as const,
      },
    ],
    opportunities: [
      {
        headline: "SEO article ranking #4 for target keyword — push to #1",
        employee: "Sage — SEO/AEO Writer",
        link: "/campaigns",
      },
      {
        headline: "3 warm leads from the launch webinar — schedule calls",
        employee: "Cal — Appointment Setter",
        link: "/leads",
      },
    ],
    metrics: {
      tasksCompletedToday: tasksCompletedToday.length,
      workApprovedToday: workApprovedToday.length,
      leadsCapturedToday,
      creditsUsedToday,
      hoursSavedToday: Math.round(tasksCompletedToday.length * 1.5),
    },
  };
}

/** Build the weekly report — covers the last 7 days. */
export function generateWeeklyReport(userId: string): WeeklyReport {
  const now = new Date();
  const weekEnd = new Date(now);
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - 7);

  const weekTasks = MOCK_TASKS.filter(
    (t) =>
      t.completedAt && new Date(t.completedAt) >= weekStart && new Date(t.completedAt) <= weekEnd,
  );

  const approvedItems = MOCK_WORK_REVIEW_ITEMS.filter(
    (w) => w.approvedAt && new Date(w.approvedAt) >= weekStart,
  );
  const rejectedItems = MOCK_WORK_REVIEW_ITEMS.filter(
    (w) => w.rejectedAt && new Date(w.rejectedAt) >= weekStart,
  );

  const creditsUsed = MOCK_AGENT_RUNS.filter(
    (r) => new Date(r.createdAt) >= weekStart,
  ).reduce((sum, r) => sum + (r.creditsActual ?? 0), 0);

  // By employee
  const byEmployeeMap = new Map<string, { completed: number; approved: number; qualitySum: number; qualityN: number }>();
  for (const r of MOCK_AGENT_RUNS.filter((r) => new Date(r.createdAt) >= weekStart)) {
    const entry = byEmployeeMap.get(r.employeeSlug) ?? { completed: 0, approved: 0, qualitySum: 0, qualityN: 0 };
    entry.completed += 1;
    if (r.evaluatorResult?.qualityScore) {
      entry.qualitySum += r.evaluatorResult.qualityScore;
      entry.qualityN += 1;
    }
    byEmployeeMap.set(r.employeeSlug, entry);
  }
  const byEmployee = Array.from(byEmployeeMap.entries()).map(([slug, v]) => ({
    employeeSlug: slug,
    employeeName: slug.replace(/-/g, " "),
    tasksCompleted: v.completed,
    workApproved: v.approved,
    qualityAvg: v.qualityN > 0 ? Math.round(v.qualitySum / v.qualityN) : 0,
  }));

  // By department — group by the same employee records
  const byDeptMap = new Map<string, { completed: number; performers: Map<string, number> }>();
  for (const r of MOCK_AGENT_RUNS.filter((r) => new Date(r.createdAt) >= weekStart)) {
    const entry = byDeptMap.get(r.department) ?? { completed: 0, performers: new Map() };
    entry.completed += 1;
    entry.performers.set(r.employeeSlug, (entry.performers.get(r.employeeSlug) ?? 0) + 1);
    byDeptMap.set(r.department, entry);
  }
  const byDepartment = Array.from(byDeptMap.entries()).map(([dept, v]) => {
    const topPerformerSlug = Array.from(v.performers.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
    return {
      department: dept,
      tasksCompleted: v.completed,
      topPerformer: topPerformerSlug,
    };
  });

  // Latest board report — if available, use it as a starting point for the summary.
  const latest = MOCK_BOARD_REPORTS[0];

  return {
    weekStart: weekStart.toISOString().slice(0, 10),
    weekEnd: weekEnd.toISOString().slice(0, 10),
    summary:
      latest?.summary ??
      `Your AI company completed ${weekTasks.length} tasks, approved ${approvedItems.length} work items, and used ${creditsUsed} credits this week. Top performers led the charge; one department needs attention.`,
    wins: [
      `${approvedItems.length} work items approved by you`,
      `${weekTasks.length} tasks completed across all departments`,
      `${MOCK_LEADS.length} active leads in pipeline`,
      `${MOCK_CONVERSATIONS.length} customer conversations handled`,
    ],
    needsAttention: [
      rejectedItems.length > 0
        ? `${rejectedItems.length} work items rejected — review patterns`
        : "No rejections this week",
      "Knowledge base coverage at 65% — add product docs and FAQs",
      "Two employees near monthly budget cap",
    ],
    opportunities: [
      "One SEO article ranking #4 — push to #1 with internal links",
      "3 webinar warm leads unconverted",
      "Pricing experiment in market — results in 2 weeks",
    ],
    risks: [
      "Competitor launched a similar AI feature this week",
      "Email reply rate down 8% — refresh subject lines",
      "Support volume trending up 12% — consider FAQ Builder",
    ],
    recommendedNextActions: [
      "Approve all pending Work Review items older than 48h",
      "Have Outreach Employee send the 3 warm webinar leads a follow-up",
      "Schedule a 30-min strategy session with the AI CEO",
      "Add 3 new FAQs to the Knowledge Base this week",
      "Increase budgets for Marketing and Sales employees",
    ],
    metrics: {
      tasksCompleted: weekTasks.length,
      workApproved: approvedItems.length,
      workRejected: rejectedItems.length,
      leadsCaptured: MOCK_LEADS.length,
      conversationsHandled: MOCK_CONVERSATIONS.length,
      contentCreated: weekTasks.filter((t) => {
        const hiredAgent = MOCK_TASKS.find((x) => x.hiredAgentId === t.hiredAgentId);
        return hiredAgent?.description?.toLowerCase().includes("content");
      }).length,
      researchGenerated: 2,
      creditsUsed,
      hoursSaved: Math.round(weekTasks.length * 1.5),
    },
    byDepartment,
    byEmployee,
    companyScoreDelta: 4, // 74 → 78
  };
}

/** Compact list used by the dashboard widget — just the summary. */
export function briefingHeadline(): string {
  return MOCK_TODAY_BRIEFING.summary;
}

export { NOW };