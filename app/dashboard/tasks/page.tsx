import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { TasksTable } from "@/components/dashboard/TasksTable";
import { getCurrentUser, listTasks, listEnrichedHiredAgents } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const user = await getCurrentUser();
  const tasks = await listTasks(user.id);
  const agents = await listEnrichedHiredAgents(user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {tasks.length} tasks total — every job your AI company has run.
          </p>
        </div>
        <GlowButton asChild>
          <Link href="/dashboard/tasks/new">
            <Plus size={14} />
            New task
          </Link>
        </GlowButton>
      </div>

      <TasksTable tasks={tasks} agents={agents} />
    </div>
  );
}