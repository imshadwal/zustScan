import Link from "next/link";
import { homeCardClass, homeCardsSection } from "@/components/home/styles";

const pages = [
  {
    href: "/how-it-works",
    step: "01",
    eyebrow: "How it works",
    title: "Six steps, from the QR to the post.",
    body: "See the full guest path and what you configure on your side.",
    accent: "from-blue/10 to-white",
  },
  {
    href: "/who-its-for",
    step: "02",
    eyebrow: "Who it’s for",
    title: "Any business a guest can review.",
    body: "Restaurants, hotels, retail, and service businesses with real examples.",
    accent: "from-navy/5 to-white",
  },
] as const;

export function HomeExplore() {
  return (
    <section className={homeCardsSection}>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:py-24">
        <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
          Explore
        </p>
        <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          How Zust Scan fits your business.
        </h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {pages.map((page) => (
            <li key={page.href}>
              <Link
                href={page.href}
                className={`group relative flex h-full flex-col overflow-hidden p-6 sm:p-8 ${homeCardClass} transition-all hover:border-blue/40 hover:shadow-[0_20px_56px_rgba(7,20,40,0.12)]`}
              >
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${page.accent}`}
                  aria-hidden="true"
                />
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue text-sm font-semibold text-white">
                    {page.step}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-mist px-3 py-1 text-[11px] font-semibold tracking-wide text-muted uppercase">
                    {page.eyebrow}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-ink sm:text-2xl">{page.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-muted">{page.body}</p>
                <span className="mt-8 inline-flex h-11 w-fit items-center gap-2 rounded-full bg-blue/10 px-5 text-sm font-semibold text-blue transition-colors group-hover:bg-blue group-hover:text-white">
                  Read more
                  <span
                    className="transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
