import Link from "next/link";
import { Suspense } from "react";
import { InitialsBadge } from "@/components/initials-badge";
import { listPublicBusinesses } from "@/lib/business-owners";

async function BusinessesList() {
  const businesses = await listPublicBusinesses();
  if (businesses.length === 0) return null;

  return (
    <section id="businesses" className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:py-24">
        <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
          On Zust Scan
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
          Businesses ready for guest reviews
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
          These owners finished setup. Their guests can scan and start the review path from their
          QR page.
        </p>

        <div className="mt-12 rounded-[32px] border-2 border-slate-200 bg-navy p-6 sm:p-8 lg:p-10">
          <p className="text-sm font-semibold text-white/75">Live on Zust Scan</p>
          <ul
            className={`mt-6 grid gap-4 ${
              businesses.length === 1 ? "max-w-xl" : "sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {businesses.map((business) => (
              <li key={business.loginId}>
                <Link
                  href={`/c/${business.loginId}`}
                  className="flex items-center gap-4 rounded-2xl border-2 border-white/15 bg-white p-5 shadow-[0_16px_48px_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-0.5"
                >
                  <InitialsBadge
                    businessName={business.businessName}
                    loginId={business.loginId}
                    size="sm"
                  />
                  <span className="min-w-0 flex-1 font-semibold text-ink">
                    {business.businessName}
                  </span>
                  <span className="hidden shrink-0 text-sm font-semibold text-blue sm:inline">
                    View →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function BusinessesSection() {
  return (
    <Suspense fallback={null}>
      <BusinessesList />
    </Suspense>
  );
}
