import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { GlowButton } from "@/components/ui/GlowButton";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Logo size="lg" />
      <h1 className="mt-8 font-display text-7xl font-bold gradient-text">404</h1>
      <p className="mt-4 max-w-md text-balance text-lg text-text-secondary">
        The page you're looking for has either been moved, deleted, or never existed in this
        timeline.
      </p>
      <div className="mt-8 flex items-center gap-3">
        <GlowButton asChild>
          <Link href="/">
            <ArrowLeft size={16} />
            Back to home
          </Link>
        </GlowButton>
      </div>
    </div>
  );
}