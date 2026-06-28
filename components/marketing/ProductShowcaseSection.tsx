"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/ui/layout";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import {
  CeoBrainIllustration,
  DeptNetworkIllustration,
  WorkInboxIllustration,
  BrainIllustration,
  GoalsIllustration,
  ReportsIllustration,
  WidgetIllustration,
} from "./illustrations";
import { cn } from "@/lib/utils";

/**
 * Product showcase — Linear-style "Engineered for teams" sections.
 * Side-by-side SVG + copy blocks. Alternating alignment.
 */
export function ProductShowcaseSection() {
  return (
    <Section id="showcase" className="relative overflow-hidden">
      {/* Subtle bg accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.03] blur-3xl"
      />

      <Container className="relative">
        <div className="mb-20 max-w-3xl">
          <Eyebrow>The operating system</Eyebrow>
          <h2 className="text-section text-text">
            Built for AI employees and{" "}
            <span className="text-accent">human owners</span>.
          </h2>
          <p className="mt-5 text-body text-secondary md:text-lg">
            Every screen in Reklu is designed like an operating system. Your AI CEO
            coordinates departments. Departments coordinate employees. You approve work
            and assign goals. Everyone — human and AI — has a clear role.
          </p>
        </div>

        <div className="space-y-32">
          <ShowcaseRow
            flip
            eyebrow="CEO Briefing"
            title="Your AI CEO runs the company."
            description="Every morning, Atlas reviews what completed, what's waiting, and what should happen today. Then he delegates to the right departments and reports back. Like a chief of staff that never sleeps."
            cta="See how the CEO works"
            illustration={<CeoBrainIllustration className="h-72" />}
          />

          <ShowcaseRow
            eyebrow="Work Inbox"
            title="Approve work, don't chat."
            description="Every AI employee submits their output to one place. Review, edit, regenerate, approve, or send. No chatbot copy-paste. No lost work. Every output is structured, attributed, and traceable."
            cta="See the Work Inbox"
            illustration={<WorkInboxIllustration className="h-72" />}
          />

          <ShowcaseRow
            flip
            eyebrow="Departments"
            title="10 departments. 42 employees. One company."
            description="Hire from Executive, Sales, Support, Marketing, Research, Finance, Operations, Product & Website, Admin, or Legal. Each department has a manager and specialized employees that coordinate work — like a real org chart, but it runs 24/7."
            cta="Browse departments"
            illustration={<DeptNetworkIllustration className="h-72" />}
          />

          <ShowcaseRow
            eyebrow="Business Brain"
            title="Your company gets smarter every day."
            description="Your Business Brain holds your products, audience, voice, competitors, FAQs, policies. Every AI employee pulls from it automatically. The longer you use Reklu, the better your agents understand your business."
            cta="See the Brain"
            illustration={<BrainIllustration className="h-72" />}
          />

          <ShowcaseRow
            flip
            eyebrow="Goals"
            title="Tell your CEO what to achieve. He plans it."
            description="Set a goal like 'get 50 qualified leads this month.' The AI CEO breaks it into tasks, assigns them to departments, and tracks progress. You approve the plan, then watch the team execute."
            cta="See goal planning"
            illustration={<GoalsIllustration className="h-72" />}
          />

          <ShowcaseRow
            eyebrow="Reports"
            title="Weekly board reports, every Monday."
            description="Every Monday morning, your AI company sends you a full executive summary. What was done, what's next, KPIs, and recommendations. Track performance over time. See which employees are crushing it."
            cta="See reports"
            illustration={<ReportsIllustration className="h-72" />}
          />

          <ShowcaseRow
            flip
            eyebrow="Widget"
            title="Capture leads and answer questions 24/7."
            description="Drop the Reklu widget on your site. It captures leads, qualifies them, and answers FAQs using your Business Brain. Your AI Support + AI Sales team working your website around the clock."
            cta="See the widget"
            illustration={<WidgetIllustration className="h-72" />}
          />
        </div>
      </Container>
    </Section>
  );
}

function ShowcaseRow({
  eyebrow,
  title,
  description,
  cta,
  illustration,
  flip,
}: {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  illustration: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid items-center gap-12 lg:grid-cols-2 lg:gap-16",
        flip && "lg:[&>div:first-child]:order-2",
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <Panel className="p-2 shadow-2xl">{illustration}</Panel>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Eyebrow>{eyebrow}</Eyebrow>
        <h3 className="text-page text-text">{title}</h3>
        <p className="mt-4 text-body text-secondary md:text-lg">{description}</p>
        <div className="mt-6">
          <Button asChild variant="secondary">
            <Link href="#">
              {cta}
              <ArrowRight size={13} />
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}