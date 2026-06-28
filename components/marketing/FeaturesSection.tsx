"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Container, Section, Eyebrow } from "@/components/ui/layout";
import { Panel } from "@/components/ui/Panel";
import { Brain, Network, BarChart3, Bell, Plug, UserPlus, Cpu } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Business Brain",
    body: "Your agents share a persistent memory of your business. The longer you use Reklu, the smarter your company gets.",
  },
  {
    icon: Network,
    title: "Agents coordinate",
    body: "CEO delegates to CMO. CMO briefs the Writer. Your agents work as a team, not isolated bots.",
  },
  {
    icon: BarChart3,
    title: "Weekly board report",
    body: "Every Monday, your AI company sends a full executive report: done, next, KPIs, recommendations.",
  },
  {
    icon: Bell,
    title: "Proactive alerts",
    body: "Your agents don't wait. They find opportunities, surface risks, and tell you first.",
  },
  {
    icon: Plug,
    title: "50+ integrations",
    body: "Connect your CRM, email, Notion, Slack, calendar, and more. No code required.",
  },
  {
    icon: UserPlus,
    title: "Hire & fire",
    body: "Build the exact team you need. Add, pause, or remove employees anytime.",
  },
  {
    icon: Cpu,
    title: "Multi-model AI",
    body: "We route each task to the best model — Claude for analysis, GPT-4o for writing, Gemini for research.",
  },
];

export function FeaturesSection() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Features</Eyebrow>
          <h2 className="text-section text-text">
            Everything your <span className="text-accent">AI company</span> needs.
          </h2>
        </div>

        <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
              >
                <Panel hoverable className="group h-full">
                  <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-2 transition-colors group-hover:border-accent/40">
                    <Icon size={16} className="text-accent" />
                  </div>
                  <h3 className="text-card text-text">{f.title}</h3>
                  <p className="mt-2 text-small text-secondary">{f.body}</p>
                </Panel>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}