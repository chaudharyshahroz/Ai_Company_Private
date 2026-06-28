/**
 * OpenRouter client — multi-model AI routing.
 *
 * In demo mode (no OPENROUTER_API_KEY), returns realistic mock output instead
 * of making a real API call. The mock output varies by agent template so the
 * dashboard looks alive.
 */

import { env, isDemoMode } from "./demo";
import { MOCK_AGENT_TEMPLATES } from "./mock-data";

export interface RunAgentOptions {
  /** Agent template ID — used to pick a realistic mock response. */
  templateId: string;
  /** Final, fully-rendered system prompt (after brain injection). */
  systemPrompt: string;
  /** User's task instruction. */
  userMessage: string;
  /** Model ID (OpenRouter format). */
  model?: string;
  /** Maximum output tokens. */
  maxTokens?: number;
}

export interface RunAgentResult {
  output: string;
  modelUsed: string;
  tokens: { input: number; output: number };
  durationMs: number;
}

// ─── Public API ─────────────────────────────────────────────

export async function runAgent(opts: RunAgentOptions): Promise<RunAgentResult> {
  const start = Date.now();

  if (isDemoMode() || !env.openrouter) {
    return mockRunAgent(opts, start);
  }

  // Real OpenRouter call
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "X-Title": "Reklu",
    },
    body: JSON.stringify({
      model: opts.model ?? "anthropic/claude-3.5-sonnet",
      messages: [
        { role: "system", content: opts.systemPrompt },
        { role: "user", content: opts.userMessage },
      ],
      max_tokens: opts.maxTokens ?? 1500,
      stream: false,
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
  }

  const data = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
    usage: { prompt_tokens: number; completion_tokens: number };
    model: string;
  };

  return {
    output: data.choices[0]?.message.content ?? "",
    modelUsed: data.model,
    tokens: {
      input: data.usage.prompt_tokens,
      output: data.usage.completion_tokens,
    },
    durationMs: Date.now() - start,
  };
}

// ─── Mock execution (used in demo mode) ─────────────────────

const MOCK_OUTPUTS: Record<string, string> = {
  "ceo-agent": `## Top 5 priorities this week

Based on what shipped last week and the signals from your team:

1. **Ship the launch email sequence** — Aria finished it; it's just waiting on you.
2. **Move from 12 to 50 outreach emails** — the motion is working.
3. **Add Sterling (CFO) to the team** — your unit economics need attention.
4. **3 customer calls** — block 90 minutes this week.
5. **Rewrite the top 5 help docs** — Riley can draft, you review.

### Why these
Linear is closing the AI-quality gap. Notion is going wide. ClickUp is noisy. Our edge is depth + voice + solo-founder focus. This week makes that real.`,
  "content-writer": `Most "AI launches" die in a Notion doc.

Here's what we did differently with our Q2 launch:

→ Wrote the landing page copy first, not the product
→ Recorded a 90s Loom instead of a Notion spec
→ Sent it to 30 people we'd talked to in the last 90 days
→ Built the waitlist before the feature was done

Result: 412 signups before launch day. The product was the smallest part.

If you're a solo founder about to launch, stop building and start telling.

#buildinpublic #saas #productlaunch`,
  "research-analyst": `## Competitor Brief — Last 30 Days

### Linear
- Shipped: native GitHub issue sync + AI triage suggestions
- Risk: their AI moves are early but polished; we're 6 months behind

### Notion
- Shipped: Notion Mail (yes, an email client)
- Risk: they're moving upmarket; doesn't compete directly today

### ClickUp
- Shipped: ClickUp Brain 2.0 — extensive marketing push
- Risk: going hard on AI-everywhere; pitch is messy but volume is real

### Opportunities for Acme
1. Position on "Linear-quality" AI — the market is dividing
2. Lean into solo-founder messaging — neither Linear nor ClickUp does this
3. Go deep on integrations, not wide`,
  "sales-agent": `Subject: Quick question about {{business_name}}

Hey {{first_name}},

Saw that {{company}} just closed your seed round — congrats. I've been digging into how founders at your stage think about content ops, and I noticed something interesting:

You're publishing ~2 posts/month. The founders who outpace you publish 8-10/month, but they didn't hire a writer — they hired an AI agent that learned their voice after one sample.

That's literally what we built. I'd love to send you a 2-minute video showing how it works. Worth a look?

— {{sender_name}}`,
  "support-agent": `Hi there,

Thanks for reaching out! I can see you're running into an issue with [your reported issue].

I checked your account and the most common cause for this is [common cause #1]. Two quick things to try:

1. [Step 1]
2. [Step 2]

If neither of those works, just reply to this email and I'll escalate to a human on our team. We typically respond within 4 hours during business hours.

Sorry for the friction — and thanks for the patience.

— Riley (Customer Support, Acme Studios)`,
  "cmo-agent": `## Campaign Brief: Q3 Launch

### Goal
Drive 1,000 signups for the Q3 launch over 30 days.

### Audience
Solo founders, seed-stage SaaS, $50k-$500k ARR.

### Channels
1. LinkedIn (primary) — 3 posts/week from the founder, 2 from Aria
2. Twitter — daily, founder-led
3. Cold email — 500 targeted sends via Hunter
4. IndieHackers — 1 deep post/week

### Messaging
Lead with the contrarian: "Don't launch the product. Launch the waitlist."

### Success metrics
- 1,000 signups
- 30% open rate on email
- 8% reply rate on outreach
- 5% conversion to paid

— Maya`,
  "hr-agent": `# Senior Backend Engineer

## About Acme Studios
We're a small team building an AI company platform for solo founders. Backed by [investors]. Profitable. 500 paying customers.

## The role
You'll own the backend — agent orchestration, billing, and integrations. You'll work directly with the founder (Alex) and our small engineering team. Ship to production on day one.

## What you'll do
- Design and ship the agent execution pipeline
- Build integrations with Notion, Slack, HubSpot, Linear
- Own reliability and observability
- Hire and mentor as we grow

## You probably have
- 5+ years building production backend systems
- Strong TypeScript / Node
- Comfort with Postgres, queues, and event-driven architecture
- Experience shipping AI/LLM products a plus

## Compensation
$160k-$220k + 0.5-1.5% equity. Remote-friendly.`,
  "cmo-agent-default": `## Campaign Brief

I drafted a campaign concept for your business. The hook: lead with the contrarian — most "AI tools for founders" don't actually save time, they create a new job (briefing the AI).

Position Acme as the team, not the tool.`,
};

async function mockRunAgent(
  opts: RunAgentOptions,
  start: number,
): Promise<RunAgentResult> {
  // Simulate latency (3-8 seconds) so the UI feels real
  const delay = 3000 + Math.random() * 5000;
  await new Promise((r) => setTimeout(r, delay));

  const template = MOCK_AGENT_TEMPLATES.find((t) => t.id === opts.templateId);
  const slug = template?.slug ?? "content-writer";
  const output =
    MOCK_OUTPUTS[slug] ?? MOCK_OUTPUTS["content-writer"] ?? "Task completed.";

  return {
    output,
    modelUsed: opts.model ?? template?.model ?? "anthropic/claude-3.5-sonnet",
    tokens: {
      input: 200 + Math.floor(Math.random() * 200),
      output: Math.floor(output.length / 4),
    },
    durationMs: Date.now() - start,
  };
}