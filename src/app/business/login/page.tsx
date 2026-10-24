import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { BusinessLoginForm } from "@/components/business/login-form";
import { LogoSpinnerPage } from "@/components/loading/logo-spinner";
import { getBusinessSessionLoginId } from "@/lib/business-session";

export const metadata: Metadata = { title: "Business owner sign in" };

export default function BusinessLoginPage() {
  return (
    <Suspense
      fallback={<LogoSpinnerPage theme="dark" />}
    >
      <LoginGate />
    </Suspense>
  );
}

async function LoginGate() {
  const loginId = await getBusinessSessionLoginId();
  if (loginId) redirect("/business");
  return <BusinessLoginForm />;
}
