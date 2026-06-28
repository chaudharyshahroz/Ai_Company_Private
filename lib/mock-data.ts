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
