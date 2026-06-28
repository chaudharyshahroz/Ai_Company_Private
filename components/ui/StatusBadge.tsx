import * as React from "react";
import { cn } from "@/lib/utils";

export type StatusTone =
  | "success"
  | "warning"
  | "danger"
  | "accent"
  | "muted";

export interface StatusBadgeProps {
  tone: StatusTone;
  children: React.ReactNode;
  /** Show a small dot before the label */
  dot?: boolean;
  className?: string;
}

/**
 * Linear-style status pill — minimal, semantic colors only.
 */
export function StatusBadge({ tone, children, dot, className }: StatusBadgeProps) {
  const tones: Record<StatusTone, string> = {
    success: "pill-success",
    warning: "pill-warning",
    danger: "pill-danger",
    accent: "pill-accent",
    muted: "pill-muted",
  };
  const dotColor: Record<StatusTone, string> = {
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
    accent: "bg-accent",
    muted: "bg-secondary",
  };
  return (
    <span className={cn("pill", tones[tone], className)}>
      {dot && (
        <span
          className={cn(
            "inline-block h-1.5 w-1.5 rounded-full",
            dotColor[tone],
            tone === "success" && "animate-pulse-status",
          )}
          aria-hidden
        />
      )}
      {children}
    </span>
  );
}

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-16 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md border border-border bg-surface-2 text-secondary">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-text">{title}</h3>
      {description && (
        <p className="mt-1 max-w-md text-sm text-secondary">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}