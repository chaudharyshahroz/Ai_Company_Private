import * as React from "react";
import { cn } from "@/lib/utils";

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tighter padding for dense data views */
  dense?: boolean;
  /** Use surface-2 (slightly elevated) */
  elevated?: boolean;
  /** Hover affordance */
  hoverable?: boolean;
  /** When true, removes the panel background (for inline rows) */
  flush?: boolean;
}

/**
 * Linear-style panel.
 *  - Subtle border, no shadow by default.
 *  - 8px radius (precise, not pillowy).
 *  - Use for cards, sections, and grouped content.
 */
export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, dense, elevated, hoverable, flush, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          !flush && (elevated ? "panel-2" : "panel"),
          hoverable &&
            "transition-colors duration-100 hover:border-border-strong cursor-pointer",
          dense ? "p-4" : "p-6",
          className,
        )}
        {...props}
      />
    );
  },
);
Panel.displayName = "Panel";

// Alias for backward compat
export const GlassCard = Panel;