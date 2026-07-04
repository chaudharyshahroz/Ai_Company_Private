/**
 * In-memory mock data store used when DATABASE_URL is not set.
 * Provides realistic seed data so every page renders meaningfully out-of-the-box.
 *
 * When you connect a real database, this module is bypassed — `lib/db` takes over.
 */

import type {
  AgentTemplate,
  HiredAgent,
  Task,
  Notification,
  BoardReport,
  BusinessBrain,
  BusinessDna,
  BusinessScore,
  Offer,
  GrowthRoadmap,
  WeeklyTask,
  KnowledgeBaseItem,
  WorkReviewItem,
  CompanyMission,
  CompanyGoal,
  DepartmentGoal,
  AgentRun,
  AgentRunStep,
  ScheduledWork,
  CreditBalance,
  CreditUsageLog,
  AuditLog,
} from "@/lib/db/schema";
import { DEMO_USER } from "@/lib/demo";

// ─── Agent Templates (8 built-in agents) ─────────────────────

export const MOCK_AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    slug: "ceo-agent",
    name: "Atlas — CEO Agent",
    role: "Chief Executive",
    department: "executive",
    tier: "executive",
    avatarEmoji: "🎯",
    avatarColor: "from-primary to-accent-warm",
    description:
      "Sets weekly priorities, delegates to your team, and reports back on what's moving the needle.",
    capabilities: [
      "Weekly priority setting",
      "Strategic delegation",
      "KPI tracking",
      "Executive summaries",
    ],
    systemPrompt:
      "You are Atlas, the CEO of {{business_name}}. Every Monday morning, review what was done last week, decide the top 5 priorities for this week, and delegate specific tasks to your team.",
    model: "anthropic/claude-3.5-sonnet",
    isActive: true,
    isFeatured: true,
    monthlyPriceUsd: "99.00",
    sortOrder: 1,
    createdAt: "2025-08-01T00:00:00Z",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    slug: "cmo-agent",
    name: "Maya — CMO Agent",
    role: "Chief Marketing",
    department: "marketing",
    tier: "executive",
    avatarEmoji: "📣",
    avatarColor: "from-accent-warm to-primary",
    description:
      "Plans campaigns, briefs your marketing team, and owns the brand voice across every channel.",
    capabilities: [
      "Campaign planning",
      "Brand voice enforcement",
      "Channel strategy",
      "Content briefs",
    ],
    systemPrompt:
      "You are Maya, the CMO of {{business_name}}. Plan campaigns, brief writers, and ensure every piece of content matches the brand voice: {{brand_voice}}.",
    model: "anthropic/claude-3.5-sonnet",
    isActive: true,
    isFeatured: true,
    monthlyPriceUsd: "79.00",
    sortOrder: 2,
    createdAt: "2025-08-01T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    slug: "content-writer",
    name: "Aria — Content Writer",
    role: "Content Writer",
    department: "marketing",
    tier: "employee",
    avatarEmoji: "✍️",
    avatarColor: "from-primary-light to-primary",
    description:
      "Writes blogs, emails, social posts, ad copy. Adopts your brand voice after one example.",
    capabilities: [
      "Long-form blog posts",
      "Email sequences",
      "Social media copy",
      "Ad creative",
    ],
    systemPrompt:
      "You are Aria, the content writer for {{business_name}}. Write in this voice: {{brand_voice}}. Always reference products: {{products}}.",
    model: "anthropic/claude-3.5-sonnet",
    isActive: true,
    isFeatured: true,
    monthlyPriceUsd: "49.00",
    sortOrder: 3,
    createdAt: "2025-08-01T00:00:00Z",
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    slug: "research-analyst",
    name: "Nova — Research Analyst",
    role: "Research Analyst",
    department: "research",
    tier: "employee",
    avatarEmoji: "🔍",
    avatarColor: "from-accent to-primary",
    description:
      "Digs into competitors, market trends, and customer voices. Surfaces the insights you missed.",
    capabilities: [
      "Competitor analysis",
      "Market trend reports",
      "Customer research",
      "Keyword research",
    ],
    systemPrompt:
      "You are Nova, the research analyst for {{business_name}}. Find insights about: {{competitors}} and trends in: {{keywords}}.",
    model: "anthropic/claude-3.5-sonnet",
    isActive: true,
    isFeatured: true,
    monthlyPriceUsd: "59.00",
    sortOrder: 4,
    createdAt: "2025-08-01T00:00:00Z",
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    slug: "sales-agent",
    name: "Hunter — Sales Agent",
    role: "Sales Development",
    department: "sales",
    tier: "employee",
    avatarEmoji: "💼",
    avatarColor: "from-accent-warm to-accent",
    description:
      "Drafts outreach, follow-ups, and personalized sequences that don't feel like templates.",
    capabilities: [
      "Cold outreach",
      "Follow-up sequences",
      "Lead qualification",
      "CRM hygiene",
    ],
    systemPrompt:
      "You are Hunter, the sales agent for {{business_name}}. Target: {{target_audience}}. Sell: {{products}}.",
    model: "openai/gpt-4o-mini",
    isActive: true,
    isFeatured: true,
    monthlyPriceUsd: "69.00",
    sortOrder: 5,
    createdAt: "2025-08-01T00:00:00Z",
  },
  {
    id: "66666666-6666-6666-6666-666666666666",
    slug: "support-agent",
    name: "Riley — Support Agent",
    role: "Customer Support",
    department: "support",
    tier: "employee",
    avatarEmoji: "💬",
    avatarColor: "from-primary to-accent",
    description:
      "Handles tickets, drafts FAQs, and escalates the right issues to humans.",
    capabilities: [
      "Ticket triage",
      "FAQ drafting",
      "Tone-matched replies",
      "Escalation routing",
    ],
    systemPrompt:
      "You are Riley, the support agent for {{business_name}}. Reply in this voice: {{brand_voice}}. Know the products: {{products}}.",
    model: "openai/gpt-4o-mini",
    isActive: true,
    isFeatured: true,
    monthlyPriceUsd: "39.00",
    sortOrder: 6,
    createdAt: "2025-08-01T00:00:00Z",
  },
  {
    id: "77777777-7777-7777-7777-777777777777",
    slug: "cfo-agent",
    name: "Sterling — CFO Agent",
    role: "Chief Financial",
    department: "finance",
    tier: "executive",
    avatarEmoji: "💰",
    avatarColor: "from-accent to-accent-warm",
    description:
      "Tracks budgets, forecasts cash, and turns raw numbers into board-ready summaries.",
    capabilities: [
      "Budget tracking",
      "Cash flow forecasts",
      "Financial summaries",
      "Unit economics",
    ],
    systemPrompt:
      "You are Sterling, the CFO of {{business_name}}. Translate numbers into decisions.",
    model: "anthropic/claude-3.5-sonnet",
    isActive: true,
    isFeatured: false,
    monthlyPriceUsd: "89.00",
    sortOrder: 7,
    createdAt: "2025-08-01T00:00:00Z",
  },
  {
    id: "88888888-8888-8888-8888-888888888888",
    slug: "hr-agent",
    name: "Quinn — HR Agent",
    role: "People Operations",
    department: "operations",
    tier: "manager",
    avatarEmoji: "🤝",
    avatarColor: "from-primary-light to-accent",
    description:
      "Drafts job descriptions, onboarding docs, and policy updates. Your first HR hire, in code.",
    capabilities: [
      "Job descriptions",
      "Onboarding flows",
      "Policy drafting",
      "Performance review templates",
    ],
    systemPrompt:
      "You are Quinn, the HR lead at {{business_name}}. Write for the culture of: {{business_description}}.",
    model: "openai/gpt-4o-mini",
    isActive: true,
    isFeatured: false,
    monthlyPriceUsd: "49.00",
    sortOrder: 8,
    createdAt: "2025-08-01T00:00:00Z",
  },
];

// ─── Hired agents (what the demo user has on their team) ────

export const MOCK_HIRED_AGENTS: HiredAgent[] = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    userId: DEMO_USER.id,
    templateId: "11111111-1111-1111-1111-111111111111",
    customName: null,
    customInstructions: null,
    isActive: true,
    hiredAt: "2025-09-15T10:00:00Z",
    lastActiveAt: "2026-06-23T08:00:00Z",
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    userId: DEMO_USER.id,
    templateId: "33333333-3333-3333-3333-333333333333",
    customName: null,
    customInstructions: "Always lead with a strong hook. Keep paragraphs under 3 lines.",
    isActive: true,
    hiredAt: "2025-09-15T10:05:00Z",
    lastActiveAt: "2026-06-23T11:32:00Z",
  },
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    userId: DEMO_USER.id,
    templateId: "44444444-4444-4444-4444-444444444444",
    customName: "Nova (growth focus)",
    customInstructions: "Prioritize signals relevant to product-led growth.",
    isActive: true,
    hiredAt: "2025-09-15T10:10:00Z",
    lastActiveAt: "2026-06-22T16:45:00Z",
  },
  {
    id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
    userId: DEMO_USER.id,
    templateId: "55555555-5555-5555-5555-555555555555",
    customName: null,
    customInstructions: null,
    isActive: true,
    hiredAt: "2025-09-20T14:00:00Z",
    lastActiveAt: "2026-06-23T09:15:00Z",
  },
  {
    id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
    userId: DEMO_USER.id,
    templateId: "66666666-6666-6666-6666-666666666666",
    customName: null,
    customInstructions: null,
    isActive: true,
    hiredAt: "2025-09-25T09:00:00Z",
    lastActiveAt: "2026-06-23T13:00:00Z",
  },
];

// ─── Tasks (recent activity feed) ────────────────────────────

const now = new Date("2026-06-23T14:00:00Z");
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60_000).toISOString();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3_600_000).toISOString();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000).toISOString();

export const MOCK_TASKS: Task[] = [
  {
    id: "t-001",
    userId: DEMO_USER.id,
    hiredAgentId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    title: "LinkedIn post: Q2 product launch",
    description: "Write a LinkedIn post announcing our Q2 launch for SaaS founders.",
    status: "completed",
    priority: "high",
    input: { tone: "bold", length: "150 words" },
    output: `Most "product launches" die in a Notion doc.

Here's what we did differently with our Q2 launch:

→ Wrote the landing page copy first, not the product
→ Recorded a 90s Loom instead of a Notion spec
→ Sent it to 30 people we'd talked to in the last 90 days
→ Built the waitlist before the feature was done

Result: 412 signups before launch day. The product was the smallest part.

If you're a solo founder about to launch, stop building and start telling.

#buildinpublic #saas #productlaunch`,
    outputMetadata: { wordCount: 92, modelUsed: "anthropic/claude-3.5-sonnet", tokens: { input: 240, output: 145 } },
    modelUsed: "anthropic/claude-3.5-sonnet",
    tokensUsed: 385,
    errorMessage: null,
    durationMs: 4200,
    scheduledAt: null,
    startedAt: hoursAgo(2),
    completedAt: hoursAgo(2),
    createdAt: hoursAgo(2),
  },
  {
    id: "t-002",
    userId: DEMO_USER.id,
    hiredAgentId: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    title: "Competitor scan: 3 closest competitors",
    description: "Find what our top 3 competitors shipped this month.",
    status: "completed",
    priority: "normal",
    input: { competitors: ["Linear", "Notion", "ClickUp"] },
    output: `## Competitor Brief — Last 30 Days

### 1. Linear (linear.app)
- **Shipped:** Native GitHub issue sync + AI triage suggestions in Inbox
- **Pricing:** Held flat — still free for up to 10 members
- **Risk:** Their AI moves are early, but the experience is polished. We're 6 months behind here.

### 2. Notion (notion.so)
- **Shipped:** Notion Mail (yes, an email client) + AI meeting notes in beta
- **Pricing:** Added a $10/mo "Notion Mail" tier
- **Risk:** They're moving upmarket into adjacent products. Doesn't compete directly today.

### 3. ClickUp (clickup.com)
- **Shipped:** ClickUp Brain 2.0 — extensive marketing push, free for paid users
- **Pricing:** Brain 2.0 included on all paid plans (no add-on)
- **Risk:** They're going hard on AI-everywhere. Their pitch is messy but the volume is real.

### Opportunities for Acme
1. **"Linear-quality" AI positioning** — the market is dividing between polished-but-narrow vs wide-and-mediocre. We're naturally the former.
2. **Solo founder messaging** — neither Linear nor ClickUp really speaks to solo founders. We do.
3. **Integration depth over breadth** — ClickUp is going wide. We should go deep on 5 integrations.`,
    outputMetadata: { wordCount: 245, modelUsed: "anthropic/claude-3.5-sonnet", tokens: { input: 180, output: 420 } },
    modelUsed: "anthropic/claude-3.5-sonnet",
    tokensUsed: 600,
    errorMessage: null,
    durationMs: 8400,
    scheduledAt: null,
    startedAt: hoursAgo(5),
    completedAt: hoursAgo(5),
    createdAt: hoursAgo(5),
  },
  {
    id: "t-003",
    userId: DEMO_USER.id,
    hiredAgentId: "dddddddd-dddd-dddd-dddd-dddddddddddd",
    title: "Outreach: 12 SaaS founders in our ICP",
    description: "Draft personalized cold emails to 12 SaaS founders who recently raised seed rounds.",
    status: "running",
    priority: "high",
    input: { count: 12, icp: "SaaS founders, seed stage, $50k-$500k ARR" },
    output: null,
    outputMetadata: null,
    modelUsed: "openai/gpt-4o-mini",
    tokensUsed: null,
    errorMessage: null,
    durationMs: null,
    scheduledAt: null,
    startedAt: minutesAgo(3),
    completedAt: null,
    createdAt: minutesAgo(3),
  },
  {
    id: "t-004",
    userId: DEMO_USER.id,
    hiredAgentId: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
    title: "Weekly support ticket digest",
    description: "Summarize last week's customer support tickets and flag escalation candidates.",
    status: "queued",
    priority: "normal",
    input: null,
    output: null,
    outputMetadata: null,
    modelUsed: null,
    tokensUsed: null,
    errorMessage: null,
    durationMs: null,
    scheduledAt: null,
    startedAt: null,
    completedAt: null,
    createdAt: minutesAgo(15),
  },
  {
    id: "t-005",
    userId: DEMO_USER.id,
    hiredAgentId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    title: "Set this week's priorities",
    description: "Review last week's tasks and choose top 5 priorities for the week.",
    status: "completed",
    priority: "urgent",
    input: null,
    output: `## This Week at Acme Studios

Based on what moved last week and the signals from our research team, here are your 5 priorities:

1. **Ship the waitlist email sequence** — Aria's launch post converted well; let's keep that momentum.
2. **Double down on solo founder messaging** — Nova's competitor scan shows nobody owns this. We can.
3. **Hunter: send 50 personalized outreach emails** — not 12. Make it a real motion.
4. **Riley: rewrite the top 5 help docs** — support tickets show the same 5 questions. Solve them in docs.
5. **You: 3 customer calls** — no agents can replace the founder listening. Block 90 minutes.

### Why these
Linear is closing the AI-quality gap. Notion is going wide. ClickUp is noisy. Our edge is depth + voice + solo-founder focus. This week makes that real.`,
    outputMetadata: { wordCount: 168, modelUsed: "anthropic/claude-3.5-sonnet", tokens: { input: 320, output: 280 } },
    modelUsed: "anthropic/claude-3.5-sonnet",
    tokensUsed: 600,
    errorMessage: null,
    durationMs: 6800,
    scheduledAt: null,
    startedAt: daysAgo(3),
    completedAt: daysAgo(3),
    createdAt: daysAgo(3),
  },
  {
    id: "t-006",
    userId: DEMO_USER.id,
    hiredAgentId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    title: "Email sequence: 5-part onboarding for new signups",
    description: "Write a 5-part onboarding email sequence for new signups.",
    status: "completed",
    priority: "normal",
    input: null,
    output: `### Email 1: Welcome (immediate)
Subject: You're in. Here's what to do first.

Hey {{first_name}},

Welcome to Acme. Three things to do in your first 10 minutes:

1. Connect your existing tool stack
2. Hire your first AI agent (we recommend starting with Aria, our content writer)
3. Give Aria one task — anything you were going to write this week

That's it. The fastest path to "aha" is to give your first agent real work.

— The Acme team

---

### Email 2: Day 2
Subject: How to brief an agent like a senior hire

Most first-time users give agents vague tasks. "Write me a blog post." Vague in, vague out.

Better: "Write a 600-word blog post for SaaS founders about why we launched our waitlist before our product. Match the voice of [paste 2 sample paragraphs]. Lead with the contrarian take, not the obvious one."

Agents are senior hires who work for free. Brief them like one.

…`,
    outputMetadata: { wordCount: 188, modelUsed: "anthropic/claude-3.5-sonnet", tokens: { input: 210, output: 320 } },
    modelUsed: "anthropic/claude-3.5-sonnet",
    tokensUsed: 530,
    errorMessage: null,
    durationMs: 5800,
    scheduledAt: null,
    startedAt: daysAgo(1),
    completedAt: daysAgo(1),
    createdAt: daysAgo(1),
  },
];

