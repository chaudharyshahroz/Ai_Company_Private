"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  Briefcase,
  MessageSquare,
  ShieldCheck,
  Globe,
  DollarSign,
  FileText,
  Plus,
  X,
  Sparkles,
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  progress: number;
  suggestions: string[];
}

const sections: Section[] = [
  {
    id: "business-info",
    title: "Business Info",
    description: "Tell us about your business so AI employees understand who you are.",
    icon: Building2,
    progress: 100,
    suggestions: ["Update your business name", "Add your tagline"],
  },
  {
    id: "products",
    title: "Products & Services",
    description: "What you sell, your offers, and key differentiators.",
    icon: Briefcase,
    progress: 80,
    suggestions: ["Add your top product"],
  },
  {
    id: "faqs",
    title: "FAQs",
    description: "Common questions your customers ask. AI Support uses these to answer.",
    icon: MessageSquare,
    progress: 60,
    suggestions: ["Add 3 FAQs", "What does your service cost?", "How do refunds work?"],
  },
  {
    id: "pricing",
    title: "Pricing",
    description: "Your prices, plans, and what's included at each level.",
    icon: DollarSign,
    progress: 0,
    suggestions: ["Add your pricing"],
  },
  {
    id: "policies",
    title: "Policies",
    description: "Refund, shipping, terms — anything customers need to know upfront.",
    icon: ShieldCheck,
    progress: 30,
    suggestions: ["Refund policy", "Privacy policy"],
  },
  {
    id: "documents",
    title: "Documents",
    description: "Upload PDFs, briefs, sales scripts. AI employees read these.",
    icon: FileText,
    progress: 45,
    suggestions: ["Upload product document", "Add sales script"],
  },
  {
    id: "website-links",
    title: "Website Links",
    description: "Pages we should know about — landing pages, blogs, docs.",
    icon: Globe,
    progress: 75,
    suggestions: ["Add website link"],
  },
];

export function KnowledgeBaseClient() {
  const toast = useToast();
  const [progress, setProgress] = React.useState<Record<string, number>>(
    () => Object.fromEntries(sections.map((s) => [s.id, s.progress])),
  );
  const [activeSection, setActiveSection] = React.useState<Section | null>(null);
  const [draft, setDraft] = React.useState("");

  const overall = Math.round(
    Object.values(progress).reduce((s, v) => s + v, 0) / sections.length,
  );

  const handleAddInfo = (section: Section) => {
    setActiveSection(section);
    setDraft("");
  };

  const handleSaveSection = () => {
    if (!activeSection) return;
    if (!draft.trim()) {
      toast.push({
        tone: "warning",
        title: "Nothing to save",
        description: "Type something before saving.",
      });
      return;
    }
    setProgress((p) => ({
      ...p,
      [activeSection.id]: Math.min(100, (p[activeSection.id] ?? 0) + 20),
    }));
    toast.push({
      tone: "success",
      title: `${activeSection.title} updated`,
      description: `Saved “${draft.slice(0, 60)}${draft.length > 60 ? "…" : ""}”. Training progress will improve.`,
    });
    setActiveSection(null);
    setDraft("");
  };

  const handleQuickAdd = (text: string, sectionTitle: string) => {
    setProgress((p) => {
      const next = { ...p };
      // Bump the most relevant section by ~10 points (cap at 100)
      const target = sections.find((s) => s.title === sectionTitle);
      if (target) next[target.id] = Math.min(100, (next[target.id] ?? 0) + 10);
      return next;
    });
    toast.push({
      tone: "success",
      title: "Added",
      description: `“${text}” saved to ${sectionTitle}.`,
    });
  };

  return (
    <>
      <div className="mb-8 max-w-3xl">
        <h1 className="page-title">Train Your AI Team</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-secondary">
          Add your business information so your AI employees can work accurately. The more you share, the better they perform.
        </p>
      </div>

      {/* Overall progress */}
      <Panel className="mb-8 px-6 py-6 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-muted-text">
              AI Training Progress
            </p>
            <p className="mt-2 font-mono text-[34px] font-semibold leading-none text-text tabular-nums">
              {overall}%
            </p>
            <p className="mt-2 text-[13.5px] text-secondary">
              Your AI team has enough context for daily work. A few more sections and they'll be ready for anything.
            </p>
          </div>
          <a
            href="#suggestions"
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#FFFFFF] px-3 text-[13px] font-medium text-[#0A0B0C] shadow-button hover:bg-white"
          >
            See suggestions below
          </a>
        </div>
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{ width: `${overall}%` }}
          />
        </div>
      </Panel>

      {/* Edit modal */}
      {activeSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4 backdrop-blur-sm">
          <Panel className="w-full max-w-lg p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-accent">
                  {activeSection.title}
                </p>
                <p className="mt-1 text-[13.5px] text-secondary">
                  {activeSection.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection(null)}
                className="rounded-md p-1 text-muted-text hover:bg-hover hover:text-text"
              >
                <X size={14} />
              </button>
            </div>
            <textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={6}
              placeholder={`Type your ${activeSection.title.toLowerCase()} here…`}
              className="reklu-input"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setActiveSection(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSection}>
                <Sparkles size={12} />
                Save & retrain
              </Button>
            </div>
          </Panel>
        </div>
      )}

      {/* Sections grid */}
      <div className="mb-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          const value = progress[section.id];
          return (
            <Panel key={section.id} hoverable className="flex flex-col gap-4 p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface-2 text-secondary">
                  <Icon size={18} />
                </div>
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 font-mono text-[11px] tabular-nums",
                    value >= 80
                      ? "bg-success/10 text-success"
                      : value >= 40
                        ? "bg-warning/10 text-warning"
                        : "bg-muted text-muted-text",
                  )}
                >
                  {value}%
                </span>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-text">{section.title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-secondary">
                  {section.description}
                </p>
              </div>
              <div className="mt-auto">
                <Button variant="secondary" size="sm" onClick={() => handleAddInfo(section)}>
                  <Plus size={12} />
                  Add info
                </Button>
              </div>
            </Panel>
          );
        })}
      </div>

      {/* Suggestions */}
      <section id="suggestions">
        <h2 className="section-title mb-1">Quick suggestions</h2>
        <p className="mb-5 text-[14px] text-secondary">
          Small additions that make a big difference to your AI team.
        </p>
        <Panel className="p-0">
          <ul className="divide-y divide-border">
            {sections
              .flatMap((s) => s.suggestions.map((text) => ({ section: s.title, text })))
              .slice(0, 6)
              .map((s, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-hover md:px-6"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2 text-secondary">
                    <Plus size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14.5px] font-medium text-text">{s.text}</p>
                    <p className="mt-0.5 text-[12.5px] text-muted-text">
                      Goes in {s.section}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="shrink-0"
                    onClick={() => handleQuickAdd(s.text, s.section)}
                  >
                    Add
                  </Button>
                </li>
              ))}
          </ul>
        </Panel>
      </section>
    </>
  );
}