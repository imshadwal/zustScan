import { BusinessesSection } from "@/components/home/businesses-section";
import { Hero } from "@/components/home/hero";
import { TrustedPartnersSection } from "@/components/home/trusted-partners-section";
import { HomeLearnRow } from "@/components/home/home-learn-row";
import { HomePricingRow } from "@/components/home/home-pricing-row";
import { Showcase } from "@/components/home/showcase";

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustedPartnersSection />
      <Showcase />
      <HomePricingRow />
      <HomeLearnRow />
      <BusinessesSection />
    </main>
  );
}
