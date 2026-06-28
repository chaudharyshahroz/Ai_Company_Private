"use client";

import * as React from "react";
import { Bell, Search, Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  title?: string;
  user: { name?: string | null; email: string };
  unreadCount: number;
  onOpenMobileMenu: () => void;
}

export function DashboardHeader({
  title,
  user,
  unreadCount,
  onOpenMobileMenu,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/70 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={16} />
        </button>
        {title && (
          <h1 className="text-base font-semibold text-text-primary md:text-lg">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text-tertiary md:flex">
          <Search size={14} />
          <span>Search...</span>
          <kbd className="ml-2 rounded border border-border bg-surface-2 px-1.5 font-mono text-[10px]">
            ⌘K
          </kbd>
        </div>

        <Link
          href="/dashboard/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary transition-colors hover:text-text-primary"
        >
          <Bell size={15} />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-warm px-1 text-[9px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Link>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-warm text-sm font-semibold text-white">
          {user.name?.[0] ?? user.email[0]}
        </div>
      </div>
    </header>
  );
}