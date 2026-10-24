import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/header";
import { OwnerForm } from "@/components/admin/owner-form";
import { LogoSpinnerPage } from "@/components/loading/logo-spinner";
import { hasAdminSession } from "@/lib/admin-session";
import { siteOrigin } from "@/lib/login-id";

export const metadata: Metadata = { title: "New business owner" };

export default function NewOwnerPage() {
  return (
    <Suspense
      fallback={<LogoSpinnerPage theme="dark" />}
    >
      <NewOwnerGate />
    </Suspense>
  );
}

async function NewOwnerGate() {
  if (!(await hasAdminSession())) redirect("/admin/login");
  return (
    <>
      <AdminHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <OwnerForm siteOrigin={siteOrigin()} />
      </main>
    </>
  );
}
