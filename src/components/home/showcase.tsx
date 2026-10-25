import { homeCardClass, homeCardsSection } from "@/components/home/styles";

const checklist = [
  "Your name, address, contact, and Why trust us on the first screen",
  "One or more services and products",
  "Good, Great, or Exceptional (stars follow automatically)",
  "AI-powered draft they can change — English, Hindi, or Hinglish",
] as const;

const STEPS = ["Service", "Product", "Rating", "Draft"] as const;
const activeStep = 2;

function MockPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-mist/60 p-1.5 ${className}`}
    >
      {children}
    </div>
  );
}

const MOCK_WIDTH = "w-[168px]";

function GuestFlowMock() {
  return (
    <div
      className={`${MOCK_WIDTH} mx-auto overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm`}
    >
      <div className="bg-navy px-2.5 py-2.5 text-white">
        <p className="text-[7px] font-semibold tracking-[0.12em] text-blue-200 uppercase">
          Your visit
        </p>
        <p className="mt-0.5 text-[11px] font-semibold leading-tight">Lakeview Hotel</p>
        <p className="mt-0.5 text-[7px] leading-snug text-white/70">
          MG Road, Varanasi
        </p>
        <p className="mt-1 text-[7px] leading-snug text-white/80">
          Why trust us · Real guest reviews — you post on Google yourself.
        </p>
      </div>

      <div className="px-2 py-1.5">
        <ol className="flex gap-0.5" aria-hidden="true">
          {STEPS.map((label, index) => {
            const done = index < activeStep;
            const current = index === activeStep;
            return (
              <li key={label} className="flex-1">
                <div
                  className={`h-1 rounded-full ${
                    done || current ? "bg-blue" : "bg-slate-200"
                  } ${current ? "ring-1 ring-blue/25" : ""}`}
                />
                <p
                  className={`mt-1 truncate text-center text-[7px] font-semibold uppercase tracking-wide ${
                    current ? "text-blue" : "text-muted"
                  }`}
                >
                  {label}
                </p>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="space-y-1.5 px-2 pb-2">
        <MockPanel>
          <p className="text-[10px] font-semibold text-ink">Choose services</p>
          <p className="text-[8px] text-muted">Pick one or more</p>
          <ul className="mt-1.5 space-y-1">
            <li className="flex items-center gap-1.5 rounded-md bg-blue px-1.5 py-1 text-[9px] font-semibold text-white shadow-sm">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-white/20 text-[7px]">
                3
              </span>
              Food
            </li>
            <li className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-1.5 py-1 text-[9px] font-semibold text-ink">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-mist text-[7px] text-blue">
                2
              </span>
              Room
            </li>
          </ul>
        </MockPanel>

        <MockPanel>
          <p className="text-[10px] font-semibold text-ink">Choose products</p>
          <p className="text-[8px] text-muted">Food · pick one or more</p>
          <ul className="mt-1.5 space-y-1">
            <li className="rounded-md bg-white px-1.5 py-1 text-[9px] font-medium text-blue ring-2 ring-blue">
              Biryani
            </li>
            <li className="rounded-md border border-slate-200/80 bg-white px-1.5 py-1 text-[9px] font-medium text-ink">
              Paneer tikka
            </li>
          </ul>
        </MockPanel>

        <MockPanel>
          <p className="text-[10px] font-semibold text-ink">How was it?</p>
          <p className="text-[8px] text-muted">Biryani · tap Good, Great, or Exceptional</p>
          <div className="mt-2 grid grid-cols-3 gap-1">
            {(["Good", "Great", "Exceptional"] as const).map((label) => (
              <span
                key={label}
                className={`rounded-md py-1 text-center text-[8px] font-semibold ${
                  label === "Great"
                    ? "bg-blue text-white"
                    : "border border-slate-200 bg-white text-ink"
                }`}
              >
                {label}
              </span>
            ))}
          </div>
          <div className="mt-1.5 rounded-md border border-slate-200 bg-white px-1.5 py-1">
            <p className="text-[7px] font-semibold text-muted">Star rating</p>
            <div className="mt-0.5 flex justify-center gap-px" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((value) => (
                <span
                  key={value}
                  className={`flex h-5 w-5 items-center justify-center rounded text-[9px] ${
                    value <= 4 ? "bg-[#fff8e6] text-[#e5a100]" : "bg-mist text-slate-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <p className="mt-2 text-[10px] font-semibold text-ink">Review language</p>
          <div className="mt-1 grid grid-cols-3 gap-1">
            {(
              [
                { label: "English", selected: true },
                { label: "हिंदी", selected: false },
                { label: "Hinglish", selected: false },
              ] as const
            ).map(({ label, selected }) => (
              <span
                key={label}
                className={`rounded-md py-1 text-center text-[7px] font-semibold ${
                  selected
                    ? "bg-blue text-white"
                    : "border border-slate-200 bg-white text-ink"
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </MockPanel>

        <div className="rounded-full bg-blue py-1.5 text-center text-[9px] font-semibold text-white shadow-[0_4px_12px_rgba(0,96,240,0.3)]">
          Get review draft
        </div>
      </div>
    </div>
  );
}

function DraftMock() {
  return (
    <MockPanel
      className={`${MOCK_WIDTH} border-blue/20 bg-gradient-to-b from-blue/[0.06] to-white p-2.5`}
    >
      <p className="text-[9px] font-semibold text-ink">Your draft</p>
      <p className="text-[7px] text-muted">Edit before you post on Google.</p>
      <p className="mt-1.5 text-center text-xs tracking-wide text-[#e5a100]" aria-hidden="true">
        ★★★★<span className="text-slate-200">★</span>
      </p>
      <div className="mt-1.5 rounded-lg border-2 border-slate-300 bg-white px-2 py-1.5 text-[9px] leading-4 text-ink">
        The biryani arrived hot and well seasoned. Solid experience — 4 stars.
      </div>
      <div className="mt-2 space-y-1">
        <div className="rounded-full bg-blue py-1.5 text-center text-[9px] font-semibold text-white shadow-[0_4px_12px_rgba(0,96,240,0.3)]">
          Copy & Continue
        </div>
        <div className="rounded-full border border-slate-200 bg-white py-1.5 text-center text-[8px] font-semibold text-ink">
          Regenerate draft
        </div>
      </div>
      <p className="mt-2 text-center text-[8px] leading-4 text-muted">
        Paste on Google, match the stars, and tap Post yourself.
      </p>
    </MockPanel>
  );
}

export function Showcase() {
  return (
    <section className={homeCardsSection}>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
              The guest screen
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
              From a scan to words they can post.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-8 text-muted">
              Same flow on every phone: services and products, rating and language, then an
              AI draft they edit before Copy &amp; Continue opens Google.
            </p>
            <ul className="mt-8 space-y-3">
              {checklist.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm font-medium text-ink shadow-sm"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue text-white">
                    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                      <path
                        d="M4 10.5l4 4 8-8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`relative flex flex-col items-center gap-8 p-6 sm:p-8 lg:flex-row lg:justify-center lg:gap-12 ${homeCardClass}`}
          >
            <p
              className="pointer-events-none absolute top-[42%] left-1/2 hidden -translate-x-1/2 -translate-y-1/2 text-2xl text-blue/25 lg:block"
              aria-hidden="true"
            >
              →
            </p>
            <div className="relative z-[1] shrink-0">
              <div className="flex w-[12.75rem] flex-col rounded-[1.6rem] border-[8px] border-[#101828] bg-[#101828] shadow-[0_16px_40px_rgba(16,24,40,0.2)]">
                <div className="overflow-hidden rounded-[1rem] bg-mist-deep px-0.5 pt-0.5 pb-1">
                  <div className="flex items-center justify-between px-2 pt-1 pb-0.5 text-[7px] font-medium text-muted">
                    <span>9:41</span>
                    <span className="h-2.5 w-10 rounded-full bg-black/80" />
                    <span>5G</span>
                  </div>
                  <div className="max-h-[22.05rem] overflow-hidden">
                    <GuestFlowMock />
                  </div>
                </div>
              </div>
              <p className="mt-3 text-center text-xs font-semibold tracking-wide text-muted uppercase">
                Guest review flow
              </p>
            </div>

            <div className="relative z-[1] w-[12.75rem] shrink-0">
              <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
                AI-powered draft
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                After Get review draft, guests land here — same card as on the live page.
              </p>
              <div className="mt-4 flex justify-center lg:justify-start">
                <DraftMock />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
