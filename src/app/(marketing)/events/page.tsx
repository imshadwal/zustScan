import type { Metadata } from "next";
import { JsonLd } from "@/components/home/json-ld";
import { ForEventsPage } from "@/components/home/for-events-page";
import { pageMetadata } from "@/lib/page-metadata";
import { eventOfferSchema } from "@/lib/site-schema";
import { eventsPagePath, forEventsLabel } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: forEventsLabel,
  description:
    "Customised QR standees for weddings, corporate meetings, banquets, and birthdays. Guest reviews describe the event they attended.",
  path: eventsPagePath,
});

export default function EventsPage() {
  return (
    <main>
      <JsonLd data={eventOfferSchema()} />
      <ForEventsPage />
    </main>
  );
}
