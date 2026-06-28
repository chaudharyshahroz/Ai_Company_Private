"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ListChecks,
  Brain,
  BarChart3,
  Bell,
  Plug,
  CreditCard,
  Settings as SettingsIcon,
  Sparkles,
  Crown,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { GlowButton } from "@/components/ui/GlowButton";
import { PlanBadge } from "@/components/dashboard/PlanBadge";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/db/schema";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/team", label: "My Team", icon: Users },
  { href: "/dashboard/tasks", label: "Tasks", icon: ListChecks },
  { href: "/dashboard/brain", label: "Business Brain", icon: Brain },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/integrations", label: "Integrations", icon: Plug },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

interface SidebarProps {
  user: User;
  unreadCount: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  user,
  unreadCount,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-surface/60 backdrop-blur-xl transition-all duration-300",
          "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          collapsed ? "lg:w-20" : "lg:w-64",
          "w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 px-5">
          <Link href="/dashboard" className="flex items-center">
            {collapsed ? <Logo size="sm" showWordmark={false} /> : <Logo size="md" />}
          </Link>
          <button
            onClick={onToggleCollapse}
            className="hidden h-8 w-8 items-center justify-center rounded-md text-text-secondary hover:bg-surface-2 hover:text-text-primary lg:flex"
            aria-label="Toggle sidebar"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>

        {/* Business + plan */}
        <div className={cn("border-b border-border/60 px-5 py-4", collapsed && "lg:px-3")}>
          {!collapsed ? (
            <>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-text-tertiary">
                <Sparkles size={11} className="text-primary-light" />
                <span>Business</span>
              </div>
              <div className="mt-1 truncate text-sm font-medium text-text-primary">
                {user.businessName ?? "Your company"}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <PlanBadge plan={user.plan} />
                <span className="text-[10px] text-text-tertiary capitalize">{user.planStatus}</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-base">
                🏢
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onCloseMobile}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-primary/15 text-text-primary"
                        : "text-text-secondary hover:bg-surface-2/60 hover:text-text-primary",
                      collapsed && "lg:justify-center lg:px-0",
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
                    )}
                    <Icon size={16} className={active ? "text-primary-light" : ""} />
                    {!collapsed && (
                      <>
                        <span>{item.label}</span>
                        {item.href === "/dashboard/notifications" && unreadCount > 0 && (
                          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-warm px-1.5 text-[10px] font-bold text-white">
                            {unreadCount}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User + Upgrade */}
        <div className="shrink-0 border-t border-border/60 p-4">
          {!collapsed ? (
            <>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-warm text-sm font-semibold text-white">
                  {user.name?.[0] ?? user.email[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-text-primary">
                    {user.name ?? "You"}
                  </div>
                  <div className="truncate text-xs text-text-tertiary">{user.email}</div>
                </div>
              </div>
              {user.plan === "free" && (
                <GlowButton asChild size="sm" className="w-full">
                  <Link href="/dashboard/billing">
                    <Crown size={14} />
                    Upgrade
                  </Link>
                </GlowButton>
              )}
            </>
          ) : (
            <div className="flex justify-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-warm text-sm font-semibold text-white">
                {user.name?.[0] ?? user.email[0]}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}