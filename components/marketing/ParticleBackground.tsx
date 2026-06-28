"use client";

import * as React from "react";

export interface ParticleBackgroundProps {
  /** Number of particles. Defaults to 60. */
  count?: number;
  /** Max connection distance in CSS pixels. */
  maxDistance?: number;
  /** Particle base color (defaults to brand purple). */
  color?: string;
  /** Enable cursor-following glow. */
  cursorGlow?: boolean;
}

/**
 * Canvas-based animated particle mesh.
 * 60+ floating dots connected by faint lines, slow drift.
 * The particle nearest the cursor gets a purple glow.
 * Pauses when the tab is hidden to save battery.
 */
export function ParticleBackground({
  count = 60,
  maxDistance = 140,
  color = "255, 255, 255",
  cursorGlow = true,
}: ParticleBackgroundProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rafRef = React.useRef<number | null>(null);
  const mouseRef = React.useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    type P = { x: number; y: number; vx: number; vy: number; r: number; phase: number };
    let particles: P[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };
    const onLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const tick = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      // Draw connection lines first (so dots overlay them)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]!;
          const b = particles[j]!;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < maxDistance) {
            const alpha = (1 - d / maxDistance) * 0.18;
            ctx.strokeStyle = `rgba(${color}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      let closestIdx = -1;
      let closestD = Infinity;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]!;
        if (cursorGlow && mouseRef.current.active) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const d = Math.hypot(dx, dy);
          if (d < 80 && d < closestD) {
            closestD = d;
            closestIdx = i;
          }
        }

        // Gentle floating motion (sin wave on top of velocity)
        const breathe = Math.sin(t * 0.0008 + p.phase) * 0.2;
        p.x += p.vx + breathe * 0.05;
        p.y += p.vy + breathe * 0.05;

        // Wrap edges
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        ctx.fillStyle = `rgba(${color}, 0.6)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cursor-attracted glow on the closest particle
      if (cursorGlow && closestIdx !== -1 && mouseRef.current.active) {
        const p = particles[closestIdx]!;
        const intensity = Math.max(0, 1 - closestD / 120);

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 24);
        grad.addColorStop(0, `rgba(${color}, ${0.6 * intensity})`);
        grad.addColorStop(1, `rgba(${color}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 24, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${color}, ${0.8 + 0.2 * intensity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + 1.5 * intensity, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const start = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    resize();
    seed();
    start();

    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count, maxDistance, color, cursorGlow]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full"
    />
  );
}