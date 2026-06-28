import * as React from "react";
import Link from "next/link";
import {
  User,
  Bell,
  CreditCard,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { HqSidebar } from "@/components/dashboard/HqSidebar";
import { HqHeader } from "@/components/dashboard/HqHeader";
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav";
import { SettingsClient } from "@/components/dashboard/SettingsClient";
import { getCurrentUser } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen bg-bg">
      <HqSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <HqHeader user={user} unreadCount={0} />

        <main className="flex-1 px-5 pb-32 pt-8 md:px-10 md:pb-12 md:pt-10">
          <div className="mb-8 max-w-3xl">
            <h1 className="page-title">Settings</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-secondary">
              Manage your account, team, and how Reklu looks.
            </p>
          </div>

          <SettingsClient user={user} />

          <section className="mt-10">
            <h2 className="section-title mb-4">More settings</h2>
            <div className="panel p-0">
              <ul className="divide-y divide-border">
                <SettingRow href="/settings#profile" icon={<User size={16} />} label="Profile" description="Your name, photo, contact details" />
                <SettingRow href="/team" icon={<Users size={16} />} label="Team" description="Invite teammates and assign roles" />
                <SettingRow href="/notifications" icon={<Bell size={16} />} label="Notifications" description="When and how Reklu alerts you" />
                <SettingRow href="/billing" icon={<CreditCard size={16} />} label="Billing" description="Plan, payment method, invoices" />
              </ul>
            </div>
          </section>
        </main>

        <MobileBottomNav />
      </div>
    </div>
  );
}

function SettingRow({
  href,
  icon,
  label,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-hover md:px-6"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-2 text-secondary">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[14.5px] font-medium text-text">{label}</p>
          <p className="mt-0.5 text-[13px] text-secondary">{description}</p>
        </div>
        <ArrowRight
          size={14}
          className="text-muted-text opacity-0 transition-opacity group-hover:opacity-100"
        />
      </Link>
    </li>
  );
}