// ─── Notifications ──────────────────────────────────────────

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n-001",
    userId: DEMO_USER.id,
    type: "task_complete",
    title: "Aria finished a task",
    message: 'LinkedIn post: Q2 product launch — 92 words, 4.2s.',
    isRead: false,
    actionUrl: "/dashboard/tasks",
    createdAt: hoursAgo(2),
  },
  {
    id: "n-002",
    userId: DEMO_USER.id,
    type: "agent_alert",
    title: "Competitor moved",
    message: "Linear shipped native GitHub issue sync — relevant to your AI triage roadmap.",
    isRead: false,
    actionUrl: "/dashboard/tasks",
    createdAt: hoursAgo(5),
  },
  {
    id: "n-003",
    userId: DEMO_USER.id,
    type: "board_report",
    title: "Your weekly board report is ready",
    message: "142 tasks completed this week. 3 strategic recommendations inside.",
    isRead: true,
    actionUrl: "/dashboard/reports",
    createdAt: daysAgo(2),
  },
  {
    id: "n-004",
    userId: DEMO_USER.id,
    type: "task_failed",
    title: "Task failed: customer research API",
    message: "Hunter's enrichment task hit a rate limit. Retry queued.",
    isRead: true,
    actionUrl: "/dashboard/tasks",
    createdAt: daysAgo(3),
  },
  {
    id: "n-005",
    userId: DEMO_USER.id,
    type: "system",
    title: "New agents available in the marketplace",
    message: "Try Sterling (CFO) and Quinn (HR) — both added this week.",
    isRead: true,
    actionUrl: "/dashboard/team",
    createdAt: daysAgo(5),
  },
];

// ─── Weekly board report ────────────────────────────────────

export const MOCK_BOARD_REPORTS: BoardReport[] = [
  {
    id: "br-current",
    userId: DEMO_USER.id,
    weekStart: daysAgo(7).slice(0, 10),
    weekEnd: daysAgo(1).slice(0, 10),
    summary:
      "Strong week. 142 tasks completed (up 28% vs last week), the Q2 launch post became your top-performing LinkedIn content, and the competitor scan revealed a clear positioning opening around solo founders. Sales outreach opened 47 conversations. Next week's biggest lever: ship the onboarding email sequence Aria drafted.",
    tasksCompleted: 142,
    tasksFailed: 4,
    topOutputs: ["t-005", "t-001", "t-002"],
    agentPerformance: {
      "Atlas — CEO Agent": { completed: 12, failed: 0, avgDurationMs: 5800 },
      "Maya — CMO Agent": { completed: 18, failed: 0, avgDurationMs: 4600 },
      "Aria — Content Writer": { completed: 41, failed: 1, avgDurationMs: 4400 },
      "Nova — Research Analyst": { completed: 22, failed: 0, avgDurationMs: 7200 },
      "Hunter — Sales Agent": { completed: 38, failed: 2, avgDurationMs: 6800 },
      "Riley — Support Agent": { completed: 11, failed: 1, avgDurationMs: 3100 },
    },
    recommendations: [
      "Ship Aria's onboarding email sequence — it's already written and waiting.",
      "Move from 12 outreach emails/week to 50. The motion is working.",
      "Add Sterling (CFO) — your unit economics are about to matter.",
      "Consider raising prices — your top customers are asking for more, not less.",
    ],
    status: "ready",
    sentAt: daysAgo(1),
    createdAt: daysAgo(2),
  },
];

// ─── Business brain ─────────────────────────────────────────

export const MOCK_BUSINESS_BRAIN: BusinessBrain = {
  id: "bb-001",
  userId: DEMO_USER.id,
  products: [
    {
      name: "Reklu Starter",
      description: "3 AI agents, 500 tasks/month. For solo founders testing the waters.",
      price: "$29/mo",
      url: "https://reklu.app/pricing#starter",
    },
    {
      name: "Reklu Growth",
      description: "8 AI agents, unlimited tasks, weekly board reports.",
      price: "$79/mo",
      url: "https://reklu.app/pricing#growth",
    },
    {
      name: "Reklu Company",
      description: "Unlimited everything, custom agents, dedicated onboarding.",
      price: "$149/mo",
      url: "https://reklu.app/pricing#company",
    },
  ],
  competitors: [
    { name: "Linear", url: "linear.app", notes: "Polished but narrow; doesn't target solo founders." },
    { name: "Notion AI", url: "notion.so/product/ai", notes: "Wide product surface; AI is bolted on." },
    { name: "ClickUp Brain", url: "clickup.com", notes: "AI-everywhere positioning; noisy marketing." },
  ],
  targetKeywords: [
    "AI agents for founders",
    "AI employees",
    "AI company",
    "AI workforce",
    "solo founder tools",
    "indie hacker AI",
  ],
  usp:
    "We're the only AI company platform that briefs and remembers — your agents learn your business over time and work as a coordinated team, not isolated chatbots.",
  toneExamples: [
    "Most AI tools give you a chatbot. We give you a team.",
    "Stop running your business alone. Hire your first agent in 5 minutes.",
    "AI employees that actually know your business.",
  ],
  keyMilestones: [
    { date: "2025-09-01", event: "Founded Reklu in stealth" },
    { date: "2025-12-15", event: "Closed beta with 142 founders" },
    { date: "2026-03-01", event: "Public launch" },
    { date: "2026-06-01", event: "Crossed 500 paying customers" },
  ],
  customContext:
    "Founder is Alex, a solo technical founder who left a senior eng role at Stripe in 2025. Speaks in plain English, hates jargon. The audience is the same — solo founders who built something and now have to figure out how to grow it without hiring a team.",
  updatedAt: daysAgo(2),
};

// ─── Industry starter kits ──────────────────────────────────

export const MOCK_INDUSTRY_KITS = [
  {
    slug: "saas",
    name: "SaaS Startup Pack",
    description: "Everything you need to launch, write, and sell your SaaS.",
    agents: ["ceo-agent", "cmo-agent", "content-writer", "research-analyst"],
    price: "$199/mo (vs $286 individually)",
  },
  {
    slug: "ecommerce",
    name: "E-commerce Pack",
    description: "Product copy, customer outreach, and support that scales with you.",
    agents: ["ceo-agent", "content-writer", "sales-agent", "support-agent"],
    price: "$179/mo (vs $256 individually)",
  },
  {
    slug: "agency",
    name: "Agency Pack",
    description: "Run an agency without burning out — research, content, people ops.",
    agents: ["ceo-agent", "content-writer", "research-analyst", "hr-agent"],
    price: "$189/mo (vs $256 individually)",
  },
];

// ─── Sample blog posts ──────────────────────────────────────

export const MOCK_BLOG_POSTS = [
  {
    slug: "why-we-built-reklu",
    title: "Why we built Reklu — the AI company for solo founders",
    excerpt:
      "I was running a one-person startup wearing every hat. The agents I tried were clever but forgetful, generic, and siloed. So I built something different.",
    author: "Alex Founder",
    publishedAt: "2026-05-12",
    readingMinutes: 6,
    tags: ["founder-story", "ai-agents"],
    cover: null,
    content: `Most "AI tools" for founders are really just chatbots wearing a suit.

You open them, paste a prompt, get an answer, close the tab. The next day, they don't remember what you asked. They don't know your business. They don't coordinate with each other.

That's why we built Reklu.

Reklu is an AI company. Not a chatbot. A company.

You describe your business once. You hire a team of agents — a CEO, a writer, a researcher, a sales agent, a support agent. Each one learns your business from your Business Brain. Each one remembers what they did yesterday. They delegate to each other. They report back.

You stop being the bottleneck.

This post is the long version of why we built it.`,
  },
  {
    slug: "agent-to-agent-delegation",
    title: "Agent-to-agent delegation: how your AI company coordinates",
    excerpt:
      "When a CEO agent decides 'we need a LinkedIn post about our launch', it doesn't just write it. It briefs the CMO. The CMO briefs the Writer. The Writer produces. Here's how that works in practice.",
    author: "Maya (CMO Agent)",
    publishedAt: "2026-05-28",
    readingMinutes: 8,
    tags: ["engineering", "agent-design"],
    cover: null,
    content: `The first version of Reklu didn't have agent-to-agent delegation.

Each agent worked alone. The CEO could set priorities, but it couldn't actually tell the CMO what to do. The CMO could brief writers, but the brief had to come from a human, in the right form, at the right time.

The result: the agents were helpful, but they weren't a company. They were five tools pretending to be a team.

Then we added delegation.

Here's how it works now.`,
  },
  {
    slug: "the-business-brain-explained",
    title: "The Business Brain: how Reklu's memory layer works",
    excerpt:
      "Your agents share a persistent memory of your business. The longer you use Reklu, the smarter your company gets. Here's the architecture.",
    author: "Nova (Research Analyst)",
    publishedAt: "2026-06-10",
    readingMinutes: 5,
    tags: ["engineering", "architecture"],
    cover: null,
    content: `Every Reklu account has a Business Brain.

It's a structured store of everything your agents know about you — your products, your audience, your competitors, your tone, your milestones, your custom context.

Whenever any agent runs, the brain is injected into its prompt as variables. {{business_name}}, {{products}}, {{brand_voice}}, {{target_audience}}. The agent doesn't have to ask. It already knows.`,
  },
];

// ─── Plans ──────────────────────────────────────────────────

