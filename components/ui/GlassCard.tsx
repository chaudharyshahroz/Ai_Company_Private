import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** When true, applies a stronger backdrop blur (for nav, modals). */
  strong?: boolean;
  /** Adds a subtle hover lift effect. */
  hoverable?: boolean;
}

/**
 * Glassmorphism card surface with subtle border + backdrop blur.
 * Used throughout the marketing site and dashboard for premium feel.
 */
export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, strong, hoverable, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl",
          strong ? "glass-strong" : "glass",
          hoverable &&
            "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-sm",
          className,
        )}
        {...props}
      />
    );
  },
);
GlassCard.displayName = "GlassCard";