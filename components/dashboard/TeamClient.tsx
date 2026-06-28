"use client";

import * as React from "react";
import { Plus, Mail, Users, X, CheckCircle2, Crown } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  joinedAt: string;
  lastActive: string;
}

export function TeamClient({ initialMembers }: { initialMembers: Member[] }) {
  const toast = useToast();
  const [members, setMembers] = React.useState(initialMembers);
  const [showInvite, setShowInvite] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<"admin" | "member">("member");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const newMember: Member = {
      id: `m-${Date.now()}`,
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email: email.trim(),
      role,
      joinedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };
    setMembers((prev) => [...prev, newMember]);
    setEmail("");
    setShowInvite(false);
    toast.push({
      tone: "success",
      title: "Invite sent",
      description: `${newMember.email} will get an email with a join link.`,
    });
  };

  const handleRemove = (id: string) => {
    const m = members.find((mm) => mm.id === id);
    setMembers((prev) => prev.filter((mm) => mm.id !== id));
    if (m) {
      toast.push({
        tone: "warning",
        title: "Removed from team",
        description: `${m.email} no longer has access.`,
      });
    }
  };

  return (
    <>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="page-title">Team</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-secondary">
            Human teammates. AI employees live in <a href="/employees" className="text-accent hover:underline">AI Employees</a>.
          </p>
        </div>
        <Button onClick={() => setShowInvite(true)} size="lg">
          <Plus size={13} />
          Invite teammate
        </Button>
      </div>

      {showInvite && (
        <Panel className="mb-6 border-accent/30 p-6">
          <form onSubmit={handleInvite}>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[14.5px] font-semibold text-text">Invite a teammate</p>
              <button
                type="button"
                onClick={() => setShowInvite(false)}
                className="rounded-md p-1 text-muted-text hover:bg-hover hover:text-text"
              >
                <X size={14} />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[12.5px] font-medium text-muted-text">
                  Email address
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teammate@yourcompany.com"
                  className="reklu-input"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12.5px] font-medium text-muted-text">
                  Role
                </span>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "admin" | "member")}
                  className="reklu-input"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" type="button" onClick={() => setShowInvite(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Mail size={12} />
                Send invite
              </Button>
            </div>
          </form>
        </Panel>
      )}

      {members.length === 0 ? (
        <Panel className="px-6 py-16 text-center">
          <Users size={28} className="mx-auto mb-3 text-muted-text" />
          <h3 className="text-[16px] font-semibold text-text">No teammates yet</h3>
          <p className="mt-1 text-[14px] text-secondary">
            Invite the first person to share access with.
          </p>
          <Button onClick={() => setShowInvite(true)} className="mt-5">
            <Plus size={13} />
            Invite teammate
          </Button>
        </Panel>
      ) : (
        <Panel className="overflow-hidden p-0">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-border bg-surface-2">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-text">
                  Name
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-text">
                  Email
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-text">
                  Role
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-text">
                  Joined
                </th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-hover">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[12px] font-semibold text-text">
                        {m.name[0]}
                      </div>
                      <span className="font-medium text-text">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-secondary">{m.email}</td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium",
                        m.role === "admin"
                          ? "border-accent/40 bg-accent/10 text-accent-hover"
                          : "border-border bg-muted text-secondary",
                      )}
                    >
                      {m.role === "admin" && <Crown size={10} />}
                      {m.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-text">
                    {new Date(m.joinedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      onClick={() => handleRemove(m.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-muted-text transition-colors hover:bg-danger/10 hover:text-danger"
                      title="Remove from team"
                    >
                      <X size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </>
  );
}