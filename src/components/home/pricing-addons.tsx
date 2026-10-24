import { homeCardClass } from "@/components/home/styles";
import {
  additionalOutletPrice,
  multiLocationSummary,
  referralDiscountAmount,
  referralProgramSummary,
} from "@/lib/site";

export function PricingAddons({ className = "" }: { className?: string }) {
  return (
    <div className={`mt-10 grid gap-4 sm:grid-cols-2 ${className}`}>
      <div className={`p-6 sm:p-8 ${homeCardClass}`}>
        <p className="text-xs font-semibold tracking-[0.14em] text-blue uppercase">Referral</p>
        <p className="mt-2 text-xl font-semibold text-ink">{referralDiscountAmount} off each</p>
        <p className="mt-3 text-sm leading-7 text-muted">{referralProgramSummary}</p>
        <p className="mt-3 text-xs text-muted">
          Mention the business you referred in your enquiry — we apply credit when both setups are
          live.
        </p>
      </div>
      <div className={`p-6 sm:p-8 ${homeCardClass}`}>
        <p className="text-xs font-semibold tracking-[0.14em] text-blue uppercase">
          Multi-location
        </p>
        <p className="mt-2 text-xl font-semibold text-ink">From {additionalOutletPrice}</p>
        <p className="mt-3 text-sm leading-7 text-muted">{multiLocationSummary}</p>
        <p className="mt-3 text-xs text-muted">
          Tell us how many outlets in the enquiry — we quote each add-on clearly on WhatsApp.
        </p>
      </div>
    </div>
  );
}
