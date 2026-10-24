"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { primaryButtonClass } from "@/components/admin/styles";

export function AdminHeader() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => null);
    router.push("/admin/login");
    router.refresh();
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
