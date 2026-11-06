import type { Metadata } from "next";
import { Journey } from "@/components/home/journey";
import { Split } from "@/components/home/split";
import { pageMetadata } from "@/lib/page-metadata";
import { productPagePath } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "How it works",
  description:
    "Six steps from QR scan to Google review. What guests do on your branded page and what you configure in Zust Scan.",
  path: productPagePath,
});

export default function HowItWorksPage() {
  return (
    <main>
      <Journey />
      <Split compactTop />
    </main>
  );
}
