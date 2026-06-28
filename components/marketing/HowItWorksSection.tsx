"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Container, Section, Eyebrow } from "@/components/ui/layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { ClipboardList, Users, Zap, ArrowRight } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: ClipboardList,
    title: "Describe your business",
    body: "Tell Reklu about your business, products, and goals. Your AI company learns who you are.",
  },
  {
    num: "02",
    icon: Users,
    title: "Hire your agents",
    body: "Browse the agent marketplace. Hire a researcher, writer, sales agent, and more. Each one knows your business.",
  },
  {
    num: "03",
    icon: Zap,
    title: "Watch them work",
    body: "Your agents run 24/7. They produce work, alert you to opportunities, and report every Monday.",
  },
];

export function HowItWorksSection() {
  return (
    <Section id="how">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="text-balance font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Your AI company.{" "}
            <span className="gradient-text">Built in 5 minutes.</span>
          </h2>
        </div>

        <div className="relative mt-20">
          {/* Connection line */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
          />

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="relative"
                >
                  <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
                    {/* Outer pulse ring */}
                    <div className="absolute inset-0 rounded-full border border-primary/30" />
                    <div
                      className="absolute inset-2 rounded-full border border-primary/20"
                      style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
                    />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-warm shadow-glow">
                      <Icon size={22} className="text-white" />
                    </div>
                    <div className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface font-mono text-[10px] font-semibold text-text-secondary">
                      {s.num}
                    </div>
                  </div>

                  <h3 className="text-center text-xl font-semibold text-text-primary">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-center text-sm leading-relaxed text-text-secondary">
                    {s.body}
                  </p>

                  {i < steps.length - 1 && (
                    <ArrowRight
                      size={16}
                      className="absolute -right-4 top-12 hidden text-text-tertiary md:block"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CEO + 6 agents diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto mt-20 max-w-3xl"
        >
          <GlassCard className="p-8">
            <AgentFlowDiagram />
          </GlassCard>
        </motion.div>
      </Container>
    </Section>
  );
}

function AgentFlowDiagram() {
  // CEO in center, 6 agents around it
  const agents = [
    { emoji: "📣", label: "CMO", angle: 0 },
    { emoji: "✍️", label: "Writer", angle: 60 },
    { emoji: "🔍", label: "Research", angle: 120 },
    { emoji: "💼", label: "Sales", angle: 180 },
    { emoji: "💬", label: "Support", angle: 240 },
    { emoji: "💰", label: "CFO", angle: 300 },
  ];

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {/* Connection lines from CEO to each agent */}
        {agents.map((a) => {
          const rad = (a.angle * Math.PI) / 180;
          const cx = 200 + Math.cos(rad) * 140;
          const cy = 200 + Math.sin(rad) * 140;
          return (
            <line
              key={a.angle}
              x1="200"
              y1="200"
              x2={cx}
              y2={cy}
              stroke="rgba(124, 92, 252, 0.3)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}
      </svg>

      {/* CEO center */}
      <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-warm shadow-glow">
        <span className="text-2xl">🎯</span>
      </div>

      {/* Surrounding agents */}
      {agents.map((a) => {
        const rad = (a.angle * Math.PI) / 180;
        const x = 200 + Math.cos(rad) * 140;
        const y = 200 + Math.sin(rad) * 140;
        return (
          <div
            key={a.label}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${(x / 400) * 100}%`, top: `${(y / 400) * 100}%` }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface text-xl shadow-lg">
                {a.emoji}
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-text-secondary">
                {a.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}