import { WhyTrustUsInfo } from "@/components/guest/why-trust-us";
import { BusinessOwnerMark } from "@/components/initials-badge";

export function GuestPageHeader({
  businessName,
  loginId,
  logoUrl,
  title,
  detail,
  addressLine,
  phone,
  contactPhone,
  whyTrustUs,
}: {
  businessName: string | null;
  loginId: string;
  logoUrl: string | null;
  title: string;
  detail?: string | null;
  addressLine?: string | null;
  phone?: string | null;
  contactPhone?: string | null;
  whyTrustUs?: string | null;
}) {
  return (
    <div className="bg-white px-4 py-6 text-ink sm:px-6">
      <div className="flex items-start gap-4">
        <BusinessOwnerMark
          businessName={businessName}
          loginId={loginId}
          logoUrl={logoUrl}
          size="lg"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="caption-1 text-muted">Share your experience</p>
            {whyTrustUs ? <WhyTrustUsInfo text={whyTrustUs} /> : null}
          </div>
          <h1 className="heading-3 mt-2 max-w-[680px]">
            <span className="hero-heading">{title}</span>
          </h1>
          {detail ? <p className="body-2 mt-2 text-ink">{detail}</p> : null}
          {addressLine ? <p className="body-2 mt-2 text-muted">{addressLine}</p> : null}
          {contactPhone && phone ? (
            <a href={`tel:${phone}`} className="body-2 mt-2 block text-ink">
              {contactPhone}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
