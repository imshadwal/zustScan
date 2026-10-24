import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { GuestShell } from "@/components/guest/shell";
import { findCustomer } from "@/lib/customers";

export const metadata: Metadata = {
  title: "Guest page | Zust Scan",
  robots: { index: false, follow: false },
};

export default function CustomerPage({
  params,
}: {
  params: Promise<{ loginId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <GuestShell>
          <p className="text-muted">Loading…</p>
        </GuestShell>
      }
    >
      <GuestPage params={params} />
    </Suspense>
  );
}

async function GuestPage({ params }: { params: Promise<{ loginId: string }> }) {
  const { loginId } = await params;
  let customer: { loginId: string } | null = null;
  let unavailable = false;
  try {
    customer = await findCustomer(loginId);
  } catch {
    unavailable = true;
  }

  if (unavailable) {
    return (
      <GuestShell>
        <h1 className="text-2xl font-semibold">This page is not available right now.</h1>
        <p className="mt-3 text-muted">The guest steps for this business are not ready.</p>
      </GuestShell>
    );
  }

  if (!customer) notFound();

  return (
    <GuestShell>
      <p className="text-sm font-semibold tracking-wide text-blue uppercase">Business</p>
      <h1 className="mt-2 text-3xl font-semibold">{customer.loginId}</h1>
      <p className="mt-4 text-muted">Guest steps for this business come next.</p>
    </GuestShell>
  );
}
