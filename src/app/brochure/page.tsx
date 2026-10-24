import type { Metadata } from "next";
import { BrochurePrintBar } from "@/components/home/brochure-print-bar";
import { ProductBrochure } from "@/components/home/product-brochure";
import { siteOrigin } from "@/lib/login-id";

export const metadata: Metadata = {
  title: "Product brochure",
  description:
    "Product PDF: QR guest reviews, Hindi/Hinglish drafts, launch pricing, FAQ, referral, and multi-outlet add-ons.",
};

export default function BrochurePage() {
  return (
    <div className="min-h-dvh bg-mist-deep print:bg-white">
      <BrochurePrintBar />
      <ProductBrochure siteUrl={siteOrigin()} />
    </div>
  );
}
