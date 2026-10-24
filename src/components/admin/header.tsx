"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { primaryButtonClass } from "@/components/admin/styles";

export function AdminHeader() {
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    try {
      await fetch("/api/admin/logout", { method: "POST", cache: "no-store" });
    } catch {
      /* still leave — cookie may already be cleared */
    }
    // Full navigation avoids re-running the heavy /admin server page via router.refresh().
    window.location.assign("/admin/login");
  }

  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/admin" className="shrink-0">
          <Image
            src="/logo-on-dark.png"
            alt="Zust Scan"
            width={1493}
            height={675}
            className="h-10 w-auto"
          />
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/admin/owners/new" className={`${primaryButtonClass} h-10 px-4`}>
            New business owner
          </Link>
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
