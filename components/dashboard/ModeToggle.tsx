"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Mode = "simple" | "advanced";

const STORAGE_KEY = "reklu:display-mode";

/**
 * Toggle between Simple (default) and Advanced modes.
 * Persists in localStorage so the user's preference survives page reloads.
 *
 * In Simple mode (the default), the dashboard hides things like:
 *  - Departments as separate sidebar items
 *  - Task Board, Analytics, Team, CEO Briefing, Company Goals
 *  - Agent settings, system logs, automations, advanced analytics
 *
 * In Advanced mode, those become available again.
 */
export function ModeToggle() {
  const [mode, setMode] = React.useState<Mode>("simple");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Mode | null;
      if (stored === "advanced" || stored === "simple") setMode(stored);
    } catch {
      // ignore — localStorage may be unavailable
    }
  }, []);

  const onChange = (next: Mode) => {
    setMode(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
      // Tell other components (e.g. HqSidebar) to react.
      window.dispatchEvent(new CustomEvent("reklu:mode-change", { detail: next }));
    } catch {
      // ignore
    }
  };

  if (!mounted) {
    // Avoid SSR/CSR mismatch
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-2">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <ModeCard
        active={mode === "simple"}
        title="Simple Mode"
        subtitle="Recommended for most teams"
        bullets={[
          "Home, AI Employees, Work Review, Tasks, Leads, Knowledge Base, Reports",
          "Conversations, Campaigns, Website Widget, Integrations, Billing, Settings",
          "No technical jargon",
        ]}
        onSelect={() => onChange("simple")}
      />
      <ModeCard
        active={mode === "advanced"}
        title="Advanced Mode"
        subtitle="For power users"
        bullets={[
          "Everything in Simple Mode, plus:",
          "Departments as separate sidebar items",
          "Agent settings, automations, system logs",
          "Advanced analytics, employee permissions",
        ]}
        onSelect={() => onChange("advanced")}
      />
    </div>
  );
}

function ModeCard({
  active,
  title,
  subtitle,
  bullets,
  onSelect,
}: {
  active: boolean;
  title: string;
  subtitle: string;
  bullets: string[];
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group flex flex-col gap-3 rounded-md border p-5 text-left transition-colors",
        active
          ? "border-accent/40 bg-accent/8"
          : "border-border bg-surface hover:border-border-strong",
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={cn("text-[15px] font-semibold", active ? "text-text" : "text-text")}>
            {title}
          </p>
          <p className="mt-0.5 text-[12.5px] text-muted-text">{subtitle}</p>
        </div>
        <span
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full border-2",
            active ? "border-accent bg-accent" : "border-border-strong",
          )}
        >
          {active && (
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>
      </div>
      <ul className="space-y-1 text-[13px] leading-relaxed text-secondary">
        {bullets.map((b, i) => (
          <li key={i}>· {b}</li>
        ))}
      </ul>
    </button>
  );
}

function SkeletonCard() {
  return (
    <div className="h-32 animate-pulse rounded-md border border-border bg-surface" />
  );
}