"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play, Command } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductShowcase } from "./ProductShowcase";

/**
 * Hero v2 — Linear-inspired with custom SVG product showcase.
 *
 *  - Mesh gradient backdrop (subtle, monochrome).
 *  - Star field animation (60 dots).
 *  - Stacked layered product UI mockup (centerpiece).
 *  - Kinetic typography reveal.
 *  - Floating feature badges.
 *  - Trust line + dual CTA.
 */
export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden pt-24 pb-24 md:pt-32 md:pb-32">
      {/* Mesh gradient backdrop */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-bg" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 1200px 700px at 50% -10%, rgba(94, 106, 210, 0.15), transparent 50%),
              radial-gradient(ellipse 800px 500px at 80% 30%, rgba(94, 106, 210, 0.08), transparent 50%),
              radial-gradient(ellipse 800px 600px at 20% 50%, rgba(94, 106, 210, 0.06), transparent 50%)
            `,
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Star field */}
      <StarField count={50} />

      <div className="relative mx-auto max-w-[1200px] px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 text-[12px] text-secondary backdrop-blur"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-success animate-pulse-status" />
            <span>Hiring AI employees · 500+ founders onboarded</span>
            <ArrowRight size={11} className="text-muted-text" />
          </motion.div>

          {/* Headline — kinetic reveal */}
          <h1 className="text-[56px] font-semibold leading-[1.02] tracking-[-0.03em] text-text md:text-[72px] lg:text-[88px]">
            {"Your AI company,".split("").map((char, i) => (
              <motion.span
                key={`a-${i}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.02 }}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
            <br />
            <span className="text-accent">{"operating 24/7.".split("").map((char, i) => (
              <motion.span
                key={`b-${i}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 + i * 0.02 }}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}</span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-secondary md:text-[18px]"
          >
            Reklu gives every business an{" "}
            <span className="font-medium text-text">AI CEO</span>, departments, employees, tasks, approvals, reports, and business memory — all inside one operating system.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Button asChild size="lg">
              <Link href="/sign-up" className="group">
                Build My AI Company
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="#showcase">
                <Play size={12} fill="currentColor" />
                Watch 2-min tour
              </Link>
            </Button>
          </motion.div>

          {/* Trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-6 flex items-center justify-center gap-4 text-[12px] text-muted-text"
          >
            <span className="flex items-center gap-1.5">
              <kbd>⌘</kbd>
              <kbd>K</kbd>
              <span>command menu</span>
            </span>
            <span className="text-border">·</span>
            <span>Free for 1 AI employee forever</span>
            <span className="text-border">·</span>
            <span>No credit card</span>
          </motion.div>
        </div>

        {/* Product showcase */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-20"
        >
          <ProductShowcase />

          {/* Floating feature badges */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="absolute -left-4 top-1/4 hidden lg:block"
          >
            <FloatingBadge
              icon={<Sparkles size={12} className="text-accent" />}
              title="Atlas — AI CEO"
              subtitle="Managing your company"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
            className="absolute -right-4 top-1/3 hidden lg:block"
          >
            <FloatingBadge
              icon={<Command size={12} className="text-accent" />}
              title="⌘K"
              subtitle="Open command menu"
              mono
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.8 }}
            className="absolute -bottom-6 left-1/4 hidden lg:block"
          >
            <FloatingBadge
              icon={<span className="h-2 w-2 rounded-full bg-success animate-pulse-status" />}
              title="24 leads found"
              subtitle="Sales dept · 5m ago"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function FloatingBadge({
  icon,
  title,
  subtitle,
  mono,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-surface/90 p-3 shadow-2xl backdrop-blur-md">
      <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface-2">
        {icon}
      </div>
      <div>
        <div className={`text-[13px] font-medium text-text ${mono ? "font-mono" : ""}`}>
          {title}
        </div>
        <div className="text-[11px] text-muted-text">{subtitle}</div>
      </div>
    </div>
  );
}

function StarField({ count = 50 }: { count?: number }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let raf: number | null = null;

    type P = { x: number; y: number; r: number; vx: number; vy: number; o: number };
    let particles: P[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.3,
        vx: (Math.random() - 0.5) * 0.06,
        vy: (Math.random() - 0.5) * 0.06,
        o: Math.random() * 0.4 + 0.2,
      }));
    };

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -5) p.x = width + 5;
        else if (p.x > width + 5) p.x = -5;
        if (p.y < -5) p.y = height + 5;
        else if (p.y > height + 5) p.y = -5;

        ctx.fillStyle = `rgba(255, 255, 255, ${p.o})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf != null) return;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (raf != null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };
    const onVis = () => {
      if (document.hidden) stop();
      else start();
    };

    resize();
    seed();
    start();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 -z-10 h-full w-full"
    />
  );
}