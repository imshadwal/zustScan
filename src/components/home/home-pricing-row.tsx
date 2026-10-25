import Link from "next/link";
import { homeCardClass, homeCardsSection } from "@/components/home/styles";
import {
  eventStandeeIncludes,
  eventStandeePrice,
  eventsPagePath,
  forEventsLabel,
  launchOfferHeadline,
  launchOfferSavings,
  listPrice,
  planIncludes,
  price,
} from "@/lib/site";

const businessIncludes = planIncludes.slice(0, 3);

export function HomePricingRow() {
  return (
    <section className={homeCardsSection}>
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">Pricing</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Two ways to collect reviews
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
            Everyday counter and table QR, or a customised standee for function nights.
          </p>
        </div>

        <div
          className={`mx-auto mt-8 max-w-3xl overflow-hidden sm:grid sm:grid-cols-2 sm:items-stretch ${homeCardClass} !rounded-[28px] !p-0`}
        >
          <Link
            href="/pricing"
            className="group flex h-full min-h-full flex-col border-b border-slate-200 p-6 transition-colors hover:bg-white sm:border-r sm:border-b-0 sm:p-7"
          >
            <span className="w-fit rounded-full bg-blue/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-blue uppercase">
              Business QR
            </span>
            <p className="mt-4 text-4xl font-semibold tracking-tight text-ink">{price}</p>
            <p className="mt-1 text-sm text-muted">
              <span className="line-through">{listPrice}</span>
              <span className="mx-1.5 text-slate-300">·</span>
              Save {launchOfferSavings}
            </p>
            <span className="mt-3 inline-flex w-fit rounded-full bg-mist px-3 py-1 text-[11px] font-semibold text-ink">
              {launchOfferHeadline}
            </span>
            <ul className="mt-5 flex-1 space-y-2 text-sm leading-6 text-muted">
              {businessIncludes.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="font-semibold text-blue" aria-hidden="true">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6">
              <span className="inline-flex h-11 items-center rounded-full bg-blue px-5 text-sm font-semibold text-white transition-colors group-hover:bg-blue-deep">
                See pricing
              </span>
            </div>
          </Link>

          <Link
            href={eventsPagePath}
            className="group flex h-full min-h-full flex-col bg-mist/40 p-6 transition-colors hover:bg-mist/60 sm:p-7"
          >
            <span className="w-fit rounded-full bg-navy/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-navy uppercase">
              {forEventsLabel}
            </span>
            <p className="mt-4 text-4xl font-semibold tracking-tight text-ink">{eventStandeePrice}</p>
            <p className="mt-1 text-sm text-muted">Per standee · one function night</p>
            <span className="mt-3 inline-flex w-fit rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-muted">
              Custom event QR · AI draft
            </span>
            <ul className="mt-5 flex-1 space-y-2 text-sm leading-6 text-muted">
              {eventStandeeIncludes.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="font-semibold text-blue" aria-hidden="true">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6">
              <span className="inline-flex h-11 items-center rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-ink transition-colors group-hover:border-blue group-hover:text-blue">
                Event standee
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
