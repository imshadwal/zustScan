import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/header";
import { CustomerList } from "@/components/admin/customer-list";
import { hasAdminSession } from "@/lib/admin-session";
import { CustomerStoreError } from "@/lib/customer-error";
import { formatCreatedAt, formatRupees, siteOrigin } from "@/lib/customer-id";
import { listCustomers } from "@/lib/customers";

export const metadata: Metadata = { title: "Customers" };

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center px-4">
          <p className="text-white/70">Loading customers…</p>
        </div>
      }
    >
      <CustomersGate />
    </Suspense>
  );
}

async function CustomersGate() {
  if (!(await hasAdminSession())) redirect("/admin/login");

  let customers: { loginId: string; createdAtLabel: string; soldPriceLabel: string }[] = [];
  let totalLabel = formatRupees(0);
  let message: string | null = null;
  try {
    const rows = await listCustomers();
    customers = rows.map((customer) => ({
      loginId: customer.loginId,
      createdAtLabel: formatCreatedAt(customer.createdAt),
      soldPriceLabel: formatRupees(customer.soldPrice),
    }));
    totalLabel = formatRupees(rows.reduce((sum, customer) => sum + customer.soldPrice, 0));
  } catch (error) {
    message =
      error instanceof CustomerStoreError
        ? error.message
        : "Customers could not be loaded.";
  }

  return (
    <>
      <AdminHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <CustomerList
          customers={customers}
          siteOrigin={siteOrigin()}
          totalLabel={totalLabel}
          notice={message}
        />
      </main>
    </>
  );
}
