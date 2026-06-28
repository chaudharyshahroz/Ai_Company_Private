"use client";

import * as React from "react";
import { useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AnimatedCounterProps {
  /** Final value to count up to. */
  value: number;
  /** Optional starting value. Defaults to 0. */
  from?: number;
  /** Duration of the count-up in seconds. */
  duration?: number;
  /** Optional formatter (e.g. for USD or compact numbers). */
  formatter?: (n: number) => string;
  /** Extra Tailwind classes for the rendered span. */
  className?: string;
  /** Trigger on viewport entry (default true). */
  triggerOnView?: boolean;
}

const defaultFormat = (n: number) =>
  new Intl.NumberFormat("en-US").format(Math.round(n));

/**
 * Smoothly counts up to `value` when scrolled into view.
 * Uses a spring for buttery deceleration — feels much more premium
 * than a linear `requestAnimationFrame` ticker.
 */
export function AnimatedCounter({
  value,
  from = 0,
  duration = 1.4,
  formatter = defaultFormat,
  className,
  triggerOnView = true,
}: AnimatedCounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const motion = useMotionValue(from);
  const spring = useSpring(motion, {
    duration: duration * 1000,
    bounce: 0,
  });
  const rounded = useTransform(spring, (latest) => formatter(latest));
  const [display, setDisplay] = React.useState(formatter(from));

  React.useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => unsub();
  }, [rounded]);

  React.useEffect(() => {
    if (!triggerOnView || isInView) motion.set(value);
  }, [isInView, motion, value, triggerOnView]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {display}
    </span>
  );
}