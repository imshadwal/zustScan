import type { Metadata } from "next";
import { ForEventsPage } from "@/components/home/for-events-page";
import { forEventsLabel } from "@/lib/site";

export const metadata: Metadata = {
  title: `${forEventsLabel} | Zust Scan`,
  description:
    "Customised QR standees for weddings, banquets, and function nights — guest reviews tailored to the event your guests attended.",
};

export default function EventsPage() {
  return (
    <main>
      <ForEventsPage />
    </main>
  );
}
