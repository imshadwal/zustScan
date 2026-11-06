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
            ? "caption-5 inline-flex rounded-full bg-white/15 px-3 py-1 text-white"
            : "caption-5 inline-flex rounded-full bg-blue/10 px-3 py-1 text-blue"
        }
      >
        {launchOfferHeadline}
      </p>
      <p
        className={`body-3 mt-3 ${onBlue ? "text-white/80" : "text-muted"}`}
      >
        <span className={onBlue ? "text-white/80 line-through" : "line-through"}>
          {listPrice}
        </span>{" "}
        <span className={`font-semibold ${onBlue ? "text-white" : "text-ink"}`}>{price}</span>
        {" · "}
        Save {launchOfferSavings} · Offer through{" "}
        <span className={onBlue ? "font-semibold text-white" : "font-semibold text-ink"}>
          {launchOfferEndsLabel}
        </span>
      </p>
      <p className={`caption-5 mt-2 ${onBlue ? "text-white/80" : "text-muted"}`}>
        {launchOfferFinePrint}
      </p>
    </div>
  );
}
