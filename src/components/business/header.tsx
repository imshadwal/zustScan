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
    return `rounded-full px-3 py-2 text-base ${
      active ? "font-semibold text-blue" : "font-medium text-ink hover:text-blue"
    }`;
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
    <header className="sticky top-0 z-40 px-4 pt-4">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 rounded-full border border-black/5 bg-white/80 px-3 py-2 backdrop-blur-md">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <Link href="/business" className="shrink-0">
            <Image src="/LOGO ZS.png" alt="Zust Scan" width={2172} height={724} className="h-10 w-auto" />
          </Link>
          <div className="hidden min-w-0 text-ink sm:block">
            <OwnerIdentity businessName={businessName} loginId={loginId} size="sm" showMark={false} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <nav className="flex items-center gap-1" aria-label="Business portal">
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
            className="cursor-pointer rounded-full px-3 py-2 text-base font-semibold text-muted hover:text-ink disabled:opacity-60"
          >
            {pending ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </div>
    </header>
  );
}
