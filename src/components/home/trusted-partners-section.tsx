import { Suspense } from "react";
import { TrustedPartnersMarquee } from "@/components/home/trusted-partners-marquee";
import { listPublicBusinesses } from "@/lib/business-owners";
import { trustedPartnersHeadline, trustedPartnersSubline } from "@/lib/site";

async function TrustedPartnersContent() {
  const businesses = await listPublicBusinesses();
  const partners = businesses.length > 0 ? businesses : null;

  return (
    <section
      aria-labelledby="trusted-partners-heading"
      className="border-y border-slate-200/80 bg-white py-14 sm:py-16"
    >
      <div className="mx-auto max-w-6xl px-5 text-center sm:px-6">
        <h2
          id="trusted-partners-heading"
          className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-4xl"
        >
          {trustedPartnersHeadline}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
          {trustedPartnersSubline}
        </p>
      </div>

      {partners ? (
        <TrustedPartnersMarquee partners={partners} />
      ) : (
        <p className="mx-auto mt-8 max-w-md px-5 text-center text-sm text-muted">
          Live guest pages appear here as businesses finish setup.
        </p>
      )}
    </section>
  );
}

export function TrustedPartnersSection() {
  return (
    <Suspense fallback={null}>
      <TrustedPartnersContent />
    </Suspense>
  );
}
