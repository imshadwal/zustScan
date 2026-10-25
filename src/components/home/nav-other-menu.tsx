"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={`inline-flex items-center gap-1.5 ${linkClass(menuActive || open)}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {otherNavLabel}
        <svg
          viewBox="0 0 20 20"
          className={`h-4 w-4 opacity-70 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
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
      <div
        className={`absolute top-full left-1/2 z-50 mt-3 w-72 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_16px_48px_rgba(7,20,40,0.14)] transition-all ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col gap-0.5">
          {otherNavLinks.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block rounded-xl px-4 py-3 transition-colors hover:bg-mist ${active ? "bg-mist/80" : ""}`}
                  onClick={() => setOpen(false)}
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
