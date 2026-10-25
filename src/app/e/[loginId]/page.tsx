import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { EventGuestReviewFlow } from "@/components/guest/event-review-flow";
import { GuestShell } from "@/components/guest/shell";
import { LogoSpinnerPage } from "@/components/loading/logo-spinner";
import { GuestQrPausedCard } from "@/components/guest/qr-paused";
import { loadEventGuestExperience } from "@/lib/business-events";
import { findBusinessOwnerPublic } from "@/lib/business-owners";
import { displayGuestBusinessTitle } from "@/lib/initials";

export const metadata: Metadata = {
  title: "Event guest page | Zust Scan",
  robots: { index: false, follow: false },
};

export default function EventGuestPageRoute({
  params,
}: {
  params: Promise<{ loginId: string }>;
}) {
  return (
    <Suspense fallback={<LogoSpinnerPage theme="light" />}>
      <EventGuestPage params={params} />
    </Suspense>
  );
}

async function EventGuestPage({ params }: { params: Promise<{ loginId: string }> }) {
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

  if (owner.standeeType === "table") {
    redirect(`/c/${owner.loginId}`);
  }

  const title = displayGuestBusinessTitle(owner.businessName, owner.loginId, owner.city);

  if (!owner.qrActive) {
    return (
      <GuestShell center>
        <GuestQrPausedCard businessTitle={title} loginId={owner.loginId} />
      </GuestShell>
    );
  }

  let experience: Awaited<ReturnType<typeof loadEventGuestExperience>> = null;
  try {
    experience = await loadEventGuestExperience(loginId);
  } catch {
    return (
      <GuestShell>
        <h1 className="text-2xl font-semibold">This page is not available right now.</h1>
        <p className="mt-3 text-muted">Please try again later.</p>
      </GuestShell>
    );
  }

  if (experience) {
    return (
      <GuestShell themeId={experience.guestThemeId}>
        <EventGuestReviewFlow experience={experience} />
      </GuestShell>
    );
  }

  if (!owner.setupComplete) {
    return (
      <GuestShell>
        <p className="text-sm font-semibold tracking-wide text-blue uppercase">Event</p>
        <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
        <p className="mt-4 text-muted">
          This event page is still being set up. Scan again once the venue finishes profile and
          event details.
        </p>
      </GuestShell>
    );
  }

  return (
    <GuestShell>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-4 text-muted">
        Setup looks complete but the event page could not load. The venue should check event name,
        date, and areas in the business portal.
      </p>
    </GuestShell>
  );
}
