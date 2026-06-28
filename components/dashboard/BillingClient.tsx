"use client";

import * as React from "react";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface Plan {
  id: string;
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  cta: string;
  highlight?: boolean;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    cadence: "forever",
    description: "Try Reklu with one AI employee.",
    features: ["1 AI employee", "100 tasks / month", "Email support"],
    cta: "Current plan",
  },
  {
    id: "starter",
    name: "Starter",
    price: "$49",
    cadence: "per month",
    description: "Run a small AI team across sales + support.",
    features: ["5 AI employees", "1,000 tasks / month", "Knowledge base", "Priority support"],
    cta: "Upgrade to Starter",
  },
  {
    id: "growth",
    name: "Growth",
    price: "$149",
    cadence: "per month",
    description: "For growing businesses that need a full AI team.",
    features: ["15 AI employees", "5,000 tasks / month", "Advanced analytics", "Custom training"],
    cta: "Upgrade to Growth",
    highlight: true,
  },
  {
    id: "company",
    name: "Company",
    price: "$399",
    cadence: "per month",
    description: "For larger teams that need scale and control.",
    features: ["Unlimited employees", "Unlimited tasks", "Dedicated success manager", "SSO + audit log"],
    cta: "Talk to sales",
  },
];

export function BillingClient({ currentPlan }: { currentPlan: string }) {
  const toast = useToast();
  const [active, setActive] = React.useState(currentPlan);
  const [billing, setBilling] = React.useState(false);

  const handleSelect = (plan: Plan) => {
    if (plan.id === active) return;
    setBilling(true);
    // Simulate checkout
    setTimeout(() => {
      setActive(plan.id);
      setBilling(false);
      toast.push({
        tone: "success",
        title: `Switched to ${plan.name}`,
        description:
          plan.id === "company"
            ? "Our team will reach out within 24 hours."
            : "Your new plan is active. You'll see the change on your next invoice.",
      });
    }, 800);
  };

  return (
    <>
      {/* Current plan card */}
      <Panel className="mb-8 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-muted-text">
              Current plan
            </p>
            <p className="mt-2 text-[20px] font-semibold capitalize text-text">
              {active}
            </p>
            <p className="mt-1 text-[13.5px] text-secondary">
              $149 / month · Renews on Jul 18 · 8,547 credits remaining
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() =>
                toast.push({
                  tone: "info",
                  title: "Payment settings",
                  description: "Card management coming soon.",
                })
              }
            >
              Manage payment method
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                toast.push({
                  tone: "info",
                  title: "Billing history",
                  description: "Invoices will appear here once available.",
                })
              }
            >
              Invoices
            </Button>
          </div>
        </div>
      </Panel>

      {/* Plans */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((p) => {
          const isCurrent = p.id === active;
          return (
            <Panel
              key={p.id}
              className={cn(
                p.highlight && !isCurrent
                  ? "border-accent/40 p-6 ring-1 ring-accent/20"
                  : "p-6",
                isCurrent && "border-success/40 p-6",
              )}
            >
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-semibold uppercase tracking-[0.04em] text-muted-text">
                  {p.name}
                </p>
                {isCurrent && (
                  <span className="rounded-md border border-success/40 bg-success/10 px-1.5 py-0.5 text-[10.5px] font-medium uppercase tracking-wider text-success">
                    Active
                  </span>
                )}
              </div>
              <p className="mt-3 font-mono text-[28px] font-semibold leading-none text-text tabular-nums">
                {p.price}
              </p>
              <p className="mt-1 text-[12.5px] text-muted-text">{p.cadence}</p>
              <p className="mt-3 text-[13.5px] leading-snug text-secondary">
                {p.description}
              </p>
              <ul className="mt-4 space-y-1.5 text-[13px]">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-text">
                    <Check size={13} className="mt-0.5 shrink-0 text-success" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <Button
                  variant={isCurrent ? "secondary" : p.highlight ? "primary" : "secondary"}
                  className="w-full"
                  disabled={isCurrent || billing}
                  onClick={() => handleSelect(p)}
                >
                  {isCurrent ? (
                    "Current plan"
                  ) : billing ? (
                    <>
                      <Sparkles size={12} className="animate-pulse" />
                      Processing…
                    </>
                  ) : (
                    <>
                      {p.cta}
                      <ArrowRight size={12} />
                    </>
                  )}
                </Button>
              </div>
            </Panel>
          );
        })}
      </div>
    </>
  );
}