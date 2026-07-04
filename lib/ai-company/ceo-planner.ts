/**
 * CEO Planner — given a company goal, generates the structured department-by-department
 * task plan that the user approves.
 *
 * Output shape (matches `ceoPlan` jsonb on `company_goals`):
 *   {
 *     rationale: string,
 *     risks: string[],
 *     departmentBreakdown: [
 *       { department, departmentName, reasoning, tasks: [...] }
 *     ]
 *   }
 *
 * In demo mode, plans are deterministic templates based on goal keywords.
 * With a real LLM, this calls `runAgent` with the CEO system prompt + business
 * memory to produce the plan.
 */

import type { CeoPlan, ActionRisk, Department } from "./types";
import { EMPLOYEES, getEmployee } from "@/lib/employees";
import { DEPARTMENTS } from "@/lib/departments";

const PLAN_TEMPLATES: Array<{
  match: (text: string) => boolean;
  build: (goal: { title: string; description?: string }) => CeoPlan;
}> = [
  {
    match: (t) => /lead|outreach|sales|customer.*acquisition/i.test(t),
    build: (g) => ({
      rationale:
        `To "${g.title}", we need a coordinated motion: research → outreach → qualification → conversion. ` +
        `Sales, Marketing, and Research must work in parallel for the first 7 days, then Sales takes over for the remainder. ` +
        `Success metric: weekly qualified-lead count trending toward the monthly target.`,
      risks: [
        "Lead list quality drives everything downstream — invest in research depth.",
        "Outreach volume vs reply rate — calibrate daily.",
        "Calendar booking depends on offer + pricing clarity.",
      ],
      departmentBreakdown: [
        {
          department: "research" as Department,
          departmentName: "Research",
          reasoning: "Identify ideal customer profile and competitor positioning before any outreach.",
          tasks: [
            {
              title: "Build target lead list (200 prospects)",
              objective: "Generate a high-quality list of 200 leads matching the ICP, with name, role, company, email, and a personalization hook for each.",
              suggestedEmployeeSlug: "lead-researcher",
              suggestedSkill: "Lead generation",
              estimatedCredits: 120,
              requiresApproval: false,
              scheduledWithinDays: 2,
              riskLevel: "draft" as ActionRisk,
            },
            {
              title: "Competitor scan — top 5 in niche",
              objective: "Identify top 5 competitors and surface their positioning weaknesses and pricing gaps.",
              suggestedEmployeeSlug: "competitor-researcher",
              suggestedSkill: "Competitor analysis",
              estimatedCredits: 80,
              requiresApproval: false,
              scheduledWithinDays: 3,
              riskLevel: "draft" as ActionRisk,
            },
          ],
        },
        {
          department: "marketing" as Department,
          departmentName: "Marketing",
          reasoning: "Create the content and ad angles that will be used to warm the leads before outreach.",
          tasks: [
            {
              title: "Write 10 social posts aligned to lead topic",
              objective: "Build authority on the lead's pain point before outreach hits their inbox.",
              suggestedEmployeeSlug: "content-writer",
              suggestedSkill: "Long-form",
              estimatedCredits: 100,
              requiresApproval: true,
              scheduledWithinDays: 5,
              riskLevel: "draft" as ActionRisk,
            },
            {
              title: "Generate 3 ad campaign angles",
              objective: "Create paid angles for testing once the waitlist lands.",
              suggestedEmployeeSlug: "ad-copywriter",
              suggestedSkill: "Ads",
              estimatedCredits: 60,
              requiresApproval: true,
              scheduledWithinDays: 7,
              riskLevel: "external" as ActionRisk,
            },
          ],
        },
        {
          department: "sales" as Department,
          departmentName: "Sales",
          reasoning: "Outreach + qualification is the execution layer that converts research into pipeline.",
          tasks: [
            {
              title: "Write 5 cold email variations",
              objective: "5 distinct angles (pain-led, story-led, social-proof-led, contrarian, case-study).",
              suggestedEmployeeSlug: "outreach-employee",
              suggestedSkill: "Cold email",
              estimatedCredits: 80,
              requiresApproval: true,
              scheduledWithinDays: 3,
              riskLevel: "external" as ActionRisk,
            },
            {
              title: "Build follow-up sequence (5 steps)",
              objective: "Day 3 / 7 / 14 / 21 / 28 follow-ups with different angles.",
              suggestedEmployeeSlug: "outreach-employee",
              suggestedSkill: "Sequences",
              estimatedCredits: 60,
              requiresApproval: true,
              scheduledWithinDays: 4,
              riskLevel: "external" as ActionRisk,
            },
            {
              title: "Write discovery questions + qualification form",
              objective: "Use BANT-style questions so Sales Closer can route qualified leads to booking.",
              suggestedEmployeeSlug: "appointment-setter",
              suggestedSkill: "Qualification",
              estimatedCredits: 40,
              requiresApproval: false,
              scheduledWithinDays: 5,
              riskLevel: "draft" as ActionRisk,
            },
          ],
        },
      ],
    }),
  },
  {
    match: (t) => /content|blog|social|seo|traffic/i.test(t),
    build: (g) => ({
      rationale:
        `Content velocity is the engine for "${g.title}". Marketing Manager plans the editorial arc, ` +
        `Content Writer produces, SEO/AEO Writer optimizes for AI-search visibility, and Social Media Manager repackages for distribution.`,
      risks: [
        "Quality drops when volume goes up — strict QA on every piece.",
        "Brand-voice drift across many channels — pin examples before scaling.",
      ],
      departmentBreakdown: [
        {
          department: "marketing" as Department,
          departmentName: "Marketing",
          reasoning: "Owns the editorial calendar and brand voice across every channel.",
          tasks: [
            {
              title: "Plan 7-day content calendar",
              objective: "Pick 7 topics tied to the business mission. One per day, varied format.",
              suggestedEmployeeSlug: "marketing-manager",
              suggestedSkill: "Campaign planning",
              estimatedCredits: 40,
              requiresApproval: true,
              scheduledWithinDays: 1,
              riskLevel: "draft" as ActionRisk,
            },
            {
              title: "Write 7 blog posts (one per day)",
              objective: "Long-form, 800-1500 words each, brand-voice consistent.",
              suggestedEmployeeSlug: "content-writer",
              suggestedSkill: "Long-form",
              estimatedCredits: 200,
              requiresApproval: true,
              scheduledWithinDays: 7,
              riskLevel: "draft" as ActionRisk,
            },
            {
              title: "Repurpose each post into 3 social captions",
              objective: "LinkedIn / Twitter / Instagram versions, each with its own hook.",
              suggestedEmployeeSlug: "social-media-manager",
              suggestedSkill: "Captions",
              estimatedCredits: 120,
              requiresApproval: true,
              scheduledWithinDays: 7,
              riskLevel: "external" as ActionRisk,
            },
            {
              title: "SEO optimization pass on all 7 posts",
              objective: "Keyword targeting, internal links, schema, AEO-ready Q&A blocks.",
              suggestedEmployeeSlug: "seo-aeo-writer",
              suggestedSkill: "SEO",
              estimatedCredits: 60,
              requiresApproval: false,
              scheduledWithinDays: 7,
              riskLevel: "draft" as ActionRisk,
            },
          ],
        },
      ],
    }),
  },
  {
    match: (t) => /research|competitor|market|trend/i.test(t),
    build: (g) => ({
      rationale:
        `Research is the foundation of "${g.title}". We need a comprehensive landscape read before any execution.`,
      risks: [
        "Research depth matters more than breadth — pick 3-5 competitors deeply, not 50 shallowly.",
        "Source citations are required for everything — no claims without evidence.",
      ],
      departmentBreakdown: [
        {
          department: "research" as Department,
          departmentName: "Research",
          reasoning: "Build the evidence base that informs the strategy.",
          tasks: [
            {
              title: "Deep competitor analysis (top 5)",
              objective: "Pricing, features, positioning, weaknesses, recent moves.",
              suggestedEmployeeSlug: "competitor-researcher",
              suggestedSkill: "Competitor analysis",
              estimatedCredits: 100,
              requiresApproval: false,
              scheduledWithinDays: 3,
              riskLevel: "draft" as ActionRisk,
            },
            {
              title: "Market trend scan",
              objective: "Identify 3-5 emerging trends relevant to the business.",
              suggestedEmployeeSlug: "trend-finder",
              suggestedSkill: "Trends",
              estimatedCredits: 60,
              requiresApproval: false,
              scheduledWithinDays: 3,
              riskLevel: "draft" as ActionRisk,
            },
            {
              title: "Synthesize opportunities brief",
              objective: "Distill all findings into a 1-page opportunity brief for CEO.",
              suggestedEmployeeSlug: "research-manager",
              suggestedSkill: "QA",
              estimatedCredits: 80,
              requiresApproval: true,
              scheduledWithinDays: 5,
              riskLevel: "draft" as ActionRisk,
            },
          ],
        },
      ],
    }),
  },
  {
    match: (t) => /support|customer.*success|retention|churn/i.test(t),
    build: (g) => ({
      rationale:
        `Customer support reliability and retention underpins "${g.title}". Knowledge base + smart replies + feedback loops.`,
      risks: [
        "Outdated knowledge base produces bad replies — schedule weekly KB review.",
        "Auto-replies can erode trust if tone drifts — pin brand voice in every prompt.",
      ],
      departmentBreakdown: [
        {
          department: "support" as Department,
          departmentName: "Customer Support",
          reasoning: "Owns the response quality and ticket triage.",
          tasks: [
            {
              title: "Audit current knowledge base for gaps",
              objective: "Identify the top 10 questions customers ask that the KB does not answer.",
              suggestedEmployeeSlug: "faq-builder",
              suggestedSkill: "Gap analysis",
              estimatedCredits: 50,
              requiresApproval: false,
              scheduledWithinDays: 2,
              riskLevel: "draft" as ActionRisk,
            },
            {
              title: "Draft FAQ entries for top 10 gaps",
              objective: "Brand-voice-matched, with sources from docs.",
              suggestedEmployeeSlug: "faq-builder",
              suggestedSkill: "FAQ writing",
              estimatedCredits: 80,
              requiresApproval: true,
              scheduledWithinDays: 4,
              riskLevel: "draft" as ActionRisk,
            },
            {
              title: "Review last 20 conversations for feedback patterns",
              objective: "Sentiment + pain points → product feedback doc.",
              suggestedEmployeeSlug: "feedback-analyst",
              suggestedSkill: "Pain points",
              estimatedCredits: 60,
              requiresApproval: true,
              scheduledWithinDays: 5,
              riskLevel: "draft" as ActionRisk,
            },
          ],
        },
      ],
    }),
  },
];

