import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { BusinessHeader } from "@/components/business/header";
import { ProfileForm } from "@/components/business/profile-form";
import { LogoSpinnerPage } from "@/components/loading/logo-spinner";
import { getBusinessSessionLoginId } from "@/lib/business-session";
import { listBusinessCategoryOptions } from "@/lib/business-category-options";
import { getBusinessOwnerProfile } from "@/lib/business-owners";
import { resolveGuestTheme } from "@/lib/guest-themes";

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

  const [profile, categories] = await Promise.all([
    getBusinessOwnerProfile(loginId),
    listBusinessCategoryOptions(),
  ]);
  if (!profile) redirect("/business/login");

  return (
    <>
      <BusinessHeader
        businessName={profile.businessName}
        loginId={profile.loginId}
        logoUrl={profile.logoUrl}
        standeeType={profile.standeeType}
      />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-white">Business profile</h1>
        <p className="mt-2 text-sm text-white/70">
          {profile.standeeType === "event"
            ? "Venue name, contact, and Google review link for your event standee. Event name, date, and guest areas are on Event setup."
            : "Complete profile, category, and services for guest QR setup."}
        </p>
        <div className="mt-6">
          <ProfileForm
            categories={categories}
            standeeType={profile.standeeType}
            initial={{
              businessName: profile.businessName,
              city: profile.city,
              businessCategory: profile.businessCategory,
              businessCategoryOther: profile.businessCategoryOther,
              address: profile.address,
              whyTrustUs: profile.whyTrustUs,
              phone: profile.phone,
              mapLink: profile.mapLink,
              guestThemeId: resolveGuestTheme(profile.guestThemeId).id,
              logoUrl: profile.logoUrl,
            }}
          />
        </div>
      </main>
    </>
  );
}
