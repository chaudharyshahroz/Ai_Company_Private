"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/ui/layout";
import { GlassCard } from "@/components/ui/GlassCard";

const testimonials = [
  {
    name: "Maya Chen",
    role: "Founder",
    company: "Tidepool",
    quote:
      "I went from publishing twice a month to publishing every week. Aria learned my voice after one sample post. My engagement tripled.",
    rating: 5,
  },
  {
    name: "Jordan Patel",
    role: "Solo founder",
    company: "Loophole Labs",
    quote:
      "Atlas (the CEO agent) noticed a competitor launch before I did and had a positioning brief waiting for me Monday morning. That's the moment I knew this was real.",
    rating: 5,
  },
  {
    name: "Sam Rivera",
    role: "Founder & CEO",
    company: "Quiver",
    quote:
      "I hired three agents. I sleep better. My wife is happier. The ROI math is silly — they cost less than one part-time intern and they never call in sick.",
    rating: 5,
  },
  {
    name: "Aisha Patel",
    role: "Indie hacker",
    company: "Stitchwork",
    quote:
      "The agent-to-agent delegation is the magic. Hunter doesn't just send cold emails — he reads my last 10 replies and adjusts the sequence. Real motion.",
    rating: 5,
  },
  {
    name: "Tom Wright",
    role: "Founder",
    company: "Boots & Cats",
    quote:
      "I run an agency and we use Reklu to draft the first pass of every client deliverable. We've cut our turnaround in half without losing quality.",
    rating: 5,
  },
  {
    name: "Lena Park",
    role: "Founder",
    company: "Lucent",
    quote:
      "Riley handles 80% of our support tickets without escalation. The other 20% get triaged with full context. I haven't written a support reply in 6 weeks.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Founders love Reklu</Eyebrow>
          <h2 className="text-balance font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Founders who got their <span className="gradient-text">time back</span>
          </h2>
        </div>

        <div className="mt-16 columns-1 gap-5 md:columns-2 lg:columns-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="mb-5 break-inside-avoid"
            >
              <GlassCard className="relative p-6">
                <Quote
                  size={32}
                  className="absolute right-5 top-5 text-primary/20"
                />
                <div className="mb-3 flex items-center gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-text-primary">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-border/50 pt-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-warm text-sm font-semibold text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-primary">{t.name}</div>
                    <div className="text-xs text-text-tertiary">
                      {t.role} · {t.company}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs italic text-text-tertiary">
          Testimonials are representative — replace with real founder quotes before launch.
        </p>
      </Container>
    </Section>
  );
}