const DEFAULT_PLAN: CeoPlan = {
  rationale:
    "We will execute this goal in three waves: research → execution → optimization. Each department has a clear role and the goal progress will update as tasks complete.",
  risks: [
    "Scope creep — keep the original goal in view.",
    "Approval delays on external actions — pre-approve recurring safe sends.",
  ],
  departmentBreakdown: [
    {
      department: "research" as Department,
      departmentName: "Research",
      reasoning: "Establish facts and context first.",
      tasks: [
        {
          title: "Research landscape",
          objective: "Map the current state of the goal area.",
          suggestedEmployeeSlug: "market-researcher",
          suggestedSkill: "Trends",
          estimatedCredits: 60,
          requiresApproval: false,
          scheduledWithinDays: 2,
          riskLevel: "draft" as ActionRisk,
        },
      ],
    },
    {
      department: "marketing" as Department,
      departmentName: "Marketing",
      reasoning: "Build the messaging and assets that drive the goal.",
      tasks: [
        {
          title: "Draft core messaging",
          objective: "Translate the research into messaging that resonates.",
          suggestedEmployeeSlug: "content-writer",
          suggestedSkill: "Long-form",
          estimatedCredits: 80,
          requiresApproval: true,
          scheduledWithinDays: 4,
          riskLevel: "draft" as ActionRisk,
        },
      ],
    },
  ],
};

