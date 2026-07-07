import * as React from "react";
import { Rocket, Sparkles } from "lucide-react";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { LaunchClient, type LaunchDayView } from "@/components/dashboard/LaunchClient";
import { getCurrentUser, getGrowthRoadmap } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function LaunchPage() {
  const user = await getCurrentUser();
  const roadmap = await getGrowthRoadmap(user.id, "launch_7");

  const view: LaunchDayView[] = roadmap.items.map((i) => ({
    day: i.day,
    task: i.task,
    objective: i.objective,
    whyItMatters: i.whyItMatters,
    department: i.department,
    employee: i.employee,
    difficulty: i.difficulty,
    expectedResult: i.expectedResult,
    status: i.status,
  }));

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={0} />
        <main className="flex-1 px-5 pb-32 pt-8 md:px-10 md:pb-12 md:pt-10">
          <div className="mb-6 flex items-start justify-between gap-6">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs">
                <Rocket size={12} className="text-accent" />
                <span className="font-semibold uppercase tracking-wider text-accent">Launch Plan</span>
                <span className="ml-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-success">
                  Live
                </span>
              </div>
              <h1 className="text-page text-text">Your 7-day launch, day-by-day.</h1>
              <p className="mt-3 max-w-2xl text-body text-secondary">
                Generated from your Business DNA. Every day has a clear task, owner, and expected outcome.
                Hit publish on day 7.
              </p>
            </div>
          </div>
          <LaunchClient initialItems={view} weekStart={new Date(roadmap.createdAt).toISOString().slice(0, 10)} />
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
