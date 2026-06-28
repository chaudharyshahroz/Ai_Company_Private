"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Container, Section, Eyebrow } from "@/components/ui/layout";
import { Panel } from "@/components/ui/Panel";
import { cn } from "@/lib/utils";

type DemoTab = "content" | "research" | "sales" | "support";

interface Demo {
  id: DemoTab;
  label: string;
  emoji: string;
  accent: string;
  input: string;
  output: string;
  meta: { agent: string; duration: string };
}

const DEMOS: Demo[] = [
  {
    id: "content",
    label: "Content",
    emoji: "✍️",
    accent: "#5E6AD2",
    input: "Write a LinkedIn post about our new product launch for SaaS founders.",
    output: `Most "AI launches" die in a Notion doc.

Here's what we did differently with our Q2 launch:

→ Wrote the landing page copy first, not the product
→ Recorded a 90s Loom instead of a Notion spec
→ Sent it to 30 people we'd talked to in the last 90 days
→ Built the waitlist before the feature was done

Result: 412 signups before launch day. The product was the smallest part.

If you're a solo founder about to launch, stop building and start telling.

#buildinpublic #saas #productlaunch`,
    meta: { agent: "Aria (Content Writer)", duration: "4.2 seconds" },
  },
  {
    id: "research",
    label: "Research",
    emoji: "🔍",
    accent: "#63D471",
    input: "Research our top 3 competitors and find their weaknesses.",
    output: `## Competitor Brief — Last 30 Days

**Linear** — polished AI moves, but narrow product; doesn't target solo founders.
**Notion AI** — wide product surface, AI is bolted on; positioning unclear.
**ClickUp Brain 2.0** — going hard on AI-everywhere; marketing is noisy.

### Your opening
The market is splitting between polished-but-narrow vs wide-and-mediocre. We're naturally the former — and Linear is the only other one with that quality bar. Lean in.`,
    meta: { agent: "Nova (Research Analyst)", duration: "8.4 seconds" },
  },
  {
    id: "sales",
    label: "Sales",
    emoji: "💼",
    accent: "#F5C451",
    input: "Draft 10 personalized cold emails to SaaS founders who recently raised seed rounds.",
    output: `Subject: Quick question about [Company]

Hey {{first_name}},

Saw you just closed your seed round — congrats. I've been digging into how founders at your stage think about content ops, and noticed something:

You're publishing ~2 posts/month. The founders who outpace you publish 8-10, but they didn't hire a writer — they hired an AI agent that learned their voice after one sample.

That's what we built. Worth a 2-minute look?

— {{sender_name}}

[9 more variations auto-personalized from your CRM data]`,
    meta: { agent: "Hunter (Sales Agent)", duration: "6.8 seconds" },
  },
  {
    id: "support",
    label: "Support",
    emoji: "💬",
    accent: "#EF6461",
    input: "Draft a reply to a customer asking about refund policy and account deletion.",
    output: `Hi {{first_name}},

Thanks for reaching out. I can help with both.

**Refunds:** We refund within 30 days, no questions asked. Just reply to this email with "refund" and we'll process it same-day.

**Account deletion:** You can delete your account anytime at /settings → Delete account. We purge all data within 7 days.

If you have a second, I'd love to know what's making you consider leaving — totally optional, but it helps us build better. Either way, no hard feelings.

— Robin (Customer Support, Acme Studios)`,
    meta: { agent: "Robin (Support Agent)", duration: "3.1 seconds" },
  },
];

export function LiveDemoSection() {
  const [active, setActive] = React.useState<DemoTab>("content");
  const [typed, setTyped] = React.useState("");
  const demo = DEMOS.find((d) => d.id === active)!;

  React.useEffect(() => {
    setTyped("");
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setTyped(demo.output.slice(0, i));
      if (i >= demo.output.length) clearInterval(interval);
    }, 8);
    return () => clearInterval(interval);
  }, [active, demo.output]);

  return (
    <Section id="demo">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Live demo</Eyebrow>
          <h2 className="text-section text-text">
            See what your agents <span className="text-accent">produce</span>.
          </h2>
          <p className="mt-5 text-body text-secondary md:text-lg">
            Real outputs from real AI employees, on your business context.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-12 max-w-5xl"
        >
          <Panel className="overflow-hidden p-0 shadow-2xl">
            {/* Tabs */}
            <div className="flex border-b border-border">
              {DEMOS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setActive(d.id)}
                  className={cn(
                    "relative flex flex-1 items-center justify-center gap-2 px-4 py-3 text-[13px] font-medium transition-colors",
                    active === d.id
                      ? "text-text"
                      : "text-secondary hover:text-text",
                  )}
                >
                  <span className="text-base">{d.emoji}</span>
                  <span>{d.label}</span>
                  {active === d.id && (
                    <motion.span
                      layoutId="demo-tab-indicator"
                      className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2">
              <div className="border-b border-border bg-surface-2 p-6 md:border-b-0 md:border-r">
                <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-surface px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-secondary">
                  Brief
                </div>
                <p className="text-[14px] leading-relaxed text-secondary">
                  <span className="text-muted-text">{"// "}</span>
                  {demo.input}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-border bg-surface px-2 py-1 text-[10px] text-muted-text">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Business context loaded from Brain
                </div>
              </div>

              <div className="p-6">
                <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent">
                  Output
                </div>
                <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-text">
                  {typed}
                  <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse-status bg-accent align-middle" />
                </pre>
                <div className="mt-4 border-t border-border/50 pt-3 text-[11px] text-muted-text">
                  Generated by <span className="text-text">{demo.meta.agent}</span> in{" "}
                  <span className="text-text">{demo.meta.duration}</span>
                </div>
              </div>
            </div>
          </Panel>
        </motion.div>
      </Container>
    </Section>
  );
}