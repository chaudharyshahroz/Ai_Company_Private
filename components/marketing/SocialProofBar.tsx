"use client";

import * as React from "react";

/**
 * Infinite-scrolling logo marquee. Pure CSS animation, no JS.
 * Logos are placeholder wordmarks (since we don't ship real brand marks here).
 */
export function SocialProofBar() {
  const logos = [
    "Shopify", "Stripe", "Linear", "Notion", "Figma", "Webflow",
    "Vercel", "Framer", "Loom", "Calendly", "Intercom", "Zapier",
  ];
  // Duplicate for seamless loop
  const reel = [...logos, ...logos];

  return (
    <section className="relative border-y border-border/40 bg-surface/30 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-text-tertiary">
          Trusted by founders from
        </p>
        <div
          className="relative overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div className="flex animate-marquee gap-12 whitespace-nowrap">
            {reel.map((name, i) => (
              <div
                key={`${name}-${i}`}
                className="flex shrink-0 items-center gap-2 text-lg font-semibold text-text-tertiary/80 transition-colors hover:text-text-secondary"
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-primary/60"
                  aria-hidden
                />
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}