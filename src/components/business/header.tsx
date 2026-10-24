"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OwnerIdentity } from "@/components/initials-badge";

export function BusinessHeader({
  businessName,
  loginId,
}: {
  businessName: string | null;
  loginId: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    await fetch("/api/business/logout", { method: "POST" }).catch(() => null);
    router.push("/business/login");
    router.refresh();
  }

  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/business" className="shrink-0">
          <Image
            src="/logo-on-dark.png"
            alt="Zust Scan"
            width={1493}
            height={675}
            className="h-10 w-auto"
          />
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden text-white sm:block">
            <OwnerIdentity businessName={businessName} loginId={loginId} size="sm" />
          </div>
          <nav className="flex items-center gap-2 text-sm font-semibold">
            <Link href="/business/profile" className="rounded-full px-3 py-2 text-white/80 hover:text-white">
              Profile
            </Link>
            <Link href="/business/services" className="rounded-full px-3 py-2 text-white/80 hover:text-white">
              Services
            </Link>
          </nav>
          <button
            type="button"
            onClick={signOut}
            disabled={pending}
            className="inline-flex h-10 cursor-pointer items-center rounded-full px-3 text-sm font-semibold text-white/80 hover:text-white disabled:opacity-60"
          >
            {pending ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </div>
    </header>
  );
}
