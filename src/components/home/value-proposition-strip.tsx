import { homeValueStrip } from "@/lib/site";

export function ValuePropositionStrip() {
  return (
    <section
      aria-label="Why Zust Scan"
      className="relative overflow-hidden border-y border-white/10 bg-navy text-white"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(0,102,255,0.18)_0%,transparent_45%,rgba(0,102,255,0.08)_100%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14 lg:py-16">
        <p className="max-w-5xl text-2xl font-semibold leading-snug tracking-tight sm:text-3xl lg:text-4xl lg:leading-tight">
          <span className="text-white">{homeValueStrip.lead}</span>{" "}
          <span className="text-blue">{homeValueStrip.product}</span>
        </p>
        <p className="mt-4 max-w-3xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
          {homeValueStrip.detail}
        </p>
      </div>
    </section>
  );
}
