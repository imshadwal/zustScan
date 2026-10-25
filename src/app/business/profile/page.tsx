import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { BusinessHeader } from "@/components/business/header";
import { ProfileForm } from "@/components/business/profile-form";
import { LogoSpinnerPage } from "@/components/loading/logo-spinner";
import { getBusinessSessionLoginId } from "@/lib/business-session";
import { getBusinessOwnerProfile } from "@/lib/business-owners";

export const metadata: Metadata = { title: "Profile" };

export default function BusinessProfilePage() {
  return (
    <Suspense
      fallback={<LogoSpinnerPage theme="dark" />}
    >
      <ProfileGate />
    </Suspense>
  );
}

async function ProfileGate() {
  const loginId = await getBusinessSessionLoginId();
  if (!loginId) redirect("/business/login");

  const profile = await getBusinessOwnerProfile(loginId);
  if (!profile) redirect("/business/login");

  return (
    <>
      <BusinessHeader businessName={profile.businessName} loginId={profile.loginId} />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-white">Business profile</h1>
        <p className="mt-2 text-sm text-white/70">All fields are required for guest QR setup.</p>
        <div className="mt-6">
          <ProfileForm
            initial={{
              businessName: profile.businessName,
              city: profile.city,
              phone: profile.phone,
              mapLink: profile.mapLink,
              brief: profile.brief,
            }}
          />
        </div>
      </main>
    </>
  );
}