export const MOCK_PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "mo",
    agentsLimit: 1,
    tasksLimit: 50,
    features: [
      "1 AI agent",
      "50 tasks/month",
      "Business Brain (basic)",
      "Community support",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: 29,
    interval: "mo",
    agentsLimit: 3,
    tasksLimit: 500,
    features: [
      "3 AI agents",
      "500 tasks/month",
      "Business Brain (basic)",
      "Email support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 79,
    interval: "mo",
    popular: true,
    agentsLimit: 8,
    tasksLimit: -1, // unlimited
    features: [
      "8 AI agents",
      "Unlimited tasks",
      "Business Brain (full)",
      "Agent-to-agent workflows",
      "Weekly board report",
      "Priority support",
    ],
  },
  {
    id: "company",
    name: "Company",
    price: 149,
    interval: "mo",
    agentsLimit: -1,
    tasksLimit: -1,
    features: [
      "Unlimited agents",
      "Unlimited tasks",
      "Full Business Brain",
      "Custom agent creation",
      "White-label option",
      "Dedicated onboarding",
    ],
  },
];
// ─── Company Goals ──────────────────────────────────────────

export const MOCK_COMPANY_GOALS = [
  {
    id: "goal-1",
    title: "Get 50 qualified leads this month",
    description: "Generate 50 leads that match our ICP (SaaS founders, seed stage, $50k-$500k ARR).",
    status: "in_progress",
    progress: 62,
    deadline: "2026-07-31",
    owner: "ceo",
    kpi: { current: 31, target: 50, unit: "leads" },
    plan: [
      { id: "p1", title: "Build lead list of 200 SaaS founders", employee: "lead-researcher", status: "completed" },
      { id: "p2", title: "Send 100 personalized cold emails", employee: "outreach-employee", status: "in_progress" },
      { id: "p3", title: "Run 25 discovery calls", employee: "appointment-setter", status: "in_progress" },
      { id: "p4", title: "Send 50 follow-ups", employee: "outreach-employee", status: "queued" },
    ],
    createdAt: "2026-06-15T00:00:00Z",
  },
  {
    id: "goal-2",
    title: "Publish 30 days of content",
    description: "Ship 30 days of social content + 4 long-form blog posts.",
    status: "in_progress",
    progress: 47,
    deadline: "2026-07-15",
    owner: "marketing-manager",
    kpi: { current: 14, target: 30, unit: "days of content" },
    plan: [
      { id: "p1", title: "Create Q3 content calendar", employee: "marketing-manager", status: "completed" },
      { id: "p2", title: "Write 4 blog posts (SEO-optimized)", employee: "seo-aeo-writer", status: "in_progress" },
      { id: "p3", title: "Generate 30 social posts", employee: "social-media-manager", status: "in_progress" },
      { id: "p4", title: "Schedule and publish", employee: "social-media-manager", status: "queued" },
    ],
    createdAt: "2026-06-10T00:00:00Z",
  },
  {
    id: "goal-3",
    title: "Launch new pricing page",
    description: "Build, test, and ship a new pricing page that lifts trial signups by 25%.",
    status: "in_progress",
    progress: 75,
    deadline: "2026-07-08",
    owner: "website-builder",
    kpi: { current: 3, target: 4, unit: "experiments" },
    plan: [
      { id: "p1", title: "Audit current pricing page", employee: "ux-reviewer", status: "completed" },
      { id: "p2", title: "Generate 3 new copy variants", employee: "website-builder", status: "completed" },
      { id: "p3", title: "Run A/B test", employee: "conversion-optimizer", status: "in_progress" },
      { id: "p4", title: "Ship winner", employee: "website-builder", status: "queued" },
    ],
    createdAt: "2026-06-20T00:00:00Z",
  },
  {
    id: "goal-4",
    title: "Answer customers 24/7",
    description: "Deploy website widget with FAQ-grounded support + lead capture.",
    status: "completed",
    progress: 100,
    deadline: "2026-06-22",
    owner: "support-manager",
    kpi: { current: 142, target: 100, unit: "tickets handled" },
    plan: [],
    createdAt: "2026-06-01T00:00:00Z",
  },
];

// ─── Work Inbox Items ───────────────────────────────────────

export const MOCK_WORK_INBOX = [
  {
    id: "wi-1",
    employeeSlug: "content-writer",
    employeeName: "Aria",
    department: "marketing",
    type: "ready_to_publish",
    title: "LinkedIn post: Why we open-sourced our agent runtime",
    preview: "Most companies treat their AI agents like black boxes. We open-sourced ours...",
    output: "Most companies treat their AI agents like black boxes. We open-sourced ours...",
    credits: 2,
    createdAt: "2026-06-23T11:00:00Z",
    status: "needs_approval",
  },
  {
    id: "wi-2",
    employeeSlug: "outreach-employee",
    employeeName: "Echo",
    department: "sales",
    type: "ready_to_send",
    title: "10 personalized cold emails to SaaS founders",
    preview: "Hey {{first_name}}, saw you just launched [Product]. Most founders at this stage...",
    output: "Subject: Quick question about [Company]\n\nHey {{first_name}}...",
    credits: 5,
    createdAt: "2026-06-23T09:00:00Z",
    status: "needs_approval",
  },
  {
    id: "wi-3",
    employeeSlug: "support-employee",
    employeeName: "Robin",
    department: "support",
    type: "customer_reply",
    title: "Reply to ticket: 'Refund request — annual plan'",
    preview: "Hi Jordan — totally fine. I've processed your refund and you'll see it within 5 business days...",
    output: "Hi Jordan,\n\nTotally fine — I've processed your refund. You'll see it on your statement within 5 business days.\n\nIf you have a sec, I'd love to know what didn't click for you. Helps us build better. No pressure either way.\n\nBest,\nRobin (AI Support at Acme)",
    credits: 1,
    createdAt: "2026-06-23T13:42:00Z",
    status: "needs_approval",
  },
  {
    id: "wi-4",
    employeeSlug: "competitor-researcher",
    employeeName: "Rival",
    department: "research",
    type: "research_report",
    title: "Competitor scan: Linear, Notion AI, ClickUp Brain",
    preview: "Linear is closing the AI-quality gap. Notion is going wide. ClickUp is noisy...",
    output: "## Competitor Brief — Last 30 Days\n\n### Linear\n- Shipped native GitHub issue sync\n- AI triage suggestions in beta\n\n### Notion AI\n- Notion Mail launched\n- AI meeting notes in beta\n\n### ClickUp\n- ClickUp Brain 2.0 — heavy push\n- Free for paid users\n\n### Opportunities\n1. Position on 'Linear-quality' AI\n2. Lean into solo-founder messaging\n3. Go deep on integrations, not wide",
    credits: 4,
    createdAt: "2026-06-22T16:00:00Z",
    status: "needs_approval",
  },
  {
    id: "wi-5",
    employeeSlug: "cfo",
    employeeName: "Sterling",
    department: "finance",
    type: "growth_suggestion",
    title: "Pricing suggestion: launch $149/mo Pro tier",
    preview: "Based on usage data, 23% of your Growth users would pay $149 for the features they're already using...",
    output: "## Pricing Recommendation\n\nBased on usage data from the last 90 days, 23% of your Growth users would likely pay $149/mo for the features they're already using heavily.\n\n**Proposal:**\n- Pro: $149/mo — adds custom employee creation, advanced permissions\n- Beta test with top 10 customers\n- Expected MRR impact: +$2,400/mo",
    credits: 3,
    createdAt: "2026-06-22T12:00:00Z",
    status: "needs_approval",
  },
  {
    id: "wi-6",
    employeeSlug: "website-builder",
    employeeName: "Pixel",
    department: "product-website",
    type: "growth_suggestion",
    title: "CTA improvement: hero section",
    preview: "Your current CTA 'Build Your AI Company' has a 4.2% click rate. Industry average is 6.8%...",
    output: "## CTA Improvement Plan\n\nYour hero CTA 'Build Your AI Company' gets 4.2% clicks. Industry average: 6.8%.\n\n**Suggestions:**\n1. Change to action verb: 'Hire My First AI Employee' (specific > abstract)\n2. Add trust line below: '500+ founders · 4.9/5'\n3. Move signup closer to fold\n\nExpected lift: 30-40% on CTA clicks",
    credits: 2,
    createdAt: "2026-06-23T07:00:00Z",
    status: "needs_approval",
  },
];

// ─── Department Stats ───────────────────────────────────────

export const MOCK_DEPARTMENTS_STATS = [
  { slug: "executive", name: "Executive", emoji: "🎯", manager: "Atlas", employees: 3, tasks: 12, performance: 92, color: "from-primary to-accent-warm" },
  { slug: "sales", name: "Sales", emoji: "💼", manager: "Hunter", employees: 5, tasks: 38, performance: 88, color: "from-accent-warm to-accent" },
  { slug: "support", name: "Support", emoji: "💬", manager: "Riley", employees: 5, tasks: 26, performance: 94, color: "from-primary to-accent" },
  { slug: "marketing", name: "Marketing", emoji: "📣", manager: "Maya", employees: 7, tasks: 41, performance: 91, color: "from-accent-warm to-primary" },
  { slug: "research", name: "Research", emoji: "🔍", manager: "Nova", employees: 5, tasks: 22, performance: 86, color: "from-accent to-primary" },
  { slug: "finance", name: "Finance", emoji: "💰", manager: "Sterling", employees: 4, tasks: 11, performance: 84, color: "from-accent to-accent-warm" },
  { slug: "operations", name: "Operations", emoji: "⚙️", manager: "Foreman", employees: 4, tasks: 18, performance: 87, color: "from-primary-light to-accent" },
  { slug: "product-website", name: "Product & Website", emoji: "🌐", manager: "Pivot", employees: 4, tasks: 19, performance: 89, color: "from-accent to-primary-light" },
  { slug: "admin", name: "Admin", emoji: "🗂️", manager: "Axel", employees: 3, tasks: 8, performance: 82, color: "from-text-tertiary to-primary" },
  { slug: "legal", name: "Legal & Compliance", emoji: "⚖️", manager: "Lex", employees: 2, tasks: 4, performance: 79, color: "from-accent-warm to-text-tertiary" },
];

// ─── Today's CEO Briefing ───────────────────────────────────

export const MOCK_TODAY_BRIEFING = {
  date: "2026-06-24",
  greeting: "Good morning",
  summary:
    "Your AI company completed 18 tasks today. Marketing drafted 7 posts, Sales found 24 leads, Support answered 12 customer questions, and Research found 3 competitor updates. 6 items need your approval.",
  highlights: [
    { icon: "📣", dept: "Marketing", text: "7 posts drafted and ready for review" },
    { icon: "💼", dept: "Sales", text: "24 new leads found, 12 personalized emails drafted" },
    { icon: "💬", dept: "Support", text: "12 customer questions answered" },
    { icon: "🔍", dept: "Research", text: "3 competitor updates logged" },
    { icon: "💰", dept: "Finance", text: "New pricing suggestion from CFO" },
    { icon: "🌐", dept: "Product & Website", text: "CTA improvement ready for review" },
  ],
  needsApproval: 6,
  risks: [
    { level: "low", text: "2 overdue tasks in Support dept — Robin waiting on your approval for refund replies" },
  ],
  recommendations: [
    "Approve Echo's 10 outreach emails (Sales Manager recommends these go out today)",
    "Review Sterling's pricing proposal — could add $2,400/mo MRR",
    "Hire the new Trend Finder employee — Research dept asked for it twice",
  ],
};

// ─── Leads ──────────────────────────────────────────────────

export const MOCK_LEADS = [
  { id: "l-1", name: "Maya Chen", email: "maya@tidepool.app", phone: "+1 415-555-0102", company: "Tidepool", source: "LinkedIn", status: "hot", budget: "$5k/mo", interest: "AI sales employees", assignedTo: "echo", notes: "Asked about pricing twice. Ready for a call.", createdAt: "2026-06-22T14:00:00Z", nextFollowUp: "2026-06-25" },
  { id: "l-2", name: "Jordan Patel", email: "jordan@loophole.dev", phone: "+1 510-555-0144", company: "Loophole Labs", source: "Widget", status: "qualified", budget: "$500/mo", interest: "Support widget for dev tool", assignedTo: "cal", notes: "Wants widget + lead capture for landing page.", createdAt: "2026-06-23T08:30:00Z", nextFollowUp: "2026-06-24" },
  { id: "l-3", name: "Sam Rivera", email: "sam@quiver.io", phone: "+1 323-555-0118", company: "Quiver", source: "Cold email", status: "follow-up", budget: "TBD", interest: "Full company", assignedTo: "echo", notes: "Opened 3 emails. Replied once asking for case studies.", createdAt: "2026-06-20T11:00:00Z", nextFollowUp: "2026-06-26" },
  { id: "l-4", name: "Lena Park", email: "lena@lucent.co", phone: "+1 212-555-0166", company: "Lucent", source: "Referral", status: "contacted", budget: "$2k/mo", interest: "Marketing team", assignedTo: "echo", notes: "Referred by Sam. Wants marketing dept.", createdAt: "2026-06-19T09:00:00Z", nextFollowUp: "2026-06-27" },
  { id: "l-5", name: "Tom Wright", email: "tom@bootscats.com", phone: "+1 415-555-0199", company: "Boots & Cats", source: "Demo request", status: "new", budget: "TBD", interest: "Agency plan", assignedTo: "cal", notes: "Requested demo via website. Agency owner.", createdAt: "2026-06-23T15:20:00Z", nextFollowUp: "2026-06-24" },
  { id: "l-6", name: "Aisha Patel", email: "aisha@stitchwork.dev", phone: "+1 617-555-0123", company: "Stitchwork", source: "Cold email", status: "won", budget: "$79/mo", interest: "Growth plan", assignedTo: "echo", notes: "Signed up. Onboarding sent.", createdAt: "2026-06-15T13:00:00Z", nextFollowUp: null },
  { id: "l-7", name: "Marcus Johnson", email: "marcus@growthstack.io", phone: "+1 305-555-0145", company: "GrowthStack", source: "LinkedIn", status: "lost", budget: "N/A", interest: "Custom plan", assignedTo: "echo", notes: "Went with competitor. Reason: too expensive.", createdAt: "2026-06-12T10:00:00Z", nextFollowUp: null },
];

