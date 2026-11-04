import type { Metadata } from "next";
import { BrochurePrintBar } from "@/components/home/brochure-print-bar";
import { ProductBrochure } from "@/components/home/product-brochure";
import { siteOrigin } from "@/lib/login-id";

export const metadata: Metadata = {
  title: "Product brochure",
  description:
    "Customer brochure: everyday QR standee and event standee, guest review flow, founder card, and live totals.",
};

export default function BrochurePage() {
  return (
    <div className="min-h-dvh bg-mist-deep print:bg-white">
      <style>{`
        @media print {
          .brochure-section {
            margin-top: 1rem !important;
            break-inside: auto !important;
            page-break-inside: auto !important;
          }
          .brochure-keep {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>
      <BrochurePrintBar />
      <ProductBrochure siteUrl={siteOrigin()} />
    </div>
  );
}
