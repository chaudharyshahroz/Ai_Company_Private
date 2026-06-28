import * as React from "react";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { BillingClient } from "@/components/dashboard/BillingClient";
import { getCurrentUser } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={0} />

        <main className="flex-1 px-5 pb-32 pt-8 md:px-10 md:pb-12 md:pt-10">
          <div className="mb-8 max-w-3xl">
            <h1 className="page-title">Billing</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-secondary">
              Pick the plan that matches your team. Cancel any time.
            </p>
          </div>

          <BillingClient currentPlan={user.plan ?? "growth"} />
        </main>

        <MobileBottomNav />
      </div>
    </div>
  );
}