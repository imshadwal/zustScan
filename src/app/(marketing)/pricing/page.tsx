import type { Metadata } from "next";
import { Pricing } from "@/components/home/pricing";

export const metadata: Metadata = {
  title: "Pricing | Zust Scan",
  description:
    "One plan for the business: QR, guest path, AI draft, and setup from your enquiry.",
};

export default function PricingPage() {
  return (
    <main className="pt-24">
      <Pricing />
    </main>
  );
}
