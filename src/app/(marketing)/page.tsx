import { BusinessesSection } from "@/components/home/businesses-section";
import { Hero } from "@/components/home/hero";
import { HomeLearnRow } from "@/components/home/home-learn-row";
import { HomePricingRow } from "@/components/home/home-pricing-row";
import { Showcase } from "@/components/home/showcase";

export default function Home() {
  return (
    <main>
      <Hero />
      <Showcase />
      <HomePricingRow />
      <HomeLearnRow />
      <BusinessesSection />
    </main>
  );
}
