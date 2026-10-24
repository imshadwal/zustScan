import type { Metadata } from "next";
import { FaqSection } from "@/components/home/faq-section";
import { Pricing } from "@/components/home/pricing";
import { RoiSection } from "@/components/home/roi-section";

export const metadata: Metadata = {
  title: "Pricing | Zust Scan",
  description:
    "One plan: full setup, QR standee delivered to your address, guest path, and AI draft.",
};

export default function PricingPage() {
  return (
    <main className="pt-24">
      <Pricing />
      <RoiSection />
      <FaqSection className="!bg-mist-deep" />
    </main>
  );
}
