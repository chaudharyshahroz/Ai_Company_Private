import * as React from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getCurrentUser, getUnreadCount } from "@/lib/data";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const unreadCount = await getUnreadCount(user.id);

  return (
    <DashboardShell user={user} unreadCount={unreadCount}>
      {children}
    </DashboardShell>
  );
}