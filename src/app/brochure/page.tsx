import type { Metadata } from "next";
import { BrochurePrintBar } from "@/components/home/brochure-print-bar";
import { ProductBrochure } from "@/components/home/product-brochure";
import { JsonLd } from "@/components/home/json-ld";
import { siteOrigin } from "@/lib/login-id";
import { pageMetadata } from "@/lib/page-metadata";
import { organizationSchema } from "@/lib/site-schema";
import { productBrochurePath } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Product brochure",
  description:
    "Everyday QR standee and event standee, guest review flow, founder card, and live totals.",
  path: productBrochurePath,
});

export default function BrochurePage() {
  return (
    <div className="min-h-dvh bg-mist-deep print:bg-white">
      <JsonLd data={organizationSchema()} />
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
