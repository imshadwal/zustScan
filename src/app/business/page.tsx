import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { BusinessHeader } from "@/components/business/header";
import { DashboardHome } from "@/components/business/dashboard-home";
import { BusinessPageSkeleton } from "@/components/loading/business-page-skeleton";
import { getBusinessSessionLoginId } from "@/lib/business-session";
import { getBusinessOwnerProfile, listServicesForOwner } from "@/lib/business-owners";
import { getGuestAnalyticsForLogin } from "@/lib/guest-analytics";
import { guestPageUrlForStandeeType } from "@/lib/guest-urls";

export const metadata: Metadata = { title: "Dashboard" };

export default function BusinessHomePage() {
  return (
    <Suspense
      fallback={<BusinessPageSkeleton variant="dashboard" />}
    >
      <BusinessHomeGate />
    </Suspense>
  );
}

async function BusinessHomeGate() {
  const loginId = await getBusinessSessionLoginId();
  if (!loginId) redirect("/business/login");

  const profile = await getBusinessOwnerProfile(loginId);
  if (!profile) redirect("/business/login");

  const isEvent = profile.standeeType === "event";
  const services = isEvent ? [] : await listServicesForOwner(loginId);
  const serviceCount = isEvent
    ? (profile.eventChecklist?.hasArea ? 1 : 0)
    : services.length;
  const productCount = isEvent ? 0 : services.reduce((sum, s) => sum + s.products.length, 0);
  const guestAnalytics = await getGuestAnalyticsForLogin(loginId);

  return (
    <>
      <BusinessHeader
        businessName={profile.businessName}
        loginId={profile.loginId}
        logoUrl={profile.logoUrl}
        standeeType={profile.standeeType}
      />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <DashboardHome
          businessName={profile.businessName}
          loginId={profile.loginId}
          logoUrl={profile.logoUrl}
          checklist={profile.checklist}
          serviceCount={serviceCount}
          productCount={productCount}
          guestUrl={guestPageUrlForStandeeType(profile.loginId, profile.standeeType)}
          standeeType={profile.standeeType}
          eventChecklist={profile.eventChecklist}
          guestAnalytics={guestAnalytics}
        />
      </main>
    </>
  );
}
