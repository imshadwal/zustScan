import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { BusinessHeader } from "@/components/business/header";
import { ServicesManager } from "@/components/business/services-manager";
import { LogoSpinnerPage } from "@/components/loading/logo-spinner";
import { getBusinessSessionLoginId } from "@/lib/business-session";
import { getBusinessOwnerProfile, listServicesForOwner } from "@/lib/business-owners";

export const metadata: Metadata = { title: "Services" };

export default function BusinessServicesPage() {
  return (
    <Suspense
      fallback={<LogoSpinnerPage theme="dark" />}
    >
      <ServicesGate />
    </Suspense>
  );
}

async function ServicesGate() {
  const loginId = await getBusinessSessionLoginId();
  if (!loginId) redirect("/business/login");

  const profile = await getBusinessOwnerProfile(loginId);
  if (!profile) redirect("/business/login");

  const services = await listServicesForOwner(loginId);

  return (
    <>
      <BusinessHeader businessName={profile.businessName} loginId={profile.loginId} />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-white">Services & products</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">
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
