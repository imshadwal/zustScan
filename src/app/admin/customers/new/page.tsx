import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/header";
import { CustomerForm } from "@/components/admin/customer-form";
import { hasAdminSession } from "@/lib/admin-session";
import { siteOrigin } from "@/lib/customer-id";

export const metadata: Metadata = { title: "New customer" };

export default function NewCustomerPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center px-4">
          <p className="text-white/70">Loading…</p>
        </div>
      }
    >
      <NewCustomerGate />
    </Suspense>
  );
}

async function NewCustomerGate() {
  if (!(await hasAdminSession())) redirect("/admin/login");
  return (
    <>
      <AdminHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <CustomerForm siteOrigin={siteOrigin()} />
      </main>
    </>
  );
}
