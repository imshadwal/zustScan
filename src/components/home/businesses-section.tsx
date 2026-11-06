import Link from "next/link";
import { Suspense } from "react";
import { BusinessCardsStripSkeleton } from "@/components/loading/marketing-page-skeleton";
import { BusinessOwnerMark } from "@/components/initials-badge";
import { homeCardClass, homeCardsSection } from "@/components/home/styles";
import { listPublicBusinesses } from "@/lib/business-owners";

async function BusinessesList() {
  const businesses = await listPublicBusinesses();
  if (businesses.length === 0) return null;

  return (
    <section id="businesses" className={homeCardsSection}>
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:py-16">
        <p className="caption-1 text-muted">On Zust Scan</p>
        <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Businesses ready for guest reviews
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted sm:text-base">
          Setup complete — tap a business to preview its guest QR page.
        </p>

        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {businesses.map((business) => (
            <li key={business.loginId}>
              <Link
                href={
                  business.standeeType === "event"
                    ? `/e/${business.loginId}`
                    : `/c/${business.loginId}`
                }
                className={`group flex items-center gap-4 p-6 ${homeCardClass}`}
              >
                <BusinessOwnerMark
                  businessName={business.businessName}
                  loginId={business.loginId}
                  logoUrl={business.logoUrl}
                  size="sm"
                />
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#3dde7a]"
                      aria-hidden="true"
                    />
                    <span className="truncate">{business.businessName}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted">Live · guest page</p>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 shrink-0 text-blue"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h12M13 6l6 6-6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="sr-only">View {business.businessName} guest page</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function BusinessesSection() {
  return (
    <Suspense fallback={<BusinessCardsStripSkeleton />}>
      <BusinessesList />
    </Suspense>
  );
}
