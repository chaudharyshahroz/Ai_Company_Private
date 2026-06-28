import type { Config } from "tailwindcss";

/**
 * Reklu design system — Linear-inspired.
 * Dark mode first, monochrome with a single indigo accent used sparingly.
 */

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        // Surfaces
        bg: "#08090A",
        surface: "#0F1011",
        "surface-2": "#141516",
        muted: "#23252A",
        // Backward-compat aliases
        background: "#08090A",
        // Borders
        border: "rgba(255,255,255,0.05)",
        "border-strong": "rgba(255,255,255,0.08)",
        // Text
        text: {
          DEFAULT: "#F7F8F8",
          primary: "#F7F8F8",
          secondary: "#8A8F98",
          tertiary: "#62666D",
        },
        secondary: "#8A8F98",
        "muted-text": "#62666D",
        white: "#FFFFFF",
        // Backward-compat: old "primary" maps to new accent (indigo)
        primary: {
          DEFAULT: "#5E6AD2",
          light: "#828FFF",
        },
        // Accent (use SPARINGLY)
        accent: {
          DEFAULT: "#5E6AD2",
          hover: "#828FFF",
        },
        // Backward-compat: old "accent" (green) → new "success"
        "accent-warm": "#EF6461",
        // Semantic
        success: "#63D471",
        warning: "#F5C451",
        danger: "#EF6461",
        info: "#5E6AD2",
        // Buttons (Linear-style: light surface, dark text)
        button: "#FFFFFF",
        "button-text": "#0A0B0C",
        // Hover surfaces
        hover: "rgba(255,255,255,0.03)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "Berkeley Mono",
          "SF Mono",
          "Monaco",
          "Cascadia Code",
          "ui-monospace",
          "monospace",
        ],
      },
      fontSize: {
        // Typography scale (per spec)
        "hero": ["64px", { lineHeight: "64px", fontWeight: "510", letterSpacing: "-0.02em" }],
        "section": ["48px", { lineHeight: "48px", fontWeight: "510", letterSpacing: "-0.02em" }],
        "page": ["32px", { lineHeight: "40px", fontWeight: "510", letterSpacing: "-0.01em" }],
        "card": ["20px", { lineHeight: "28px", fontWeight: "590" }],
        "small-heading": ["16px", { lineHeight: "24px", fontWeight: "590" }],
        "body": ["15px", { lineHeight: "24px", fontWeight: "400" }],
        "small": ["13px", { lineHeight: "20px", fontWeight: "400" }],
        "button": ["13px", { lineHeight: "20px", fontWeight: "510" }],
        "code": ["12.25px", { lineHeight: "18px", fontWeight: "400" }],
        "code-lg": ["14px", { lineHeight: "20px", fontWeight: "400" }],
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "8px",
        pill: "9999px",
      },
      // 4px spacing system — explicit allowed values
      spacing: {
        "0": "0px",
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "7": "28px",
        "8": "32px",
        "9": "36px",
        "10": "40px",
        "12": "48px",
        "13": "52px",
        "16": "64px",
        "20": "80px",
        "24": "96px",
        "32": "128px",
      },
      boxShadow: {
        // Very subtle shadows — Linear-style precision
        panel: "0 0 0 1px rgba(255,255,255,0.04), 0 1px 2px rgba(0,0,0,0.4)",
        "panel-hover": "0 0 0 1px rgba(255,255,255,0.06), 0 2px 4px rgba(0,0,0,0.4)",
        button: "0 1px 0 rgba(255,255,255,0.05), inset 0 0 0 1px rgba(0,0,0,0.2)",
        "button-hover": "0 1px 2px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(0,0,0,0.2)",
        focus: "0 0 0 2px rgba(94,106,210,0.4)",
        // Subtle accent glow (used SPARINGLY)
        "accent-glow": "0 0 0 1px rgba(94,106,210,0.4), 0 0 12px rgba(94,106,210,0.15)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(8px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-status": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out forwards",
        "fade-in-up": "fade-in-up 0.3s ease-out forwards",
        "slide-in-right": "slide-in-right 0.2s ease-out forwards",
        "pulse-status": "pulse-status 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;