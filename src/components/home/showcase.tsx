import { homeCardClass, homeCardsSection } from "@/components/home/styles";

const checklist = [
  "Service and product",
  "Stars they choose",
  "A draft they can change",
] as const;

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
              Service, then the product, then Good, Better, or Best. The draft
              stays editable, and the guest posts it.
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
            className={`relative grid gap-6 p-6 sm:grid-cols-[minmax(0,240px)_1fr] sm:p-8 ${homeCardClass}`}
          >
            <p
              className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 text-3xl text-blue/25 sm:block"
              aria-hidden="true"
            >
              →
            </p>
            <div className="relative z-[1] mx-auto w-full max-w-[240px]">
              <div className="rounded-[2rem] border-[10px] border-[#101828] bg-[#101828] shadow-[0_24px_60px_rgba(16,24,40,0.22)]">
                <div className="overflow-hidden rounded-[1.3rem] bg-mist">
                  <div className="flex items-center justify-between px-4 pt-3 pb-2 text-[10px] font-medium text-muted">
                    <span>9:41</span>
                    <span className="h-4 w-16 rounded-full bg-black/80" />
                    <span>5G</span>
                  </div>
                  <div className="px-3 pb-4">
                    <p className="text-[11px] font-medium text-muted">Your hotel</p>
                    <p className="mt-1 text-sm font-semibold text-ink">Choose a service</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-blue px-2.5 py-1 text-[11px] font-semibold text-white">
                        Food
                      </span>
                      <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-ink ring-1 ring-slate-200">
                        Room
                      </span>
                      <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-ink ring-1 ring-slate-200">
                        Amenities
                      </span>
                    </div>
                    <p className="mt-4 text-sm font-semibold text-ink">Food</p>
                    <div className="mt-2 space-y-1.5">
                      {["Biryani", "Paneer tikka", "Breakfast"].map((item, index) => (
                        <div
                          key={item}
                          className={`rounded-xl px-3 py-2 text-[12px] font-medium ${
                            index === 0
                              ? "bg-white text-blue ring-2 ring-blue"
                              : "bg-white text-ink ring-1 ring-slate-200"
                          }`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-sm font-semibold text-ink">How was it?</p>
                    <div className="mt-2 grid grid-cols-3 gap-1.5">
                      {["Good", "Better", "Best"].map((label) => (
                        <span
                          key={label}
                          className={`rounded-xl py-2 text-center text-[11px] font-semibold ${
                            label === "Better"
                              ? "bg-blue text-white"
                              : "bg-white text-ink ring-1 ring-slate-200"
                          }`}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                    <p
                      className="mt-3 text-center text-sm tracking-widest text-[#f5b301]"
                      aria-label="4 out of 5 stars"
                    >
                      ★★★★☆
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-center text-xs font-semibold tracking-wide text-muted uppercase">
                Guest picks
              </p>
            </div>

            <div className="relative z-[1] flex flex-col rounded-[24px] border-2 border-blue/15 bg-gradient-to-br from-white to-blue/[0.04] p-6 shadow-[0_12px_40px_rgba(0,96,240,0.08)]">
              <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
                Example draft
              </p>
              <p className="mt-3 text-sm tracking-[0.2em] text-[#f5b301]" aria-hidden="true">
                ★★★★☆
              </p>
              <p className="mt-3 flex-1 text-lg leading-8 text-ink">
                “The biryani arrived hot and well seasoned, and the room was ready when
                we checked in.”
              </p>
              <div className="mt-6 inline-flex h-11 w-fit items-center rounded-full bg-blue px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,96,240,0.35)]">
                Copy & Continue
              </div>
              <p className="mt-4 text-sm leading-6 text-muted">
                Copies the draft and opens Google review. The guest pastes and taps Post.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
