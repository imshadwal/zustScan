import Image from "next/image";
import {
  email,
  emailHref,
  instagramHandle,
  instagramUrl,
  navLinks,
  phoneDisplay,
  phoneHref,
} from "@/lib/site";

export function Contact() {
  return (
    <footer id="contact" className="bg-navy text-white">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:py-24">
        <p className="text-xs font-semibold tracking-[0.16em] text-white/50 uppercase">
          Contact
        </p>
        <a
          href={emailHref}
          className="mt-4 block text-3xl font-semibold tracking-tight break-all text-white transition-colors hover:text-blue sm:text-5xl lg:text-6xl"
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
            className="inline-flex h-12 items-center rounded-full bg-white/10 px-5 text-sm font-semibold hover:bg-white/15"
          >
            Instagram {instagramHandle}
          </a>
        </div>

        <div className="mt-16 grid gap-10 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            <a href="#top" className="inline-flex w-fit">
            <Image
              src="/logo-on-dark.png"
              alt="Zust Scan"
              width={1493}
              height={675}
              className="h-16 w-auto sm:h-20"
            />
          </a>
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-white/50 uppercase">
              Product
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-white/80 hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-white/50 uppercase">
              Journey
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li>Scan</li>
              <li>Choose</li>
              <li>Draft</li>
              <li>Post</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-white/50 uppercase">
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
            </ul>
          </div>
        </div>
        <p className="mt-12 text-sm text-white/40">
          Scan to share, review to care.
        </p>
      </div>
    </footer>
  );
}
