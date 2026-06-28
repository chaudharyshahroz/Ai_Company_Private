"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

/**
 * Mockup of the dashboard — 3 agent cards with status indicators.
 * Floats gently to feel alive. Used inside the hero.
 */
export function HeroMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, rotateY: -8 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1200 }}
      className="relative w-full max-w-md"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="glass-strong relative overflow-hidden rounded-2xl p-5 shadow-glow"
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-text-tertiary">
              Your AI Company
            </div>
            <div className="mt-0.5 text-sm font-medium text-text-primary">
              Monday Board Report
            </div>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15">
            <Sparkles size={14} className="text-primary-light" />
          </div>
        </div>

        {/* Agent cards */}
        <div className="space-y-2.5">
          <AgentRow
            emoji="✍️"
            name="Aria"
            role="Content Writer"
            status="working"
            delay={0}
          />
          <AgentRow
            emoji="🔍"
            name="Nova"
            role="Research Analyst"
            status="working"
            delay={0.6}
          />
          <AgentRow
            emoji="💼"
            name="Atlas"
            role="Sales Agent"
            status="completed"
            delay={1.2}
          />
        </div>

        {/* Bottom bar */}
        <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-xs text-text-secondary">2 agents working</span>
          </div>
          <span className="text-xs text-text-tertiary">12 tasks this week</span>
        </div>
      </motion.div>

      {/* Side accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-primary/30 blur-3xl"
      />
    </motion.div>
  );
}

function AgentRow({
  emoji,
  name,
  role,
  status,
  delay,
}: {
  emoji: string;
  name: string;
  role: string;
  status: "working" | "completed" | "idle";
  delay: number;
}) {
  const statusMap = {
    working: {
      label: "Working",
      dotClass: "bg-accent",
      textClass: "text-accent",
      pulse: true,
    },
    completed: {
      label: "Done · 4m ago",
      dotClass: "bg-text-tertiary",
      textClass: "text-text-tertiary",
      pulse: false,
    },
    idle: {
      label: "Idle",
      dotClass: "bg-text-tertiary",
      textClass: "text-text-tertiary",
      pulse: false,
    },
  } as const;
  const s = statusMap[status];

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.8 + delay }}
      className="flex items-center justify-between rounded-xl bg-surface/60 p-3"
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/30 to-accent-warm/30 text-base",
            status === "working" && "ring-1 ring-accent/40",
          )}
        >
          {emoji}
        </div>
        <div>
          <div className="text-sm font-medium text-text-primary">{name}</div>
          <div className="text-xs text-text-tertiary">{role}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="relative inline-flex h-2 w-2">
          {s.pulse && (
            <span
              className={cn(
                "absolute inset-0 animate-ping rounded-full opacity-75",
                s.dotClass,
              )}
            />
          )}
          <span className={cn("relative inline-flex h-2 w-2 rounded-full", s.dotClass)} />
        </span>
        <span className={cn("text-xs font-medium", s.textClass)}>{s.label}</span>
      </div>
    </motion.div>
  );
}