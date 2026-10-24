import {
  launchOfferEndsLabel,
  launchOfferFinePrint,
  launchOfferHeadline,
  launchOfferSavings,
  listPrice,
  price,
} from "@/lib/site";

export function LaunchOfferNote({
  variant = "light",
  className = "",
}: {
  variant?: "light" | "onBlue";
  className?: string;
}) {
  const onBlue = variant === "onBlue";
  return (
    <div className={className}>
      <p
        className={
          onBlue
            ? "inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-white"
            : "inline-flex rounded-full bg-blue/10 px-3 py-1 text-xs font-semibold text-blue"
        }
      >
        {launchOfferHeadline}
      </p>
      <p
        className={`mt-3 text-sm leading-6 ${onBlue ? "text-white/85" : "text-muted"}`}
      >
        <span className={onBlue ? "text-white line-through opacity-70" : "line-through"}>
          {listPrice}
        </span>{" "}
        <span className={`font-semibold ${onBlue ? "text-white" : "text-ink"}`}>{price}</span>
        {" · "}
        Save {launchOfferSavings} · Offer through{" "}
        <span className={onBlue ? "font-semibold text-white" : "font-semibold text-ink"}>
          {launchOfferEndsLabel}
        </span>
      </p>
      <p className={`mt-2 text-xs leading-5 ${onBlue ? "text-white/70" : "text-muted"}`}>
        {launchOfferFinePrint}
      </p>
    </div>
  );
}
