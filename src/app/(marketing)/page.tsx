import { BusinessesSection } from "@/components/home/businesses-section";
import { Hero } from "@/components/home/hero";
import { HomeExplore } from "@/components/home/home-explore";
import { JourneyTimeline } from "@/components/home/journey-timeline";
import { LanguageVoiceShowcase } from "@/components/home/language-voice-showcase";
import { OwnerAnalyticsShowcase } from "@/components/home/owner-analytics-showcase";
import { PricingTeaser } from "@/components/home/pricing-teaser";
import { Showcase } from "@/components/home/showcase";

export default function Home() {
  return (
    <main>
      <Hero />
      <Showcase />
      <LanguageVoiceShowcase />
      <JourneyTimeline />
      <HomeExplore />
      <BusinessesSection />
      <OwnerAnalyticsShowcase className="!bg-white" />
      <PricingTeaser />
    </main>
  );
}
