"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Circle } from "lucide-react";
import { CeoBrainIllustration } from "./illustrations";

/**
 * Centerpiece product showcase.
 *  - Layered, tilted panels giving 3D depth.
 *  - Scroll-driven parallax (subtle).
 *  - Real-looking UI chrome, not a fake browser.
 */
export function ProductShowcase() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateMain = useTransform(scrollYProgress, [0, 1], [-2, 1]);
  const rotateBack = useTransform(scrollYProgress, [0, 1], [3, -1]);
  const yMain = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <div ref={ref} className="relative" style={{ perspective: "1500px" }}>
      {/* Background panel (employees list, offset) */}
      <motion.div
        style={{ rotate: rotateBack, transformOrigin: "center" }}
        className="absolute inset-x-12 top-12 -z-10"
      >
        <div className="panel-2 overflow-hidden p-0 opacity-60 shadow-2xl">
          <PanelHeader title="AI Employees" badge="42" />
          <div className="px-2 py-2">
            {[
              { emoji: "🎯", name: "Atlas", role: "AI CEO", status: "working" },
              { emoji: "💼", name: "Hunter", role: "Sales Manager", status: "working" },
              { emoji: "✍️", name: "Aria", role: "Content Writer", status: "review" },
              { emoji: "🔍", name: "Nova", role: "Research Analyst", status: "done" },
              { emoji: "💬", name: "Robin", role: "Support", status: "working" },
              { emoji: "📣", name: "Maya", role: "Marketing Mgr", status: "idle" },
            ].map((emp) => (
              <div
                key={emp.name}
                className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-hover"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{emp.emoji}</span>
                  <div>
                    <div className="text-[13px] font-medium text-text">{emp.name}</div>
                    <div className="text-[11px] text-muted-text">{emp.role}</div>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] text-muted-text">
                  <Circle
                    size={6}
                    fill={
                      emp.status === "working"
                        ? "#63D471"
                        : emp.status === "review"
                        ? "#F5C451"
                        : "#62666D"
                    }
                    stroke="none"
                  />
                  {emp.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main panel — Company HQ */}
      <motion.div style={{ rotate: rotateMain, y: yMain }}>
        <div className="panel overflow-hidden p-0 shadow-2xl">
          <PanelHeader title="Reklu OS" subtitle="reklu.app/hq" badge="HQ" badgeColor="accent" />

          {/* Main grid */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
            {/* Mini sidebar */}
            <div className="border-b border-border bg-surface-2 p-3 md:border-b-0 md:border-r">
              <div className="space-y-0.5">
                {[
                  { label: "Company HQ", active: true, badge: "" },
                  { label: "CEO Briefing", active: false },
                  { label: "Work Inbox", active: false, badge: "6" },
                  { label: "Goals", active: false },
                  { label: "Task Board", active: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between rounded-md px-2 py-1.5 text-[12px] ${
                      item.active
                        ? "bg-accent/12 text-text"
                        : "text-secondary"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="rounded bg-muted px-1 text-[10px] text-secondary">
                        {item.badge}
                      </span>
                    )}
                  </div>
                ))}
                <div className="mt-4 mb-1 px-2 text-[9px] font-semibold uppercase tracking-wider text-muted-text">
                  Depts
                </div>
                {["Sales", "Marketing", "Support", "Research", "Finance"].map((d) => (
                  <div key={d} className="rounded-md px-2 py-1.5 text-[12px] text-secondary">
                    {d}
                  </div>
                ))}
              </div>
            </div>

            {/* Main content */}
            <div className="p-6">
              {/* CEO brain illustration */}
              <div className="mb-4 flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                  AI CEO Briefing
                </span>
                <span className="text-[11px] text-muted-text">· Today</span>
              </div>
              <CeoBrainIllustration className="h-32" />

              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  { label: "Employees", value: "31", tone: "accent" },
                  { label: "Tasks", value: "18", tone: "success" },
                  { label: "Approvals", value: "6", tone: "warning" },
                  { label: "Hours", value: "14h", tone: "success" },
                ].map((kpi) => (
                  <div key={kpi.label} className="rounded-md border border-border bg-surface-2 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-text">
                      {kpi.label}
                    </div>
                    <div
                      className={`mt-1 font-mono text-lg ${
                        kpi.tone === "accent"
                          ? "text-accent"
                          : kpi.tone === "warning"
                          ? "text-warning"
                          : "text-success"
                      }`}
                    >
                      {kpi.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent work */}
              <div className="mt-4 rounded-md border border-border bg-surface-2 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-text">
                    Recent work
                  </span>
                  <ArrowUpRight size={11} className="text-muted-text" />
                </div>
                {[
                  { id: "WRK-1024", title: "LinkedIn post: Q3 launch", emp: "Aria", tone: "accent" },
                  { id: "WRK-1025", title: "10 cold emails drafted", emp: "Echo", tone: "accent" },
                  { id: "WRK-1026", title: "Competitor scan complete", emp: "Nova", tone: "muted" },
                ].map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center justify-between border-t border-border py-2 first:border-t-0 first:pt-0"
                  >
                    <div>
                      <div className="text-[13px] text-text">{w.title}</div>
                      <div className="text-[11px] text-muted-text">
                        {w.emp} · <span className="font-mono">{w.id}</span>
                      </div>
                    </div>
                    <span
                      className={`pill ${
                        w.tone === "accent"
                          ? "pill-accent"
                          : w.tone === "warning"
                          ? "pill-warning"
                          : w.tone === "success"
                          ? "pill-success"
                          : "pill-muted"
                      }`}
                    >
                      review
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function PanelHeader({
  title,
  subtitle,
  badge,
  badgeColor,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: "accent" | "muted";
}) {
  return (
    <div className="flex items-center justify-between border-b border-border bg-surface-2 px-4 py-2.5">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
        </div>
        <span className="text-[12px] font-medium text-text">{title}</span>
        {subtitle && (
          <span className="font-mono text-[11px] text-muted-text">{subtitle}</span>
        )}
      </div>
      {badge && (
        <span
          className={`pill ${
            badgeColor === "accent" ? "pill-accent" : "pill-muted"
          }`}
        >
          {badge}
        </span>
      )}
    </div>
  );
}