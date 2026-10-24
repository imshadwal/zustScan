import type { Metadata } from "next";
import { Journey } from "@/components/home/journey";
import { PageIntro } from "@/components/home/page-intro";
import { Split } from "@/components/home/split";

export const metadata: Metadata = {
  title: "How it works | Zust Scan",
  description:
    "Six steps from QR scan to Google review: choose service and product, set how it felt, edit the draft, and post yourself.",
};

export default function HowItWorksPage() {
  return (
    <main>
      <PageIntro
        eyebrow="How it works"
        title="Six steps, from the QR to the post."
        description="The same path works at a restaurant table, a hotel desk, a shop counter, or after a service visit."
        className="border-b border-slate-200 bg-white"
      />
      <Journey showHeading={false} />
      <Split compactTop />
    </main>
  );
}
