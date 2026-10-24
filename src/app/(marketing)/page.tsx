import { BusinessesSection } from "@/components/home/businesses-section";
import { Hero } from "@/components/home/hero";
import { HomeExplore } from "@/components/home/home-explore";
import { JourneyTimeline } from "@/components/home/journey-timeline";
import { PricingTeaser } from "@/components/home/pricing-teaser";
import { Showcase } from "@/components/home/showcase";

export default function Home() {
  return (
    <main>
      <Hero />
      <Showcase />
      <JourneyTimeline />
      <HomeExplore />
      <BusinessesSection />
      <PricingTeaser />
    </main>
  );
}