// ─── Customers ──────────────────────────────────────────────

export const MOCK_CUSTOMERS = [
  { id: "c-1", name: "Alex Founder", email: "demo@reklu.app", company: "Acme Studios", plan: "growth", mrr: 79, joinedAt: "2025-09-01", health: "excellent" },
  { id: "c-2", name: "Maya Chen", email: "maya@tidepool.app", company: "Tidepool", plan: "growth", mrr: 79, joinedAt: "2025-12-01", health: "excellent" },
  { id: "c-3", name: "Lena Park", email: "lena@lucent.co", company: "Lucent", plan: "company", mrr: 149, joinedAt: "2025-11-08", health: "excellent" },
  { id: "c-4", name: "Tom Wright", email: "tom@bootscats.com", company: "Boots & Cats", plan: "growth", mrr: 79, joinedAt: "2026-02-22", health: "good" },
  { id: "c-5", name: "Aisha Patel", email: "aisha@stitchwork.dev", company: "Stitchwork", plan: "starter", mrr: 29, joinedAt: "2026-03-15", health: "good" },
];

// ─── Conversations ──────────────────────────────────────────

export const MOCK_CONVERSATIONS = [
  { id: "v-1", customer: "Maya Chen", source: "widget", subject: "Pricing for Pro tier", status: "open", lastMessage: "Hey! Saw your pricing page — is there a Pro tier?", assignedDept: "sales", suggestedBy: "closer", updatedAt: "2026-06-23T15:00:00Z" },
  { id: "v-2", customer: "Jordan Patel", source: "widget", subject: "Refund for annual plan", status: "pending", lastMessage: "I'd like a refund on my annual plan please.", assignedDept: "support", suggestedBy: "support-employee", updatedAt: "2026-06-23T13:42:00Z" },
  { id: "v-3", customer: "Sam Rivera", source: "email", subject: "Case studies request", status: "open", lastMessage: "Do you have any case studies from SaaS founders?", assignedDept: "sales", suggestedBy: "outreach-employee", updatedAt: "2026-06-22T16:30:00Z" },
  { id: "v-4", customer: "Tom Wright", source: "widget", subject: "Agency plan details", status: "open", lastMessage: "I run an agency — does the Agency plan include white-label?", assignedDept: "sales", suggestedBy: "closer", updatedAt: "2026-06-23T15:25:00Z" },
  { id: "v-5", customer: "Lena Park", source: "email", subject: "Custom employee training", status: "closed", lastMessage: "Thanks, that solved it!", assignedDept: "support", suggestedBy: null, updatedAt: "2026-06-22T11:00:00Z" },
];

// ─── Campaigns ──────────────────────────────────────────────

export const MOCK_CAMPAIGNS = [
  { id: "camp-1", name: "Q3 Founder Push", channel: "LinkedIn", status: "running", leads: 142, conversions: 18, budget: 1200, startedAt: "2026-06-01", employees: ["social-media-manager", "ad-copywriter"] },
  { id: "camp-2", name: "Cold Email Series", channel: "Email", status: "running", leads: 412, conversions: 47, budget: 800, startedAt: "2026-05-15", employees: ["outreach-employee"] },
  { id: "camp-3", name: "Waitlist Welcome Sequence", channel: "Email", status: "running", leads: 687, conversions: 89, budget: 0, startedAt: "2026-04-01", employees: ["email-marketer"] },
  { id: "camp-4", name: "Facebook Ads — Solo Founders", channel: "Facebook", status: "draft", leads: 0, conversions: 0, budget: 0, startedAt: null, employees: ["ad-copywriter"] },
];

// ─── Knowledge Base ─────────────────────────────────────────

export const MOCK_KNOWLEDGE_BASE = [
  { id: "kb-1", section: "Business Profile", title: "Acme Studios", type: "profile", updatedAt: "2026-06-20" },
  { id: "kb-2", section: "Products & Services", title: "Reklu Starter, Growth, Company", type: "products", updatedAt: "2026-06-22" },
  { id: "kb-3", section: "FAQs", title: "27 customer questions", type: "faqs", items: 27, updatedAt: "2026-06-22" },
  { id: "kb-4", section: "Documents", title: "12 documents indexed", type: "documents", items: 12, updatedAt: "2026-06-21" },
  { id: "kb-5", section: "Brand Voice", title: "Bold, modern, empowering", type: "voice", updatedAt: "2026-06-18" },
  { id: "kb-6", section: "Competitors", title: "Linear, Notion AI, ClickUp", type: "competitors", items: 3, updatedAt: "2026-06-23" },
  { id: "kb-7", section: "Policies", title: "Terms, Privacy, Refund", type: "policies", items: 3, updatedAt: "2026-06-15" },
  { id: "kb-8", section: "Website Content", title: "acmestudios.example", type: "website", items: 8, updatedAt: "2026-06-20" },
];

// ─── Team Members ───────────────────────────────────────────

export const MOCK_TEAM_MEMBERS = [
  { id: "t-1", name: "Alex Founder", email: "alex@acmestudios.example", role: "owner", joinedAt: "2025-09-01", lastActive: "now" },
  { id: "t-2", name: "Riley Chen", email: "riley@acmestudios.example", role: "team_member", joinedAt: "2026-01-15", lastActive: "2h ago" },
  { id: "t-3", name: "Sam Wright", email: "sam@acmestudios.example", role: "team_member", joinedAt: "2026-02-08", lastActive: "yesterday" },
];

// ─── Credit History ─────────────────────────────────────────

export const MOCK_CREDIT_HISTORY = [
  { id: "c-1", date: "2026-06-23", employee: "Aria (Content Writer)", task: "LinkedIn post draft", credits: 2 },
  { id: "c-2", date: "2026-06-23", employee: "Echo (Outreach)", task: "10 personalized emails", credits: 5 },
  { id: "c-3", date: "2026-06-23", employee: "Robin (Support)", task: "12 ticket replies", credits: 6 },
  { id: "c-4", date: "2026-06-22", employee: "Nova (Research Manager)", task: "Competitor scan", credits: 4 },
  { id: "c-5", date: "2026-06-22", employee: "Pixel (Website)", task: "CTA improvement", credits: 2 },
  { id: "c-6", date: "2026-06-22", employee: "Atlas (CEO)", task: "Weekly briefing", credits: 3 },
];

// ─── Business DNA ──────────────────────────────────────────
// The foundation of every AI output. One per user.

export const MOCK_BUSINESS_DNA: BusinessDna = {
  id: "dna-001",
  userId: DEMO_USER.id,
  sourceMode: "start_new",

  // Overview
  businessName: "Acme AI Studios",
  tagline: "AI-powered websites for local service businesses",
  businessIdea:
    "We build AI-powered websites and lead-capture systems for local service businesses (clinics, dentists, real estate agents) that miss leads after hours.",
  industry: "Marketing & Advertising",
  businessType: "online",
  country: "United States",
  city: "Austin, TX",
  market: "regional",
  stage: "launching",

  // Customer
  targetCustomer:
    "Local service business owners (clinics, dental practices, real estate agents) in Tier-1 US cities doing $500k-$5M/year who lose leads after hours.",
  customerPainPoints: [
    "Miss 40-60% of calls and form submissions outside business hours",
    "No automated follow-up when leads come in cold",
    "Website is a digital brochure, not a 24/7 sales rep",
    "Spending on ads but can't tie spend to booked appointments",
  ],
  customerDemographics: "Owner-operator, 30-55, mid-market service business",

  // Offer
  mainOffer:
    "Done-for-you AI website + WhatsApp/SMS auto-reply + booking system, set up in 14 days.",
  priceRange: "$1,500-$3,500 setup + $299/mo",
  revenueTarget: "$50k MRR by month 12",

  // Brand
  brandTone: "premium",
  brandVoiceNotes:
    "Calm confidence. No hype. We sound like a senior partner, not a growth-hacker. Short sentences. Numbers > adjectives.",

  // Assets
  websiteUrl: "https://acmeaistudios.example",
  socialLinks: {
    linkedin: "https://linkedin.com/company/acme-ai-studios",
    twitter: "https://x.com/acmeaistudios",
    instagram: "https://instagram.com/acmeaistudios",
  },

  // Competitors
  competitors: [
    { name: "ServiceTitan", url: "servicetitan.com", notes: "Enterprise. Way too expensive and complex for our ICP." },
    { name: "Birdeye", url: "birdeye.com", notes: "Reviews-focused. Doesn't solve the after-hours lead problem." },
    { name: "Local Lead AI", url: "localleadai.com", notes: "Direct competitor. We beat them on speed and pricing." },
  ],

  // Goals & problems
  mainGoal: "Get 10 paying clients in the next 90 days",
  currentProblems: [
    "No clear niche positioning",
    "Outbound is manual and slow",
    "Can't prove ROI to prospects",
  ],
  budget: "$5k-$15k for first 90 days",
  timeline: "First paying client in 30 days, 10 clients in 90 days",
  skillLevel: "intermediate",
  preferredChannels: ["linkedin", "email", "instagram", "facebook_ads"],

  // AI-generated
  aiSummary:
    "Strong niche: local service businesses in Tier-1 cities who miss leads after hours. The wedge is 'AI website + 24/7 lead capture in 14 days' — concrete, fast, and tied to revenue. Differentiate from ServiceTitan (enterprise) and Birdeye (reviews-only) by being the simplest done-for-you offer at a price point a solo operator can sign off on without a board meeting.",
  aiRecommendedNiche:
    "AI appointment + lead-reply system for dental clinics and med-spa in cities with >500k population.",
  aiRecommendedPositioning:
    "The 14-day AI front-desk for local service businesses. We don't replace your receptionist — we cover the 60% of leads that happen after they go home.",

  createdAt: "2026-06-01T00:00:00Z",
  updatedAt: "2026-06-25T00:00:00Z",
};

// ─── Business Score ─────────────────────────────────────────

export const MOCK_BUSINESS_SCORE: BusinessScore = {
  id: "score-001",
  userId: DEMO_USER.id,

  overall: 78,
  demand: 84,
  competition: 68, // higher = less competition
  differentiation: 81,
  profitPotential: 75,
  launchDifficulty: 70, // higher = easier
  growthPotential: 86,
  riskScore: 72, // higher = lower risk

  verdict: "good_needs_positioning",
  canIWinAnswer:
    "Yes, you can win — but not by selling 'AI websites' generically. Your best angle is AI appointment automation for dental clinics and med-spas in Tier-1 US cities. These businesses answer phones 9-5 but miss 40-60% of after-hours inquiries, they have budget (avg LTV $3k-$15k), and they buy fast when ROI is concrete. Skip restaurants and gyms — they churn and haggle on price.",

  breakdown: [
    { dimension: "Market Demand", score: 84, note: "Strong: 73% of local service businesses report after-hours lead loss." },
    { dimension: "Competition", score: 68, note: "Moderate: ServiceTitan dominates enterprise; you win the SMB gap." },
    { dimension: "Differentiation", score: 81, note: "Strong: 14-day setup + flat pricing beats 6-month agency engagements." },
    { dimension: "Profit Potential", score: 75, note: "Good: $1.5k-$3.5k setup + $299/mo = 6-month payback at ~70% margin." },
    { dimension: "Launch Difficulty", score: 70, note: "Easy: niche is reachable on LinkedIn, demos are visual, no infra to build." },
    { dimension: "Growth Potential", score: 86, note: "High: every clinic/dental in every city is a prospect. Geography is your CAC lever." },
    { dimension: "Risk", score: 72, note: "Moderate: dependent on Meta/Google ads reach; can offset with outbound." },
  ],

  createdAt: "2026-06-25T00:00:00Z",
};

export const MOCK_BUSINESS_SCORE_HISTORY: BusinessScore[] = [
  { ...MOCK_BUSINESS_SCORE, overall: 62, createdAt: "2026-05-01T00:00:00Z" },
  { ...MOCK_BUSINESS_SCORE, overall: 68, createdAt: "2026-05-15T00:00:00Z" },
  { ...MOCK_BUSINESS_SCORE, overall: 71, createdAt: "2026-06-01T00:00:00Z" },
  { ...MOCK_BUSINESS_SCORE, overall: 74, createdAt: "2026-06-15T00:00:00Z" },
  { ...MOCK_BUSINESS_SCORE, overall: 78, createdAt: "2026-06-25T00:00:00Z" },
];

// ─── Offers ────────────────────────────────────────────────

