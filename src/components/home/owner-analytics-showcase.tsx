import Link from "next/link";
import { quietButtonClass } from "@/components/admin/styles";
import { GuestAnalyticsStats } from "@/components/home/guest-analytics-stats";
import { homeCardClass, homeCardsSection } from "@/components/home/styles";
import {
  marketingAnalyticsDemo,
  ownerAnalyticsBody,
  ownerAnalyticsTitle,
} from "@/lib/site";

export function OwnerAnalyticsShowcase({ className = "" }: { className?: string }) {
  return (
    <section id="owner-analytics" className={`${homeCardsSection} ${className}`}>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
              Owner portal
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {ownerAnalyticsTitle}
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted">{ownerAnalyticsBody}</p>
            <ul className="mt-6 space-y-2 text-sm leading-6 text-muted">
              <li className="flex gap-2">
                <span className="font-semibold text-blue">Scans</span>
                <span>— guest opened your page from the QR</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-blue">Drafts</span>
                <span>— AI review text generated from their picks</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-blue">Copy &amp; Continue</span>
                <span>— copied draft and opened Google</span>
              </li>
            </ul>
            <Link href="/pricing" className={`${quietButtonClass} mt-8 inline-flex`}>
              See pricing &amp; FAQ
            </Link>
          </div>

          <div
            className={`overflow-hidden ${homeCardClass} !rounded-[28px] !border-slate-300 !p-0`}
          >
            <div className="bg-navy px-5 py-4 text-white sm:px-6">
              <p className="text-xs font-semibold tracking-wide text-white/70 uppercase">
                Business dashboard
              </p>
              <p className="mt-1 text-lg font-semibold">Guest activity</p>
              <p className="mt-1 text-xs text-white/60">Sample week — illustrative only</p>
            </div>
            <div className="bg-gradient-to-b from-navy/95 to-[#0a1a32] px-5 py-6 sm:px-6">
              <GuestAnalyticsStats variant="dark" counts={marketingAnalyticsDemo} />
            </div>
            <p className="border-t border-slate-200 bg-mist px-5 py-3 text-center text-xs text-muted">
              Same metrics appear in your portal after setup — no guest PII stored.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Compact stats row for brochure / print layouts. */
export function OwnerAnalyticsDemoStrip({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-wide text-blue">Guest activity</p>
      <p className="mt-1 text-sm text-muted">What owners see in the portal (anonymous counts)</p>
      <div className="mt-4">
        <GuestAnalyticsStats counts={marketingAnalyticsDemo} />
      </div>
      <p className="mt-3 text-xs text-muted">
        Illustrative example — your numbers update as guests use your QR.
      </p>
    </div>
  );
}
