import type { Metadata } from "next";
import { Pricing } from "@/components/home/pricing";

export const metadata: Metadata = {
  title: "Pricing | Zust Scan",
  description:
    "One plan: full setup, QR standee delivered to your address, guest path, and AI draft.",
};

export default function PricingPage() {
  return (
    <main className="pt-24">
      <Pricing />
    </main>
  );
}
