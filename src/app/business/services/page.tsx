import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { BusinessHeader } from "@/components/business/header";
import { ServicesManager } from "@/components/business/services-manager";
import { BusinessPageSkeleton } from "@/components/loading/business-page-skeleton";
import { getBusinessSessionLoginId } from "@/lib/business-session";
import { getBusinessOwnerProfile, listServicesForOwner } from "@/lib/business-owners";

export const metadata: Metadata = { title: "Services" };

export default function BusinessServicesPage() {
  return (
    <Suspense
      fallback={<BusinessPageSkeleton variant="services" />}
    >
      <ServicesGate />
    </Suspense>
  );
}

async function ServicesGate() {
  const loginId = await getBusinessSessionLoginId();
  if (!loginId) redirect("/business/login");

  const [profile, services] = await Promise.all([
    getBusinessOwnerProfile(loginId, { refreshChecklist: false }),
    listServicesForOwner(loginId),
  ]);
  if (!profile) redirect("/business/login");
  if (profile.standeeType === "event") redirect("/business/event");

  return (
    <>
      <BusinessHeader
        businessName={profile.businessName}
        loginId={profile.loginId}
      />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="heading-4">Services and products</h1>
        <p className="body-2 mt-2 max-w-2xl text-muted">
          Group what you offer into services, then add products under each. Guests will pick one of
          each after they scan your QR.
        </p>
        <div className="mt-6">
          <ServicesManager initialServices={services} />
        </div>
      </main>
    </>
  );
}
