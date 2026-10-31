import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { GuestPageSkeleton } from "@/components/guest/guest-page-skeleton";
import { GuestShell } from "@/components/guest/shell";
import { displayGuestBusinessTitle } from "@/lib/initials";
import { GuestQrPausedCard } from "@/components/guest/qr-paused";
import { GuestReviewFlow } from "@/components/guest/review-flow";
import { loadTableGuestPage } from "@/lib/business-owners";

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
      fallback={
        <GuestShell>
          <GuestPageSkeleton stepCount={4} />
        </GuestShell>
      }
    >
      <GuestPage params={params} />
    </Suspense>
  );
}

async function GuestPage({ params }: { params: Promise<{ loginId: string }> }) {
  const { loginId } = await params;
  let page: Awaited<ReturnType<typeof loadTableGuestPage>>;
  try {
    page = await loadTableGuestPage(loginId);
  } catch {
    return (
      <GuestShell>
        <h1 className="text-2xl font-semibold">This page is not available right now.</h1>
        <p className="mt-3 text-muted">Please try again later.</p>
      </GuestShell>
    );
  }

  if (page.status === "not_found") notFound();
  if (page.status === "event") redirect(`/e/${page.loginId}`);

  if (page.status === "ready") {
    return (
      <GuestShell themeId={page.experience.guestThemeId}>
        <GuestReviewFlow experience={page.experience} />
      </GuestShell>
    );
  }

  const title = displayGuestBusinessTitle(page.businessName, page.loginId, page.city);

  if (page.status === "qr_paused") {
    return (
      <GuestShell center>
        <GuestQrPausedCard businessTitle={title} loginId={page.loginId} />
      </GuestShell>
    );
  }

  if (page.status === "setup_incomplete") {
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

  return (
    <GuestShell>
      <p className="text-sm font-semibold tracking-wide text-blue uppercase">Business</p>
      <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
      <p className="mt-4 text-muted">
        Setup looks complete but the guest page could not load. The owner should open Services in
        their portal and save profile again.
      </p>
    </GuestShell>
  );
}