export const MOCK_OFFERS: Offer[] = [
  {
    id: "offer-001",
    userId: DEMO_USER.id,
    offerName: "AI Front-Desk System",
    promise:
      "Never miss another lead. We set up an AI front-desk for your business that replies within 30 seconds — 24/7 — and books appointments straight into your calendar.",
    targetCustomer: "Local service business owners in Tier-1 US cities (dental, med-spa, real estate)",
    packages: [
      {
        name: "Starter",
        price: "$1,500 setup + $199/mo",
        bestFor: "Solo clinics testing AI lead capture for the first time",
        features: [
          "AI website (1 page)",
          "After-hours SMS/WhatsApp auto-reply",
          "Calendar booking integration",
          "Weekly lead report",
        ],
        outcome: "Capture leads 24/7. Book 5-10 extra appointments/month.",
        cta: "Get Started",
      },
      {
        name: "Growth",
        price: "$3,500 setup + $399/mo",
        bestFor: "Established practices doing $500k+ with multiple lead sources",
        features: [
          "Multi-page AI website (5 pages)",
          "AI front-desk with appointment booking",
          "Missed-call-text-back",
          "Lead-to-CRM pipeline (HubSpot or Pipedrive)",
          "Bi-weekly optimization",
        ],
        outcome: "30% more booked appointments in 60 days, or money back.",
        cta: "Book a Demo",
      },
      {
        name: "Premium",
        price: "$7,500 setup + $799/mo",
        bestFor: "Multi-location businesses or agencies white-labeling the system",
        features: [
          "Everything in Growth",
          "Multi-location support",
          "Custom AI agent trained on your FAQs",
          "White-label client dashboard",
          "Dedicated success manager",
        ],
        outcome: "Full white-label system for up to 10 client locations.",
        cta: "Talk to Us",
      },
    ],
    salesPitch:
      "Hi [Name], I help local service businesses stop losing leads after hours. We set up an AI front-desk in 14 days that replies to every inquiry in under 30 seconds and books appointments straight into your calendar. Most clients see 5-10 extra booked appointments in the first month. Worth 15 minutes?",
    coldDmScript:
      "Hey [Name] — saw you run [Clinic Name]. Quick question: what happens when someone calls or messages after 6pm? Most practices lose ~40% of leads that way. We built a 14-day AI front-desk that catches them. Want me to show you a 2-min demo?",
    whatsappPitch:
      "Hey [Name] 👋 — I help local clinics catch every lead, even at 11pm. We set up an AI receptionist in 14 days that books appointments straight into your calendar. No contracts. Want to see how it works for [Clinic Name]?",
    emailPitch:
      "Subject: 40% of your leads probably happen after 6pm.\n\nHi [Name],\n\nMost local service businesses lose 4 in 10 leads because they happen after hours. We built a 14-day AI front-desk that catches every inquiry and books straight into your calendar.\n\nQuick 15-min demo?",
    landingHeadline: "Never lose another lead after 6pm.",
    guarantee:
      "If you don't book at least 30% more appointments in 60 days, we'll work free until you do.",
    bonuses: [
      "Free missed-call-text-back setup ($500 value)",
      "14-day implementation — no waiting",
      "30-day money-back guarantee",
    ],
    isActive: true,
    createdAt: "2026-06-20T00:00:00Z",
  },
];

// ─── Growth Roadmap (7-day launch plan) ────────────────────

export const MOCK_GROWTH_ROADMAP: GrowthRoadmap = {
  id: "rm-001",
  userId: DEMO_USER.id,
  kind: "launch_7",
  title: "7-Day Launch Plan",
  summary:
    "From finalized offer to your first booked demo — generated by your AI CEO based on your Business DNA.",
  items: [
    {
      day: 1,
      task: "Finalize your offer and pricing",
      objective: "Lock in 3-tier packages and the core promise",
      whyItMatters: "Most businesses fail because their offer is fuzzy. Lock it before anything else.",
      department: "Marketing",
      employee: "Maya (CMO)",
      difficulty: "easy",
      expectedResult: "Clear offer, 3 tiers, headline, guarantee.",
      status: "done",
    },
    {
      day: 2,
      task: "Build your landing page",
      objective: "Get a publishable landing page live",
      whyItMatters: "You need somewhere to send leads today. Not tomorrow.",
      department: "Product & Website",
      employee: "Pixel (Website Agent)",
      difficulty: "medium",
      expectedResult: "Live landing page with offer + CTA + lead form.",
      status: "done",
    },
    {
      day: 3,
      task: "Generate first content campaign",
      objective: "Ship 7 LinkedIn posts + 3 cold email scripts",
      whyItMatters: "Outbound starts day 1. Content compounds by day 30.",
      department: "Marketing",
      employee: "Aria (Content Writer)",
      difficulty: "easy",
      expectedResult: "7-day content calendar ready to publish.",
      status: "in_progress",
    },
    {
      day: 4,
      task: "Build your lead list",
      objective: "Find 50 qualified prospects",
      whyItMatters: "Outbound without a list is just noise.",
      department: "Sales",
      employee: "Nova (Lead Finder)",
      difficulty: "medium",
      expectedResult: "50 prospects with name, email, company, hook.",
      status: "todo",
    },
    {
      day: 5,
      task: "Write your 5-step follow-up sequence",
      objective: "Automated follow-up cadence",
      whyItMatters: "80% of deals close between touch 2 and 5. Most people stop at 1.",
      department: "Sales",
      employee: "Echo (Outreach)",
      difficulty: "medium",
      expectedResult: "5-email sequence with subject lines, hooks, and CTAs.",
      status: "todo",
    },
    {
      day: 6,
      task: "Launch your first outbound campaign",
      objective: "Send 50 personalized messages",
      whyItMatters: "Revenue comes from conversations. Start them.",
      department: "Sales",
      employee: "Echo (Outreach)",
      difficulty: "hard",
      expectedResult: "50 messages sent, 10 replies expected.",
      status: "todo",
    },
    {
      day: 7,
      task: "Review and improve",
      objective: "Analyze results, pick next week's focus",
      whyItMatters: "Speed of iteration is the only moat in 2026.",
      department: "Executive",
      employee: "Atlas (CEO)",
      difficulty: "easy",
      expectedResult: "Week 2 priority list.",
      status: "todo",
    },
  ],
  createdAt: "2026-06-25T00:00:00Z",
};

// ─── Weekly Tasks (AI CEO's next-best-actions) ─────────────

export const MOCK_WEEKLY_TASKS: WeeklyTask[] = [
  {
    id: "wt-1",
    userId: DEMO_USER.id,
    weekStart: "2026-06-23",
    task: "Publish 3 LinkedIn posts about your offer",
    reason: "Content compounds. You're at week 1 — every post is a permanent asset.",
    expectedResult: "3 posts live, 2k impressions, 5 connection requests.",
    assignedDepartment: "marketing",
    dueDate: "2026-06-26",
    status: "in_progress",
    oneClickAction: "/ads",
    createdAt: "2026-06-23T00:00:00Z",
  },
  {
    id: "wt-2",
    userId: DEMO_USER.id,
    weekStart: "2026-06-23",
    task: "Send 30 personalized cold DMs",
    reason: "Your pipeline is your business. DMs today = meetings next week.",
    expectedResult: "30 DMs sent, 8 replies, 2 calls booked.",
    assignedDepartment: "sales",
    dueDate: "2026-06-27",
    status: "todo",
    oneClickAction: "/leads",
    createdAt: "2026-06-23T00:00:00Z",
  },
  {
    id: "wt-3",
    userId: DEMO_USER.id,
    weekStart: "2026-06-23",
    task: "Improve landing page headline",
    reason: "Current headline is generic. A specific promise converts 2-3x better.",
    expectedResult: "New headline tested, conversion +20%.",
    assignedDepartment: "product-website",
    dueDate: "2026-06-28",
    status: "todo",
    oneClickAction: "/website",
    createdAt: "2026-06-23T00:00:00Z",
  },
  {
    id: "wt-4",
    userId: DEMO_USER.id,
    weekStart: "2026-06-23",
    task: "Add WhatsApp CTA to your website",
    reason: "Your ICP uses WhatsApp. One tap = conversation.",
    expectedResult: "WhatsApp button live, 5+ chats/week.",
    assignedDepartment: "product-website",
    dueDate: "2026-06-29",
    status: "todo",
    oneClickAction: "/website",
    createdAt: "2026-06-23T00:00:00Z",
  },
  {
    id: "wt-5",
    userId: DEMO_USER.id,
    weekStart: "2026-06-23",
    task: "Follow up with 8 warm leads",
    reason: "Warm leads convert 5-10x better than cold. Don't let them cool.",
    expectedResult: "8 follow-ups sent, 1 closed deal.",
    assignedDepartment: "sales",
    dueDate: "2026-06-30",
    status: "todo",
    oneClickAction: "/leads",
    createdAt: "2026-06-23T00:00:00Z",
  },
];

// ════════════════════════════════════════════════════════════════
//  PHASE 3 — AI COMPANY ENGINE MOCK DATA
// ════════════════════════════════════════════════════════════════

// ─── Knowledge Base Items (real semantic memory) ──────────────
// Powers the memory-retriever in lib/ai-company/memory-retriever.ts

