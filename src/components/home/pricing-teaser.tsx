import Link from "next/link";
import { EnquiryButton } from "@/components/home/enquiry";
import { homeCardClass, homeCardsSection } from "@/components/home/styles";
import { SetupStandeeCallout } from "@/components/home/setup-standee-callout";
import { LaunchOfferNote } from "@/components/home/launch-offer-note";
import { price } from "@/lib/site";

export function PricingTeaser() {
  return (
    <section id="pricing" className={homeCardsSection}>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:py-24">
        <div
          className={`overflow-hidden lg:grid lg:grid-cols-[1fr_auto] ${homeCardClass} !rounded-[32px]`}
        >
          <div className="border-b border-slate-300 p-8 sm:p-10 lg:border-r lg:border-b-0">
            <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              One plan for the business.
            </h2>
            <p className="mt-3 max-w-md text-base leading-7 text-muted">
              One QR, the full guest path, and an editable AI draft — setup starts
              from your enquiry.
            </p>
            <SetupStandeeCallout className="mt-5 max-w-md" />
            <div className="mt-8">
              <p className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{price}</p>
              <LaunchOfferNote className="mt-4" />
            </div>
          </div>
          <div className="flex flex-col justify-center gap-3 border-t border-slate-300 bg-mist p-8 sm:border-t-0 sm:border-l lg:p-10">
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-6 text-sm font-semibold text-ink shadow-sm transition-colors hover:border-blue hover:text-blue"
            >
              See what’s included
            </Link>
            <EnquiryButton className="inline-flex h-12 items-center justify-center rounded-full bg-blue px-6 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,96,240,0.3)] transition-colors hover:bg-blue-deep">
              Send an enquiry
            </EnquiryButton>
          </div>
        </div>
      </div>
    </section>
  );
}
