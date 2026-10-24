import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/header";
import { OwnerList } from "@/components/admin/owner-list";
import { LogoSpinnerPage } from "@/components/loading/logo-spinner";
import { hasAdminSession } from "@/lib/admin-session";
import { listBusinessOwners } from "@/lib/business-owners";
import { formatCreatedAt, formatRupees, siteOrigin } from "@/lib/login-id";
import { OwnerStoreError } from "@/lib/store-error";

export const metadata: Metadata = { title: "Business owners" };

export default function AdminPage() {
  return (
    <Suspense
      fallback={<LogoSpinnerPage theme="dark" />}
    >
      <OwnersGate />
    </Suspense>
  );
}

async function OwnersGate() {
  if (!(await hasAdminSession())) redirect("/admin/login");

  let owners: {
    loginId: string;
    businessName: string | null;
    createdAtLabel: string;
    soldPriceLabel: string;
    setupComplete: boolean;
  }[] = [];
  let totalLabel = formatRupees(0);
  let message: string | null = null;
  try {
    const rows = await listBusinessOwners();
    owners = rows.map((owner) => ({
      loginId: owner.loginId,
      businessName: owner.businessName,
      createdAtLabel: formatCreatedAt(owner.createdAt),
      soldPriceLabel: formatRupees(owner.soldPrice),
      setupComplete: owner.setupComplete,
    }));
    totalLabel = formatRupees(rows.reduce((sum, owner) => sum + owner.soldPrice, 0));
  } catch (error) {
    message =
      error instanceof OwnerStoreError
        ? error.message
        : "Business owners could not be loaded.";
  }

  return (
    <>
      <AdminHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <OwnerList
          owners={owners}
          siteOrigin={siteOrigin()}
          totalLabel={totalLabel}
          notice={message}
        />
      </main>
    </>
  );
}
