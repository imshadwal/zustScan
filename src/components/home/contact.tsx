import Image from "next/image";
import Link from "next/link";
import {
  email,
  emailHref,
  facebookLabel,
  facebookUrl,
  instagramHandle,
  instagramUrl,
  journeyTimeline,
  navLinks,
  otherNavLabel,
  otherNavLinks,
  phoneDisplay,
  phoneHref,
} from "@/lib/site";

export function Contact() {
  return (
    <footer id="contact" className="scroll-mt-28 bg-navy text-white">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:py-24">
        <p className="caption-1 text-white/80">Contact</p>
        <a
          href={emailHref}
          className="body-1 mt-4 block break-all font-semibold text-white transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-blue"
        >
          {email}
        </a>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={phoneHref}
            className="inline-flex h-12 items-center gap-3 rounded-full bg-white/10 px-5 text-sm font-semibold"
          >
            <span className="h-2 w-2 rounded-full bg-[#3dde7a]" aria-hidden="true" />
            {phoneDisplay}
          </a>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram ${instagramHandle}`}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/15"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
              <path
                d="M8 4h8a4 4 0 014 4v8a4 4 0 01-4 4H8a4 4 0 01-4-4V8a4 4 0 014-4z"
                stroke="currentColor"
                strokeWidth="1.75"
              />
              <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.75" />
              <circle cx="16.8" cy="7.2" r="0.85" fill="currentColor" />
            </svg>
          </a>
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={facebookLabel}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/15"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
              <path d="M14 8h2.5V4H14c-2.8 0-4.5 1.7-4.5 4.5V11H7v3.5h2.5V20h3.5v-5.5H16L16.5 11H13V8.8C13 8.1 13.2 8 14 8z" />
            </svg>
          </a>
        </div>

        <div className="mt-16 grid gap-10 pt-10 sm:grid-cols-2 lg:grid-cols-5">
            <Link href="/" className="inline-flex w-fit">
            <Image
              src="/logo-on-dark.png"
              alt="Zust Scan"
              width={1493}
              height={675}
              className="h-10 w-auto"
            />
          </Link>
          <div>
            <p className="caption-1 text-white/80">
              Site
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {navLinks
                .filter((link) => link.href !== "/contact")
                .map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/80 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="caption-1 text-white/80">
              {otherNavLabel}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {otherNavLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/80 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="caption-1 text-white/80">
              Journey
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {journeyTimeline.map((step) => (
                <li key={step.title}>
                  <Link
                    href="/how-it-works"
                    className="text-white/80 hover:text-white"
                  >
                    {step.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="caption-1 text-white/80">
              Contact
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={emailHref} className="text-white/80 hover:text-white">
                  {email}
                </a>
              </li>
              <li>
                <a href={phoneHref} className="text-white/80 hover:text-white">
                  {phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white"
                >
                  {instagramHandle}
                </a>
              </li>
              <li>
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white"
                >
                  {facebookLabel}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
