import { EnquiryButton } from "@/components/home/enquiry";
import { homeCardsSection } from "@/components/home/styles";
import { listPrice, planIncludes, price } from "@/lib/site";

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
        <div className="mt-12 grid overflow-hidden rounded-[32px] bg-blue text-white shadow-[0_24px_70px_rgba(0,96,240,0.28)] lg:grid-cols-[0.86fr_1.14fr]">
          <div className="border-b border-white/15 p-8 sm:p-10 lg:border-r lg:border-b-0">
            <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide">
              Save ₹2,000
            </p>
            <p className="mt-6 text-sm font-semibold text-white/80">Zust Scan</p>
            <p className="mt-4 text-2xl font-medium text-white/45 line-through">
              {listPrice}
            </p>
            <p className="mt-1 text-5xl font-semibold tracking-tight sm:text-6xl">
              {price}
            </p>
            <p className="mt-4 max-w-sm text-base leading-7 text-white/80">
              For one business. Your details go to WhatsApp so we can set it up
              with you.
            </p>
            <EnquiryButton className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-blue transition-colors hover:bg-mist">
              Send an enquiry
            </EnquiryButton>
          </div>
          <ul className="space-y-4 p-8 sm:p-10">
            {planIncludes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base leading-7">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
