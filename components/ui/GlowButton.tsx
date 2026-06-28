"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glowButtonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-medium tracking-tight",
    "transition-all duration-200 ease-out",
    "select-none cursor-pointer",
    "disabled:opacity-50 disabled:pointer-events-none",
    "active:scale-[0.97]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  ].join(" "),
  {
    variants: {
      variant: {
        // Filled purple with glow — primary CTA
        primary: [
          "bg-primary text-white",
          "shadow-glow-sm hover:shadow-glow",
          "hover:bg-primary-light",
          "before:absolute before:inset-0 before:rounded-[inherit] before:bg-primary before:opacity-0",
          "hover:before:opacity-100 before:transition-opacity",
          "before:-z-10",
        ].join(" "),
        // Ghost outline — secondary CTA
        secondary: [
          "border border-border bg-surface/50 text-text-primary backdrop-blur",
          "hover:border-primary/50 hover:bg-surface-2",
          "hover:shadow-glow-sm",
        ].join(" "),
        // Subtle link-style
        ghost: [
          "text-text-secondary hover:text-text-primary",
        ].join(" "),
        // Inverted dark on light
        light: [
          "bg-white text-background",
          "hover:bg-white/90",
          "shadow-lg hover:shadow-xl",
        ].join(" "),
      },
      size: {
        sm: "h-9 px-4 text-sm rounded-lg",
        md: "h-11 px-6 text-sm rounded-xl",
        lg: "h-14 px-8 text-base rounded-xl",
        xl: "h-16 px-10 text-lg rounded-2xl",
      },
      glow: {
        none: "",
        pulse: "animate-pulse-glow",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      glow: "none",
    },
  },
);

export interface GlowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glowButtonVariants> {
  asChild?: boolean;
}

export const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, variant, size, glow, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(glowButtonVariants({ variant, size, glow }), className)}
        {...props}
      />
    );
  },
);
GlowButton.displayName = "GlowButton";