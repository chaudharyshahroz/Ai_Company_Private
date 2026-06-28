"use client";

import * as React from "react";
import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/db/schema";

interface DashboardShellProps {
  user: User;
  unreadCount: number;
  children: React.ReactNode;
  title?: string;
}

export function DashboardShell({ user, unreadCount, children, title }: DashboardShellProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        user={user}
        unreadCount={unreadCount}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          title={title}
          user={{ name: user.name, email: user.email }}
          unreadCount={unreadCount}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />
        <main className={cn("flex-1 px-6 py-8 md:px-8")}>{children}</main>
      </div>
    </div>
  );
}