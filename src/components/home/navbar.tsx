"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { EnquiryButton, useEnquiry } from "@/components/home/enquiry";
import { navLinks } from "@/lib/site";

function navLinkClass(active: boolean) {
  return active
    ? "font-semibold text-blue"
    : "font-medium text-ink transition-colors hover:text-blue";
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { openEnquiry } = useEnquiry();

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full bg-white py-3 pr-2.5 pl-4 shadow-[0_12px_40px_rgba(7,20,40,0.14)] sm:py-3.5 sm:pr-3 sm:pl-5">
        <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
          <Image
            src="/LOGO ZS.png"
            alt="Zust Scan"
            width={2172}
            height={724}
            priority
            className="h-11 w-auto sm:h-12"
          />
        </Link>
        <nav className="hidden items-center gap-6 text-base md:flex lg:gap-7 xl:gap-8">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link key={link.href} href={link.href} className={navLinkClass(active)}>
                {link.label}
              </Link>
            );
          })}
        </nav>
        <EnquiryButton className="hidden h-12 items-center rounded-full bg-blue px-6 text-base font-semibold text-white transition-colors hover:bg-blue-deep md:inline-flex">
          Enquire
        </EnquiryButton>
        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
            {open ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>
      {open ? (
        <nav
          id="mobile-menu"
          className="mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-3xl bg-white p-4 shadow-[0_12px_40px_rgba(7,20,40,0.14)] md:hidden"
        >
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-2xl px-4 py-3.5 text-lg hover:bg-mist ${navLinkClass(active)}`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            type="button"
            className="mt-1 inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-blue px-4 text-base font-semibold text-white"
            onClick={() => {
              setOpen(false);
              openEnquiry();
            }}
          >
            Enquire
          </button>
        </nav>
      ) : null}
    </header>
  );
}
