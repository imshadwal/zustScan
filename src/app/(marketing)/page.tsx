import { BusinessesSection } from "@/components/home/businesses-section";
import { Hero } from "@/components/home/hero";
import { HomeLearnRow } from "@/components/home/home-learn-row";
import { HomePricingRow } from "@/components/home/home-pricing-row";
import { Showcase } from "@/components/home/showcase";
import { TrustedPartnersSection } from "@/components/home/trusted-partners-section";
import { pageMetadata } from "@/lib/page-metadata";
import { siteDescription, siteTitle } from "@/lib/site";

export const metadata = pageMetadata({
  title: siteTitle,
  description: siteDescription,
  path: "/",
  absolute: true,
});

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