export const MOCK_KNOWLEDGE_BASE_ITEMS: KnowledgeBaseItem[] = [
  // ── Business profile (scope: all)
  {
    id: "kb-item-profile-1",
    userId: DEMO_USER.id,
    title: "Company Overview — Acme AI Studios",
    content:
      "Acme AI Studios builds AI-powered websites and lead-capture systems for local service businesses (clinics, dentists, real estate agents) that miss leads after hours. Founded 2025. Based in Austin, TX. We sell a done-for-you service: AI website + WhatsApp auto-reply + booking system, set up in 14 days. Pricing: $1,500-$3,500 setup + $299/mo.",
    source: "user_added",
    sourceRef: null,
    tags: ["business", "overview", "company", "profile"],
    scope: "all",
    embedding: null,
    trainingWeight: 90,
    confidence: 95,
    createdBy: "user",
    lastUsedAt: "2026-07-04T08:00:00Z",
    useCount: 47,
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-06-20T14:30:00Z",
  },
  {
    id: "kb-item-profile-2",
    userId: DEMO_USER.id,
    title: "Ideal Customer Profile",
    content:
      "Owner-operators of local service businesses in Tier-1 US cities. Revenue $500k-$5M/year. Verticals: dental practices, medical clinics, real estate agents, law firms. They miss 40-60% of calls and form submissions outside business hours. They have a website but it's a digital brochure, not a 24/7 sales rep. They spend on ads but can't tie spend to booked appointments.",
    source: "user_added",
    sourceRef: null,
    tags: ["icp", "customer", "audience", "ideal"],
    scope: "all",
    embedding: null,
    trainingWeight: 95,
    confidence: 95,
    createdBy: "user",
    lastUsedAt: "2026-07-04T07:30:00Z",
    useCount: 38,
    createdAt: "2026-05-15T10:30:00Z",
    updatedAt: "2026-06-18T11:00:00Z",
  },
  {
    id: "kb-item-brand-1",
    userId: DEMO_USER.id,
    title: "Brand Voice — Acme AI Studios",
    content:
      "Calm confidence. No hype. We sound like a senior partner, not a growth-hacker. Short sentences. Numbers over adjectives. Never use: game-changing, revolutionary, unleash, supercharge, unlock. Always use: specific outcomes, real numbers, customer-quoted phrases. Tone benchmark: 'a thoughtful friend who happens to be great at this.'",
    source: "user_added",
    sourceRef: null,
    tags: ["brand", "voice", "tone", "style"],
    scope: "all",
    embedding: null,
    trainingWeight: 100,
    confidence: 100,
    createdBy: "user",
    lastUsedAt: "2026-07-04T08:15:00Z",
    useCount: 124,
    createdAt: "2026-05-20T09:00:00Z",
    updatedAt: "2026-06-22T16:00:00Z",
  },

  // ── Products & pricing (scope: sales)
  {
    id: "kb-item-product-1",
    userId: DEMO_USER.id,
    title: "Pricing Packages",
    content:
      "Three tiers. Starter ($1,500 setup + $199/mo): single-location site, AI WhatsApp, basic booking. Growth ($2,500 setup + $399/mo): multi-page, CRM integration, advanced flows. Premium ($3,500 setup + $699/mo): full custom, multi-channel (WhatsApp + SMS + email), priority support. Setup is 14 days. Guarantee: 3x ROI in 90 days or 100% refund.",
    source: "user_added",
    sourceRef: null,
    tags: ["pricing", "packages", "products", "tiers", "starter", "growth", "premium"],
    scope: "sales",
    embedding: null,
    trainingWeight: 95,
    confidence: 95,
    createdBy: "user",
    lastUsedAt: "2026-07-04T06:00:00Z",
    useCount: 56,
    createdAt: "2026-05-22T11:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
  },

  // ── FAQs (scope: support)
  {
    id: "kb-item-faq-1",
    userId: DEMO_USER.id,
    title: "FAQ — How long does setup take?",
    content:
      "Most setups are live within 14 business days. We move fast because we use our own AI tooling. Day 1-3: discovery call + content collection. Day 4-10: design + build. Day 11-13: review + revisions. Day 14: launch. We send a Loom at the end of each phase.",
    source: "user_added",
    sourceRef: null,
    tags: ["faq", "setup", "timeline", "support"],
    scope: "support",
    embedding: null,
    trainingWeight: 80,
    confidence: 90,
    createdBy: "user",
    lastUsedAt: "2026-07-03T15:00:00Z",
    useCount: 22,
    createdAt: "2026-06-01T10:00:00Z",
    updatedAt: "2026-06-15T09:00:00Z",
  },
  {
    id: "kb-item-faq-2",
    userId: DEMO_USER.id,
    title: "FAQ — What if I don't get ROI?",
    content:
      "We offer a 90-day ROI guarantee. If you don't 3x your setup fee in booked appointments within 90 days, we refund 100%. Less than 5% of clients have ever invoked this. We're confident because we only onboard clients whose ICP we can serve.",
    source: "user_added",
    sourceRef: null,
    tags: ["faq", "guarantee", "roi", "refund", "support"],
    scope: "support",
    embedding: null,
    trainingWeight: 85,
    confidence: 95,
    createdBy: "user",
    lastUsedAt: "2026-07-03T16:00:00Z",
    useCount: 18,
    createdAt: "2026-06-01T10:30:00Z",
    updatedAt: "2026-06-15T09:00:00Z",
  },
  {
    id: "kb-item-faq-3",
    userId: DEMO_USER.id,
    title: "FAQ — Do you integrate with my CRM?",
    content:
      "We integrate with HubSpot, Salesforce, Pipedrive, GoHighLevel, and most calendar systems (Calendly, Cal.com). If you use something custom, we'll build a Zapier/Make integration during setup. Most clients don't need anything beyond the standard integrations.",
    source: "user_added",
    sourceRef: null,
    tags: ["faq", "integration", "crm", "support"],
    scope: "support",
    embedding: null,
    trainingWeight: 75,
    confidence: 90,
    createdBy: "user",
    lastUsedAt: "2026-07-02T11:00:00Z",
    useCount: 14,
    createdAt: "2026-06-01T11:00:00Z",
    updatedAt: "2026-06-15T09:00:00Z",
  },

  // ── Competitors (scope: marketing, research)
  {
    id: "kb-item-comp-1",
    userId: DEMO_USER.id,
    title: "Competitor — ServiceTitan",
    content:
      "ServiceTitan is enterprise. Pricing starts at $5,000/mo. Way too expensive and complex for our ICP. They target multi-location franchises. We don't compete with them — we serve the segment they ignore.",
    source: "user_added",
    sourceRef: null,
    tags: ["competitor", "servicetitan", "enterprise"],
    scope: "marketing",
    embedding: null,
    trainingWeight: 70,
    confidence: 90,
    createdBy: "user",
    lastUsedAt: "2026-07-01T14:00:00Z",
    useCount: 12,
    createdAt: "2026-06-05T09:00:00Z",
    updatedAt: "2026-06-20T12:00:00Z",
  },
  {
    id: "kb-item-comp-2",
    userId: DEMO_USER.id,
    title: "Competitor — Birdeye",
    content:
      "Birdeye is reviews-focused. They do a good job at review generation and listings. They do NOT solve the after-hours lead problem. Our wedge: Birdeye gets the customer reviews, we get them the customer. Partnership angle possible.",
    source: "user_added",
    sourceRef: null,
    tags: ["competitor", "birdeye", "reviews"],
    scope: "marketing",
    embedding: null,
    trainingWeight: 70,
    confidence: 85,
    createdBy: "user",
    lastUsedAt: "2026-07-01T14:30:00Z",
    useCount: 9,
    createdAt: "2026-06-05T09:30:00Z",
    updatedAt: "2026-06-20T12:00:00Z",
  },
  {
    id: "kb-item-comp-3",
    userId: DEMO_USER.id,
    title: "Competitor — Local Lead AI",
    content:
      "Direct competitor. They charge $400-$800/mo + setup. Their AI is generic. We beat them on: (a) 14-day setup vs their 6-week, (b) flat pricing vs their usage-based, (c) dedicated AI employee vs generic chat. We've won 3 of 4 head-to-head deals.",
    source: "user_added",
    sourceRef: null,
    tags: ["competitor", "local lead ai", "direct"],
    scope: "marketing",
    embedding: null,
    trainingWeight: 95,
    confidence: 95,
    createdBy: "user",
    lastUsedAt: "2026-07-04T07:00:00Z",
    useCount: 28,
    createdAt: "2026-06-05T10:00:00Z",
    updatedAt: "2026-06-25T16:00:00Z",
  },

  // ── Past approved work (scope: all) — what we said "yes" to
  {
    id: "kb-item-approved-1",
    userId: DEMO_USER.id,
    title: "Approved Cold Email Template — Pain-Led",
    content:
      "Subject: {{first_name}}, your after-hours leads\n\nHi {{first_name}},\n\nSaw that {{company}} gets ~40% of inquiries after 5pm. Most of those go to voicemail and never come back.\n\nWe build AI systems that reply to those leads in under 60 seconds, qualify them, and book the appointment — without you hiring anyone.\n\n14-day setup. Flat $299/mo. We've done it for 12 dental practices in Texas.\n\nWorth a 15-min call?\n\n— Alex",
    source: "approved_work",
    sourceRef: "wri-1",
    tags: ["cold email", "outreach", "template", "approved", "pain-led"],
    scope: "sales",
    embedding: null,
    trainingWeight: 100,
    confidence: 100,
    createdBy: "ai",
    lastUsedAt: "2026-07-04T05:00:00Z",
    useCount: 67,
    createdAt: "2026-06-10T12:00:00Z",
    updatedAt: "2026-06-10T12:00:00Z",
  },
  {
    id: "kb-item-approved-2",
    userId: DEMO_USER.id,
    title: "Approved LinkedIn Post — Contrarian",
    content:
      "Most AI tools for local businesses are designed for enterprise teams.\n\nWe built the opposite.\n\nAcme AI is for the owner-operator with 3 locations and a phone that rings after 5pm. One setup call. 14 days. $299/mo. Replies in 60 seconds.\n\nIf you're a clinic owner losing leads to voicemail, this is for you.\n\n— Alex, founder",
    source: "approved_work",
    sourceRef: "wri-2",
    tags: ["linkedin", "social", "approved", "contrarian"],
    scope: "marketing",
    embedding: null,
    trainingWeight: 100,
    confidence: 100,
    createdBy: "ai",
    lastUsedAt: "2026-07-03T19:00:00Z",
    useCount: 41,
    createdAt: "2026-06-12T14:00:00Z",
    updatedAt: "2026-06-12T14:00:00Z",
  },

  // ── Policies (scope: legal)
  {
    id: "kb-item-policy-1",
    userId: DEMO_USER.id,
    title: "Refund Policy",
    content:
      "Full refund within 30 days of setup payment, no questions asked. After 30 days: prorated refund of unused months on the subscription. ROI guarantee is separate — full refund if 3x ROI not achieved in 90 days. Always confirm with support@acmeaistudios.example before processing.",
    source: "user_added",
    sourceRef: null,
    tags: ["policy", "refund", "guarantee", "legal"],
    scope: "legal",
    embedding: null,
    trainingWeight: 90,
    confidence: 95,
    createdBy: "user",
    lastUsedAt: "2026-07-01T10:00:00Z",
    useCount: 15,
    createdAt: "2026-05-25T09:00:00Z",
    updatedAt: "2026-06-15T11:00:00Z",
  },
  {
    id: "kb-item-policy-2",
    userId: DEMO_USER.id,
    title: "Privacy Policy Highlights",
    content:
      "We never sell customer data. We collect: name, email, business info for service delivery. We use: Resend for email, Cloudflare R2 for files, OpenRouter for AI processing. Customer data is encrypted at rest. GDPR + CCPA compliant. Full policy at acmeaistudios.example/privacy.",
    source: "user_added",
    sourceRef: null,
    tags: ["policy", "privacy", "gdpr", "legal"],
    scope: "legal",
    embedding: null,
    trainingWeight: 85,
    confidence: 90,
    createdBy: "user",
    lastUsedAt: "2026-06-30T11:00:00Z",
    useCount: 8,
    createdAt: "2026-05-25T09:30:00Z",
    updatedAt: "2026-06-15T11:00:00Z",
  },

  // ── Website content (scope: marketing)
  {
    id: "kb-item-web-1",
    userId: DEMO_USER.id,
    title: "Website Homepage Headline",
    content:
      "We build AI websites that answer your customers in 60 seconds — even when you're asleep. Built for dental practices, clinics, and real estate agents who miss 40% of their leads after hours.",
    source: "user_added",
    sourceRef: null,
    tags: ["website", "homepage", "headline", "marketing"],
    scope: "marketing",
    embedding: null,
    trainingWeight: 95,
    confidence: 95,
    createdBy: "user",
    lastUsedAt: "2026-07-04T08:30:00Z",
    useCount: 32,
    createdAt: "2026-06-01T10:00:00Z",
    updatedAt: "2026-06-22T13:00:00Z",
  },
];

// ─── Company Missions (Phase 3 schema) ────────────────────────

export const MOCK_COMPANY_MISSIONS: CompanyMission[] = [
  {
    id: "mission-demo-1",
    userId: DEMO_USER.id,
    mission: "Help 100 local service businesses stop losing after-hours leads by Q4 2026.",
    vision:
      "Every small business in America has an AI front-desk that never sleeps, never misses a lead, and books appointments around the clock. We make that default.",
    cadence: "quarterly",
    northStarMetric: "paying_clients",
    northStarTarget: "100",
    values: [
      "Customer outcomes over our convenience",
      "Calm confidence over hype",
      "Specificity over abstraction",
      "Numbers over adjectives",
    ],
    createdAt: "2026-04-01T09:00:00Z",
    updatedAt: "2026-07-01T10:00:00Z",
  },
];

// ─── Company Goals (Phase 3 schema) ───────────────────────────

export const MOCK_COMPANY_GOALS_NEW: CompanyGoal[] = [
  {
    id: "goal-new-1",
    userId: DEMO_USER.id,
    missionId: "mission-demo-1",
    title: "Get 50 qualified leads this month",
    description:
      "Generate 50 leads that match our ICP (dental practices, clinics, real estate agents in Tier-1 US cities doing $500k-$5M/year).",
    horizon: "30_day",
    status: "active",
    successMetric: "qualified_leads",
    successTarget: "50",
    progressPct: 62,
    ceoPlan: {
      rationale:
        "Sales-led motion with marketing support. Three waves: research → outreach → qualification.",
      risks: ["Lead quality drives downstream", "Outreach volume vs reply rate"],
      departmentBreakdown: [
        {
          department: "research",
          tasks: [
            {
              title: "Build lead list of 200 SaaS founders",
              objective: "Generate a high-quality list of 200 leads matching the ICP, with name, role, company, email, and a personalization hook.",
              suggestedEmployeeSlug: "lead-researcher",
              suggestedSkill: "Lead generation",
              estimatedCredits: 120,
              requiresApproval: false,
              scheduledWithinDays: 2,
            },
          ],
        },
        {
          department: "sales",
          tasks: [
            {
              title: "Send 100 personalized cold emails",
              objective: "Use pain-led template, one email per lead, no mass blast.",
              suggestedEmployeeSlug: "outreach-employee",
              suggestedSkill: "Cold email",
              estimatedCredits: 200,
              requiresApproval: true,
              scheduledWithinDays: 5,
            },
          ],
        },
      ],
    },
    planApprovedAt: "2026-07-02T09:00:00Z",
    planApprovedBy: "user",
    dueDate: "2026-07-31",
    completedAt: null,
    archivedAt: null,
    createdAt: "2026-07-01T10:00:00Z",
    updatedAt: "2026-07-04T08:00:00Z",
  },
  {
    id: "goal-new-2",
    userId: DEMO_USER.id,
    missionId: "mission-demo-1",
    title: "Publish 30 days of content",
    description: "Ship 30 days of social content + 4 long-form blog posts.",
    horizon: "30_day",
    status: "active",
    successMetric: "content_pieces",
    successTarget: "30",
    progressPct: 47,
    ceoPlan: {
      rationale: "Content velocity builds brand. Marketing Manager plans, Content Writer ships.",
      risks: ["Quality drops at volume"],
      departmentBreakdown: [
        {
          department: "marketing",
          tasks: [
            {
              title: "Write 4 blog posts",
              objective: "800-1500 words each, SEO-optimized, brand-voice consistent.",
              suggestedEmployeeSlug: "content-writer",
              suggestedSkill: "Long-form",
              estimatedCredits: 200,
              requiresApproval: true,
              scheduledWithinDays: 14,
            },
          ],
        },
      ],
    },
    planApprovedAt: "2026-07-02T09:30:00Z",
    planApprovedBy: "user",
    dueDate: "2026-07-31",
    completedAt: null,
    archivedAt: null,
    createdAt: "2026-07-01T11:00:00Z",
    updatedAt: "2026-07-04T07:00:00Z",
  },
  {
    id: "goal-new-3",
    userId: DEMO_USER.id,
    missionId: "mission-demo-1",
    title: "Launch new pricing page",
    description: "Build, test, and ship a new pricing page that lifts trial signups by 25%.",
    horizon: "30_day",
    status: "active",
    successMetric: "trial_signup_lift",
    successTarget: "25",
    progressPct: 75,
    ceoPlan: {
      rationale: "",
      risks: [],
      departmentBreakdown: [],
    },
    planApprovedAt: "2026-07-01T09:00:00Z",
    planApprovedBy: "user",
    dueDate: "2026-07-15",
    completedAt: null,
    archivedAt: null,
    createdAt: "2026-06-25T09:00:00Z",
    updatedAt: "2026-07-03T16:00:00Z",
  },
];

// ─── Department Goals ─────────────────────────────────────────