export interface PlanGoalInput {
  title: string;
  description?: string;
  successMetric?: string;
  successTarget?: string;
  businessType?: string;
}

/**
 * Generate a CEO plan for a goal.
 * In demo mode: matches against known patterns.
 * In real mode: would call the LLM with the CEO system prompt + business memory.
 */
export function generateCeoPlan(input: PlanGoalInput): CeoPlan {
  const text = `${input.title} ${input.description ?? ""}`;

  for (const template of PLAN_TEMPLATES) {
    if (template.match(text)) {
      return template.build({ title: input.title, description: input.description });
    }
  }
  return DEFAULT_PLAN;
}

/** After user approves a plan, materialize it into the schema-friendly format. */
export function planToStoredShape(plan: CeoPlan) {
  return {
    rationale: plan.rationale,
    risks: plan.risks,
    departmentBreakdown: plan.departmentBreakdown.map((d) => ({
      department: d.department,
      tasks: d.tasks.map((t) => ({
        title: t.title,
        objective: t.objective,
        suggestedEmployeeSlug: t.suggestedEmployeeSlug,
        suggestedSkill: t.suggestedSkill,
        estimatedCredits: t.estimatedCredits,
        requiresApproval: t.requiresApproval,
        scheduledWithinDays: t.scheduledWithinDays,
      })),
    })),
  };
}

/** Get department display info from a slug. */
export function departmentName(slug: string): string {
  const dept = DEPARTMENTS.find((d) => d.slug === slug);
  return dept?.name ?? slug;
}

/** Get the employee suggested by slug — falls back to a generic department employee. */
export function pickEmployeeForTask(opts: {
  suggestedEmployeeSlug: string;
  department: string;
}) {
  const direct = getEmployee(opts.suggestedEmployeeSlug);
  if (direct) return direct;
  // Fallback: first employee in the department
  const deptEmps = EMPLOYEES.filter((e) => e.department === opts.department);
  return deptEmps[0] ?? null;
}