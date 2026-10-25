import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function GuestShell({
  children,
  center = false,
}: {
  children: ReactNode;
  /** Vertically center the card in the viewport (status pages). */
  center?: boolean;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-mist-deep text-ink">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-blue/10 to-transparent" aria-hidden="true" />
      <header className="relative px-4 pt-5 pb-2">
        <Link href="/" className="inline-flex rounded-full bg-white/90 px-3 py-2 shadow-sm">
          <Image
            src="/LOGO ZS.png"
            alt="Zust Scan"
            width={2172}
            height={724}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>
      </header>
      <main
        className={`relative mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-8 ${
          center ? "justify-center" : ""
        }`}
      >
        <div className="overflow-hidden rounded-[28px] border border-slate-300 bg-white shadow-[0_16px_48px_rgba(7,20,40,0.12)] [&>:not([data-guest-flow])]:p-6 [&>:not([data-guest-flow])]:sm:p-8">
          {children}
        </div>
        <p className="mt-6 text-center text-xs text-muted">Scan to share, review to care.</p>
      </main>
    </div>
  );
}
