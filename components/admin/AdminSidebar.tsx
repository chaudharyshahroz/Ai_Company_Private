"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Bot,
  ListChecks,
  DollarSign,
  Mail,
  Settings as SettingsIcon,
  FileText,
  Megaphone,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/agents", label: "Agents", icon: Bot },
  { href: "/admin/tasks", label: "Tasks", icon: ListChecks },
  { href: "/admin/revenue", label: "Revenue", icon: DollarSign },
  { href: "/admin/emails", label: "Emails", icon: Mail },
  { href: "/admin/platform", label: "Platform", icon: SettingsIcon },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
];

interface AdminSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AdminSidebar({ mobileOpen, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface/70 backdrop-blur-xl transition-transform",
          "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link href="/admin" className="flex items-center gap-2">
            <Logo size="md" />
            <span className="ml-1 inline-flex items-center gap-1 rounded-md bg-accent-warm/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-warm">
              <ShieldCheck size={10} />
              Admin
            </span>
          </Link>
        </div>

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
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
                    )}
                    <Icon size={16} className={active ? "text-primary-light" : ""} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border p-4 text-xs text-text-tertiary">
          <Link href="/dashboard" className="hover:text-text-secondary">
            ← Back to user dashboard
          </Link>
        </div>
      </aside>
    </>
  );
}