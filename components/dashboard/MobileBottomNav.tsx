"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Inbox, ListChecks, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/hq", label: "Home", icon: Home, exact: true },
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/hq/work-inbox", label: "Work", icon: Inbox },
  { href: "/hq/tasks", label: "Tasks", icon: ListChecks },
  { href: "/settings", label: "More", icon: MoreHorizontal },
];

/**
 * Bottom nav shown only on small screens. Replaces the sidebar on mobile.
 */
export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-lg lg:hidden">
      <ul className="grid grid-cols-5 px-1 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = t.exact
            ? pathname === t.href
            : pathname === t.href || pathname.startsWith(t.href + "/");
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-md py-1.5 text-[10.5px] font-medium transition-colors",
                  active ? "text-text" : "text-muted-text hover:text-text",
                )}
              >
                <Icon size={18} strokeWidth={active ? 2 : 1.7} />
                <span>{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}