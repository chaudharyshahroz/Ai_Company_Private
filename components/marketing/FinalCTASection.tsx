"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Section } from "@/components/ui/layout";
import { Button } from "@/components/ui/Button";
import { CeoBrainIllustration } from "./illustrations";

export function FinalCTASection() {
  return (
    <Section className="relative overflow-hidden">
      {/* Background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 800px 500px at 50% 50%, rgba(94, 106, 210, 0.12), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex justify-center"
        >
          <CeoBrainIllustration className="h-40" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-section text-text md:text-[56px]"
        >
          Ready to hire your{" "}
          <span className="text-accent">AI company</span>?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-5 max-w-xl text-body text-secondary md:text-lg"
        >
          One company. One CEO. 42 AI employees ready to work.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Button asChild size="xl">
            <Link href="/sign-up" className="group">
              <Sparkles size={14} className="text-accent-hover" />
              Build My AI Company — Free
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="xl">
            <Link href="/employees">
              Browse employees
              <ArrowRight size={13} />
            </Link>
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-5 text-xs text-muted-text"
        >
          Free for 1 AI employee forever · No credit card · Cancel anytime
        </motion.p>
      </div>
    </Section>
  );
}