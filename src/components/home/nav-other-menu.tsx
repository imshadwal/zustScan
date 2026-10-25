"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { otherNavLabel, otherNavLinks } from "@/lib/site";

function linkClass(active: boolean) {
  return active
    ? "font-semibold text-blue"
    : "font-medium text-ink transition-colors hover:text-blue";
}

export function isOtherNavActive(pathname: string) {
  return otherNavLinks.some(
    (link) => pathname === link.href || pathname.startsWith(`${link.href}/`),
  );
}

export function NavOtherMenuDesktop() {
  const pathname = usePathname();
  const menuActive = isOtherNavActive(pathname);

  return (
    <div className="relative group/nav-other">
      <button
        type="button"
        className={`inline-flex items-center gap-1.5 ${linkClass(menuActive)}`}
        aria-haspopup="true"
        aria-expanded="false"
      >
        {otherNavLabel}
        <svg viewBox="0 0 20 20" className="h-4 w-4 opacity-70" aria-hidden="true">
          <path
            d="M5 7l5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="invisible absolute top-full left-1/2 z-50 mt-3 w-72 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-[0_16px_48px_rgba(7,20,40,0.14)] transition-all group-hover/nav-other:visible group-hover/nav-other:opacity-100 group-focus-within/nav-other:visible group-focus-within/nav-other:opacity-100">
        <ul className="flex flex-col gap-0.5">
          {otherNavLinks.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block rounded-xl px-4 py-3 transition-colors hover:bg-mist ${active ? "bg-mist/80" : ""}`}
                >
                  <span className={`block text-sm ${linkClass(active)}`}>{link.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-muted">{link.description}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function NavOtherMenuMobile({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();

  return (
    <div className="rounded-2xl bg-mist/50 px-2 py-2">
      <p className="px-3 py-2 text-xs font-semibold tracking-wide text-muted uppercase">
        {otherNavLabel}
      </p>
      <ul className="flex flex-col gap-0.5">
        {otherNavLinks.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block rounded-xl px-4 py-3 text-lg hover:bg-white ${linkClass(active)}`}
                onClick={onNavigate}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
