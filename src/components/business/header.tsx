"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { OwnerIdentity } from "@/components/initials-badge";

export function BusinessHeader({
  businessName,
  loginId,
  standeeType = "table",
}: {
  businessName: string | null;
  loginId: string;
  standeeType?: "table" | "event";
}) {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);

  const navLinkClass = (href: string) => {
    const active =
      href === "/business"
        ? pathname === "/business"
        : pathname === href || pathname.startsWith(`${href}/`);
    return `rounded-full px-3 py-2 ${active ? "text-white" : "text-white/80 hover:text-white"}`;
  };

  async function signOut() {
    setPending(true);
    try {
      await fetch("/api/business/logout", { method: "POST", cache: "no-store" });
    } catch {
      /* still leave */
    }
    window.location.assign("/business/login");
  }

  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-5">
          <Link href="/business" className="shrink-0">
            <Image
              src="/logo-on-dark.png"
              alt="Zust Scan"
              width={1493}
              height={675}
              className="h-10 w-auto sm:h-11"
            />
          </Link>
          <div className="hidden min-w-0 text-white sm:block">
            <OwnerIdentity businessName={businessName} loginId={loginId} size="lg" showMark={false} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0 text-white sm:hidden">
            <OwnerIdentity businessName={businessName} loginId={loginId} size="md" showMark={false} />
          </div>
          <nav className="flex items-center gap-2 text-sm font-semibold" aria-label="Business portal">
            <Link href="/business" prefetch={false} className={navLinkClass("/business")}>
              Home
            </Link>
            <Link href="/business/profile" prefetch={false} className={navLinkClass("/business/profile")}>
              Business
            </Link>
            <Link href="/business/founder" prefetch={false} className={navLinkClass("/business/founder")}>
              Founder
            </Link>
            {standeeType === "event" ? (
              <Link href="/business/event" prefetch={false} className={navLinkClass("/business/event")}>
                Event
              </Link>
            ) : (
              <Link href="/business/services" prefetch={false} className={navLinkClass("/business/services")}>
                Services
              </Link>
            )}
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