export const MOCK_DEPARTMENT_GOALS: DepartmentGoal[] = [
  {
    id: "dpg-1",
    userId: DEMO_USER.id,
    companyGoalId: "goal-new-1",
    department: "research",
    objective: "Build lead list of 200 SaaS founders · Generate competitor scan",
    metric: "leads_researched",
    targetValue: "200",
    progressPct: 80,
    status: "active",
    createdAt: "2026-07-02T09:00:00Z",
  },
  {
    id: "dpg-2",
    userId: DEMO_USER.id,
    companyGoalId: "goal-new-1",
    department: "sales",
    objective: "Send 100 personalized cold emails · Schedule 25 discovery calls",
    metric: "emails_sent",
    targetValue: "100",
    progressPct: 55,
    status: "active",
    createdAt: "2026-07-02T09:00:00Z",
  },
  {
    id: "dpg-3",
    userId: DEMO_USER.id,
    companyGoalId: "goal-new-2",
    department: "marketing",
    objective: "Write 4 blog posts · Generate 30 social posts",
    metric: "pieces_published",
    targetValue: "30",
    progressPct: 47,
    status: "active",
    createdAt: "2026-07-02T09:30:00Z",
  },
];

// ─── Agent Runs ───────────────────────────────────────────────

export const MOCK_AGENT_RUNS: AgentRun[] = [
  {
    id: "run-1",
    userId: DEMO_USER.id,
    companyId: null,
    hiredAgentId: null,
    taskId: null,
    goalId: "goal-new-1",
    workReviewItemId: "wri-1",
    scheduledWorkId: null,
    employeeSlug: "outreach-employee",
    employeeName: "Echo — Outreach Specialist",
    department: "sales",
    modelProvider: "openrouter",
    modelName: "openai/gpt-4o-mini",
    promptVersion: "v1",
    input: { title: "Send 100 personalized cold emails", description: "Pain-led email template" },
    memoryUsed: [
      { source: "user_added", title: "Approved Cold Email Template — Pain-Led", snippet: "Subject: {{first_name}}, your after-hours leads..." },
      { source: "user_added", title: "Ideal Customer Profile", snippet: "Owner-operators of local service businesses..." },
    ],
    toolsUsed: [],
    output: "Subject: {{first_name}}, your after-hours leads\n\nHi {{first_name}},\n\nSaw that {{company}} gets ~40% of inquiries after 5pm...",
    outputStructured: null,
    evaluatorResult: {
      qualityScore: 88,
      relevanceScore: 95,
      safetyScore: 92,
      confidenceScore: 85,
      notes: "Strong pain-led hook, references approved template, clear CTA.",
      passed: true,
    },
    creditsEstimated: 25,
    creditsActual: 25,
    durationMs: 4200,
    status: "needs_approval",
    errorMessage: null,
    errorStack: null,
    startedAt: "2026-07-04T07:30:00Z",
    completedAt: "2026-07-04T07:30:04Z",
    createdAt: "2026-07-04T07:30:00Z",
  },
  {
    id: "run-2",
    userId: DEMO_USER.id,
    companyId: null,
    hiredAgentId: null,
    taskId: null,
    goalId: "goal-new-1",
    workReviewItemId: "wri-2",
    scheduledWorkId: null,
    employeeSlug: "content-writer",
    employeeName: "Aria — Content Writer",
    department: "marketing",
    modelProvider: "openrouter",
    modelName: "anthropic/claude-3.5-sonnet",
    promptVersion: "v1",
    input: { title: "Write 4 blog posts (one per day)", description: "Blog post on after-hours lead capture" },
    memoryUsed: [
      { source: "user_added", title: "Brand Voice — Acme AI Studios", snippet: "Calm confidence. No hype..." },
      { source: "user_added", title: "Approved LinkedIn Post — Contrarian", snippet: "Most AI tools for local businesses are designed for enterprise..." },
    ],
    toolsUsed: [],
    output: "## Why your after-hours leads are vanishing\n\nMost local service businesses...",
    outputStructured: null,
    evaluatorResult: {
      qualityScore: 91,
      relevanceScore: 88,
      safetyScore: 95,
      confidenceScore: 82,
      notes: "Strong hook, brand-voice consistent, references pain points from ICP.",
      passed: true,
    },
    creditsEstimated: 80,
    creditsActual: 80,
    durationMs: 12500,
    status: "needs_approval",
    errorMessage: null,
    errorStack: null,
    startedAt: "2026-07-04T06:00:00Z",
    completedAt: "2026-07-04T06:00:12Z",
    createdAt: "2026-07-04T06:00:00Z",
  },
  {
    id: "run-3",
    userId: DEMO_USER.id,
    companyId: null,
    hiredAgentId: null,
    taskId: null,
    goalId: "goal-new-3",
    workReviewItemId: null,
    scheduledWorkId: null,
    employeeSlug: "competitor-researcher",
    employeeName: "Rival — Competitor Researcher",
    department: "research",
    modelProvider: "openrouter",
    modelName: "anthropic/claude-3.5-sonnet",
    promptVersion: "v1",
    input: { title: "Competitor scan — Local Lead AI", description: "Pricing + positioning analysis" },
    memoryUsed: [
      { source: "user_added", title: "Competitor — Local Lead AI", snippet: "Direct competitor. They charge $400-$800/mo + setup..." },
    ],
    toolsUsed: [],
    output: "## Local Lead AI — Positioning Update\n\nTheir pricing moved from $300/mo to $450/mo in Q2...",
    outputStructured: null,
    evaluatorResult: {
      qualityScore: 84,
      relevanceScore: 92,
      safetyScore: 95,
      confidenceScore: 78,
      notes: "Cited competitor knowledge, surfaced pricing shift opportunity.",
      passed: true,
    },
    creditsEstimated: 40,
    creditsActual: 40,
    durationMs: 6800,
    status: "completed",
    errorMessage: null,
    errorStack: null,
    startedAt: "2026-07-03T16:00:00Z",
    completedAt: "2026-07-03T16:00:07Z",
    createdAt: "2026-07-03T16:00:00Z",
  },
];

// ─── Agent Run Steps ──────────────────────────────────────────

export const MOCK_AGENT_RUN_STEPS: AgentRunStep[] = [
  {
    id: "step-run-1-0",
    agentRunId: "run-1",
    stepIndex: 0,
    stepName: "permission_check",
    startedAt: "2026-07-04T07:30:00Z",
    completedAt: "2026-07-04T07:30:00Z",
    durationMs: 2,
    input: { employeeLevel: 2, actionRisk: "external" },
    output: { allowed: true, requiresApproval: true, approvalReason: "External send" },
    status: "completed",
    errorMessage: null,
  },
  {
    id: "step-run-1-1",
    agentRunId: "run-1",
    stepIndex: 1,
    stepName: "budget_check",
    startedAt: "2026-07-04T07:30:00Z",
    completedAt: "2026-07-04T07:30:00Z",
    durationMs: 1,
    input: { estimatedCredits: 25 },
    output: { allowed: true, creditsRemaining: 8800 },
    status: "completed",
    errorMessage: null,
  },
  {
    id: "step-run-1-2",
    agentRunId: "run-1",
    stepIndex: 2,
    stepName: "memory_retrieval",
    startedAt: "2026-07-04T07:30:01Z",
    completedAt: "2026-07-04T07:30:01Z",
    durationMs: 25,
    input: { query: "personalized cold emails pain-led outreach" },
    output: { hitCount: 2, hits: [] },
    status: "completed",
    errorMessage: null,
  },
  {
    id: "step-run-1-3",
    agentRunId: "run-1",
    stepIndex: 3,
    stepName: "llm_call",
    startedAt: "2026-07-04T07:30:01Z",
    completedAt: "2026-07-04T07:30:04Z",
    durationMs: 4150,
    input: { model: "openai/gpt-4o-mini" },
    output: { modelUsed: "openai/gpt-4o-mini", outputLength: 412 },
    status: "completed",
    errorMessage: null,
  },
  {
    id: "step-run-1-4",
    agentRunId: "run-1",
    stepIndex: 4,
    stepName: "evaluation",
    startedAt: "2026-07-04T07:30:04Z",
    completedAt: "2026-07-04T07:30:04Z",
    durationMs: 22,
    input: { outputLength: 412 },
    output: { passed: true, qualityScore: 88, relevanceScore: 95 },
    status: "completed",
    errorMessage: null,
  },
];

// ─── Work Review Items ────────────────────────────────────────

