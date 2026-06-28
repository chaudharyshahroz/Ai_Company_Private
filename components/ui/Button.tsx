"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Linear-style buttons.
 *  - primary: white surface, dark text. The one main action.
 *  - secondary: ghost, muted text. Cancel, view details.
 *  - accent: indigo, sparingly for OS-level actions.
 *  - ghost: minimal text-only.
 *  - danger: red, destructive actions.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "text-[13px] font-medium tracking-tight select-none cursor-pointer",
    "transition-all duration-100 ease-out",
    "disabled:opacity-50 disabled:pointer-events-none",
    "active:scale-[0.98]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          // Inline colors to avoid tailwind-merge dedup with `text-button` font-size.
          "bg-[#FFFFFF] text-[#0A0B0C]",
          "shadow-button hover:shadow-button-hover",
          "hover:bg-white",
        ].join(" "),
        secondary: [
          "bg-transparent text-secondary",
          "hover:text-text hover:bg-hover",
        ].join(" "),
        accent: [
          "bg-accent text-white",
          "hover:bg-accent-hover",
          "shadow-button",
        ].join(" "),
        ghost: [
          "bg-transparent text-secondary",
          "hover:text-text",
        ].join(" "),
        danger: [
          "bg-transparent text-danger",
          "hover:bg-danger/10",
        ].join(" "),
      },
      size: {
        sm: "h-8 px-3 rounded-md",
        md: "h-8 px-3 rounded-md", // Linear uses 32px as default
        lg: "h-10 px-4 rounded-md",
        xl: "h-11 px-5 rounded-md",
        // Mobile is 44px tall per accessibility
        mobile: "h-11 px-4 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

// Alias for backward compat
export const GlowButton = Button;