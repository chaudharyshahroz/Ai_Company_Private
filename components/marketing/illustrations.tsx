"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Custom SVG illustrations for Reklu.
 * Hand-drawn, minimal, monochrome with a single accent color.
 * No stock icons. No emojis.
 */

interface SvgProps {
  className?: string;
  /** Accent color override (defaults to current text color). */
  accent?: string;
}

// ───────────────────────────────────────────────────────────
//  AI CEO — central brain with radiating departments
// ───────────────────────────────────────────────────────────

export function CeoBrainIllustration({ className, accent = "#5E6AD2" }: SvgProps) {
  return (
    <svg
      viewBox="0 0 400 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full", className)}
    >
      <defs>
        <radialGradient id="ceo-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.25" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer halo */}
      <circle cx="200" cy="140" r="120" fill="url(#ceo-glow)" />

      {/* Department nodes around the CEO */}
      {[
        { angle: -90, dist: 100, label: "Sales" },
        { angle: -30, dist: 100, label: "Marketing" },
        { angle: 30, dist: 100, label: "Support" },
        { angle: 90, dist: 100, label: "Research" },
        { angle: 150, dist: 100, label: "Finance" },
        { angle: 210, dist: 100, label: "Ops" },
      ].map((dept) => {
        const rad = (dept.angle * Math.PI) / 180;
        const x = 200 + Math.cos(rad) * dept.dist;
        const y = 140 + Math.sin(rad) * dept.dist;
        return (
          <g key={dept.label}>
            {/* Connection line */}
            <line
              x1="200"
              y1="140"
              x2={x}
              y2={y}
              stroke={accent}
              strokeOpacity="0.3"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
            {/* Node */}
            <circle cx={x} cy={y} r="16" fill="#141516" stroke={accent} strokeOpacity="0.4" />
            <circle cx={x} cy={y} r="3" fill={accent} />
          </g>
        );
      })}

      {/* CEO center node — animated */}
      <circle cx="200" cy="140" r="36" fill="#0F1011" stroke={accent} strokeWidth="1.5" />
      <circle cx="200" cy="140" r="22" fill={accent} fillOpacity="0.15" />
      <circle cx="200" cy="140" r="14" fill={accent} fillOpacity="0.4" />
      <circle cx="200" cy="140" r="6" fill={accent} />

      {/* Animated pulse */}
      <circle cx="200" cy="140" r="6" fill="none" stroke={accent} strokeWidth="1.5">
        <animate attributeName="r" from="6" to="40" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.8" to="0" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

// ───────────────────────────────────────────────────────────
//  Department Network — hexagonal grid with connections
// ───────────────────────────────────────────────────────────

export function DeptNetworkIllustration({ className, accent = "#5E6AD2" }: SvgProps) {
  const depts = [
    { x: 80, y: 60, label: "Sales", status: "working" },
    { x: 220, y: 50, label: "Marketing", status: "review" },
    { x: 340, y: 100, label: "Support", status: "working" },
    { x: 100, y: 180, label: "Research", status: "done" },
    { x: 250, y: 200, label: "Finance", status: "working" },
    { x: 360, y: 220, label: "Ops", status: "review" },
  ];
  return (
    <svg viewBox="0 0 440 280" fill="none" className={cn("w-full", className)}>
      {/* Connection lines (with offset paths) */}
      {depts.map((d, i) =>
        depts.slice(i + 1).map((d2, j) => (
          <line
            key={`${i}-${j}`}
            x1={d.x}
            y1={d.y}
            x2={d2.x}
            y2={d2.y}
            stroke={accent}
            strokeOpacity="0.15"
            strokeWidth="1"
          />
        )),
      )}
      {depts.map((d) => (
        <g key={d.label}>
          <rect
            x={d.x - 28}
            y={d.y - 14}
            width="56"
            height="28"
            rx="6"
            fill="#141516"
            stroke={accent}
            strokeOpacity={d.status === "working" ? "0.6" : "0.2"}
            strokeWidth="1"
          />
          <text
            x={d.x}
            y={d.y + 3}
            textAnchor="middle"
            fontSize="10"
            fontFamily="Inter, sans-serif"
            fontWeight="500"
            fill="#F7F8F8"
          >
            {d.label}
          </text>
          <circle
            cx={d.x + 22}
            cy={d.y - 8}
            r="2"
            fill={d.status === "done" ? "#63D471" : d.status === "review" ? "#F5C451" : accent}
          />
        </g>
      ))}
    </svg>
  );
}

