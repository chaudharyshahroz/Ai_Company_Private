"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Container, Section, Eyebrow } from "@/components/ui/layout";
import { Panel } from "@/components/ui/Panel";
import { HardHat, Workflow, DollarSign, ArrowRight } from "lucide-react";

const painPoints = [
  {
    icon: HardHat,
    title: "You wear every hat",
    body: "You're the marketer, researcher, writer, salesperson, and support team. All at once. It never stops.",
  },
  {
    icon: Workflow,
    title: "Tools don't talk to each other",
    body: "You use 12 different apps that don't coordinate. Every task starts from scratch.",
  },
  {
    icon: DollarSign,
    title: "You can't afford a full team",
    body: "A content writer costs $3k/mo. A researcher $4k. A sales rep $5k. That's $12k/mo before you're profitable.",
  },
];

export function ProblemSection() {
  return (
    <Section id="problem">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>The problem</Eyebrow>
          <h2 className="text-section text-text">
            Running a business alone is <span className="gradient-text">exhausting</span>.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-body text-secondary">
            The solo founder trap. You started a business for freedom, and now you can't leave
            your laptop.
          </p>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {painPoints.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Panel className="h-full">
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface-2">
                    <Icon size={18} className="text-secondary" />
                  </div>
                  <h3 className="text-card text-text">{p.title}</h3>
                  <p className="mt-2 text-body text-secondary">{p.body}</p>
                </Panel>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-12 flex items-center justify-center gap-2 text-sm text-secondary"
        >
          <span>There's a better way</span>
          <ArrowRight size={14} className="text-accent" />
        </motion.div>
      </Container>
    </Section>
  );
}