"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container, Section, Eyebrow } from "@/components/ui/layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { MOCK_AGENT_TEMPLATES } from "@/lib/mock-data";
import { ArrowRight } from "lucide-react";

export function AgentShowcaseSection() {
  return (
    <Section id="agents">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>The team</Eyebrow>
          <h2 className="text-balance font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Meet your <span className="gradient-text">new team</span>
          </h2>
          <p className="mt-5 text-pretty text-lg text-text-secondary">
            Each agent is trained on your business and works with the others.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_AGENT_TEMPLATES.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
            >
              <GlassCard hoverable className="group h-full p-6">
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${agent.avatarColor} text-2xl shadow-md`}
                >
                  {agent.avatarEmoji}
                </div>

                <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-text-secondary">
                  {agent.department}
                </div>

                <h3 className="text-lg font-semibold text-text-primary">{agent.name}</h3>
                <p className="mt-1 text-xs text-text-tertiary">{agent.role}</p>

                <ul className="mt-4 space-y-1.5">
                  {agent.capabilities.slice(0, 3).map((cap) => (
                    <li
                      key={cap}
                      className="flex items-start gap-2 text-xs text-text-secondary"
                    >
                      <span className="mt-1 inline-block h-1 w-1 shrink-0 rounded-full bg-primary-light" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4">
                  <span className="text-xs text-text-tertiary">
                    ${agent.monthlyPriceUsd}/mo
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-light transition-transform group-hover:translate-x-0.5">
                    Hire <ArrowRight size={12} />
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <GlowButton asChild variant="secondary" size="lg">
            <Link href="/agents">
              Browse all agents <ArrowRight size={16} />
            </Link>
          </GlowButton>
        </div>
      </Container>
    </Section>
  );
}