// ───────────────────────────────────────────────────────────
//  Work Inbox — document with priority queue
// ───────────────────────────────────────────────────────────

export function WorkInboxIllustration({ className, accent = "#5E6AD2" }: SvgProps) {
  return (
    <svg viewBox="0 0 400 280" fill="none" className={cn("w-full", className)}>
      {/* Background */}
      <rect x="20" y="40" width="360" height="200" rx="8" fill="#0F1011" stroke="rgba(255,255,255,0.05)" />

      {/* Header */}
      <rect x="20" y="40" width="360" height="32" rx="8" fill="#141516" />
      <rect x="20" y="64" width="360" height="1" fill="rgba(255,255,255,0.05)" />
      <circle cx="40" cy="56" r="4" fill={accent} fillOpacity="0.4" />
      <text x="55" y="60" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="500" fill="#8A8F98">
        Work Inbox
      </text>
      <rect x="320" y="50" width="40" height="14" rx="9999" fill={accent} fillOpacity="0.15" />
      <text x="340" y="60" textAnchor="middle" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="500" fill={accent}>
        6 pending
      </text>

      {/* Issue rows */}
      {[
        { y: 90, status: "review", id: "WRK-1024", title: "LinkedIn post: Q3 launch" },
        { y: 130, status: "review", id: "WRK-1025", title: "10 personalized cold emails" },
        { y: 170, status: "draft", id: "WRK-1026", title: "Competitor scan brief" },
        { y: 210, status: "done", id: "WRK-1027", title: "Weekly board report" },
      ].map((row) => {
        const statusColor =
          row.status === "done" ? "#63D471" : row.status === "draft" ? "#F5C451" : accent;
        return (
          <g key={row.id}>
            <rect x="20" y={row.y} width="360" height="36" fill={row.status === "done" ? "rgba(99,212,113,0.03)" : "transparent"} />
            <line x1="20" y1={row.y + 36} x2="380" y2={row.y + 36} stroke="rgba(255,255,255,0.05)" />
            <circle cx="40" cy={row.y + 18} r="3" fill={statusColor} />
            <text x="55" y={row.y + 15} fontSize="9" fontFamily="ui-monospace, monospace" fill="#62666D">
              {row.id}
            </text>
            <text x="55" y={row.y + 28} fontSize="11" fontFamily="Inter, sans-serif" fontWeight="500" fill="#F7F8F8">
              {row.title}
            </text>
            <rect x="320" y={row.y + 12} width="48" height="14" rx="9999" fill={statusColor} fillOpacity="0.12" />
            <text
              x="344"
              y={row.y + 22}
              textAnchor="middle"
              fontSize="8"
              fontFamily="Inter, sans-serif"
              fontWeight="500"
              letterSpacing="0.5"
              fill={statusColor}
              style={{ textTransform: "uppercase" }}
            >
              {row.status}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ───────────────────────────────────────────────────────────
//  Business Brain — neural network / memory
// ───────────────────────────────────────────────────────────

export function BrainIllustration({ className, accent = "#5E6AD2" }: SvgProps) {
  // 4 layers of nodes with connections
  const layers = [
    [3],
    [5, 5, 5],
    [5, 5, 5],
    [3],
  ];
  const layerX = [60, 140, 220, 300];
  const positions: { x: number; y: number; layer: number }[] = [];
  layers.forEach((layer, li) => {
    const x = layerX[li]!;
    layer.forEach((_, ni) => {
      const count = layer.length;
      const y = 140 - ((count - 1) * 30) / 2 + ni * 30;
      positions.push({ x, y, layer: li });
    });
  });

  return (
    <svg viewBox="0 0 360 280" fill="none" className={cn("w-full", className)}>
      <defs>
        <radialGradient id="brain-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.2" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="180" cy="140" rx="160" ry="120" fill="url(#brain-glow)" />

      {/* All connections */}
      {positions.map((p, i) =>
        positions.slice(i + 1).map((p2, j) => {
          if (Math.abs(p.layer - p2.layer) !== 1) return null;
          return (
            <line
              key={`${i}-${j}`}
              x1={p.x}
              y1={p.y}
              x2={p2.x}
              y2={p2.y}
              stroke={accent}
              strokeOpacity="0.18"
              strokeWidth="0.75"
            />
          );
        }),
      )}

      {/* Highlighted (active) connections */}
      {[
        [0, 3], [0, 4], [3, 6], [4, 6], [6, 7],
      ].map(([a, b], i) => {
        const p1 = positions[a];
        const p2 = positions[b];
        if (!p1 || !p2) return null;
        return (
          <line
            key={`hl-${i}`}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke={accent}
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />
        );
      })}

      {/* Nodes */}
      {positions.map((p, i) => {
        const highlighted = [0, 3, 4, 6, 7].includes(i);
        return (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={highlighted ? 6 : 4}
              fill={highlighted ? accent : "#0F1011"}
              stroke={accent}
              strokeWidth={highlighted ? 0 : 1}
              strokeOpacity={highlighted ? 1 : 0.4}
            />
            {highlighted && (
              <circle cx={p.x} cy={p.y} r="6" fill="none" stroke={accent} strokeOpacity="0.4">
                <animate attributeName="r" from="6" to="14" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ───────────────────────────────────────────────────────────
//  Goals / Target — concentric with arrows
// ───────────────────────────────────────────────────────────

export function GoalsIllustration({ className, accent = "#5E6AD2" }: SvgProps) {
  return (
    <svg viewBox="0 0 360 280" fill="none" className={cn("w-full", className)}>
      {/* Concentric rings */}
      <circle cx="180" cy="140" r="100" stroke={accent} strokeOpacity="0.15" />
      <circle cx="180" cy="140" r="75" stroke={accent} strokeOpacity="0.25" />
      <circle cx="180" cy="140" r="50" stroke={accent} strokeOpacity="0.4" />
      <circle cx="180" cy="140" r="25" stroke={accent} strokeOpacity="0.7" />
      <circle cx="180" cy="140" r="6" fill={accent} />

      {/* Crosshairs */}
      <line x1="60" y1="140" x2="100" y2="140" stroke={accent} strokeOpacity="0.3" strokeWidth="1" />
      <line x1="260" y1="140" x2="300" y2="140" stroke={accent} strokeOpacity="0.3" strokeWidth="1" />
      <line x1="180" y1="20" x2="180" y2="60" stroke={accent} strokeOpacity="0.3" strokeWidth="1" />
      <line x1="180" y1="220" x2="180" y2="260" stroke={accent} strokeOpacity="0.3" strokeWidth="1" />

      {/* Arrows */}
      <g transform="translate(220, 60)">
        <line x1="0" y1="0" x2="-20" y2="20" stroke={accent} strokeWidth="1.5" />
        <polygon points="-20,20 -16,12 -12,18" fill={accent} />
      </g>
      <g transform="translate(140, 220)">
        <line x1="0" y1="0" x2="20" y2="-20" stroke={accent} strokeWidth="1.5" />
        <polygon points="20,-20 12,-16 18,-12" fill={accent} />
      </g>
    </svg>
  );
}

// ───────────────────────────────────────────────────────────
//  Reports / Analytics — chart bars rising
// ───────────────────────────────────────────────────────────

export function ReportsIllustration({ className, accent = "#5E6AD2" }: SvgProps) {
  const heights = [40, 65, 50, 85, 70, 95, 110];
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <svg viewBox="0 0 360 280" fill="none" className={cn("w-full", className)}>
      {/* Grid */}
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1="40"
          y1={40 + i * 50}
          x2="320"
          y2={40 + i * 50}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
        />
      ))}

      {/* Bars */}
      {heights.map((h, i) => {
        const x = 50 + i * 38;
        const y = 240 - h;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width="24"
              height={h}
              rx="2"
              fill={accent}
              fillOpacity={i === 6 ? "0.8" : i === 5 ? "0.55" : "0.35"}
            >
              {i === 6 && (
                <animate attributeName="height" from={h * 0.5} to={h} dur="1.5s" repeatCount="indefinite" />
              )}
            </rect>
            <text
              x={x + 12}
              y="258"
              textAnchor="middle"
              fontSize="9"
              fontFamily="Inter, sans-serif"
              fill="#62666D"
            >
              {labels[i]}
            </text>
          </g>
        );
      })}

      {/* Trend line */}
      <polyline
        points="62,200 100,175 138,190 176,155 214,170 252,145 290,130"
        fill="none"
        stroke="#63D471"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="290" cy="130" r="3" fill="#63D471" />
    </svg>
  );
}

// ───────────────────────────────────────────────────────────
//  Widget — chat bubble + lead capture
// ───────────────────────────────────────────────────────────

export function WidgetIllustration({ className, accent = "#5E6AD2" }: SvgProps) {
  return (
    <svg viewBox="0 0 400 280" fill="none" className={cn("w-full", className)}>
      {/* Browser frame */}
      <rect x="20" y="40" width="360" height="220" rx="8" fill="#0F1011" stroke="rgba(255,255,255,0.05)" />
      {/* Address bar */}
      <rect x="20" y="40" width="360" height="28" rx="8" fill="#141516" />
      <rect x="20" y="60" width="360" height="1" fill="rgba(255,255,255,0.05)" />
      <circle cx="36" cy="54" r="3" fill="#EF6461" />
      <circle cx="46" cy="54" r="3" fill="#F5C451" />
      <circle cx="56" cy="54" r="3" fill="#63D471" />
      <rect x="140" y="48" width="160" height="14" rx="6" fill="#0F1011" />
      <text x="220" y="58" textAnchor="middle" fontSize="9" fontFamily="ui-monospace, monospace" fill="#62666D">
        yoursite.com
      </text>

      {/* Page content (fake) */}
      <rect x="40" y="84" width="120" height="8" rx="2" fill="#62666D" />
      <rect x="40" y="98" width="200" height="6" rx="2" fill="rgba(255,255,255,0.06)" />
      <rect x="40" y="110" width="180" height="6" rx="2" fill="rgba(255,255,255,0.06)" />
      <rect x="40" y="128" width="80" height="24" rx="4" fill={accent} />
      <text x="80" y="144" textAnchor="middle" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="500" fill="white">
        Get started
      </text>

      {/* Chat widget */}
      <g>
        <rect x="260" y="160" width="100" height="80" rx="10" fill="#0F1011" stroke={accent} strokeWidth="1" />
        <circle cx="280" cy="178" r="10" fill={accent} fillOpacity="0.2" />
        <circle cx="280" cy="178" r="6" fill={accent} />
        <text x="298" y="178" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="500" fill="#F7F8F8">
          Acme AI
        </text>
        <text x="298" y="190" fontSize="8" fontFamily="Inter, sans-serif" fill="#63D471">
          ● Online
        </text>
        {/* Chat bubble */}
        <rect x="270" y="200" width="80" height="14" rx="6" fill={accent} fillOpacity="0.15" />
        <text x="278" y="210" fontSize="7" fontFamily="Inter, sans-serif" fill="#F7F8F8">
          Hi! How can we help?
        </text>
        <rect x="270" y="220" width="50" height="10" rx="9999" fill="#0F1011" stroke="rgba(255,255,255,0.08)" />
      </g>
    </svg>
  );
}