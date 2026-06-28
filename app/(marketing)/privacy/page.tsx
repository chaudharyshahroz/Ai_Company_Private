import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Footer } from "@/components/marketing/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <>
      <Section className="!pt-40 !pb-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h1 className="text-balance font-display text-4xl font-bold tracking-tight md:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-text-tertiary">Last updated: June 24, 2026</p>

            <GlassCard className="mt-10 p-8">
              <div className="prose prose-invert max-w-none space-y-5 text-sm leading-relaxed text-text-primary">
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">What we collect</h2>
                  <p>
                    We collect the information you provide when signing up (name, email,
                    business profile), the data you add to your Business Brain (products,
                    competitors, voice samples), and usage data (which agents run, what tasks
                    they perform, what outputs they produce).
                  </p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">How we use it</h2>
                  <p>
                    To provide and improve Reklu. We do not train AI models on your business
                    data. We do not sell your data to third parties.
                  </p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">Where it&apos;s stored</h2>
                  <p>
                    Data is stored on Neon PostgreSQL (US region). File uploads go to Cloudflare
                    R2. Backups are encrypted and retained for 30 days.
                  </p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">Third-party services</h2>
                  <p>
                    We use Clerk for authentication, OpenRouter for AI model routing, Paddle
                    for payments, Resend for email, and Cloudflare R2 for file storage. Each
                    receives only the data needed to perform its function.
                  </p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">Your rights</h2>
                  <p>
                    You can export all your data, modify your Business Brain, or delete your
                    account at any time from your settings.
                  </p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">Cookies</h2>
                  <p>
                    We use first-party cookies for authentication and analytics. No
                    third-party tracking.
                  </p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">Contact</h2>
                  <p>
                    Privacy questions? Email{" "}
                    <a href="mailto:privacy@reklu.app" className="text-primary-light hover:underline">
                      privacy@reklu.app
                    </a>
                    .
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </Container>
      </Section>
      <Footer />
    </>
  );
}