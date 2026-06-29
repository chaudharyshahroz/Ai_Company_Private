"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Rocket,
  TrendingUp,
  Users,
  Check,
  ChevronRight,
  Building2,
  Target,
  Mic,
  Globe,
  MapPin,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

type Mode = "start_new" | "grow_existing" | "hire_ai_company";

const modes: Array<{
  id: Mode;
  icon: React.ElementType;
  title: string;
  oneLine: string;
  forWho: string;
  outcome: string;
}> = [
  {
    id: "start_new",
    icon: Rocket,
    title: "Start a new business",
    oneLine: "I have an idea. Help me turn it into a real business.",
    forWho: "Founders with just an idea — no customers yet.",
    outcome: "Business DNA → Score → 7-day launch plan → first AI employees hired.",
  },
  {
    id: "grow_existing",
    icon: TrendingUp,
    title: "Grow an existing business",
    oneLine: "I have a business. Help me grow it faster.",
    forWho: "Small business owners with revenue, looking for the next leap.",
    outcome: "Growth audit → competitor gap → offer improvements → campaign.",
  },
  {
    id: "hire_ai_company",
    icon: Users,
    title: "Hire an AI company",
    oneLine: "I just want an AI team that does the work for me.",
    forWho: "Operators who want execution, not strategy decks.",
    outcome: "Pre-built departments → AI employees → work in your inbox.",
  },
];

const industries = [
  "SaaS",
  "E-commerce",
  "Agency",
  "Coaching / Consulting",
  "Restaurant",
  "Real Estate",
  "Clinic / Dental",
  "Education",
  "Local Service",
  "Other",
];

const tones = [
  {
    id: "bold",
    label: "Bold",
    example: "Stop running your business alone.",
  },
  {
    id: "premium",
    label: "Premium",
    example: "We help clinics scale without adding headcount.",
  },
  {
    id: "friendly",
    label: "Friendly",
    example: "Hey! Just shipped a thing — wanted you to see it.",
  },
  {
    id: "calm",
    label: "Calm",
    example: "Steady, predictable growth. No hacks.",
  },
  {
    id: "expert",
    label: "Expert",
    example: "Based on our analysis of 142 competitors...",
  },
];

const goals = [
  "Get first 10 customers",
  "Launch in 30 days",
  "Grow revenue 2x",
  "Build a content engine",
  "Get more leads",
  "Improve my website",
];

