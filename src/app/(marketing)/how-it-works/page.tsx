import type { Metadata } from "next";
import { Journey } from "@/components/home/journey";
import { Split } from "@/components/home/split";

export const metadata: Metadata = {
  title: "How it works | Zust Scan",
  description:
    "Six steps from QR scan to Google review — what guests do on your branded page and what you configure in Zust Scan.",
};

export default function HowItWorksPage() {
  return (
    <main>
      <Journey />
      <Split compactTop />
    </main>
  );
}
