import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { BusinessHeader } from "@/components/business/header";
import { DashboardHome } from "@/components/business/dashboard-home";
import { LogoSpinnerPage } from "@/components/loading/logo-spinner";
import { getBusinessSessionLoginId } from "@/lib/business-session";
import { getBusinessOwnerProfile, listServicesForOwner } from "@/lib/business-owners";
import { guestPageUrl } from "@/lib/login-id";

export const metadata: Metadata = { title: "Dashboard" };

export default function BusinessHomePage() {
  return (
    <Suspense
      fallback={<LogoSpinnerPage theme="dark" />}
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

  const services = await listServicesForOwner(loginId);
  const serviceCount = services.length;
  const productCount = services.reduce((sum, service) => sum + service.products.length, 0);

  return (
    <>
      <BusinessHeader businessName={profile.businessName} loginId={profile.loginId} />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <DashboardHome
          businessName={profile.businessName}
          loginId={profile.loginId}
          checklist={profile.checklist}
          serviceCount={serviceCount}
          productCount={productCount}
          guestUrl={guestPageUrl(profile.loginId)}
        />
      </main>
    </>
  );
}
