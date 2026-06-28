import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Search, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex justify-center">
          <span className="text-xl font-semibold tracking-tight">Reklu</span>
        </Link>
        <GlassCard className="p-8">
          <h1 className="font-display text-2xl font-bold tracking-tight">Forgot password</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Enter your email and we'll send you a reset link.
          </p>
          <div className="mt-6 space-y-3">
            <input
              type="email"
              placeholder="you@yourcompany.com"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-primary"
            />
            <GlowButton className="w-full" size="md">
              Send reset link
            </GlowButton>
            <Link
              href="/sign-in"
              className="flex items-center justify-center gap-1.5 text-xs text-text-secondary hover:text-text-primary"
            >
              <ArrowLeft size={12} />
              Back to sign in
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}