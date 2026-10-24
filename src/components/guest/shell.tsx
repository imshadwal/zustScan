import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function GuestShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-mist text-ink">
      <header className="px-4 py-5">
        <Link href="/" className="inline-flex">
          <Image
            src="/logo.png"
            alt="Zust Scan"
            width={1493}
            height={675}
            className="h-12 w-auto"
          />
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 pb-16">
        <div className="rounded-3xl bg-white p-8 shadow-[0_12px_40px_rgba(7,20,40,0.08)]">
          {children}
        </div>
      </main>
    </div>
  );
}
