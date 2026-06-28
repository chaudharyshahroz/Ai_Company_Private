import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Footer } from "@/components/marketing/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <>
      <Section className="!pt-40 !pb-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h1 className="text-balance font-display text-4xl font-bold tracking-tight md:text-5xl">
              Terms of Service
            </h1>
            <p className="mt-2 text-sm text-text-tertiary">Last updated: June 24, 2026</p>

            <GlassCard className="mt-10 p-8">
              <div className="prose prose-invert max-w-none space-y-5 text-sm leading-relaxed text-text-primary">
                <Section_>
                  <h2 className="text-lg font-semibold text-text-primary">1. Acceptance</h2>
                  <p>
                    By accessing or using Reklu, you agree to be bound by these Terms. If you
                    disagree with any part, you may not use the service.
                  </p>
                </Section_>
                <Section_>
                  <h2 className="text-lg font-semibold text-text-primary">2. Service</h2>
                  <p>
                    Reklu provides AI agents that perform tasks on behalf of users. We do not
                    guarantee specific outcomes from agent actions. Agents operate within
                    configured limits; you are responsible for reviewing outputs before acting
                    on them.
                  </p>
                </Section_>
                <Section_>
                  <h2 className="text-lg font-semibold text-text-primary">3. Accounts</h2>
                  <p>
                    You are responsible for maintaining the security of your account and for any
                    actions taken under your credentials.
                  </p>
                </Section_>
                <Section_>
                  <h2 className="text-lg font-semibold text-text-primary">4. Billing</h2>
                  <p>
                    Paid plans are billed via Paddle. You can cancel anytime from your
                    dashboard. Refunds follow our refund policy.
                  </p>
                </Section_>
                <Section_>
                  <h2 className="text-lg font-semibold text-text-primary">5. Acceptable use</h2>
                  <p>
                    You may not use Reklu for illegal activities, to generate harmful content,
                    or to violate third-party rights. We reserve the right to suspend accounts
                    that violate these terms.
                  </p>
                </Section_>
                <Section_>
                  <h2 className="text-lg font-semibold text-text-primary">6. Liability</h2>
                  <p>
                    Reklu is provided &ldquo;as is&rdquo; without warranties. To the maximum extent
                    permitted by law, we are not liable for any indirect or consequential
                    damages arising from your use of the service.
                  </p>
                </Section_>
                <Section_>
                  <h2 className="text-lg font-semibold text-text-primary">7. Changes</h2>
                  <p>
                    We may update these terms from time to time. We&apos;ll notify you of
                    material changes via email.
                  </p>
                </Section_>
                <Section_>
                  <h2 className="text-lg font-semibold text-text-primary">8. Contact</h2>
                  <p>
                    Questions? Email{" "}
                    <a href="mailto:legal@reklu.app" className="text-primary-light hover:underline">
                      legal@reklu.app
                    </a>
                    .
                  </p>
                </Section_>
              </div>
            </GlassCard>
          </div>
        </Container>
      </Section>
      <Footer />
    </>
  );
}

function Section_({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}