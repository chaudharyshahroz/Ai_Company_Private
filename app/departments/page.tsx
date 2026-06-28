import * as React from "react";
import Link from "next/link";
import { ArrowRight, Plus, Target } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { getCurrentUser, getDepartmentStats } from "@/lib/data";
import { DEPARTMENTS } from "@/lib/departments";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DepartmentsPage() {
  const user = await getCurrentUser();
  const stats = await getDepartmentStats();
  const statsBySlug = Object.fromEntries(stats.map((s) => [s.slug, s]));

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={3} />
        <main className="flex-1 px-8 py-8">
          <div className="mb-8">
            <h1 className="text-page text-text">Departments</h1>
            <p className="mt-1 text-body text-secondary">
              10 departments. {DEPARTMENTS.reduce((s, d) => s + d.employeeSlugs.length, 0)} AI employees. Each one a real hire.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {DEPARTMENTS.map((dept) => {
              const s = statsBySlug[dept.slug];
              return (
                <Link key={dept.slug} href={`/departments/${dept.slug}`}>
                  <Panel hoverable className="group h-full">
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface-2 text-xl">
                        {dept.emoji}
                      </div>
                      {s && (
                        <span className="rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-secondary">
                          {s.performance}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-4 text-card text-text">{dept.name}</h2>
                    <p className="mt-1 text-small text-secondary">{dept.shortDescription}</p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {dept.tasks.slice(0, 4).map((t) => (
                        <span key={t} className="rounded-md border border-border bg-surface px-1.5 py-0.5 text-[10px] text-secondary">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-text">
                      <span>{dept.employeeSlugs.length} employees</span>
                      <ArrowRight size={12} className="text-muted-text transition-transform group-hover:translate-x-0.5 group-hover:text-text" />
                    </div>
                  </Panel>
                </Link>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}