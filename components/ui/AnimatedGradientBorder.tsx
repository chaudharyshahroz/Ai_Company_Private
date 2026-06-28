import * as React from "react";
import { cn } from "@/lib/utils";

export interface AnimatedGradientBorderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Border thickness in pixels. */
  thickness?: number;
  /** Optional inner content padding override. */
  innerClassName?: string;
}

/**
 * Wraps children in a card with an animated gradient border.
 * Uses a pseudo-element trick (no double-render) — see globals.css `.gradient-border`.
 */
export const AnimatedGradientBorder = React.forwardRef<
  HTMLDivElement,
  AnimatedGradientBorderProps
>(({ className, children, thickness = 1, innerClassName, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("gradient-border", className)}
      style={{ padding: thickness }}
      {...props}
    >
      <div
        className={cn(
          "relative rounded-[calc(1rem-1px)] bg-surface p-6",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
});
AnimatedGradientBorder.displayName = "AnimatedGradientBorder";