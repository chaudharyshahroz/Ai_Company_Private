"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, Check } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

const steps = [
  { title: "Tell us about your business", subtitle: "This helps your agents work smarter for you." },
  { title: "Who are your customers?", subtitle: "The more specific, the more on-target your agents." },
  { title: "How should your agents sound?", subtitle: "Pick a voice. You can change this anytime." },
  { title: "Hire your first team", subtitle: "Pre-selected based on your business type." },
];

const businessTypes = ["SaaS", "E-commerce", "Agency", "Consulting", "Restaurant", "Real Estate", "Other"];
const goals = ["More sales", "More content", "Better support", "Market research", "All of the above"];
const voices = [
  { id: "professional", label: "Professional", example: "We help SaaS companies ship faster." },
  { id: "friendly", label: "Friendly", example: "Hey! Just shipped a thing — wanted you to see it." },
  { id: "bold", label: "Bold", example: "Stop running your business alone." },
  { id: "casual", label: "Casual", example: "okay so this is kinda cool — let me show you" },
  { id: "expert", label: "Expert", example: "Based on our analysis of 142 competitors..." },
];

const kits = {
  SaaS: ["ceo-agent", "cmo-agent", "content-writer", "research-analyst"],
  "E-commerce": ["ceo-agent", "content-writer", "sales-agent", "support-agent"],
  Agency: ["ceo-agent", "content-writer", "research-analyst", "hr-agent"],
} as Record<string, string[]>;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({
    businessName: "",
    businessType: "SaaS",
    description: "",
    website: "",
    audience: "",
    goal: "All of the above",
    voice: "bold",
    competitors: "",
  });

  const total = steps.length;
  const progress = ((step + 1) / total) * 100;

  const next = () => {
    if (step < total - 1) setStep(step + 1);
    else router.push("/dashboard?welcome=1");
  };
  const back = () => step > 0 && setStep(step - 1);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between text-xs text-text-tertiary">
            <span>
              Step <span className="font-medium text-text-primary">{step + 1}</span> of {total}
            </span>
            <span>{steps[step]?.title}</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-surface-2">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <GlassCard className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                {steps[step]?.title}
              </h2>
              <p className="mt-2 text-sm text-text-secondary">{steps[step]?.subtitle}</p>

              <div className="mt-8 space-y-5">
                {step === 0 && (
                  <>
                    <Field label="Business name">
                      <input
                        value={data.businessName}
                        onChange={(e) => setData({ ...data, businessName: e.target.value })}
                        placeholder="Acme Studios"
                        className="input"
                      />
                    </Field>
                    <Field label="Business type">
                      <div className="flex flex-wrap gap-2">
                        {businessTypes.map((t) => (
                          <button
                            key={t}
                            onClick={() => setData({ ...data, businessType: t })}
                            className={cn(
                              "rounded-full border px-4 py-1.5 text-sm transition-colors",
                              data.businessType === t
                                ? "border-primary bg-primary/15 text-primary-light"
                                : "border-border bg-surface text-text-secondary hover:text-text-primary",
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <Field label="What do you sell?">
                      <textarea
                        value={data.description}
                        onChange={(e) => setData({ ...data, description: e.target.value })}
                        placeholder="A productivity tool for solo founders..."
                        rows={3}
                        className="input resize-none"
                      />
                    </Field>
                    <Field label="Website (optional)">
                      <input
                        value={data.website}
                        onChange={(e) => setData({ ...data, website: e.target.value })}
                        placeholder="https://yourcompany.com"
                        className="input"
                      />
                    </Field>
                  </>
                )}

                {step === 1 && (
                  <>
                    <Field label="Describe your ideal customer">
                      <textarea
                        value={data.audience}
                        onChange={(e) => setData({ ...data, audience: e.target.value })}
                        placeholder="Solo SaaS founders, seed stage, $50k-$500k ARR..."
                        rows={3}
                        className="input resize-none"
                      />
                    </Field>
                    <Field label="Primary goal">
                      <div className="flex flex-wrap gap-2">
                        {goals.map((g) => (
                          <button
                            key={g}
                            onClick={() => setData({ ...data, goal: g })}
                            className={cn(
                              "rounded-full border px-4 py-1.5 text-sm transition-colors",
                              data.goal === g
                                ? "border-primary bg-primary/15 text-primary-light"
                                : "border-border bg-surface text-text-secondary hover:text-text-primary",
                            )}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </Field>
                  </>
                )}

                {step === 2 && (
                  <>
                    <Field label="Brand voice">
                      <div className="grid gap-2">
                        {voices.map((v) => (
                          <button
                            key={v.id}
                            onClick={() => setData({ ...data, voice: v.id })}
                            className={cn(
                              "group flex items-start gap-3 rounded-lg border p-4 text-left transition-all",
                              data.voice === v.id
                                ? "border-primary bg-primary/10"
                                : "border-border bg-surface hover:border-primary/30",
                            )}
                          >
                            <div
                              className={cn(
                                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                                data.voice === v.id
                                  ? "border-primary bg-primary"
                                  : "border-text-tertiary",
                              )}
                            >
                              {data.voice === v.id && (
                                <Check size={12} className="text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-text-primary">
                                {v.label}
                              </div>
                              <div className="mt-1 text-xs italic text-text-secondary">
                                &ldquo;{v.example}&rdquo;
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </Field>
                    <Field label="Competitors (optional)">
                      <input
                        value={data.competitors}
                        onChange={(e) => setData({ ...data, competitors: e.target.value })}
                        placeholder="linear.app, notion.so, clickup.com"
                        className="input"
                      />
                    </Field>
                  </>
                )}

                {step === 3 && (
                  <div>
                    <p className="text-sm text-text-secondary">
                      Based on your business type, we recommend starting with:
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {(kits[data.businessType] ?? kits.SaaS ?? []).map((slug) => (
                        <div
                          key={slug}
                          className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent-warm text-base">
                            ✨
                          </div>
                          <div>
                            <div className="text-sm font-medium text-text-primary capitalize">
                              {slug.replace("-", " ")}
                            </div>
                            <div className="text-xs text-accent">Pre-selected</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-5 text-xs text-text-tertiary">
                      Your first agent is free. Upgrade anytime. You can swap any agent after
                      your company is live.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Footer buttons */}
          <div className="mt-10 flex items-center justify-between">
            {step > 0 ? (
              <button
                onClick={back}
                className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary"
              >
                <ArrowLeft size={14} />
                Back
              </button>
            ) : (
              <button
                onClick={() => router.push("/dashboard")}
                className="text-sm text-text-tertiary hover:text-text-secondary"
              >
                Skip for now
              </button>
            )}
            <GlowButton onClick={next}>
              {step === total - 1 ? (
                <>
                  <Sparkles size={14} />
                  Launch my AI company
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight size={14} />
                </>
              )}
            </GlowButton>
          </div>
        </GlassCard>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          background-color: rgba(17, 17, 24, 0.6);
          border: 1px solid #2a2a3e;
          border-radius: 0.5rem;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: #f0eeff;
          outline: none;
          transition: border-color 0.15s;
        }
        :global(.input:focus) {
          border-color: #7c5cfc;
          box-shadow: 0 0 0 3px rgba(124, 92, 252, 0.15);
        }
        :global(.input::placeholder) {
          color: #4a4a65;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-tertiary">
        {label}
      </label>
      {children}
    </div>
  );
}