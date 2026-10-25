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
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-20 right-[-5%] h-96 w-96 rounded-full bg-blue/25 blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-5%] h-72 w-72 rounded-full bg-blue/10 blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pt-32 pb-16 sm:px-6 sm:pt-36 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pt-40 lg:pb-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold tracking-[0.14em] text-white/85 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-blue" />
              {otherProductsPage.eyebrow}
            </p>
            <h1 className="mt-6 max-w-xl text-3xl leading-[1.08] font-semibold tracking-tight sm:text-5xl">
              {otherProductsPage.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
              {otherProductsPage.description}
            </p>
            <ul className="mt-6 space-y-3">
              {eventStandeeHeroHighlights.map((line) => (
                <li key={line} className="flex gap-3 text-sm leading-6 text-white/80 sm:text-base">
                  <CheckIcon />
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-end gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wide text-white/50 uppercase">
                  Event standee
                </p>
                <p className="mt-1 text-4xl font-semibold tracking-tight sm:text-5xl">
                  {eventStandeePrice}
                </p>
              </div>
              {"badge" in product && product.badge ? (
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white/90">
                  {product.badge}
                </span>
              ) : null}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
          <div className="mx-auto w-full max-w-[320px] lg:max-w-none lg:justify-self-end">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-5">
              <StandeeShowcase embedded className="w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-14">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
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
          <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">Process</p>
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

      <section className="border-t border-slate-200 bg-white">
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
