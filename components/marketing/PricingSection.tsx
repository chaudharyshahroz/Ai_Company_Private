"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/ui/layout";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { cn, formatUsd } from "@/lib/utils";

const plans = [
  {
    id: "starter",
    name: "Starter",
    monthly: 29,
    yearly: 24,
    description: "Solo founder testing the waters.",
    features: ["3 AI employees", "500 tasks / month", "Business Brain (basic)", "Email support"],
    cta: "Hire 3 employees",
    popular: false,
  },
  {
    id: "growth",
    name: "Growth",
    monthly: 79,
    yearly: 65,
    description: "The whole AI company.",
    features: ["8 AI employees", "Unlimited tasks", "Business Brain (full)", "Agent-to-agent workflows", "Weekly board report", "Priority support"],
    cta: "Build your team",
    popular: true,
  },
  {
    id: "company",
    name: "Company",
    monthly: 149,
    yearly: 124,
    description: "For agencies and teams.",
    features: ["Unlimited agents", "Unlimited tasks", "Full Business Brain", "Custom agent creation", "White-label option", "Dedicated onboarding"],
    cta: "Go full company",
    popular: false,
  },
];

export function PricingSection() {
  const [annual, setAnnual] = React.useState(false);

  return (
    <Section id="pricing">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="text-section text-text">
            Pricing that makes sense for <span className="gradient-text">solo founders</span>.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-body text-secondary">
            Start free. Upgrade when your AI company needs more seats.
          </p>

          <div className="mt-8 inline-flex items-center gap-1 rounded-md border border-border bg-surface p-1">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "rounded-md px-4 py-1 text-button transition-colors",
                !annual ? "bg-muted text-text" : "text-secondary hover:text-text",
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "rounded-md px-4 py-1 text-button transition-colors",
                annual ? "bg-muted text-text" : "text-secondary hover:text-text",
              )}
            >
              Annual{" "}
              <span className="ml-1 text-[10px] text-success">−2 mo</span>
            </button>
          </div>
        </div>

        <div className="mt-16 grid gap-4 lg:grid-cols-3">
          {plans.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={cn(p.popular && "relative")}
            >
              <Panel
                hoverable
                className={cn(
                  "h-full",
                  p.popular && "border-accent/40 shadow-accent-glow",
                )}
              >
                {p.popular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-md bg-accent px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
                    Most popular
                  </div>
                )}
                <h3 className="text-card text-text">{p.name}</h3>
                <p className="mt-1 text-small text-secondary">{p.description}</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-3xl text-text">
                    {formatUsd(annual ? p.yearly : p.monthly)}
                  </span>
                  <span className="text-small text-muted-text">/mo</span>
                </div>
                {annual && (
                  <p className="mt-1 text-xs text-success">Billed annually · saves 2 months</p>
                )}

                <ul className="mt-6 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-small text-secondary">
                      <Check
                        size={14}
                        className={cn(
                          "mt-0.5 shrink-0",
                          p.popular ? "text-accent" : "text-success",
                        )}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7">
                  <Button
                    asChild
                    className="w-full"
                    variant={p.popular ? "primary" : "secondary"}
                  >
                    <Link href={`/sign-up?plan=${p.id}`}>{p.cta}</Link>
                  </Button>
                </div>
              </Panel>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center text-small text-secondary">
          Free tier: <span className="text-text">1 agent, 50 tasks/month, no credit card</span>
        </p>
        <p className="mt-3 text-center text-xs text-muted-text">
          Enterprise?{" "}
          <Link href="mailto:sales@reklu.app" className="text-accent hover:underline">
            Let&apos;s talk →
          </Link>
        </p>
      </Container>
    </Section>
  );
}