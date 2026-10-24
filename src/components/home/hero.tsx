import { EnquiryButton } from "@/components/home/enquiry";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-navy text-white">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute -top-24 right-[-10%] h-80 w-80 rounded-full bg-blue/30 blur-3xl" />
        <div className="absolute bottom-0 left-[-10%] h-64 w-64 rounded-full bg-blue/10 blur-3xl" />
      </div>
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pt-36 pb-20 sm:px-6 sm:pt-40 lg:grid-cols-[1.15fr_0.85fr] lg:pt-44 lg:pb-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-white/80 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-blue" />
            QR review assistant
          </p>
          <h1 className="mt-6 max-w-xl text-4xl leading-[1.05] font-semibold tracking-tight sm:text-6xl">
            One scan. A better review.
            <span className="mt-1 block text-blue">Made personal.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/75">
            Guests scan a code where the moment happens, choose what they used,
            and get a review draft they can edit. They post it themselves on
            your Google page.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <EnquiryButton className="inline-flex h-12 items-center justify-center rounded-full bg-blue px-6 text-sm font-semibold text-white transition-colors hover:bg-blue-deep">
              Send an enquiry
            </EnquiryButton>
            <a
              href="#journey"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              See how it works
            </a>
          </div>
          <p className="mt-8 max-w-md text-sm leading-6 text-white/60">
            The guest owns the stars, the wording, and the final tap on Post.
            Zust Scan never submits the review.
          </p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-sm sm:p-6">
          <p className="text-xs font-semibold tracking-[0.16em] text-white/50 uppercase">
            A guest’s path
          </p>
          <ol className="mt-5 space-y-3">
            {[
              ["Service", "Food"],
              ["Product", "Biryani"],
              ["How it felt", "Better · 4 stars"],
            ].map(([label, value], index) => (
              <li
                key={label}
                className="flex items-center gap-4 rounded-2xl bg-white px-4 py-3 text-ink"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <span>
                  <span className="block text-xs text-muted">{label}</span>
                  <span className="block font-semibold">{value}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm leading-6 text-white/60">
            Scan to share, review to care.
          </p>
        </div>
      </div>
    </section>
  );
}
