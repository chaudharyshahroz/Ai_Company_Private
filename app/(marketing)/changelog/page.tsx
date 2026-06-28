import type { Metadata } from "next";
import { Container, Section, Eyebrow } from "@/components/ui/layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Footer } from "@/components/marketing/Footer";

export const metadata: Metadata = {
  title: "Changelog",
  description: "What's new at Reklu.",
};

const releases = [
  {
    version: "v0.4.0",
    date: "2026-06-20",
    title: "Agent-to-agent delegation",
    highlights: [
      "CEO agent now delegates to CMO, Writer, and Research automatically",
      "Delegation chain visualization in task detail view",
      "Sub-tasks inherit parent context and brain",
    ],
    tag: "new",
  },
  {
    version: "v0.3.2",
    date: "2026-06-12",
    title: "Two new agents: CFO and HR",
    highlights: [
      "Sterling — CFO Agent: budgets, forecasts, financial summaries",
      "Quinn — HR Agent: job descriptions, onboarding docs, policy drafts",
      "Updated Business Brain to include finance + people sections",
    ],
    tag: "agents",
  },
  {
    version: "v0.3.0",
    date: "2026-06-01",
    title: "Public launch",
    highlights: [
      "500+ founders signed up in the first week",
      "Pro plans opened to all",
      "Onboarding wizard simplified to 4 steps",
    ],
    tag: "milestone",
  },
  {
    version: "v0.2.0",
    date: "2026-05-15",
    title: "Weekly board reports",
    highlights: [
      "Every Monday, your CEO agent delivers a full executive summary",
      "Agent performance breakdown, top outputs, AI recommendations",
      "Email delivery via Resend",
    ],
    tag: "new",
  },
  {
    version: "v0.1.0",
    date: "2026-05-01",
    title: "Closed beta",
    highlights: [
      "142 founding users",
      "8 initial agents: CEO, CMO, Writer, Research, Sales, Support, CFO, HR",
      "Built the Business Brain — the persistent memory layer",
    ],
    tag: "milestone",
  },
];

export default function ChangelogPage() {
  return (
    <>
      <Section className="!pt-40">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>Changelog</Eyebrow>
            <h1 className="text-balance font-display text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              What&apos;s new at <span className="gradient-text">Reklu</span>
            </h1>
          </div>

          <div className="mx-auto mt-16 max-w-3xl space-y-5">
            {releases.map((r) => (
              <GlassCard key={r.version} className="p-7">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-primary-light">{r.version}</span>
                    <span className="rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">
                      {r.tag}
                    </span>
                  </div>
                  <time dateTime={r.date} className="text-xs text-text-tertiary">
                    {r.date}
                  </time>
                </div>
                <h2 className="text-xl font-semibold text-text-primary">{r.title}</h2>
                <ul className="mt-3 space-y-1.5">
                  {r.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2 text-sm text-text-secondary"
                    >
                      <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-primary-light" />
                      {h}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </div>
        </Container>
      </Section>
      <Footer />
    </>
  );
}