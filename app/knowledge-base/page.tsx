import * as React from "react";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { KnowledgeBaseClient } from "@/components/dashboard/KnowledgeBaseClient";
import { getCurrentUser } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function KnowledgeBasePage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={0} />
        <main className="flex-1 px-5 pb-32 pt-8 md:px-10 md:pb-12 md:pt-10">
          <KnowledgeBaseClient />
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}