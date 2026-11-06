"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { primaryButtonClass } from "@/components/admin/styles";

export function AdminHeader() {
  const [pending, setPending] = useState(false);
  const pathname = usePathname();
  const categoriesActive = pathname.startsWith("/admin/categories");

  async function signOut() {
    setPending(true);
    try {
      await fetch("/api/admin/logout", { method: "POST", cache: "no-store" });
    } catch {
      /* still leave — cookie may already be cleared */
    }
    window.location.assign("/admin/login");
  }

  return (
    <header className="sticky top-0 z-40 px-4 pt-4">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 rounded-full border border-black/5 bg-white/80 px-3 py-2 backdrop-blur-md">
        <Link href="/admin" className="shrink-0">
          <Image src="/LOGO ZS.png" alt="Zust Scan" width={2172} height={724} className="h-10 w-auto" />
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/categories"
            className={`rounded-full px-3 py-2 text-base font-medium ${
              categoriesActive ? "font-semibold text-blue" : "text-ink hover:text-blue"
            }`}
          >
            Categories
          </Link>
          <Link href="/admin/owners/new" className={primaryButtonClass}>
            New business owner
          </Link>
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
