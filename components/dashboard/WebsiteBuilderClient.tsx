"use client";

import * as React from "react";
import {
  Plus,
  X,
  Globe,
  Sparkles,
  Copy,
  Download,
  Code,
  Trash2,
  CheckCircle2,
  Star,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Eye,
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/StatusBadge";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export type WebsiteType = "landing" | "long-form-sales" | "waitlist" | "pricing" | "about";

export type WebsiteStatus = "draft" | "ready" | "published";

export interface WebsitePageView {
  id: string;
  name: string;
  slug: string;
  type: WebsiteType;
  status: WebsiteStatus;
  goal: string;
  tone: string;
  targetAudience: string;
  hero: { headline: string; subhead: string; cta: string };
  problem: { title: string; points: string[] };
  solution: { title: string; points: string[] };
  features: { title: string; description: string }[];
  socialProof: { quote: string; author: string; company: string }[];
  pricing: { tier: string; price: string; features: string[] }[];
  faq: { q: string; a: string }[];
  cta: { headline: string; cta: string };
  seo: { title: string; description: string };
  createdAt: string;
}

const typeMeta: Record<WebsiteType, { label: string; tone: string }> = {
  landing: { label: "Landing", tone: "text-accent border-accent/30 bg-accent/10" },
  "long-form-sales": { label: "Long-form sales", tone: "text-success border-success/30 bg-success/10" },
  waitlist: { label: "Waitlist", tone: "text-warning border-warning/30 bg-warning/10" },
  pricing: { label: "Pricing", tone: "text-info border-info/30 bg-info/10" },
  about: { label: "About", tone: "text-secondary border-secondary/30 bg-secondary/10" },
};

const statusMeta: Record<WebsiteStatus, { label: string; tone: string }> = {
  draft: { label: "Draft", tone: "text-muted-text border-border bg-surface-2" },
  ready: { label: "Ready", tone: "text-accent border-accent/30 bg-accent/10" },
  published: { label: "Published", tone: "text-success border-success/30 bg-success/10" },
};

const emptyForm = {
  name: "",
  type: "landing" as WebsiteType,
  goal: "",
  tone: "Bold, modern, outcome-focused",
  targetAudience: "",
};

export function WebsiteBuilderClient({ initial }: { initial: WebsitePageView[] }) {
  const toast = useToast();
  const [pages, setPages] = React.useState<WebsitePageView[]>(initial);
  const [active, setActive] = React.useState<string | null>(initial[0]?.id ?? null);
  const [showAdd, setShowAdd] = React.useState(false);
  const [form, setForm] = React.useState(emptyForm);
  const [creating, setCreating] = React.useState(false);
  const [tab, setTab] = React.useState<"preview" | "structure" | "seo">("preview");

  const activePage = pages.find((p) => p.id === active);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.goal.trim()) return;
    setCreating(true);
    setShowAdd(false);
    toast.push({
      tone: "info",
      title: `Building "${form.name}"`,
      description: "Pixel is generating hero, problem, solution, features, social proof, pricing, FAQ, and SEO. ETA: 30s.",
    });
    await new Promise((r) => setTimeout(r, 1200));

    const newPage: WebsitePageView = {
      id: `wp-new-${Date.now()}`,
      name: form.name.trim(),
      slug: `/${form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
      type: form.type,
      status: "ready",
      goal: form.goal,
      tone: form.tone,
      targetAudience: form.targetAudience || "your ideal customer",
      hero: {
        headline: `Stop struggling with ${form.goal.toLowerCase()}.`,
        subhead: `${form.targetAudience || "Operators like you"} use us to ${form.goal.toLowerCase()} — in 14 days, no code.`,
        cta: "Get started",
      },
      problem: {
        title: `You're losing time and money.`,
        points: [
          `Manual work is eating your week`,
          `Your tools don't talk to each other`,
          `You can't scale without hiring`,
          `You know AI can help — you just don't know where to start`,
        ],
      },
      solution: {
        title: `AI that ships work, not just suggestions.`,
        points: [
          `Hire an AI team in 14 days`,
          `Sales, marketing, content, support, research — all working 24/7`,
          `All output reviewed and approved by you before it goes out`,
          `Built for ${(form.targetAudience || "operators like you").toLowerCase()}`,
        ],
      },
      features: [
        { title: "24/7 execution", description: "Your AI team works while you sleep. They don't stop." },
        { title: "Built-in quality", description: "Every output is reviewed and approved before it ships." },
        { title: "Multi-department", description: "Sales, marketing, content, support, research, ops — coordinated." },
        { title: "Pay per outcome", description: "Flat monthly pricing. No per-seat surprises." },
      ],
      socialProof: [
        { quote: "We replaced 3 contractors with 1 AI team. Same output, 1/10th the cost.", author: "Sarah K.", company: "Bright Smile Dental" },
        { quote: "It actually does the work. That's the difference.", author: "Marcus W.", company: "Wright Realty" },
      ],
      pricing: [
        { tier: "Starter", price: "$29/mo", features: ["1 AI employee", "500 tasks/mo", "Email support"] },
        { tier: "Growth", price: "$79/mo", features: ["5 AI employees", "5,000 tasks/mo", "Priority support"] },
        { tier: "Company", price: "$149/mo", features: ["10 AI employees", "Unlimited tasks", "Dedicated CSM"] },
      ],
      faq: [
        { q: "How fast can I get started?", a: "Most teams are live in 14 days." },
        { q: "What if I don't like an output?", a: "Edit it or regenerate. The AI learns from your edits." },
        { q: "Can I cancel anytime?", a: "Yes. No contracts." },
      ],
      cta: { headline: `Ready to ${form.goal.toLowerCase()}?`, cta: "Get started" },
      seo: {
        title: `${form.name} — ${form.targetAudience || "AI for your business"}`,
        description: `${form.goal} in 14 days. Built for ${(form.targetAudience || "your business").toLowerCase()}.`,
      },
      createdAt: new Date().toISOString(),
    };
    setPages((prev) => [newPage, ...prev]);
    setActive(newPage.id);
    setForm(emptyForm);
    setCreating(false);
    toast.push({
      tone: "success",
      title: "Page ready",
      description: `${newPage.name} generated. Review the structure or export.`,
    });
  };

  const remove = (id: string) => {
    const p = pages.find((x) => x.id === id);
    if (!p) return;
    setPages((prev) => prev.filter((x) => x.id !== id));
    if (active === id) setActive(pages.find((x) => x.id !== id)?.id ?? null);
    toast.push({ tone: "info", title: `"${p.name}" removed` });
  };

  const exportHtml = (p: WebsitePageView) => {
    const html = renderHtml(p);
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(html);
      toast.push({ tone: "success", title: "HTML copied to clipboard" });
    } else {
      toast.push({ tone: "info", title: "Export queued", description: "HTML will be in your Work Inbox." });
    }
  };

  const exportNext = (p: WebsitePageView) => {
    toast.push({
      tone: "info",
      title: "Next.js export queued",
      description: `A new Next.js page with ${p.name} will be ready in 30s. Check Work Inbox.`,
    });
  };

  const publish = (id: string) => {
    setPages((prev) => prev.map((p) => (p.id === id ? { ...p, status: "published" as const } : p)));
    const p = pages.find((x) => x.id === id);
    toast.push({ tone: "success", title: `"${p?.name}" published`, description: `Live at ${p?.slug}` });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="md" onClick={() => setShowAdd(true)} disabled={creating}>
          {creating ? <Sparkles size={13} className="animate-pulse" /> : <Plus size={13} />}
          Generate page
        </Button>
      </div>

      {pages.length === 0 ? (
        <EmptyState
          title="No pages yet"
          description="Generate your first landing page — hero, problem, solution, features, pricing, FAQ, and SEO included."
          action={
            <Button size="md" onClick={() => setShowAdd(true)}>
              <Plus size={13} /> Generate page
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          {/* List */}
          <div className="space-y-2">
            {pages.map((p) => (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                className={cn(
                  "block w-full rounded-md border border-border bg-surface-1 p-3 text-left transition-colors",
                  active === p.id && "border-accent/40 bg-surface-2",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium text-text">{p.name}</div>
                    <div className="mt-0.5 truncate font-mono text-[10px] text-muted-text">{p.slug}</div>
                  </div>
                  <div className={cn("rounded border px-1.5 py-0.5 text-[9px] font-medium uppercase", statusMeta[p.status].tone)}>
                    {statusMeta[p.status].label}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className={cn("rounded border px-1.5 py-0.5 text-[10px] font-medium", typeMeta[p.type].tone)}>
                    {typeMeta[p.type].label}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Detail */}
          {activePage ? (
            <div className="space-y-4">
              <Panel className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
                      <Globe size={11} />
                      Website Builder
                    </div>
                    <h2 className="mt-2 text-[20px] font-semibold text-text">{activePage.name}</h2>
                    <div className="mt-2 flex items-center gap-2 text-[11px]">
                      <code className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-text">
                        {activePage.slug}
                      </code>
                      <div className={cn("rounded border px-1.5 py-0.5 font-medium", typeMeta[activePage.type].tone)}>
                        {typeMeta[activePage.type].label}
                      </div>
                      <div className={cn("rounded border px-1.5 py-0.5 font-medium uppercase", statusMeta[activePage.status].tone)}>
                        {statusMeta[activePage.status].label}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm" onClick={() => exportHtml(activePage)}>
                      <Code size={12} /> Export HTML
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => exportNext(activePage)}>
                      <Download size={12} /> Export Next.js
                    </Button>
                    {activePage.status !== "published" && (
                      <Button size="sm" onClick={() => publish(activePage.id)}>
                        <ExternalLink size={12} /> Publish
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => remove(activePage.id)}>
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 rounded-md border border-border bg-surface-1 p-0.5">
                  {(["preview", "structure", "seo"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={cn(
                        "rounded px-3 py-1 text-[11px] font-medium uppercase tracking-wider transition-colors",
                        tab === t ? "bg-surface-2 text-text" : "text-muted-text hover:text-text",
                      )}
                    >
                      {t === "preview" ? <Eye size={10} className="mr-1 inline" /> : t === "structure" ? <Code size={10} className="mr-1 inline" /> : <Star size={10} className="mr-1 inline" />}
                      {t}
                    </button>
                  ))}
                </div>
              </Panel>

              {tab === "preview" && <PagePreview p={activePage} />}
              {tab === "structure" && <PageStructure p={activePage} />}
              {tab === "seo" && <PageSeo p={activePage} />}
            </div>
          ) : null}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowAdd(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md">
            <Panel className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-accent">New Page</div>
                  <h3 className="mt-1 text-[16px] font-medium text-text">Generate landing page</h3>
                </div>
                <button onClick={() => setShowAdd(false)} className="rounded-md p-1 text-muted-text hover:text-text">
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={create} className="space-y-3">
                <Field label="Page name *">
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="e.g. Acme AI Studios"
                    className="w-full rounded-md border border-border bg-surface-1 px-3 py-2 text-[13px] text-text focus:border-accent/50 focus:outline-none"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Type">
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value as WebsiteType })}
                      className="w-full rounded-md border border-border bg-surface-1 px-3 py-2 text-[13px] text-text focus:border-accent/50 focus:outline-none"
                    >
                      {Object.entries(typeMeta).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Tone">
                    <input
                      value={form.tone}
                      onChange={(e) => setForm({ ...form, tone: e.target.value })}
                      placeholder="Bold, modern"
                      className="w-full rounded-md border border-border bg-surface-1 px-3 py-2 text-[13px] text-text focus:border-accent/50 focus:outline-none"
                    />
                  </Field>
                </div>
                <Field label="Goal *">
                  <input
                    value={form.goal}
                    onChange={(e) => setForm({ ...form, goal: e.target.value })}
                    required
                    placeholder="e.g. Book 15-min demo calls"
                    className="w-full rounded-md border border-border bg-surface-1 px-3 py-2 text-[13px] text-text focus:border-accent/50 focus:outline-none"
                  />
                </Field>
                <Field label="Target audience">
                  <input
                    value={form.targetAudience}
                    onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                    placeholder="e.g. Local service business owners"
                    className="w-full rounded-md border border-border bg-surface-1 px-3 py-2 text-[13px] text-text focus:border-accent/50 focus:outline-none"
                  />
                </Field>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" size="md" className="flex-1" disabled={creating}>
                    {creating ? <Sparkles size={13} className="animate-pulse" /> : <Sparkles size={13} />}
                    Generate
                  </Button>
                  <Button type="button" variant="secondary" size="md" onClick={() => setShowAdd(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
}

function PagePreview({ p }: { p: WebsitePageView }) {
  return (
    <div className="space-y-3">
      {/* Hero */}
      <Panel className="bg-gradient-to-br from-surface-1 to-surface-2 p-8 text-center">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-[32px] font-semibold leading-tight text-text">{p.hero.headline}</h1>
          <p className="mt-3 text-[16px] text-secondary">{p.hero.subhead}</p>
          <div className="mt-5 inline-flex">
            <Button size="md">
              {p.hero.cta}
              <ArrowRight size={13} />
            </Button>
          </div>
        </div>
      </Panel>

      {/* Problem */}
      <Panel className="p-6">
        <h2 className="text-[18px] font-medium text-text">{p.problem.title}</h2>
        <ul className="mt-3 space-y-2">
          {p.problem.points.map((pt, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] text-secondary">
              <X size={12} className="mt-0.5 shrink-0 text-danger" />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </Panel>

      {/* Solution */}
      <Panel className="border-accent/30 bg-accent/5 p-6">
        <h2 className="text-[18px] font-medium text-text">{p.solution.title}</h2>
        <ul className="mt-3 space-y-2">
          {p.solution.points.map((pt, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] text-secondary">
              <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-success" />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </Panel>

      {/* Features */}
      <Panel className="p-6">
        <h2 className="text-[18px] font-medium text-text">Features</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {p.features.map((f, i) => (
            <div key={i} className="rounded-md border border-border bg-surface-1 p-3">
              <div className="text-[13px] font-medium text-text">{f.title}</div>
              <div className="mt-1 text-[12px] text-secondary">{f.description}</div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Social proof */}
      <Panel className="p-6">
        <h2 className="text-[18px] font-medium text-text">What customers say</h2>
        <div className="mt-3 space-y-3">
          {p.socialProof.map((q, i) => (
            <blockquote key={i} className="rounded-md border-l-2 border-accent bg-surface-1 p-3">
              <p className="text-[14px] italic text-text">"{q.quote}"</p>
              <footer className="mt-2 text-[11px] text-muted-text">
                — {q.author}, {q.company}
              </footer>
            </blockquote>
          ))}
        </div>
      </Panel>

      {/* Pricing */}
      <Panel className="p-6">
        <h2 className="text-[18px] font-medium text-text">Pricing</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {p.pricing.map((tier, i) => (
            <div key={i} className={cn("rounded-md border p-4", i === 1 ? "border-accent/50 bg-accent/5" : "border-border bg-surface-1")}>
              <div className="text-[11px] font-medium uppercase tracking-wider text-muted-text">{tier.tier}</div>
              <div className="mt-1 font-mono text-[20px] font-semibold text-text">{tier.price}</div>
              <ul className="mt-3 space-y-1.5">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-1.5 text-[12px] text-secondary">
                    <CheckCircle2 size={10} className="mt-0.5 shrink-0 text-success" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Panel>

      {/* FAQ */}
      <Panel className="p-6">
        <h2 className="text-[18px] font-medium text-text">FAQ</h2>
        <div className="mt-3 space-y-2">
          {p.faq.map((q, i) => (
            <details key={i} className="rounded-md border border-border bg-surface-1 p-3">
              <summary className="cursor-pointer text-[13px] font-medium text-text">
                <HelpCircle size={11} className="mr-1.5 inline" />
                {q.q}
              </summary>
              <p className="mt-2 text-[12px] text-secondary">{q.a}</p>
            </details>
          ))}
        </div>
      </Panel>

      {/* Final CTA */}
      <Panel className="bg-gradient-to-br from-accent/20 to-accent/5 p-8 text-center">
        <h2 className="text-[24px] font-semibold text-text">{p.cta.headline}</h2>
        <div className="mt-4 inline-flex">
          <Button size="md">
            {p.cta.cta}
            <ArrowRight size={13} />
          </Button>
        </div>
      </Panel>
    </div>
  );
}

function PageStructure({ p }: { p: WebsitePageView }) {
  const sections: { title: string; icon: React.ElementType; items: string[] }[] = [
    { title: "Hero", icon: Star, items: [p.hero.headline, p.hero.subhead, `CTA: ${p.hero.cta}`] },
    { title: "Problem", icon: X, items: p.problem.points },
    { title: "Solution", icon: CheckCircle2, items: p.solution.points },
    { title: "Features", icon: Sparkles, items: p.features.map((f) => f.title) },
    { title: "Social proof", icon: Star, items: p.socialProof.map((q) => `${q.author} — ${q.company}`) },
    { title: "Pricing", icon: Star, items: p.pricing.map((t) => `${t.tier}: ${t.price}`) },
    { title: "FAQ", icon: HelpCircle, items: p.faq.map((q) => q.q) },
    { title: "Final CTA", icon: ArrowRight, items: [p.cta.headline, p.cta.cta] },
  ];
  return (
    <Panel className="p-5">
      <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-text">
        <Code size={11} className="text-accent" />
        Page structure
      </div>
      <div className="space-y-2">
        {sections.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="rounded-md border border-border bg-surface-1 p-3">
              <div className="flex items-center gap-2 text-[12px] font-medium text-text">
                <Icon size={11} className="text-accent" />
                {s.title}
                <span className="text-[10px] text-muted-text">· {s.items.length} items</span>
              </div>
              <ul className="mt-1.5 space-y-0.5">
                {s.items.map((it, j) => (
                  <li key={j} className="truncate text-[11px] text-secondary">
                    · {it}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function PageSeo({ p }: { p: WebsitePageView }) {
  return (
    <Panel className="p-5">
      <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-text">
        <Star size={11} className="text-accent" />
        SEO & AEO
      </div>
      <div className="space-y-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">Title tag</div>
          <div className="mt-1 rounded-md border border-border bg-surface-1 p-2 font-mono text-[12px] text-text">
            {p.seo.title}
          </div>
          <div className="mt-1 text-[10px] text-muted-text">{p.seo.title.length} characters</div>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">Meta description</div>
          <div className="mt-1 rounded-md border border-border bg-surface-1 p-2 text-[12px] text-secondary">
            {p.seo.description}
          </div>
          <div className="mt-1 text-[10px] text-muted-text">{p.seo.description.length} characters</div>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">AEO answer block</div>
          <pre className="mt-1 whitespace-pre-wrap rounded-md border border-border bg-surface-1 p-2 font-mono text-[11px] text-secondary">
{`Q: What does ${p.name} do?
A: ${p.name} helps ${p.targetAudience.toLowerCase()} ${p.goal.toLowerCase()}. ${p.hero.headline} ${p.cta.cta}.`}
          </pre>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-text">Open Graph</div>
          <pre className="mt-1 whitespace-pre-wrap rounded-md border border-border bg-surface-1 p-2 font-mono text-[11px] text-secondary">
{`<title>${p.seo.title}</title>
<meta name="description" content="${p.seo.description}" />
<meta property="og:title" content="${p.seo.title}" />
<meta property="og:description" content="${p.seo.description}" />
<meta property="og:type" content="website" />`}
          </pre>
        </div>
      </div>
    </Panel>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-muted-text">{label}</label>
      {children}
    </div>
  );
}

function renderHtml(p: WebsitePageView): string {
  // Minimal HTML export — enough to demonstrate the structure.
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escape(p.seo.title)}</title>
  <meta name="description" content="${escape(p.seo.description)}" />
</head>
<body>
  <header>
    <h1>${escape(p.hero.headline)}</h1>
    <p>${escape(p.hero.subhead)}</p>
    <a href="#cta">${escape(p.hero.cta)}</a>
  </header>
  <section><h2>${escape(p.problem.title)}</h2><ul>${p.problem.points.map((x) => `<li>${escape(x)}</li>`).join("")}</ul></section>
  <section><h2>${escape(p.solution.title)}</h2><ul>${p.solution.points.map((x) => `<li>${escape(x)}</li>`).join("")}</ul></section>
  <section><h2>Features</h2>${p.features.map((f) => `<div><h3>${escape(f.title)}</h3><p>${escape(f.description)}</p></div>`).join("")}</section>
  <section><h2>Pricing</h2>${p.pricing.map((t) => `<div><h3>${escape(t.tier)}</h3><p>${escape(t.price)}</p><ul>${t.features.map((x) => `<li>${escape(x)}</li>`).join("")}</ul></div>`).join("")}</section>
  <section><h2>FAQ</h2>${p.faq.map((q) => `<details><summary>${escape(q.q)}</summary><p>${escape(q.a)}</p></details>`).join("")}</section>
  <section id="cta"><h2>${escape(p.cta.headline)}</h2><a href="#">${escape(p.cta.cta)}</a></section>
</body>
</html>`;
}

function escape(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c);
}
