import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { AdminPageSkeleton } from "@/components/loading/admin-page-skeleton";
import { hasAdminSession } from "@/lib/admin-session";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <Suspense
      fallback={<AdminPageSkeleton variant="login" />}
    >
      <LoginGate />
    </Suspense>
  );
}

async function LoginGate() {
  if (await hasAdminSession()) redirect("/admin");
  return <LoginForm />;
}
