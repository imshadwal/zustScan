import Link from "next/link";
import { StandeeShowcase } from "@/components/home/standee-showcase";
import { homeCardClass, homeCardsSection } from "@/components/home/styles";
import {
  eventStandeePrice,
  eventStandeeTeaserBody,
  forEventsLabel,
  otherProducts,
  eventsPagePath,
} from "@/lib/site";

const event = otherProducts[0]!;

export function EventStandeeTeaser() {
  return (
    <section className={`${homeCardsSection} border-t border-slate-200/80`}>
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:py-20">
        <div
          className={`grid gap-8 overflow-visible p-6 sm:grid-cols-[1fr_min(100%,260px)] sm:items-start sm:p-8 ${homeCardClass}`}
        >
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
              Also for big nights
            </p>
            <h2 className="mt-2 text-xl font-semibold text-ink sm:text-2xl">{event.title}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
              {eventStandeeTeaserBody} Standee from {eventStandeePrice}.
            </p>
            <Link
              href={eventsPagePath}
              className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-blue px-6 text-sm font-semibold text-white transition-colors hover:bg-blue-deep"
            >
              {forEventsLabel}
            </Link>
          </div>
          <StandeeShowcase compact className="mx-auto w-full max-w-[260px] sm:mx-0 sm:max-w-none" />
        </div>
      </div>
    </section>
  );
}
