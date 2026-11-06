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
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article className={`flex h-full flex-col p-6 sm:p-8 ${homeCardClass} ${className}`}>
      {children}
    </article>
  );
}

function StepBadge({ step }: { step: string }) {
  return <span className="caption-1 text-blue">{step}</span>;
}

function StaticChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="caption-1 rounded-full border border-slate-200 bg-mist px-3 py-1 text-ink">
      {children}
    </span>
  );
}

function ChipsCard({
  item,
  className = "",
}: {
  item: WhyItem & { chips: readonly string[] };
  className?: string;
}) {
  return (
    <CardShell className={className}>
      <StepBadge step={item.step} />
      <h2 className="heading-3 mt-5 text-ink">
        {item.title}
      </h2>
      <p className="body-1 mt-3 text-muted">{item.body}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {item.chips.map((chip) => (
          <StaticChip key={chip}>{chip}</StaticChip>
        ))}
      </div>
    </CardShell>
  );
}

function LanguagesCard() {
  const item = languagesItem;
  return (
    <CardShell>
      <div className="flex items-start justify-between gap-4">
        <StepBadge step={item.step} />
        <span className="caption-1 rounded-full bg-blue/10 px-3 py-1 text-blue">
          Multilingual
        </span>
      </div>
      <h2 className="heading-3 mt-5 text-ink">
        {item.title}
      </h2>
      <p className="body-1 mt-3 max-w-xl text-muted">
        {item.body}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {item.chips.map((chip) => (
          <StaticChip key={chip}>{chip}</StaticChip>
        ))}
      </div>
    </CardShell>
  );
}

function AnalyticsCard() {
  const item = analyticsItem;
  return (
    <CardShell>
      <StepBadge step={item.step} />
      <h2 className="heading-3 mt-5 text-ink">
        {item.title}
      </h2>
      <p className="body-1 mt-3 text-muted">
        {item.body}
      </p>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-mist p-5">
        <p className="caption-1 text-muted">
          Owner portal · sample
        </p>
        <div className="mt-4">
          <GuestAnalyticsStats counts={marketingAnalyticsDemo} />
        </div>
      </div>
      {"chips" in item ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.chips.map((chip) => (
            <StaticChip key={chip}>{chip}</StaticChip>
          ))}
        </div>
      ) : null}
    </CardShell>
  );
}

function HighlightCard({ item }: { item: WhyItem & { highlight: string } }) {
  return (
    <CardShell>
      <StepBadge step={item.step} />
      <p className="heading-1 mt-4 text-blue">
        {item.highlight}
      </p>
      <h2 className="heading-3 mt-3 text-ink">{item.title}</h2>
      <p className="body-1 mt-3 text-muted">{item.body}</p>
    </CardShell>
  );
}

function NoAppCard() {
  const item = noAppItem;
  return (
    <CardShell>
      <StepBadge step={item.step} />
      <p className="heading-1 mt-4 text-ink">
        {item.highlight}
      </p>
      <h2 className="heading-3 mt-3 text-ink">{item.title}</h2>
      <p className="body-1 mt-3 text-muted">{item.body}</p>
      <p className="caption-1 mt-6 text-blue">
        Browser · QR · done
      </p>
    </CardShell>
  );
}

export function WhyDifferentSection({ showPageIntro = false }: { showPageIntro?: boolean }) {
  return (
    <section id="why-different" className="relative overflow-hidden bg-mist-deep">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-15%,rgba(0,102,255,0.14),transparent)]"
        aria-hidden="true"
      />
      <div
        className={`relative mx-auto max-w-6xl px-5 sm:px-6 ${
          showPageIntro ? "pt-8 pb-10 lg:pt-10 lg:pb-12" : "py-16 lg:py-20"
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
          className={`grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 ${
            showPageIntro ? "mt-0" : "mt-10"
          }`}
        >
          <li className="sm:col-span-2">
            <LanguagesCard />
          </li>
          <li>
            <AnalyticsCard />
          </li>
          <li className="sm:col-span-2">
            <ChipsCard item={voiceItem} />
          </li>
          <li>
            <HighlightCard item={speedItem} />
          </li>
          <li>
            <NoAppCard />
          </li>
          {extraItems.map((item) => (
            <li key={item.id}>
              <ChipsCard item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
