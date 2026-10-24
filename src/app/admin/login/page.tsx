import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { hasAdminSession } from "@/lib/admin-session";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-navy px-4 text-white/70">
          <p>Loading…</p>
        </div>
      }
    >
      <LoginGate />
    </Suspense>
  );
}

async function LoginGate() {
  if (await hasAdminSession()) redirect("/admin");
  return <LoginForm />;
}
