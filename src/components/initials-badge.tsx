import { displayInitials, displayTitle } from "@/lib/initials";

export function InitialsBadge({
  businessName,
  loginId,
  size = "md",
}: {
  businessName: string | null | undefined;
  loginId: string;
  size?: "sm" | "md";
}) {
  const initials = displayInitials(businessName, loginId);
  const sizeClass = size === "sm" ? "h-9 w-9 text-xs" : "h-11 w-11 text-sm";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-blue font-semibold text-white ${sizeClass}`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export function OwnerIdentity({
  businessName,
  loginId,
  size = "md",
}: {
  businessName: string | null | undefined;
  loginId: string;
  size?: "sm" | "md";
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <InitialsBadge businessName={businessName} loginId={loginId} size={size} />
      <span className="truncate font-semibold">{displayTitle(businessName, loginId)}</span>
    </div>
  );
}
