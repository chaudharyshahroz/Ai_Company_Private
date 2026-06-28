import * as React from "react";
import { cn } from "@/lib/utils";

interface PlanBadgeProps {
  plan: string;
  className?: string;
}

const planStyles: Record<string, { label: string; classes: string }> = {
  free: {
    label: "Free",
    classes: "border-border bg-surface text-secondary",
  },
  starter: {
    label: "Starter",
    classes: "border-info/40 bg-info/10 text-info",
  },
  growth: {
    label: "Growth",
    classes: "border-accent/40 bg-accent/10 text-accent",
  },
  company: {
    label: "Company",
    classes: "border-accent/60 bg-accent/20 text-accent",
  },
};

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  const cfg = planStyles[plan] ?? planStyles.free!;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        cfg.classes,
        className,
      )}
    >
      {cfg.label}
    </span>
  );
}