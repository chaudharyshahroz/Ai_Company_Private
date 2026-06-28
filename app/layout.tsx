import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Reklu — Hire your complete AI company.",
    template: "%s — Reklu",
  },
  description:
    "Reklu gives your business AI employees for sales, support, marketing, content, research, finance, operations, and growth — all managed by your AI CEO. Hire a 24/7 AI company.",
  keywords: [
    "AI company",
    "AI employees",
    "AI CEO",
    "AI workforce",
    "AI sales",
    "AI support",
    "AI marketing",
    "automation",
    "business AI",
  ],
  authors: [{ name: "Reklu" }],
  openGraph: {
    type: "website",
    title: "Reklu — Hire a 24/7 AI company to run and grow your business.",
    description:
      "Reklu gives your business AI employees for sales, support, marketing, content, research, finance, operations, and growth — all managed by your AI CEO.",
    siteName: "Reklu",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reklu — Hire a 24/7 AI company to run and grow your business.",
    description:
      "AI employees for sales, support, marketing, content, research, finance, operations, and growth — managed by your AI CEO.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}