import { GuestAnalyticsStats } from "@/components/home/guest-analytics-stats";
import { homeCardClass } from "@/components/home/styles";
import { marketingAnalyticsDemo, whyDifferent } from "@/lib/site";

type WhyItem = (typeof whyDifferent)[number];

const languagesItem = whyDifferent[0];
const voiceItem = whyDifferent[1];
const analyticsItem = whyDifferent[2];
const speedItem = whyDifferent[3];
const noAppItem = whyDifferent[4];
const extraItems = whyDifferent.filter(
  (item): item is WhyItem & { chips: readonly string[] } =>
    "chips" in item &&
    item.id === "branding" || item.id === "category",
);

function CardShell({
  children,
  className = "",
  dark = false,
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <article
      className={`relative flex h-full min-h-[14rem] flex-col overflow-hidden p-8 sm:min-h-[15rem] sm:p-9 lg:min-h-[16rem] lg:p-10 ${
        dark
          ? "rounded-[32px] border border-white/10 bg-navy text-white shadow-[0_24px_72px_rgba(7,20,40,0.4)]"
          : `${homeCardClass} !rounded-[32px]`
      } ${className}`}
    >
      {children}
    </article>
  );
}

function StepBadge({ step }: { step: string }) {
  return (
    <span className="text-sm font-bold tracking-wider text-blue lg:text-base">{step}</span>
  );
}

function ChipsCard({
  item,
  primaryChip = false,
  className = "",
}: {
  item: WhyItem & { chips: readonly string[] };
  primaryChip?: boolean;
  className?: string;
}) {
  return (
    <CardShell className={className}>
      <StepBadge step={item.step} />
      <h3 className="mt-5 text-2xl font-semibold text-ink sm:text-3xl lg:text-[2rem] lg:leading-tight">
        {item.title}
      </h3>
      <p className="mt-3 text-base leading-7 text-muted sm:text-lg sm:leading-8">{item.body}</p>
      <div className="mt-auto flex flex-wrap gap-3 pt-10">
        {item.chips.map((chip, index) => (
          <span
            key={chip}
            className={`rounded-full px-4 py-2 text-sm font-semibold sm:text-base ${
              primaryChip && index === 0
                ? "bg-blue text-white shadow-sm"
                : "border border-slate-200 bg-white text-ink"
            }`}
          >
            {chip}
          </span>
        ))}
      </div>
    </CardShell>
  );
}

function LanguagesCard() {
  const item = languagesItem;
  return (
    <CardShell className="lg:min-h-[18rem]">
      <div className="flex items-start justify-between gap-4">
        <StepBadge step={item.step} />
        <span className="rounded-full bg-blue/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue uppercase">
          Multilingual
        </span>
      </div>
      <h3 className="mt-5 text-2xl font-semibold text-ink sm:text-3xl lg:text-[2rem] lg:leading-tight">
        {item.title}
      </h3>
      <p className="mt-3 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
        {item.body}
      </p>
      <div className="mt-auto flex flex-wrap gap-3 pt-10">
        {item.chips.map((chip, index) => (
          <span
            key={chip}
            className={`rounded-full px-5 py-2.5 text-base font-semibold ${
              index === 0
                ? "bg-blue text-white shadow-sm"
                : "border border-slate-200 bg-mist text-ink"
            }`}
          >
            {chip}
          </span>
        ))}
      </div>
    </CardShell>
  );
}

