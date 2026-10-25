import Link from "next/link";
import { quietButtonClass } from "@/components/admin/styles";
import { EnquiryButton } from "@/components/home/enquiry";
import { homeCardClass, homeCardsSection } from "@/components/home/styles";
import { SetupStandeeCallout } from "@/components/home/setup-standee-callout";
import { LaunchOfferNote } from "@/components/home/launch-offer-note";
import { PricingAddons } from "@/components/home/pricing-addons";
import { planIncludes, price, productBrochurePath } from "@/lib/site";

export function Pricing() {
  return (
    <section id="pricing" className={homeCardsSection}>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:py-24">
        <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
          Pricing
        </p>
        <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
          One plan for the business.
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-8 text-muted">
          The QR, the guest path, and the draft. Setup starts from the enquiry.
        </p>
        <SetupStandeeCallout className="mt-6 max-w-xl" />
        <div
          className={`mt-12 grid overflow-hidden lg:grid-cols-[0.86fr_1.14fr] ${homeCardClass} !rounded-[32px] !p-0`}
        >
          <div className="border-b border-slate-200 bg-navy p-8 text-white sm:p-10 lg:border-r lg:border-b-0 lg:border-slate-700/80">
            <LaunchOfferNote variant="onBlue" />
            <p className="mt-6 text-sm font-semibold text-white/80">Zust Scan</p>
            <p className="mt-2 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              {price}
            </p>
            <p className="mt-4 max-w-sm text-base leading-7 text-white/75">
              For one business. Your details go to WhatsApp so we can set it up
              with you.
            </p>
            <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <EnquiryButton className="inline-flex h-12 items-center justify-center rounded-full bg-blue px-6 text-sm font-semibold text-white transition-colors hover:bg-blue-deep">
                Send an enquiry
              </EnquiryButton>
              <Link
                href={productBrochurePath}
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-white/5 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/15"
              >
                Product PDF
              </Link>
            </div>
          </div>
          <ul className="space-y-4 bg-mist/70 p-8 text-ink sm:p-10">
            {planIncludes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base leading-7">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue text-xs text-white">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <PricingAddons />
      </div>
    </section>
  );
}
