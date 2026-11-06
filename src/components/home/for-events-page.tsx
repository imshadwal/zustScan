import Link from "next/link";
import { EnquiryButton } from "@/components/home/enquiry";
import { homeCardClass, homeCardsSection } from "@/components/home/styles";
import { StandeeShowcase } from "@/components/home/standee-showcase";
import {
  eventStandeeEnquiryLead,
  eventStandeeHeroHighlights,
  eventStandeeIncludes,
  eventStandeePrice,
  otherProducts,
  otherProductsPage,
  productPagePath,
  eventStandeeWhatsappUrl,
} from "@/lib/site";

const product = otherProducts[0]!;

function CheckIcon() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue text-[10px] font-bold text-white">
      ✓
    </span>
  );
}

export function ForEventsPage() {
  return (
    <>
      <section className="bg-mist-deep text-ink">
        <div className="mx-auto grid max-w-6xl items-center gap-16 px-4 pt-32 pb-24 sm:pt-40 lg:grid-cols-[1.05fr_0.95fr] lg:pt-48">
          <div>
            <p className="caption-1 text-muted">{otherProductsPage.eyebrow}</p>
            <h1 className="heading-1 mt-4 max-w-[680px]">
              <span className="hero-heading">{otherProductsPage.title}</span>
            </h1>
            <p className="body-1 mt-6 max-w-[680px] text-muted">
              {otherProductsPage.description}
            </p>
            <ul className="mt-6 space-y-3">
              {eventStandeeHeroHighlights.map((line) => (
                <li key={line} className="body-2 flex gap-3 text-ink">
                  <CheckIcon />
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-end gap-4">
              <div>
                <p className="caption-1 text-muted">Event standee</p>
                <p className="heading-2 mt-2 text-ink">{eventStandeePrice}</p>
              </div>
              {"badge" in product && product.badge ? (
                <span className="caption-1 rounded-full bg-mist px-3 py-2 text-ink">
                  {product.badge}
                </span>
              ) : null}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <EnquiryButton className="btn-primary">Send an enquiry</EnquiryButton>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[320px] lg:max-w-none lg:justify-self-end">
            <div className="rounded-2xl bg-mist p-4">
              <StandeeShowcase embedded className="w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-mist-deep">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-14">
            <div>
              <p className="caption-1 text-muted">
                {product.tagline}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {product.title}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{product.body}</p>
            </div>
            <div className={`shrink-0 p-6 sm:p-8 ${homeCardClass}`}>
              <p className="text-sm font-semibold text-ink">What&apos;s included</p>
              <ul className="mt-4 space-y-3">
                {eventStandeeIncludes.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-muted">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue/10 text-[10px] font-bold text-blue">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              {"priceNote" in product && product.priceNote ? (
                <p className="mt-5 border-t border-slate-200 pt-4 text-sm font-medium text-blue">
                  {product.priceNote}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className={homeCardsSection}>
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:py-20">
          <p className="caption-1 text-muted">Process</p>
          <h2 className="mt-3 max-w-lg text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            From event brief to Google reviews
          </h2>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {product.howItWorks.map((step, index) => (
              <li key={step.title} className={`flex flex-col p-6 sm:p-7 ${homeCardClass}`}>
                <span className="text-xs font-semibold tracking-[0.2em] text-blue">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-base font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted">{step.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-mist-deep">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className={`p-6 sm:p-8 ${homeCardClass}`}>
              <h2 className="text-lg font-semibold text-ink">Ideal for</h2>
              <ul className="mt-4 space-y-3">
                {product.idealFor.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-muted">
                    <span className="font-semibold text-blue" aria-hidden="true">
                      ·
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className={`p-6 sm:p-8 ${homeCardClass}`}>
              <h2 className="text-lg font-semibold text-ink">Where to place the standee</h2>
              <ul className="mt-4 space-y-3">
                {product.placement.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-muted">
                    <span className="font-semibold text-blue" aria-hidden="true">
                      ·
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-8 rounded-2xl border border-slate-200 bg-mist px-5 py-4 text-sm leading-6 text-muted sm:px-6">
            {product.note}
          </p>
        </div>
      </section>

      <section className="bg-navy text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-14 sm:px-6 sm:flex-row sm:items-center sm:justify-between lg:py-16">
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-white">Ask about event standees</p>
            <p className="mt-2 text-sm leading-6 text-white/75">
              {eventStandeeEnquiryLead} {eventStandeePrice} per standee.
            </p>
            <Link
              href={productPagePath}
              className="mt-4 inline-flex text-sm font-semibold text-blue transition-colors hover:text-white"
            >
              Everyday table & counter QR →
            </Link>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <EnquiryButton className="inline-flex h-12 items-center justify-center rounded-full bg-blue px-6 text-sm font-semibold text-white transition-colors hover:bg-blue-deep">
              Send an enquiry
            </EnquiryButton>
            <Link
              href={eventStandeeWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              WhatsApp
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
