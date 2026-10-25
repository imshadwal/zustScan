import Link from "next/link";
import { homeCardClass } from "@/components/home/styles";
import { journeyTimeline, productPagePath } from "@/lib/site";

export function JourneyTimeline() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
              Journey
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Scan to post in four beats.
            </h2>
          </div>
          <Link
            href={productPagePath}
            className="text-sm font-semibold text-blue hover:underline"
          >
            All six steps →
          </Link>
        </div>

        <div className={`relative mt-10 p-6 sm:p-8 lg:p-10 ${homeCardClass}`}>
          {/* Horizontal connector (tablet+) */}
          <div
            className="pointer-events-none absolute top-[3.35rem] right-12 left-12 hidden h-0.5 bg-slate-300 md:block lg:top-[3.5rem]"
            aria-hidden="true"
          />
          <ol className="grid gap-8 md:grid-cols-4 md:gap-4">
            {journeyTimeline.map((item, index) => (
              <li key={item.title} className="relative flex gap-4 md:block md:text-center">
                {/* Vertical connector (mobile) */}
                {index < journeyTimeline.length - 1 ? (
                  <div
                    className="absolute top-12 bottom-0 left-5 w-0.5 -translate-x-1/2 bg-slate-300 md:hidden"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative z-[1] flex shrink-0 flex-col items-center md:mx-auto">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue bg-white text-xs font-bold text-blue shadow-sm">
                    {item.step}
                  </span>
                </div>
                <div className="min-w-0 pb-2 md:mt-5 md:px-1">
                  <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
