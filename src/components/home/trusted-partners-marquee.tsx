"use client";

import Link from "next/link";
import { BusinessOwnerMark } from "@/components/initials-badge";
import type { PublicBusinessListing } from "@/lib/business-owners";

const tileClassName =
  "group flex h-20 w-44 shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-[0_2px_12px_rgba(7,20,40,0.06)] transition-shadow hover:shadow-[0_8px_24px_rgba(7,20,40,0.1)] sm:h-24 sm:w-52";

function PartnerLogoInner({ business }: { business: PublicBusinessListing }) {
  if (business.logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={business.logoUrl}
        alt=""
        className="max-h-12 max-w-full object-contain opacity-90 transition-opacity group-hover:opacity-100 sm:max-h-14"
      />
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-2 px-1">
      <BusinessOwnerMark
        businessName={business.businessName}
        loginId={business.loginId}
        logoUrl={null}
        size="sm"
      />
      <span className="truncate text-sm font-semibold text-ink">{business.businessName}</span>
    </div>
  );
}

function PartnerLogo({
  business,
  interactive = true,
}: {
  business: PublicBusinessListing;
  interactive?: boolean;
}) {
  if (!interactive) {
    return (
      <div className={tileClassName} aria-hidden="true">
        <PartnerLogoInner business={business} />
      </div>
    );
  }

  const href =
    business.standeeType === "event" ? `/e/${business.loginId}` : `/c/${business.loginId}`;

  return (
    <Link href={href} className={tileClassName} title={business.businessName}>
      <PartnerLogoInner business={business} />
    </Link>
  );
}

function LogoRow({
  partners,
  rowKey,
  clone,
}: {
  partners: PublicBusinessListing[];
  rowKey: string;
  clone?: boolean;
}) {
  return (
    <div
      className={`flex shrink-0 items-center gap-5 pr-5 sm:gap-6 sm:pr-6 ${clone ? "pointer-events-none" : ""}`}
      aria-hidden={clone || undefined}
    >
      {partners.map((business, index) => (
        <PartnerLogo
          key={`${rowKey}-${business.loginId}-${index}`}
          business={business}
          interactive={!clone}
        />
      ))}
    </div>
  );
}

/** Repeat logos so one track fills wide screens (seamless -50% loop). */
function expandForMarquee(partners: PublicBusinessListing[], minCount = 10) {
  if (partners.length === 0) return partners;
  const row: PublicBusinessListing[] = [];
  while (row.length < minCount) {
    row.push(...partners);
  }
  return row;
}

export function TrustedPartnersMarquee({ partners }: { partners: PublicBusinessListing[] }) {
  const row = expandForMarquee(partners);

  return (
    <div className="trusted-marquee-viewport relative mt-10 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-28"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-28"
        aria-hidden="true"
      />
      <div className="trusted-marquee-track flex w-max will-change-transform">
        <LogoRow partners={row} rowKey="a" />
        <LogoRow partners={row} rowKey="a-clone" clone />
      </div>
    </div>
  );
}
