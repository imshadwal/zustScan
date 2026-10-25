import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { guestThemeCssVars, isGuestThemeId, resolveGuestTheme } from "@/lib/guest-themes";

export function GuestShell({
  children,
  center = false,
  themeId,
}: {
  children: ReactNode;
  /** Vertically center the card in the viewport (status pages). */
  center?: boolean;
  /** When set, page and card backgrounds follow the owner’s guest theme. */
  themeId?: string | null;
}) {
  const themed = Boolean(themeId && isGuestThemeId(themeId));
  const shellStyle: CSSProperties | undefined = themed
    ? guestThemeCssVars(resolveGuestTheme(themeId))
    : undefined;

  return (
    <div
      className={`relative flex min-h-dvh flex-col text-ink ${
        themed ? "bg-[var(--guest-page-bg)]" : "bg-mist-deep"
      }`}
      style={shellStyle}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-56 ${
          themed ? "bg-gradient-to-b from-[color-mix(in_srgb,var(--guest-accent)_22%,transparent)] to-transparent" : "bg-gradient-to-b from-blue/10 to-transparent"
        }`}
        aria-hidden="true"
      />
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
        <div
          className={`overflow-hidden rounded-[28px] border shadow-[0_16px_48px_rgba(7,20,40,0.12)] [&>:not([data-guest-flow])]:p-6 [&>:not([data-guest-flow])]:sm:p-8 ${
            themed
              ? "border-[var(--guest-border)] bg-[var(--guest-surface)]"
              : "border-slate-300 bg-white"
          }`}
        >
          {children}
        </div>
        <footer className="mt-6 flex flex-col items-center gap-2 pb-2">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm transition-colors ${
              themed
                ? "border-[var(--guest-border)] bg-[var(--guest-surface)]/90 text-muted hover:text-[var(--guest-accent)]"
                : "border-slate-200 bg-white/80 text-muted hover:border-blue/30 hover:text-ink"
            }`}
          >
            <Image
              src="/LOGO ZS.png"
              alt=""
              width={2172}
              height={724}
              className="h-4 w-auto opacity-80"
              aria-hidden
            />
            <span>
              Powered by <span className="font-semibold text-ink">Zust Scan</span>
            </span>
          </Link>
        </footer>
      </main>
    </div>
  );
}
