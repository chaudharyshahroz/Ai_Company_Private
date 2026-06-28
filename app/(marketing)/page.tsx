import { HeroSection } from "@/components/marketing/HeroSection";
import { SocialProofBar } from "@/components/marketing/SocialProofBar";
import { ProductShowcaseSection } from "@/components/marketing/ProductShowcaseSection";
import { LiveDemoSection } from "@/components/marketing/LiveDemoSection";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { PricingSection } from "@/components/marketing/PricingSection";
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection";
import { FAQSection } from "@/components/marketing/FAQSection";
import { FinalCTASection } from "@/components/marketing/FinalCTASection";
import { Footer } from "@/components/marketing/Footer";

// Disable prerender to avoid SSR issues with SVG SMIL animations
export const dynamic = "force-dynamic";

export default function MarketingHomePage() {
  return (
    <>
      <HeroSection />
      <SocialProofBar />
      <ProductShowcaseSection />
      <LiveDemoSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </>
  );
}