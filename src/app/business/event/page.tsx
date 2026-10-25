import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { BusinessHeader } from "@/components/business/header";
import { EventSetupManager } from "@/components/business/event-setup-manager";
import { LogoSpinnerPage } from "@/components/loading/logo-spinner";
import { getBusinessOwnerProfile } from "@/lib/business-owners";
import { getBusinessSessionLoginId } from "@/lib/business-session";

export const metadata: Metadata = { title: "Event setup" };

export default function BusinessEventPage() {
  return (
    <Suspense fallback={<LogoSpinnerPage theme="dark" />}>
      <EventGate />
    </Suspense>
  );
}

async function EventGate() {
  const loginId = await getBusinessSessionLoginId();
  if (!loginId) redirect("/business/login");

  const profile = await getBusinessOwnerProfile(loginId);
  if (!profile) redirect("/business/login");
  if (profile.standeeType !== "event") redirect("/business/services");

  return (
    <>
      <BusinessHeader
        businessName={profile.businessName}
        loginId={profile.loginId}
        logoUrl={profile.logoUrl}
        standeeType="event"
      />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-white">Event setup</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">
          Set the event name and date guests see on{" "}
          <span className="font-medium text-white">/e/{profile.loginId}</span>. Edit these when you
          host another function.
        </p>
        <div className="mt-6">
          <EventSetupManager
            initialEventName={profile.eventName ?? ""}
            initialEventDate={profile.eventDate}
            initialAreas={profile.eventAreas}
          />
        </div>
      </main>
    </>
  );
}
