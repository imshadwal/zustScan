import Link from "next/link";
import {
  email,
  emailHref,
  guestQrPausedCopy,
  phoneDisplay,
  phoneHref,
  whatsappUrl,
} from "@/lib/site";

export function GuestQrPausedCard({
  businessTitle,
  loginId,
}: {
  businessTitle: string;
  loginId: string;
}) {
  return (
    <div className="text-center sm:text-left">
      <div
        className="-mx-6 -mt-6 mb-6 border-b border-slate-200 bg-gradient-to-r from-navy/5 via-amber-50/80 to-navy/5 px-6 py-5 sm:-mx-8 sm:-mt-8 sm:px-8"
      >
        <div className="mx-auto flex max-w-sm flex-col items-center gap-3 sm:mx-0 sm:flex-row sm:items-start sm:text-left">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-200/80 bg-amber-100 text-amber-900 shadow-sm"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" d="M10 9v6M14 9v6" />
            </svg>
          </span>
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-amber-800 uppercase">
              {guestQrPausedCopy.eyebrow}
            </p>
            <h1 className="mt-1 text-xl font-semibold text-ink sm:text-2xl">{businessTitle}</h1>
            <p className="mt-0.5 font-mono text-xs text-muted">{loginId}</p>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-ink sm:text-xl">{guestQrPausedCopy.headline}</h2>
      <p className="mt-3 text-sm leading-7 text-muted sm:text-base">{guestQrPausedCopy.body}</p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-mist/60 p-4 text-left">
        <p className="text-sm font-semibold text-ink">{guestQrPausedCopy.contactLead}</p>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link href={emailHref} className="font-medium text-blue hover:underline">
              {email}
            </Link>
          </li>
          <li>
            <Link href={phoneHref} className="font-medium text-blue hover:underline">
              {phoneDisplay}
            </Link>
          </li>
          <li>
            <Link
              href={whatsappUrl}
              className="font-medium text-blue hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp support
            </Link>
          </li>
        </ul>
      </div>

      <p className="mt-5 text-xs leading-5 text-muted">
        If you are a guest who wanted to leave a review, try again later or speak with the
        business directly. No app install is required once this account is active again.
      </p>
    </div>
  );
}