function AnalyticsCard() {
  const item = analyticsItem;
  return (
    <CardShell dark className="min-h-[22rem] lg:min-h-full">
      <div
        className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-blue/25 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative flex flex-1 flex-col">
        <StepBadge step={item.step} />
        <h3 className="mt-5 text-2xl font-semibold sm:text-3xl lg:text-[2rem] lg:leading-tight">
          {item.title}
        </h3>
        <p className="mt-3 text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
          {item.body}
        </p>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm sm:p-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">
            Owner portal · sample
          </p>
          <div className="mt-4 [&_dd]:text-3xl [&_div]:px-4 [&_div]:py-5 [&_dt]:text-xs">
            <GuestAnalyticsStats variant="dark" counts={marketingAnalyticsDemo} />
          </div>
        </div>
        {"chips" in item ? (
          <ul className="mt-5 grid grid-cols-2 gap-2.5">
            {item.chips.map((chip, index) => (
              <li
                key={chip}
                className={`rounded-md border border-blue/40 bg-blue/15 px-2.5 py-1.5 text-xs font-semibold tracking-wide text-blue uppercase ${
                  index === item.chips.length - 1 && item.chips.length % 2 === 1 ? "col-span-2" : ""
                }`}
              >
                {chip}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </CardShell>
  );
}

function HighlightCard({ item }: { item: WhyItem & { highlight: string } }) {
  return (
    <CardShell className="lg:min-h-[14rem]">
      <StepBadge step={item.step} />
      <p className="mt-4 text-6xl font-semibold tracking-tight text-blue sm:text-7xl lg:text-8xl">
        {item.highlight}
      </p>
      <h3 className="mt-3 text-xl font-semibold text-ink sm:text-2xl">{item.title}</h3>
      <p className="mt-3 text-base leading-7 text-muted sm:text-lg">{item.body}</p>
    </CardShell>
  );
}

function NoAppCard() {
  const item = noAppItem;
  return (
    <CardShell className="lg:min-h-[14rem]">
      <StepBadge step={item.step} />
      <p className="mt-4 text-6xl font-semibold tracking-tight text-ink sm:text-7xl lg:text-8xl">
        {item.highlight}
      </p>
      <h3 className="mt-3 text-xl font-semibold text-ink sm:text-2xl">{item.title}</h3>
      <p className="mt-3 text-base leading-7 text-muted sm:text-lg">{item.body}</p>
      <p className="mt-auto pt-8 text-sm font-semibold tracking-wide text-blue uppercase">
        Browser · QR · Done
      </p>
    </CardShell>
  );
}

export function WhyDifferentSection({ showPageIntro = false }: { showPageIntro?: boolean }) {
  return (
    <section id="why-different" className="relative overflow-hidden bg-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-15%,rgba(0,102,255,0.14),transparent)]"
        aria-hidden="true"
      />
      <div
        className={`relative mx-auto max-w-7xl px-5 sm:px-8 xl:px-10 ${
          showPageIntro ? "pb-24 pt-8 lg:pb-32 lg:pt-10" : "py-24 lg:py-32"
        }`}
      >
        {!showPageIntro ? (
          <header className="mx-auto max-w-4xl text-center lg:max-w-none lg:text-left">
            <h2 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl lg:leading-[1.06]">
              <span className="text-ink">Why we&apos;re </span>
              <span className="text-blue">different.</span>
            </h2>
            <p className="mt-4 text-base font-medium leading-7 text-ink/80 sm:text-lg">
              Built for real guests.{" "}
              <span className="text-blue">Proof for owners.</span>
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-base sm:leading-7">
              Language, voice, branding, and category-smart setup — without asking anyone to install
              an app.
            </p>
          </header>
        ) : null}

        <ul
          className={`grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-12 lg:grid-rows-[auto_auto_auto_auto] lg:gap-7 ${
            showPageIntro ? "mt-0" : "mt-14 lg:mt-20"
          }`}
        >
          <li className="sm:col-span-2 lg:col-span-8 lg:row-start-1">
            <LanguagesCard />
          </li>
          <li className="sm:col-span-2 lg:col-span-8 lg:row-start-2">
            <ChipsCard item={voiceItem} className="lg:min-h-[18rem]" />
          </li>
          <li className="sm:col-span-2 lg:col-span-4 lg:row-span-3 lg:col-start-9 lg:row-start-1">
            <AnalyticsCard />
          </li>
          <li className="lg:col-span-4 lg:row-start-3">
            <HighlightCard item={speedItem} />
          </li>
          <li className="lg:col-span-4 lg:col-start-5 lg:row-start-3">
            <NoAppCard />
          </li>
          {extraItems.map((item) => (
            <li
              key={item.id}
              className="sm:col-span-1 lg:col-span-4 lg:row-start-4"
            >
              <ChipsCard item={item} primaryChip className="lg:min-h-[16rem]" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
