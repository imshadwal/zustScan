import type { Metadata } from "next";
import { Journey } from "@/components/home/journey";
import { Split } from "@/components/home/split";

export const metadata: Metadata = {
  title: "How it works | Zust Scan",
  description:
    "Six steps from QR scan to Google review: choose service and product, set how it felt, edit the draft, and post yourself.",
};

export default function HowItWorksPage() {
  return (
    <main>
      <Journey />
      <Split compactTop />
    </main>
  );
}
