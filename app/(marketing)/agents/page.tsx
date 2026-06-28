import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section, Eyebrow } from "@/components/ui/layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Footer } from "@/components/marketing/Footer";
import { listAgentTemplates } from "@/lib/data";
import { formatUsd } from "@/lib/utils";
import { ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Agents",
  description: "Browse the full Reklu agent marketplace.",
};

export default async function AgentsPage() {
  const agents = await listAgentTemplates({ active: true });

  return (
    <>
      <Section className="!pt-40">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>Agent marketplace</Eyebrow>
            <h1 className="text-balance font-display text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              Every role your <span className="gradient-text">company needs</span>
            </h1>
            <p className="mt-5 text-pretty text-lg text-text-secondary">
              Hire pre-built agents trained for the work that wears you down.
            </p>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <GlassCard key={agent.id} hoverable className="flex h-full flex-col p-7">
                <div className="mb-4 flex items-start justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${agent.avatarColor} text-3xl shadow-md`}
                  >
                    {agent.avatarEmoji}
                  </div>
                  {agent.isFeatured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                      <Sparkles size={10} /> Featured
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-text-primary">{agent.name}</h3>
                <p className="mt-1 text-sm text-text-secondary">{agent.description}</p>

                <ul className="mt-4 space-y-1.5">
                  {agent.capabilities.map((cap) => (
                    <li
                      key={cap}
                      className="flex items-start gap-2 text-xs text-text-secondary"
                    >
                      <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-primary-light" />
                      {cap}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-5">
                  <div>
                    <div className="text-xs text-text-tertiary">Starting at</div>
                    <div className="text-base font-semibold text-text-primary">
                      {formatUsd(agent.monthlyPriceUsd ?? "0")}
                      <span className="text-xs font-normal text-text-tertiary">/mo</span>
                    </div>
                  </div>
                  <GlowButton asChild size="sm">
                    <Link href="/sign-up">
                      Hire <ArrowRight size={14} />
                    </Link>
                  </GlowButton>
                </div>
              </GlassCard>
            ))}
          </div>
        </Container>
      </Section>

      <Footer />
    </>
  );
}