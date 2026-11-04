import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { BusinessHeader } from "@/components/business/header";
import { FounderForm } from "@/components/business/founder-fields";
import { BusinessPageSkeleton } from "@/components/loading/business-page-skeleton";
import { getBusinessSessionLoginId } from "@/lib/business-session";
import { getBusinessOwnerProfile } from "@/lib/business-owners";

export const metadata: Metadata = { title: "Founder" };

export default function BusinessFounderPage() {
  return (
    <Suspense fallback={<BusinessPageSkeleton variant="form" />}>
      <FounderGate />
    </Suspense>
  );
}

async function FounderGate() {
  const loginId = await getBusinessSessionLoginId();
  if (!loginId) redirect("/business/login");

  const profile = await getBusinessOwnerProfile(loginId, { refreshChecklist: false });
  if (!profile) redirect("/business/login");

  return (
    <>
      <BusinessHeader
        businessName={profile.businessName}
        loginId={profile.loginId}
        standeeType={profile.standeeType}
      />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-white">Founder details</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/70">
          Turn this on when guests should be able to flip the review form and see the founder card.
        </p>
        <div className="mt-6 max-w-3xl">
          <FounderForm
            initial={{
              founderVisible: profile.founderVisible,
              founderName: profile.founderName,
              founderRole: profile.founderRole,
              founderPhone: profile.founderPhone,
              founderEmail: profile.founderEmail,
              founderNote: profile.founderNote,
              founderPhotoUrl: profile.founderPhotoUrl,
            }}
          />
        </div>
      </main>
    </>
  );
}
