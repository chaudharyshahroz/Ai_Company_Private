import * as React from "react";
import { cn } from "@/lib/utils";

export interface FloatingOrbsProps {
  className?: string;
}

/**
 * Decorative floating blurred orbs — slow vertical drift, like a calm aurora.
 * Pure CSS keyframes so it costs ~0 once painted.
 */
export function FloatingOrbs({ className }: FloatingOrbsProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {/* Purple orb — top-left */}
      <div
        className="absolute -left-32 -top-32 h-[480px] w-[480px] rounded-full bg-primary/30 blur-3xl"
        style={{ animation: "float 12s ease-in-out infinite" }}
      />
      {/* Pink orb — right */}
      <div
        className="absolute right-[-160px] top-1/4 h-[420px] w-[420px] rounded-full bg-accent-warm/20 blur-3xl"
        style={{ animation: "float 10s ease-in-out infinite 1s" }}
      />
      {/* Teal orb — bottom-center */}
      <div
        className="absolute bottom-[-120px] left-1/3 h-[360px] w-[360px] rounded-full bg-accent/20 blur-3xl"
        style={{ animation: "float 14s ease-in-out infinite 2s" }}
      />
    </div>
  );
}