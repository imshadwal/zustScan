import type { Metadata } from "next";
import { Audiences } from "@/components/home/audiences";
import { EventStandeeTeaser } from "@/components/home/event-standee-teaser";
import { Journey } from "@/components/home/journey";
import { Split } from "@/components/home/split";

export const metadata: Metadata = {
  title: "How it works | Zust Scan",
  description:
    "How Zust Scan works — QR to Google review in six steps, what you configure, and who it fits: restaurants, hotels, retail, salons, and services.",
};

export default function HowItWorksPage() {
  return (
    <main>
      <Journey />
      <Split compactTop />
      <Audiences />
      <EventStandeeTeaser />
    </main>
  );
}
