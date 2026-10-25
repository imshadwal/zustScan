import {
  email,
  emailHref,
  instagramHandle,
  instagramUrl,
  phoneDisplay,
  phoneHref,
} from "@/lib/site";
import { homeCardClass } from "@/components/home/styles";

const channels = [
  {
    key: "email",
    label: "Email",
    value: email,
    href: emailHref,
    hint: "Best for setup details and attachments",
    external: false,
    icon: (
      <>
        <path
          d="M4 7h16v11H4V7z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path
          d="m4 7 8 5 8-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  {
    key: "phone",
    label: "Phone",
    value: phoneDisplay,
    href: phoneHref,
    hint: "Call or text on WhatsApp after enquiry",
    external: false,
    icon: (
      <path
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    key: "instagram",
    label: "Instagram",
    value: instagramHandle,
    href: instagramUrl,
    hint: "Updates and examples from the field",
    external: true,
    icon: (
      <path
        d="M8 4h8a4 4 0 014 4v8a4 4 0 01-4 4H8a4 4 0 01-4-4V8a4 4 0 014-4zM12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM16.8 7.2h.01"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    ),
  },
] as const;

export function ContactChannels() {
  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {channels.map((channel) => (
        <li key={channel.key}>
          <a
            href={channel.href}
            {...(channel.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className={`group flex h-full flex-col p-6 transition-shadow hover:shadow-[0_20px_56px_rgba(7,20,40,0.14)] ${homeCardClass}`}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue text-white shadow-[0_10px_24px_rgba(0,96,240,0.28)]">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                aria-hidden="true"
              >
                {channel.icon}
              </svg>
            </span>
            <p className="mt-5 text-xs font-semibold tracking-[0.14em] text-blue uppercase">
              {channel.label}
            </p>
            <p className="mt-2 text-lg font-semibold text-ink break-all">{channel.value}</p>
            <p className="mt-2 flex-1 text-sm leading-6 text-muted">{channel.hint}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue">
              {channel.key === "email"
                ? "Send email"
                : channel.key === "phone"
                  ? "Call now"
                  : "Open profile"}
              <span
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                →
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