export default function OnboardingFlowPage() {
  const router = useRouter();
  const [phase, setPhase] = React.useState<"mode" | "questions" | "building">("mode");
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({
    mode: "" as Mode | "",
    businessName: "",
    idea: "",
    industry: "",
    city: "",
    audience: "",
    tone: "bold",
    mainGoal: "Get first 10 customers",
  });

  const totalQ = 4; // business / idea / audience / tone / goal
  const progress = phase === "mode" ? 10 : Math.min(95, 15 + ((step + 1) / totalQ) * 80);

  const next = () => {
    if (step < totalQ - 1) setStep(step + 1);
    else {
      // Simulate "AI CEO building your business" phase, then redirect
      setPhase("building");
      setTimeout(() => router.push("/hq?welcome=1"), 2400);
    }
  };
  const back = () => (step > 0 ? setStep(step - 1) : setPhase("mode"));

  // Phase: Mode selection
  if (phase === "mode") {
    return (
      <main className="min-h-screen bg-bg">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <div className="mb-10 flex items-center justify-between">
            <Logo size="md" />
            <Link
              href="/sign-up"
              className="text-[13px] text-muted-text transition-colors hover:text-text"
            >
              Sign out
            </Link>
          </div>

          {/* Progress */}
          <div className="mb-10">
            <div className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-muted-text">
              <span>Step 1 of 3</span>
              <span>What brings you here?</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-border/40">
              <div className="h-full w-[10%] bg-accent transition-all duration-500" />
            </div>
          </div>

          <div className="mb-3 flex items-center gap-2 text-xs">
            <Sparkles size={12} className="text-accent" />
            <span className="font-semibold uppercase tracking-wider text-accent">
              Welcome to Reklu
            </span>
          </div>
          <h1 className="max-w-2xl text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-text md:text-[52px]">
            What do you want to do first?
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-secondary">
            Reklu adapts to where you are right now. Pick the path that fits — we'll build the
            rest from there.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {modes.map((m) => {
              const Icon = m.icon;
              const selected = data.mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setData({ ...data, mode: m.id })}
                  className={cn(
                    "group relative flex flex-col items-start rounded-lg border bg-surface p-6 text-left transition-all",
                    selected
                      ? "border-accent shadow-[0_0_0_1px_rgba(94,106,210,0.4)]"
                      : "border-border hover:border-border-strong",
                  )}
                >
                  {selected && (
                    <div className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-accent">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "mb-4 flex h-10 w-10 items-center justify-center rounded-md border",
                      selected ? "border-accent/40 bg-accent/10" : "border-border bg-surface-2",
                    )}
                  >
                    <Icon
                      size={18}
                      className={selected ? "text-accent" : "text-secondary"}
                      strokeWidth={1.7}
                    />
                  </div>
                  <h3 className="text-[17px] font-semibold text-text">{m.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-secondary">
                    {m.oneLine}
                  </p>
                  <div className="mt-5 w-full space-y-2 border-t border-border pt-4 text-[12px]">
                    <div>
                      <span className="font-medium text-muted-text">Best for: </span>
                      <span className="text-secondary">{m.forWho}</span>
                    </div>
                    <div>
                      <span className="font-medium text-muted-text">You'll get: </span>
                      <span className="text-secondary">{m.outcome}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex items-center justify-between">
            <Link
              href="/hq"
              className="text-[13px] text-muted-text transition-colors hover:text-text"
            >
              Skip and explore first →
            </Link>
            <Button
              size="lg"
              disabled={!data.mode}
              onClick={() => {
                setStep(0);
                setPhase("questions");
              }}
            >
              Continue
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // Phase: Building (loading state simulating AI CEO)
  if (phase === "building") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg">
        <div className="mx-auto max-w-md px-6 text-center">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
            <Loader2 size={28} className="animate-spin text-accent" />
          </div>
          <h2 className="text-[24px] font-semibold text-text">
            Your AI CEO is setting things up...
          </h2>
          <ul className="mt-8 space-y-3 text-left text-[14px] text-secondary">
            {[
              "Building your Business DNA",
              "Calculating your Business Score",
              "Hiring your first departments",
              "Generating your 7-day launch plan",
            ].map((line, i) => (
              <motion.li
                key={line}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.4 }}
                className="flex items-center gap-3"
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                <span>{line}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </main>
    );
  }

  // Phase: Questions
  const steps = [
    {
      title: data.mode === "hire_ai_company" ? "What kind of business?" : "What's your business called?",
      subtitle:
        data.mode === "hire_ai_company"
          ? "Even a working name is fine. You can change it later."
          : "A working name is fine — you can change it anytime.",
      content: (
        <div className="space-y-4">
          <Field label="Business name">
            <input
              autoFocus
              value={data.businessName}
              onChange={(e) => setData({ ...data, businessName: e.target.value })}
              placeholder="Acme Studios"
              className="reklu-input"
            />
          </Field>
          <Field label="Industry">
            <div className="flex flex-wrap gap-2">
              {industries.map((t) => (
                <Chip
                  key={t}
                  active={data.industry === t}
                  onClick={() => setData({ ...data, industry: t })}
                >
                  {t}
                </Chip>
              ))}
            </div>
          </Field>
        </div>
      ),
    },
    {
      title: data.mode === "start_new" ? "What's your idea?" : "What do you sell?",
      subtitle:
        data.mode === "start_new"
          ? "One paragraph is fine. The more context, the smarter your AI team will be."
          : "A clear one-liner is fine. We'll figure out positioning together.",
      content: (
        <div className="space-y-4">
          <Field label="Your idea / offer">
            <textarea
              autoFocus
              value={data.idea}
              onChange={(e) => setData({ ...data, idea: e.target.value })}
              placeholder={
                data.mode === "start_new"
                  ? "A 14-day AI front-desk for dental clinics that books appointments 24/7."
                  : "We help clinics scale without adding headcount."
              }
              rows={4}
              className="reklu-input resize-none"
            />
          </Field>
          <Field label="Where are your customers?">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-muted-text" />
              <input
                value={data.city}
                onChange={(e) => setData({ ...data, city: e.target.value })}
                placeholder="Austin, TX or Worldwide"
                className="reklu-input flex-1"
              />
            </div>
          </Field>
        </div>
      ),
    },
    {
      title: "Who's your customer?",
      subtitle: "The more specific, the more on-target every AI output will be.",
      content: (
        <div className="space-y-4">
          <Field label="Describe your ideal customer">
            <textarea
              autoFocus
              value={data.audience}
              onChange={(e) => setData({ ...data, audience: e.target.value })}
              placeholder="Solo SaaS founders, $50k-$500k ARR, US/EU, building tools for SMBs..."
              rows={4}
              className="reklu-input resize-none"
            />
          </Field>
        </div>
      ),
    },
    {
      title: "How should your AI team sound?",
      subtitle: "Pick a voice. You can change this anytime.",
      content: (
        <div className="grid gap-2">
          {tones.map((v) => (
            <button
              key={v.id}
              onClick={() => setData({ ...data, tone: v.id })}
              className={cn(
                "group flex items-start gap-3 rounded-md border p-4 text-left transition-all",
                data.tone === v.id
                  ? "border-accent bg-accent/5"
                  : "border-border bg-surface hover:border-border-strong",
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  data.tone === v.id ? "border-accent bg-accent" : "border-border-strong",
                )}
              >
                {data.tone === v.id && <Check size={10} className="text-white" />}
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-medium text-text">{v.label}</div>
                <div className="mt-1 text-[13px] italic text-secondary">"{v.example}"</div>
              </div>
            </button>
          ))}

          <div className="mt-3">
            <Field label="Main goal">
              <div className="flex flex-wrap gap-2">
                {goals.map((g) => (
                  <Chip
                    key={g}
                    active={data.mainGoal === g}
                    onClick={() => setData({ ...data, mainGoal: g })}
                  >
                    {g}
                  </Chip>
                ))}
              </div>
            </Field>
          </div>
        </div>
      ),
    },
  ];

  const current = steps[step];

  return (
    <main className="min-h-screen bg-bg">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <Logo size="md" />
          <button
            onClick={() => router.push("/hq")}
            className="text-[13px] text-muted-text transition-colors hover:text-text"
          >
            Skip
          </button>
        </div>

        {/* Progress */}
        <div className="mb-10">
          <div className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-muted-text">
            <span>
              Step {step + 2} of {totalQ + 2}
            </span>
            <span>Building your business</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-border/40">
            <motion.div
              className="h-full bg-accent"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-[28px] font-semibold leading-tight tracking-tight text-text">
              {current?.title}
            </h2>
            <p className="mt-2 text-[14.5px] text-secondary">{current?.subtitle}</p>

            <div className="mt-8">{current?.content}</div>
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          <button
            onClick={back}
            className="inline-flex items-center gap-1.5 text-[13.5px] text-secondary transition-colors hover:text-text"
          >
            <ArrowLeft size={14} />
            Back
          </button>
          <Button size="md" onClick={next}>
            {step === totalQ - 1 ? (
              <>
                <Sparkles size={13} />
                Build my AI company
              </>
            ) : (
              <>
                Continue
                <ArrowRight size={13} />
              </>
            )}
          </Button>
        </div>

        <style jsx>{`
          :global(.reklu-input) {
            width: 100%;
            background-color: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border, #2a2a3e);
            border-radius: 0.5rem;
            padding: 0.625rem 0.875rem;
            font-size: 0.875rem;
            color: #f0eeff;
            outline: none;
            transition: border-color 0.15s;
          }
          :global(.reklu-input:focus) {
            border-color: #7c5cfc;
            box-shadow: 0 0 0 3px rgba(124, 92, 252, 0.15);
          }
          :global(.reklu-input::placeholder) {
            color: #4a4a65;
          }
        `}</style>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-text">
        {label}
      </label>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-[13px] transition-all",
        active
          ? "border-accent bg-accent/15 text-accent"
          : "border-border bg-surface text-secondary hover:border-border-strong",
      )}
    >
      {children}
    </button>
  );
}
