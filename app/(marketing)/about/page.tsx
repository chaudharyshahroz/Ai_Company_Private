import type { Metadata } from "next";
import { Container, Section, Eyebrow } from "@/components/ui/layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Footer } from "@/components/marketing/Footer";
import { Sparkles, Target, Heart, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "Why we built Reklu — the story, the mission, the team.",
};

const values = [
  {
    icon: Sparkles,
    title: "Agents over assistants",
    body: "The future isn't a better chatbot. It's a team of AI workers that know your business, coordinate with each other, and improve over time.",
  },
  {
    icon: Target,
    title: "Built for the solo founder",
    body: "We're not building for the enterprise. We're building for the one-person company that's already wearing every hat.",
  },
  {
    icon: Heart,
    title: "Voice matters",
    body: "An agent that sounds generic is worse than no agent. Your brand voice is sacred — every output should sound like you, not like AI.",
  },
  {
    icon: Zap,
    title: "Ship, then ship again",
    body: "We move fast. We break things. We fix them. Every week brings a new agent, a new integration, a new capability.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Section className="!pt-40">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>About Reklu</Eyebrow>
            <h1 className="text-balance font-display text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              We&apos;re building the <span className="gradient-text">AI company</span>
            </h1>
            <p className="mt-5 text-pretty text-lg text-text-secondary">
              For founders who started a business for freedom and now can&apos;t leave their laptop.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-3xl">
            <GlassCard className="p-8 md:p-12">
              <div className="prose prose-invert max-w-none text-base leading-relaxed text-text-primary">
                <p className="mb-5">
                  Reklu was started in 2025 by a solo founder who was exhausted.
                </p>
                <p className="mb-5">
                  The AI tools available were clever but forgetful. They&apos;d write a great
                  LinkedIn post and then forget the company name the next day. They&apos;d research
                  competitors but never connect the dots to what you actually sell. They&apos;d
                  draft emails but never learn your voice.
                </p>
                <p className="mb-5">
                  So we built something different. Not a chatbot. Not a tool. A <strong>company</strong>.
                </p>
                <p>
                  A company with a CEO who sets weekly priorities. A CMO who plans campaigns. A
                  research analyst who watches competitors. A writer who sounds like you. A
                  sales agent who personalizes every outreach. They share a memory. They delegate
                  to each other. They report back on Monday.
                </p>
              </div>
            </GlassCard>
          </div>

          <div className="mx-auto mt-20 max-w-4xl">
            <h2 className="text-center font-display text-3xl font-bold tracking-tight md:text-4xl">
              What we believe
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {values.map((v) => {
                const Icon = v.icon;
                return (
                  <GlassCard key={v.title} hoverable className="p-6">
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary-light">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-base font-semibold text-text-primary">{v.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{v.body}</p>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>
      <Footer />
    </>
  );
}