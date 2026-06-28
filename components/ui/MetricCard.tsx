import * as React from "react";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  /** Optional small description below the value */
  hint?: string;
  /** Trend indicator */
  trend?: { direction: "up" | "down" | "flat"; value: string };
  /** Optional icon */
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Linear-style metric card. Compact, single-purpose, monospace numbers.
 */
export function MetricCard({ label, value, hint, trend, icon, className }: MetricCardProps) {
  return (
    <div className={cn("panel p-5", className)}>
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-secondary">
          {label}
        </span>
        {icon && <span className="text-secondary">{icon}</span>}
      </div>
      <div className="mt-3 font-mono text-2xl font-medium tabular-nums text-text">
        {value}
      </div>
      {(hint || trend) && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={cn(
                "font-medium",
                trend.direction === "up" && "text-success",
                trend.direction === "down" && "text-danger",
                trend.direction === "flat" && "text-secondary",
              )}
            >
              {trend.value}
            </span>
          )}
          {hint && <span className="text-muted-text">{hint}</span>}
        </div>
      )}
    </div>
  );
}