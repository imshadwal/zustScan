import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function GuestShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-mist-deep text-ink">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-blue/10 to-transparent" aria-hidden="true" />
      <header className="relative px-4 pt-5 pb-2">
        <Link href="/" className="inline-flex rounded-full bg-white/90 px-3 py-2 shadow-sm">
          <Image
            src="/logo.png"
            alt="Zust Scan"
            width={1493}
            height={675}
            className="h-9 w-auto"
          />
        </Link>
      </header>
      <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-8">
        <div className="overflow-hidden rounded-[28px] border border-slate-300 bg-white shadow-[0_16px_48px_rgba(7,20,40,0.12)]">
          {children}
        </div>
        <p className="mt-6 text-center text-xs text-muted">Scan to share, review to care.</p>
      </main>
    </div>
  );
}
