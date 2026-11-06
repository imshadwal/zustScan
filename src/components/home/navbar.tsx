"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { EnquiryButton, useEnquiry } from "@/components/home/enquiry";
import { NavOtherMenuDesktop, NavOtherMenuMobile } from "@/components/home/nav-other-menu";
import { navLinks } from "@/lib/site";

function navLinkClass(active: boolean) {
  return active
    ? "font-semibold text-blue"
    : "font-medium text-ink transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-blue";
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { openEnquiry } = useEnquiry();
  const mobileLinks = [...navLinks];

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="flex w-full max-w-6xl items-center justify-between gap-4 rounded-full border border-black/5 bg-white/80 px-3 py-2 backdrop-blur-md">
        <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
          <Image
            src="/LOGO ZS.png"
            alt="Zust Scan"
            width={2172}
            height={724}
            priority
            className="h-10 w-auto"
          />
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link key={link.href} href={link.href} className={`body-2 ${navLinkClass(active)}`}>
                {link.label}
              </Link>
            );
          })}
          <NavOtherMenuDesktop />
        </nav>
        <EnquiryButton className="btn-primary hidden md:inline-flex">Enquire</EnquiryButton>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
            <span
              className={`block h-0.5 w-5 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-ink transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>
      {open ? (
        <nav
          id="mobile-menu"
          className="fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-white/95 px-8 backdrop-blur-xl md:hidden"
        >
          {mobileLinks.map((link, index) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`menu-link-in heading-3 ${navLinkClass(active)}`}
                style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="menu-link-in" style={{ animationDelay: "360ms" }}>
            <NavOtherMenuMobile onNavigate={() => setOpen(false)} />
          </div>
          <button
            type="button"
            className="btn-primary menu-link-in mt-4 w-fit"
            style={{ animationDelay: "400ms" }}
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
