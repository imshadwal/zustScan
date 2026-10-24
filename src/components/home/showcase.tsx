export function Showcase() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
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
          <ul className="mt-6 space-y-3 text-sm font-medium text-ink">
            {["Service and product", "Stars they choose", "A draft they can change"].map(
              (item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue/10 text-blue">
                    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden="true">
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
              ),
            )}
          </ul>
        </div>

        <div className="grid items-center gap-6 sm:grid-cols-[240px_1fr]">
          <div className="mx-auto w-[240px] rounded-[2rem] border-[10px] border-[#101828] bg-[#101828] shadow-[0_24px_60px_rgba(16,24,40,0.25)]">
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
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-ink">
                    Room
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-ink">
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
                          ? "bg-white text-blue ring-1 ring-blue"
                          : "bg-white text-ink"
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
                          : "bg-white text-ink"
                      }`}
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-center text-sm tracking-widest text-[#f5b301]" aria-label="4 out of 5 stars">
                  ★★★★☆
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#e6ecf5] bg-white p-6 shadow-[0_16px_50px_rgba(16,32,68,0.06)]">
            <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
              Example draft
            </p>
            <p className="mt-3 text-sm tracking-[0.2em] text-[#f5b301]" aria-hidden="true">
              ★★★★☆
            </p>
            <p className="mt-3 text-lg leading-8 text-ink">
              “The biryani arrived hot and well seasoned, and the room was ready
              when we checked in.”
            </p>
            <div className="mt-6 inline-flex h-11 items-center rounded-full bg-blue px-5 text-sm font-semibold text-white">
              Copy & Continue
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">
              That button copies the draft and opens the business’s Google
              review page. The guest pastes the words and taps Post.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
