import Image from "next/image";
import { displayInitials, displayTitle } from "@/lib/initials";

const badgeSizeClass = {
  sm: "h-9 w-9 rounded-full text-xs",
  md: "h-11 w-11 rounded-full text-sm",
  lg: "h-16 w-16 rounded-2xl text-base",
  xl: "h-24 w-24 rounded-3xl text-xl sm:h-28 sm:w-28 sm:text-2xl",
} as const;

const markSizeClass = {
  sm: "h-9 w-9 rounded-full",
  md: "h-14 w-14 rounded-2xl",
  lg: "h-20 w-20 rounded-2xl",
  xl: "h-24 w-24 rounded-3xl sm:h-28 sm:w-28",
} as const;

export function InitialsBadge({
  businessName,
  loginId,
  size = "md",
}: {
  businessName: string | null | undefined;
  loginId: string;
  size?: keyof typeof badgeSizeClass;
}) {
  const initials = displayInitials(businessName, loginId);
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center bg-blue font-semibold text-white ${badgeSizeClass[size]}`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export function BusinessOwnerMark({
  businessName,
  loginId,
  logoUrl,
  size = "md",
}: {
  businessName: string | null | undefined;
  loginId: string;
  logoUrl?: string | null;
  size?: keyof typeof markSizeClass;
}) {
  if (logoUrl?.trim()) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden border border-white/25 bg-white shadow-sm ${markSizeClass[size]}`}
      >
        <Image src={logoUrl} alt="" fill className="object-contain p-1.5" unoptimized />
      </div>
    );
  }
  return <InitialsBadge businessName={businessName} loginId={loginId} size={size} />;
}

const titleSizeClass = {
  sm: "text-sm font-semibold",
  md: "text-base font-semibold sm:text-lg",
  lg: "text-xl font-semibold sm:text-2xl",
  xl: "text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-tight",
} as const;

export function OwnerIdentity({
  businessName,
  loginId,
  logoUrl,
  size = "md",
}: {
  businessName: string | null | undefined;
  loginId: string;
  logoUrl?: string | null;
  size?: keyof typeof titleSizeClass;
}) {
  const markSize =
    size === "xl" ? "xl" : size === "lg" ? "lg" : size === "sm" ? "sm" : "md";
  return (
    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
      <BusinessOwnerMark
        businessName={businessName}
        loginId={loginId}
        logoUrl={logoUrl}
        size={markSize}
      />
      <span className={`min-w-0 truncate ${titleSizeClass[size]}`}>
        {displayTitle(businessName, loginId)}
      </span>
    </div>
  );
}
