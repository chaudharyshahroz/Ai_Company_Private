import * as React from "react";
import { cn } from "@/lib/utils";

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}

const sizeMap = {
  sm: { box: 16, text: "text-sm" },
  md: { box: 18, text: "text-base" },
  lg: { box: 22, text: "text-lg" },
};

/**
 * Reklu wordmark + minimal mark.
 * No glow, no animation — Linear-style precision.
 */
export const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ className, size = "md", showWordmark = true, ...props }, ref) => {
    const cfg = sizeMap[size];
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 font-semibold tracking-tight text-text",
          className,
        )}
        {...props}
      >
        <RekluMark size={cfg.box} />
        {showWordmark && <span className={cfg.text}>Reklu</span>}
      </div>
    );
  },
);
Logo.displayName = "Logo";

export function RekluMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-text"
      aria-hidden
    >
      {/* Hexagonal mark — Linear-like geometric precision */}
      <path d="M12 2.5 L20.5 7 V17 L12 21.5 L3.5 17 V7 Z" />
      <path d="M9 9 L12 12 L15 9 M12 12 V16.5" />
    </svg>
  );
}