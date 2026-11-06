import type { Metadata } from "next";
import Link from "next/link";
import { quietButtonClass } from "@/components/admin/styles";
import { ContactChannels } from "@/components/home/contact-channels";
import { EnquiryButton } from "@/components/home/enquiry";
import { PageIntro } from "@/components/home/page-intro";
import { homeCardClass, homeCardsSection } from "@/components/home/styles";
import { SetupStandeeCallout } from "@/components/home/setup-standee-callout";
import { pageMetadata } from "@/lib/page-metadata";
import { productBrochurePath } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Email, phone, Instagram, and Facebook for Zust Scan enquiries and setup.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Contact"
        title="Talk to us about setup."
        description="Tap a channel below — each link opens email, the dialler, or Instagram."
        className="bg-mist-deep"
      />
      <section className={`${homeCardsSection} pt-8 pb-8 sm:pt-10 sm:pb-10`}>
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <ContactChannels />
          <SetupStandeeCallout className="mt-6" />
          <div
            className={`mt-6 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-start sm:gap-8 sm:p-8 ${homeCardClass}`}
          >
            <div>
              <p className="caption-1 text-ink">Prefer WhatsApp?</p>
              <p className="body-3 mt-1 max-w-md text-muted">
                Use Enquire on any page — it opens a form that sends your details
                to us on WhatsApp.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <EnquiryButton className="btn-primary shrink-0">
                Send an enquiry
              </EnquiryButton>
              <Link href={productBrochurePath} className={quietButtonClass}>
                Product PDF
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
