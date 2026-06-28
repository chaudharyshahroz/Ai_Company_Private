import * as React from "react";
import { cn } from "@/lib/utils";

/** Centered max-width page container with consistent horizontal padding. */
export function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-7xl px-6", className)} {...props} />;
}

/** Section wrapper with consistent vertical rhythm. */
export function Section({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn("relative py-24 md:py-32", className)}
      {...props}
    />
  );
}

/** Small uppercase eyebrow label used above section headlines. */
export function Eyebrow({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-secondary",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** Re-export the count-up component for inline use. */
export { AnimatedCounter } from "./AnimatedCounter";

/** Common className merger. */
export { cn };