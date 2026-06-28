import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Plus, Target } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { getCurrentUser, getDepartmentStats } from "@/lib/data";
import { getDepartment, DEPARTMENTS } from "@/lib/departments";
import { getEmployeesByDepartment, getEmployee } from "@/lib/employees";
import { formatUsd, cn } from "@/lib/utils";

interface Params {
  params: { slug: string };
}

export async function generateStaticParams() {
  return DEPARTMENTS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Params) {
  const dept = getDepartment(params.slug);
  return { title: dept?.name ?? "Department" };
}

export default async function DepartmentPage({ params }: Params) {
  const dept = getDepartment(params.slug);
  if (!dept) notFound();
  const user = await getCurrentUser();
  const stats = (await getDepartmentStats()).find((s) => s.slug === dept.slug);
  const employees = getEmployeesByDepartment(dept.slug);
  const manager = getEmployee(dept.managerSlug);

  return (
    <div className="flex min-h-screen bg-background">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={3} />
        <main className="flex-1 px-6 py-8 md:px-8">
          <Link href="/departments" className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary">
            ← All departments
          </Link>

          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-md",
                    dept.color,
                  )}
                >
                  {dept.emoji}
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{dept.name} Department</h1>
                  <p className="mt-1 text-sm text-text-secondary">{dept.description}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <GlowButton asChild variant="secondary">
                <Link href={`/employees?department=${dept.slug}`}>
                  <Plus size={14} />
                  Hire employee
                </Link>
              </GlowButton>
              <GlowButton asChild>
                <Link href="/hq/goals/new">
                  <Target size={14} />
                  Assign dept goal
                </Link>
              </GlowButton>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              <StatBox label="Employees" value={stats.employees} />
              <StatBox label="Active tasks" value={stats.tasks} />
              <StatBox label="Performance score" value={`${stats.performance}/100`} accent />
              <StatBox label="Department manager" value={stats.manager} />
            </div>
          )}

          {/* Manager card */}
          {manager && (
            <div className="mb-8">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                Department manager
              </h2>
              <Link href={`/employees/${manager.slug}`}>
                <GlassCard hoverable className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-md",
                        manager.avatarColor,
                      )}
                    >
                      {manager.avatarEmoji}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-text-primary">{manager.name}</h3>
                      <p className="text-sm text-text-tertiary">{manager.role}</p>
                      <p className="mt-2 text-sm text-text-secondary">{manager.description}</p>
                    </div>
                    <ArrowRight size={16} className="mt-2 text-text-tertiary" />
                  </div>
                </GlassCard>
              </Link>
            </div>
          )}

          {/* Employees */}
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-tertiary">
              Employees in this department
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {employees.map((emp) => (
                <Link key={emp.slug} href={`/employees/${emp.slug}`}>
                  <GlassCard hoverable className="h-full p-5">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-xl shadow-md",
                          emp.avatarColor,
                        )}
                      >
                        {emp.avatarEmoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-text-primary">{emp.name}</h3>
                        <p className="text-xs text-text-tertiary">{emp.role}</p>
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-text-secondary">{emp.description}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-[11px]">
                      <span className="text-text-tertiary">{emp.tier}</span>
                      <span className="font-mono text-text-primary">{formatUsd(emp.monthlyPriceUsd)}/mo</span>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatBox({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-surface/60 p-4">
      <div className={`text-2xl font-bold tabular-nums ${accent ? "text-primary-light" : "text-text-primary"}`}>
        {value}
      </div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-text-tertiary">{label}</div>
    </div>
  );
}