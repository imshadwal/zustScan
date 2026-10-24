import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { LogoSpinnerPage } from "@/components/loading/logo-spinner";
import { hasAdminSession } from "@/lib/admin-session";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <Suspense
      fallback={<LogoSpinnerPage theme="dark" />}
    >
      <LoginGate />
    </Suspense>
  );
}

async function LoginGate() {
  if (await hasAdminSession()) redirect("/admin");
  return <LoginForm />;
}
