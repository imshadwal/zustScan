"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { journey } from "@/lib/site";

/** Warm accent on navy (distinct from headline/link blue). */
const stepIconClass = "h-7 w-7 text-blue";
const stepBadgeClass = "border-2 border-blue bg-white font-bold text-blue";

function ScrollProgressTimeline({
  fill,
  variant,
}: {
  fill: number;
  variant: "center" | "mobile";
}) {
  const isCenter = variant === "center";
  const trackWidthPx = 4;
  const fillWidthPx = 4 + fill * 2;
  const barPositionClass = isCenter
    ? "left-1/2 -translate-x-1/2"
    : "left-0 -translate-x-1/2";

  return (
    <div
      className={
        isCenter
          ? "pointer-events-none absolute top-0 bottom-0 left-1/2 hidden -translate-x-1/2 md:block"
          : "pointer-events-none absolute top-0 bottom-0 left-[1.35rem] md:hidden"
      }
      aria-hidden="true"
    >
      <div
        className={`absolute inset-y-0 rounded-full bg-amber-200/12 ${barPositionClass}`}
        style={{ width: trackWidthPx }}
      />
      <div
        className={`absolute top-0 origin-top rounded-full bg-blue ${barPositionClass}`}
        style={{
          height: `${fill * 100}%`,
          width: fillWidthPx,
          opacity: 0.35 + fill * 0.65,
        }}
      />
    </div>
  );
}

function useTimelineScrollFill(containerRef: RefObject<HTMLElement | null>) {
  const [fill, setFill] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const anchor = vh * 0.52;
      const height = Math.max(rect.height, 1);
      const next = (anchor - rect.top) / height;
      setFill(Math.min(1, Math.max(0, next)));
    };

    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      setFill(1);
      return;
    }

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", () => {
      if (reduced.matches) setFill(1);
      else schedule();
    });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [containerRef]);

  return fill;
}

const stepIcons = [
  /* 01 QR */
  <svg key="1" viewBox="0 0 24 24" className={stepIconClass} aria-hidden="true">
    <path
      fill="currentColor"
      d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm8 2h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2z"
    />
  </svg>,
  /* 02 tap */
  <svg key="2" viewBox="0 0 24 24" className={stepIconClass} aria-hidden="true">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      d="M8 12l2 2 6-6M12 3v3M12 18v3M3 12h3M18 12h3"
    />
  </svg>,
  /* 03 stars */
  <svg key="3" viewBox="0 0 24 24" className={stepIconClass} aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17.8l-6.2 4.5 2.4-7.4L2 9.4h7.6L12 2z"
    />
  </svg>,
  /* 04 edit */
  <svg key="4" viewBox="0 0 24 24" className={stepIconClass} aria-hidden="true">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z"
    />
  </svg>,
  /* 05 copy */
  <svg key="5" viewBox="0 0 24 24" className={stepIconClass} aria-hidden="true">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      d="M8 8h10v12H8V8zm0-2a2 2 0 012-2h8a2 2 0 012 2v2H8V6z"
    />
  </svg>,
  /* 06 check */
  <svg key="6" viewBox="0 0 24 24" className={stepIconClass} aria-hidden="true">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      d="M20 6L9 17l-5-5"
    />
  </svg>,
];

function JourneyStepCard({
  item,
  icon,
}: {
  item: (typeof journey)[number];
  icon: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-black/5 bg-white p-6 sm:p-8">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-mist">
        {icon}
      </div>
      <h3 className="heading-4 text-ink">{item.title}</h3>
      <p className="body-2 mt-3 text-muted">{item.body}</p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-md border border-blue/40 bg-blue/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-blue sm:text-xs"
          >
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Journey({ showHeading = true }: { showHeading?: boolean }) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineFill = useTimelineScrollFill(timelineRef);

  return (
    <section
      id="journey"
      className="relative bg-mist-deep text-ink"
    >
      <div
        className={`relative mx-auto max-w-6xl px-4 ${
          showHeading ? "py-24 lg:py-32" : "py-16 lg:py-24"
        }`}
      >
        {showHeading ? (
          <header className="mx-auto max-w-[680px]">
            <p className="caption-1 text-muted">The guest path</p>
            <h1 className="heading-1 mt-4">
              <span className="hero-heading">
                Six steps,
                <br />
                from the QR to the post
              </span>
            </h1>
            <p className="body-1 mt-6 text-muted">
              The same path works at a restaurant table, a hotel desk, a shop counter, or
              after a service visit.
            </p>
          </header>
        ) : null}

        <div
          ref={timelineRef}
          className={`relative ${showHeading ? "mt-16 lg:mt-20" : ""}`}
        >
          <ScrollProgressTimeline fill={timelineFill} variant="center" />
          <ScrollProgressTimeline fill={timelineFill} variant="mobile" />

          <ol className="flex flex-col gap-14 md:gap-20 lg:gap-24">
            {journey.map((item, index) => {
              const onLeft = index % 2 === 0;
              const icon = stepIcons[index] ?? stepIcons[0];
              const card = <JourneyStepCard item={item} icon={icon} />;

              return (
                <li
                  key={item.step}
                  className="relative md:grid md:min-h-[12rem] md:grid-cols-2 md:items-center md:gap-10 lg:gap-14"
                >
                  <span
                    className={`pointer-events-none absolute top-8 left-[1.35rem] z-[2] flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full text-xs ${stepBadgeClass} md:hidden`}
                  >
                    {item.step}
                  </span>

                  <span
                    className={`pointer-events-none absolute top-1/2 left-1/2 z-[2] hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-sm ${stepBadgeClass} md:flex`}
                  >
                    {item.step}
                  </span>

                  {onLeft ? (
                    <>
                      <div className="relative z-[1] pl-12 md:col-start-1 md:pl-0 md:pr-14 lg:pr-20">
                        {card}
                      </div>
                      <div className="hidden md:block" aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      <div className="hidden md:block" aria-hidden="true" />
                      <div className="relative z-[1] pl-12 md:col-start-2 md:pl-14 md:pr-0 lg:pl-20">
                        {card}
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
