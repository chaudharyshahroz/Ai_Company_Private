"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Is this just a chatbot?",
    a: "No. A chatbot waits for you to ask. Reklu's agents work proactively — they research, write, sell, and report without you prompting. They also remember your business, coordinate with each other, and improve over time.",
  },
  {
    q: "How is this different from ChatGPT?",
    a: "ChatGPT is a general tool. Reklu is a configured team. Your agents know your products, your audience, your voice, your competitors — and they share that knowledge across tasks. ChatGPT forgets after every chat. Reklu doesn't.",
  },
  {
    q: "Can agents actually take actions, or just write?",
    a: "Both. Agents can draft and send emails, post to social (via integrations), update your CRM, file support tickets, and trigger workflows in connected tools. Each action is logged and reversible.",
  },
  {
    q: "What happens if an agent makes a mistake?",
    a: "All agent actions are reviewable. You can require approval before sends, see full output history, and roll back any task. We're building an AI company — we take reliability seriously.",
  },
  {
    q: "How does the Business Brain work?",
    a: "It's a structured store of everything your agents know about you — products, audience, competitors, tone, milestones, custom context. It's injected into every task prompt automatically. The more you add, the smarter your company gets.",
  },
  {
    q: "Can I customize agents?",
    a: "Yes. Each agent has a custom name, custom instructions, and per-task overrides. You can also create your own agents from scratch on the Company plan.",
  },
  {
    q: "Is my data secure?",
    a: "Your data is encrypted at rest and in transit. We never train models on your business data. We're SOC 2 Type II in progress. Enterprise plans get dedicated infrastructure.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your dashboard at any time — no email gymnastics, no retention calls. Your account stays active until the end of the billing period.",
  },
];

export function FAQSection() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="text-balance font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Questions, <span className="gradient-text">answered</span>
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-border/60 rounded-2xl border border-border bg-surface/40 backdrop-blur">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-surface-2/40"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-medium text-text-primary">{f.q}</span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "shrink-0 text-text-tertiary transition-transform",
                      isOpen && "rotate-180 text-primary-light",
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-text-secondary">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}