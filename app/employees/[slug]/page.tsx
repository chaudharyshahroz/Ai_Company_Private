import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus, Settings, Pause, BarChart3, Zap, Brain, ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { getCurrentUser } from "@/lib/data";
import { getEmployee, EMPLOYEES } from "@/lib/employees";
import { DEPARTMENTS } from "@/lib/departments";
import { formatUsd, cn } from "@/lib/utils";

interface Params {
  params: { slug: string };
}

export async function generateStaticParams() {
  return EMPLOYEES.map((e) => ({ slug: e.slug }));
}

const PERMISSION_LABELS = {
  1: "Draft Only",
  2: "Needs Approval",
  3: "Auto Work",
  4: "Admin Power",
};

export default async function EmployeeDetailPage({ params }: Params) {
  const employee = getEmployee(params.slug);
  if (!employee) notFound();
  const user = await getCurrentUser();
  const dept = DEPARTMENTS.find((d) => d.slug === employee.department);

  return (
    <div className="flex min-h-screen bg-background">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={3} />
        <main className="flex-1 px-6 py-8 md:px-8">
          <Link href="/employees" className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary">
            <ArrowLeft size={14} />
            All employees
          </Link>

          {/* Header */}
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br text-4xl shadow-glow",
                  employee.avatarColor,
                )}
              >
                {employee.avatarEmoji}
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{employee.name}</h1>
                <p className="mt-1 text-lg text-text-secondary">{employee.role}</p>
                <p className="mt-1 text-sm text-text-tertiary">
                  {dept?.name} Department · {employee.tier}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <GlowButton variant="secondary" size="md">
                <Settings size={14} />
                Configure
              </GlowButton>
              <GlowButton variant="secondary" size="md">
                <Pause size={14} />
                Pause
              </GlowButton>
              <GlowButton size="md">
                <Plus size={14} />
                Hire · {formatUsd(employee.monthlyPriceUsd)}/mo
              </GlowButton>
            </div>
          </div>

          {/* Description */}
          <GlassCard className="mb-8 p-7">
            <p className="text-base leading-relaxed text-text-primary">{employee.description}</p>
          </GlassCard>

          {/* Stats row */}
          <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatBox icon={Zap} label="Tasks completed" value="247" />
            <StatBox icon={BarChart3} label="Performance score" value="94/100" accent />
            <StatBox icon={Brain} label="Memory scope" value={employee.permissionLevel === 4 ? "Company-wide" : "Department"} />
            <StatBox icon={ShieldCheck} label="Permission level" value={PERMISSION_LABELS[employee.permissionLevel]} />
          </div>

          {/* Skills, Tools, Capabilities */}
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <Card title="Skills">
              <div className="flex flex-wrap gap-1.5">
                {employee.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-xs text-primary-light"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Card>
            <Card title="Tools">
              <div className="flex flex-wrap gap-1.5">
                {employee.tools.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-surface px-2 py-0.5 text-xs text-text-secondary"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Card>
            <Card title="Best for">
              <div className="flex flex-wrap gap-1.5">
                {employee.industryFit.map((i) => (
                  <span
                    key={i}
                    className="rounded-full border border-accent/30 bg-accent/5 px-2 py-0.5 text-xs text-accent"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* Capabilities */}
          <Card title="Capabilities" className="mb-8">
            <ul className="space-y-2">
              {employee.capabilities.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-text-primary">
                  <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-primary-light" />
                  {c}
                </li>
              ))}
            </ul>
          </Card>

          {/* Recent work */}
          <Card title="Recent work">
            <div className="space-y-2">
              {[
                { title: "LinkedIn post: open-sourcing our agent runtime", when: "2h ago", status: "awaiting approval" },
                { title: "5 competitor scan: Linear, Notion, ClickUp, Airtable, Asana", when: "5h ago", status: "approved" },
                { title: "Email welcome sequence (5 parts)", when: "yesterday", status: "approved" },
              ].map((w, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border/40 bg-surface/30 p-3">
                  <div>
                    <div className="text-sm text-text-primary">{w.title}</div>
                    <div className="mt-0.5 text-xs text-text-tertiary">{w.when}</div>
                  </div>
                  <span className="rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-primary-light">
                    {w.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}

function Card({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <GlassCard className={cn("p-6", className)}>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary">{title}</h2>
      {children}
    </GlassCard>
  );
}

function StatBox({ icon: Icon, label, value, accent }: { icon: React.ElementType; label: string; value: string; accent?: boolean }) {
  return (
    <GlassCard className="p-4">
      <Icon size={14} className="text-text-tertiary" />
      <div className={`mt-2 text-xl font-bold ${accent ? "text-primary-light" : "text-text-primary"}`}>
        {value}
      </div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-text-tertiary">{label}</div>
    </GlassCard>
  );
}