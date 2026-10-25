import { BusinessesSection } from "@/components/home/businesses-section";
import { Hero } from "@/components/home/hero";
import { HomeExplore } from "@/components/home/home-explore";
import { JourneyTimeline } from "@/components/home/journey-timeline";
import { LanguageVoiceShowcase } from "@/components/home/language-voice-showcase";
import { OwnerAnalyticsShowcase } from "@/components/home/owner-analytics-showcase";
import { Showcase } from "@/components/home/showcase";
import { ValuePropositionStrip } from "@/components/home/value-proposition-strip";
import { WhyDifferentSection } from "@/components/home/why-different-section";

export default function Home() {
  return (
    <main>
      <Hero />
      <Showcase />
      <WhyDifferentSection />
      <LanguageVoiceShowcase />
      <JourneyTimeline />
      <HomeExplore />
      <BusinessesSection />
      <OwnerAnalyticsShowcase className="!bg-white" />
      <ValuePropositionStrip />
    </main>
  );
}
