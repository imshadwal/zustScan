import type { Metadata } from "next";
import { FaqSection } from "@/components/home/faq-section";
import { JsonLd } from "@/components/home/json-ld";
import { OwnerAnalyticsShowcase } from "@/components/home/owner-analytics-showcase";
import { Pricing } from "@/components/home/pricing";
import { RoiSection } from "@/components/home/roi-section";
import { pageMetadata } from "@/lib/page-metadata";
import { everydayOfferSchema, faqSchema } from "@/lib/site-schema";

export const metadata: Metadata = pageMetadata({
  title: "Pricing",
  description:
    "One plan: full setup, QR standee delivered to your address, guest path, and AI draft.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <main>
      <JsonLd data={everydayOfferSchema()} />
      <JsonLd data={faqSchema()} />
      <Pricing />
      <OwnerAnalyticsShowcase />
      <RoiSection />
      <FaqSection className="!bg-mist-deep" />
    </main>
  );
}
