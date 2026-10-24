import type { Metadata } from "next";
import { ContactChannels } from "@/components/home/contact-channels";
import { EnquiryButton } from "@/components/home/enquiry";
import { PageIntro } from "@/components/home/page-intro";
import { homeCardClass, homeCardsSection } from "@/components/home/styles";

export const metadata: Metadata = {
  title: "Contact | Zust Scan",
  description: "Email, phone, and Instagram for Zust Scan enquiries and setup.",
};

export default function ContactPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Contact"
        title="Talk to us about setup."
        description="Tap a channel below — each link opens email, the dialler, or Instagram."
        className="bg-white"
      />
      <section className={`${homeCardsSection} pb-20 sm:pb-24`}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <ContactChannels />
          <div
            className={`mt-10 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 ${homeCardClass}`}
          >
            <div>
              <p className="text-sm font-semibold text-ink">Prefer WhatsApp?</p>
              <p className="mt-1 max-w-md text-sm leading-6 text-muted">
                Use Enquire on any page — it opens a form that sends your details
                to us on WhatsApp.
              </p>
            </div>
            <EnquiryButton className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-blue px-6 text-sm font-semibold text-white transition-colors hover:bg-blue-deep">
              Send an enquiry
            </EnquiryButton>
          </div>
        </div>
      </section>
    </main>
  );
}
