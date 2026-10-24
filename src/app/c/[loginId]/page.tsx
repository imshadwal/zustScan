import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { GuestShell } from "@/components/guest/shell";
import { LogoSpinnerPage } from "@/components/loading/logo-spinner";
import { displayTitle } from "@/lib/initials";
import { GuestReviewFlow } from "@/components/guest/review-flow";
import { findBusinessOwnerPublic, loadGuestExperience } from "@/lib/business-owners";

export const metadata: Metadata = {
  title: "Guest page | Zust Scan",
  robots: { index: false, follow: false },
};

export default function GuestPageRoute({
  params,
}: {
  params: Promise<{ loginId: string }>;
}) {
  return (
    <Suspense
      fallback={<LogoSpinnerPage theme="light" />}
    >
      <GuestPage params={params} />
    </Suspense>
  );
}

async function GuestPage({ params }: { params: Promise<{ loginId: string }> }) {
  const { loginId } = await params;
  let owner: Awaited<ReturnType<typeof findBusinessOwnerPublic>> = null;
  let unavailable = false;
  try {
    owner = await findBusinessOwnerPublic(loginId);
  } catch {
    unavailable = true;
  }

  if (unavailable) {
    return (
      <GuestShell>
        <h1 className="text-2xl font-semibold">This page is not available right now.</h1>
        <p className="mt-3 text-muted">Please try again later.</p>
      </GuestShell>
    );
  }

  if (!owner) notFound();

  const title = displayTitle(owner.businessName, owner.loginId);

  if (!owner.setupComplete) {
    return (
      <GuestShell>
        <p className="text-sm font-semibold tracking-wide text-blue uppercase">Business</p>
        <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
        <p className="mt-4 text-muted">
          This business is still finishing setup. Scan again once they are ready for reviews.
        </p>
      </GuestShell>
    );
  }

  let experience: Awaited<ReturnType<typeof loadGuestExperience>> = null;
  try {
    experience = await loadGuestExperience(loginId);
  } catch {
    return (
      <GuestShell>
        <h1 className="text-2xl font-semibold">This page is not available right now.</h1>
        <p className="mt-3 text-muted">Please try again later.</p>
      </GuestShell>
    );
  }

  if (!experience) {
    return (
      <GuestShell>
        <p className="text-sm font-semibold tracking-wide text-blue uppercase">Business</p>
        <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
        <p className="mt-4 text-muted">
          Setup is marked complete but services or products are missing. The owner should open
          Services in their portal and try again.
        </p>
      </GuestShell>
    );
  }

  return (
    <GuestShell>
      <GuestReviewFlow experience={experience} />
    </GuestShell>
  );
}