export const MOCK_WORK_REVIEW_ITEMS: WorkReviewItem[] = [
  {
    id: "wri-1",
    userId: DEMO_USER.id,
    taskId: null,
    goalId: "goal-new-1",
    departmentGoalId: "dpg-2",
    agentRunId: "run-1",
    hiredAgentId: null,
    title: "Cold email sequence — 100 personalized emails",
    summary:
      "Echo prepared 100 personalized cold emails using your pain-led template, ready to send to the 200-lead list Scout built yesterday.",
    body: "## Cold Email Sequence — Ready to Send\n\n**Volume:** 100 emails\n**Template:** Pain-led (your approved template)\n**List:** 200 SaaS founders built by Scout\n**Personalization:** Each email includes first name, company name, and a 1-line hook from their LinkedIn.\n\n### 3 Email Variations\n\n**Variation A — Pain:**\nSubject: {{first_name}}, your after-hours leads\n[full email body]\n\n**Variation B — Story:**\nSubject: How Dr. Sarah cut her missed calls by 80%\n[full email body]\n\n**Variation C — Contrarian:**\nSubject: Don't hire a receptionist\n[full email body]\n\n### Sending Plan\n- Day 1: Variation A to first 33 leads\n- Day 3: Variation B to next 33\n- Day 5: Variation C to final 34\n- Day 8: Follow-up #1 to non-openers\n- Day 14: Follow-up #2 to non-repliers",
    bodyStructured: {},
    kind: "outreach",
    status: "needs_approval",
    priority: "high",
    employeeName: "Echo — Outreach Specialist",
    employeeSlug: "outreach-employee",
    department: "sales",
    qualityScore: 88,
    relevanceScore: 95,
    safetyScore: 92,
    confidenceScore: 85,
    evaluatorNotes: "Strong pain-led hook, references approved template, clear CTA.",
    regenerationCount: 0,
    creditsEstimated: 200,
    requiresApproval: true,
    approvalReason: "External send — emails leave your company.",
    suggestedNextAction: "Approve to send via Outreach employee, or edit the variations before sending.",
    approvedAt: null,
    rejectedAt: null,
    publishedAt: null,
    sentAt: null,
    createdAt: "2026-07-04T07:30:00Z",
    updatedAt: "2026-07-04T07:30:00Z",
  },
  {
    id: "wri-2",
    userId: DEMO_USER.id,
    taskId: null,
    goalId: "goal-new-2",
    departmentGoalId: "dpg-3",
    agentRunId: "run-2",
    hiredAgentId: null,
    title: "Blog post — Why your after-hours leads are vanishing",
    summary:
      "Aria wrote a 1,200-word blog post on the after-hours lead problem for local service businesses. Brand-voice matched, ICP-anchored, ready to publish.",
    body: "## Why your after-hours leads are vanishing\n\nMost local service businesses lose 40-60% of their leads after 5pm.\n\nHere's what's actually happening:\n\n1. **Calls go to voicemail** — 80% of callers won't leave a message\n2. **Form submissions sit** — average response time is 17 hours\n3. **No follow-up** — 35% of inquiries get zero follow-up within a week\n\nThe math is brutal. If your dental practice gets 40 new patient inquiries a month and 40% come after hours, you're losing 16 potential patients every month to silence.\n\n[Full post continues with the solution, social proof, and CTA]",
    bodyStructured: {},
    kind: "content",
    status: "needs_approval",
    priority: "normal",
    employeeName: "Aria — Content Writer",
    employeeSlug: "content-writer",
    department: "marketing",
    qualityScore: 91,
    relevanceScore: 88,
    safetyScore: 95,
    confidenceScore: 82,
    evaluatorNotes: "Strong hook, brand-voice consistent, references pain points from ICP.",
    regenerationCount: 0,
    creditsEstimated: 80,
    requiresApproval: true,
    approvalReason: "External publish — content goes live on your site.",
    suggestedNextAction: "Approve to publish to campaign assets, or schedule for later.",
    approvedAt: null,
    rejectedAt: null,
    publishedAt: null,
    sentAt: null,
    createdAt: "2026-07-04T06:00:00Z",
    updatedAt: "2026-07-04T06:00:00Z",
  },
  {
    id: "wri-3",
    userId: DEMO_USER.id,
    taskId: null,
    goalId: "goal-new-3",
    departmentGoalId: null,
    agentRunId: "run-3",
    hiredAgentId: null,
    title: "Competitor scan — Local Lead AI pricing shift",
    summary:
      "Rival detected that Local Lead AI raised prices from $300 to $450/mo. This is a window to reposition on value.",
    body: "## Local Lead AI — Pricing Update Detected\n\n**What changed:** Their starter tier moved from $300/mo to $450/mo. The change is live on their pricing page as of last Tuesday.\n\n**Why it matters for Acme:**\n- We're at $299/mo. The gap just widened from $1 to $151.\n- Their churn risk: ~30% of customers were on the now-discontinued $300 tier\n- Inbound angle: 'Switched from Local Lead AI? Save $150/mo with us.'\n\n**Recommended next actions:**\n1. Add a 'Switching from Local Lead AI?' landing page\n2. Update sales scripts with the new pricing comparison\n3. Email warm leads who engaged but didn't convert last quarter",
    bodyStructured: {},
    kind: "research",
    status: "needs_approval",
    priority: "normal",
    employeeName: "Rival — Competitor Researcher",
    employeeSlug: "competitor-researcher",
    department: "research",
    qualityScore: 84,
    relevanceScore: 92,
    safetyScore: 95,
    confidenceScore: 78,
    evaluatorNotes: "Cited competitor knowledge, surfaced actionable pricing shift.",
    regenerationCount: 0,
    creditsEstimated: 40,
    requiresApproval: true,
    approvalReason: "Research output — save to Knowledge Base or share with team.",
    suggestedNextAction: "Approve to save to Knowledge Base so the whole team can use it.",
    approvedAt: null,
    rejectedAt: null,
    publishedAt: null,
    sentAt: null,
    createdAt: "2026-07-03T16:00:00Z",
    updatedAt: "2026-07-03T16:00:00Z",
  },
  {
    id: "wri-4",
    userId: DEMO_USER.id,
    taskId: null,
    goalId: null,
    departmentGoalId: null,
    agentRunId: null,
    hiredAgentId: null,
    title: "Reply to ticket — refund request from Jordan M.",
    summary:
      "Robin drafted a refund reply for an annual plan cancellation. Polite, brand-voice matched, requests feedback.",
    body: "Hi Jordan,\n\nTotally fine — I've processed your refund. You'll see it on your statement within 5 business days.\n\nIf you have a sec, I'd love to know what didn't click for you. Helps us build better. No pressure either way.\n\nBest,\nRobin (AI Support at Acme)",
    bodyStructured: {},
    kind: "reply",
    status: "needs_approval",
    priority: "high",
    employeeName: "Robin — Support Specialist",
    employeeSlug: "support-employee",
    department: "support",
    qualityScore: 86,
    relevanceScore: 90,
    safetyScore: 98,
    confidenceScore: 88,
    evaluatorNotes: "Brand-voice matched, asks for feedback without being pushy.",
    regenerationCount: 0,
    creditsEstimated: 5,
    requiresApproval: true,
    approvalReason: "External reply — message goes to a customer.",
    suggestedNextAction: "Approve to send to customer, or edit first.",
    approvedAt: null,
    rejectedAt: null,
    publishedAt: null,
    sentAt: null,
    createdAt: "2026-07-04T05:30:00Z",
    updatedAt: "2026-07-04T05:30:00Z",
  },
  {
    id: "wri-5",
    userId: DEMO_USER.id,
    taskId: null,
    goalId: null,
    departmentGoalId: null,
    agentRunId: null,
    hiredAgentId: null,
    title: "Pricing recommendation — launch $399/mo Pro tier",
    summary:
      "Sterling recommends a new Pro tier based on usage data. 23% of Growth users would pay $399/mo for the features they're already using heavily.",
    body: "## Pricing Recommendation — Launch $399/mo Pro Tier\n\nBased on usage data from the last 90 days, 23% of your Growth users would likely pay $399/mo for the features they're already using heavily.\n\n**Proposal:**\n- Pro: $399/mo — adds custom AI employee creation, advanced permissions, multi-channel auto-reply\n- Beta test with top 10 customers before public launch\n- Expected MRR impact: +$4,800/mo\n\n**Risk:** Could cannibalize Growth tier. Recommend grandfathering existing Growth customers at their current price.",
    bodyStructured: {},
    kind: "finance_draft",
    status: "needs_approval",
    priority: "normal",
    employeeName: "Sterling — AI CFO",
    employeeSlug: "cfo",
    department: "finance",
    qualityScore: 82,
    relevanceScore: 85,
    safetyScore: 88,
    confidenceScore: 76,
    evaluatorNotes:
      "Data-backed pricing recommendation. Note: not financial advice — review with a finance professional.",
    regenerationCount: 0,
    creditsEstimated: 30,
    requiresApproval: true,
    approvalReason: "Finance output — must be reviewed by a finance professional.",
    suggestedNextAction: "Review with a finance professional before publishing.",
    approvedAt: null,
    rejectedAt: null,
    publishedAt: null,
    sentAt: null,
    createdAt: "2026-07-03T14:00:00Z",
    updatedAt: "2026-07-03T14:00:00Z",
  },
  {
    id: "wri-6",
    userId: DEMO_USER.id,
    taskId: null,
    goalId: "goal-new-3",
    departmentGoalId: null,
    agentRunId: null,
    hiredAgentId: null,
    title: "CTA improvement plan — pricing page hero",
    summary:
      "Iris audited your pricing page CTA. 'Start Free Trial' has 4.2% click rate. Industry avg is 6.8%. 3 specific changes recommended.",
    body: "## Pricing Page CTA — Improvement Plan\n\n**Current:** 'Start Free Trial' — 4.2% click rate\n**Industry avg:** 6.8%\n**Potential lift:** 30-40%\n\n### 3 Changes\n\n1. **Change the verb to be specific:** 'Start My 14-Day Setup' (specific > abstract)\n2. **Add a trust line below:** '500+ founders · 4.9/5 · 14-day setup, no card required'\n3. **Move signup button 200px higher:** Reduce fold below to one line of text\n\nExpected impact: +2.6 percentage points on click rate → +62% trial signups at current traffic.",
    bodyStructured: {},
    kind: "analysis",
    status: "needs_approval",
    priority: "normal",
    employeeName: "Iris — UX Reviewer",
    employeeSlug: "ux-reviewer",
    department: "product-website",
    qualityScore: 87,
    relevanceScore: 90,
    safetyScore: 95,
    confidenceScore: 84,
    evaluatorNotes: "Specific, actionable, references current vs. industry benchmark.",
    regenerationCount: 0,
    creditsEstimated: 25,
    requiresApproval: true,
    approvalReason: "Analysis output — save insights to reports or share with team.",
    suggestedNextAction: "Approve to save insights to reports or assign to website builder for implementation.",
    approvedAt: null,
    rejectedAt: null,
    publishedAt: null,
    sentAt: null,
    createdAt: "2026-07-03T11:00:00Z",
    updatedAt: "2026-07-03T11:00:00Z",
  },
];

// ─── Credit Balances ──────────────────────────────────────────

export const MOCK_CREDIT_BALANCES: CreditBalance[] = [
  {
    id: "balance-1",
    userId: DEMO_USER.id,
    monthlyAllowance: 10000,
    monthlyUsed: 1420,
    rollover: 0,
    planTier: "growth",
    periodStart: "2026-07-01",
    periodEnd: "2026-07-31",
    updatedAt: "2026-07-04T08:00:00Z",
  },
];

// ─── Credit Usage Log ─────────────────────────────────────────

export const MOCK_CREDIT_USAGE_LOG: CreditUsageLog[] = [
  {
    id: "cu-1",
    userId: DEMO_USER.id,
    agentRunId: "run-1",
    employeeSlug: "outreach-employee",
    department: "sales",
    credits: 25,
    purpose: "task_run",
    createdAt: "2026-07-04T07:30:00Z",
  },
  {
    id: "cu-2",
    userId: DEMO_USER.id,
    agentRunId: "run-2",
    employeeSlug: "content-writer",
    department: "marketing",
    credits: 80,
    purpose: "task_run",
    createdAt: "2026-07-04T06:00:00Z",
  },
  {
    id: "cu-3",
    userId: DEMO_USER.id,
    agentRunId: "run-3",
    employeeSlug: "competitor-researcher",
    department: "research",
    credits: 40,
    purpose: "task_run",
    createdAt: "2026-07-03T16:00:00Z",
  },
];

// ─── Audit Logs ───────────────────────────────────────────────

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: "audit-1",
    userId: DEMO_USER.id,
    actor: "user",
    action: "mission_set",
    targetType: "company_mission",
    targetId: "mission-demo-1",
    metadata: { mission: "Help 100 local service businesses..." },
    note: "Initial mission set during onboarding",
    ipAddress: null,
    createdAt: "2026-04-01T09:00:00Z",
  },
  {
    id: "audit-2",
    userId: DEMO_USER.id,
    actor: "user",
    action: "goal_created",
    targetType: "company_goal",
    targetId: "goal-new-1",
    metadata: { title: "Get 50 qualified leads this month" },
    note: null,
    ipAddress: null,
    createdAt: "2026-07-01T10:00:00Z",
  },
  {
    id: "audit-3",
    userId: DEMO_USER.id,
    actor: "ai",
    action: "plan_generated",
    targetType: "company_goal",
    targetId: "goal-new-1",
    metadata: { departmentCount: 2, taskCount: 2 },
    note: "Atlas (AI CEO) generated the plan",
    ipAddress: null,
    createdAt: "2026-07-02T08:55:00Z",
  },
  {
    id: "audit-4",
    userId: DEMO_USER.id,
    actor: "user",
    action: "plan_approved",
    targetType: "company_goal",
    targetId: "goal-new-1",
    metadata: {},
    note: null,
    ipAddress: null,
    createdAt: "2026-07-02T09:00:00Z",
  },
  {
    id: "audit-5",
    userId: DEMO_USER.id,
    actor: "ai",
    action: "task_completed",
    targetType: "agent_run",
    targetId: "run-1",
    metadata: { employeeSlug: "outreach-employee", creditsUsed: 25, qualityScore: 88 },
    note: "Echo produced output for \"Send 100 personalized cold emails\"",
    ipAddress: null,
    createdAt: "2026-07-04T07:30:00Z",
  },
  {
    id: "audit-6",
    userId: DEMO_USER.id,
    actor: "ai",
    action: "work_review_created",
    targetType: "work_review_item",
    targetId: "wri-1",
    metadata: { employeeSlug: "outreach-employee" },
    note: "Cold email sequence ready for approval",
    ipAddress: null,
    createdAt: "2026-07-04T07:30:00Z",
  },
];

// ─── Scheduled Work (heartbeats) ──────────────────────────────

export const MOCK_SCHEDULED_WORK: ScheduledWork[] = [
  {
    id: "sw-1",
    userId: DEMO_USER.id,
    hiredAgentId: null,
    employeeSlug: "ceo",
    employeeName: "Atlas — AI CEO",
    title: "Daily CEO briefing",
    description: "Generate the morning briefing: top priorities, wins, needs attention, risks.",
    frequency: "daily",
    timeOfDay: "08:00",
    dayOfWeek: null,
    dayOfMonth: null,
    timezone: "America/Los_Angeles",
    taskTemplate: {
      title: "Generate today's CEO briefing",
      description: "Compose the daily briefing covering: top priorities, wins, needs attention, pending approvals, risks, opportunities.",
      input: { type: "daily_briefing" },
    },
    isEnabled: true,
    requiresApproval: false,
    budgetPerRun: 20,
    lastRunAt: "2026-07-04T08:00:00Z",
    lastRunStatus: "completed",
    nextRunAt: "2026-07-05T08:00:00Z",
    createdAt: "2026-05-01T09:00:00Z",
  },
  {
    id: "sw-2",
    userId: DEMO_USER.id,
    hiredAgentId: null,
    employeeSlug: "competitor-researcher",
    employeeName: "Rival — Competitor Researcher",
    title: "Weekly competitor scan",
    description: "Check competitor pricing, product launches, and positioning updates.",
    frequency: "weekly",
    timeOfDay: "09:00",
    dayOfWeek: 1, // Monday
    dayOfMonth: null,
    timezone: "America/Los_Angeles",
    taskTemplate: {
      title: "Weekly competitor scan",
      description: "Scan the 5 main competitors for pricing changes, new features, and notable positioning shifts.",
      input: { type: "competitor_scan", competitors: ["Local Lead AI", "Birdeye", "ServiceTitan"] },
    },
    isEnabled: true,
    requiresApproval: true,
    budgetPerRun: 80,
    lastRunAt: "2026-07-01T09:00:00Z",
    lastRunStatus: "needs_approval",
    nextRunAt: "2026-07-08T09:00:00Z",
    createdAt: "2026-05-01T09:00:00Z",
  },
  {
    id: "sw-3",
    userId: DEMO_USER.id,
    hiredAgentId: null,
    employeeSlug: "outreach-employee",
    employeeName: "Echo — Outreach Specialist",
    title: "Daily lead follow-up scan",
    description: "Check warm leads and prepare follow-up drafts.",
    frequency: "daily",
    timeOfDay: "10:00",
    dayOfWeek: null,
    dayOfMonth: null,
    timezone: "America/Los_Angeles",
    taskTemplate: {
      title: "Daily lead follow-up",
      description: "Scan warm leads, identify those without recent contact, draft follow-up messages.",
      input: { type: "lead_followup" },
    },
    isEnabled: true,
    requiresApproval: true,
    budgetPerRun: 40,
    lastRunAt: "2026-07-04T10:00:00Z",
    lastRunStatus: "needs_approval",
    nextRunAt: "2026-07-05T10:00:00Z",
    createdAt: "2026-05-15T09:00:00Z",
  },
  {
    id: "sw-4",
    userId: DEMO_USER.id,
    hiredAgentId: null,
    employeeSlug: "cfo",
    employeeName: "Sterling — AI CFO",
    title: "Monthly pricing review",
    description: "Review unit economics and suggest pricing optimizations.",
    frequency: "monthly",
    timeOfDay: "09:00",
    dayOfWeek: null,
    dayOfMonth: 1,
    timezone: "America/Los_Angeles",
    taskTemplate: {
      title: "Monthly pricing review",
      description: "Analyze MRR, churn, and usage data. Recommend pricing changes.",
      input: { type: "pricing_review" },
    },
    isEnabled: true,
    requiresApproval: true,
    budgetPerRun: 100,
    lastRunAt: "2026-07-01T09:00:00Z",
    lastRunStatus: "needs_approval",
    nextRunAt: "2026-08-01T09:00:00Z",
    createdAt: "2026-05-01T09:00:00Z",
  },
];
