import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { primaryButtonClass } from "@/components/admin/styles";
import { MARKETING_DRAFT_SAMPLES } from "@/lib/marketing-samples";
import {
  additionalOutletPrice,
  audiences,
  brochureProof,
  email,
  emailHref,
  eventStandeeIncludes,
  eventStandeePrice,
  journey,
  launchOfferSavings,
  listPrice,
  phoneDisplay,
  phoneHref,
  planIncludes,
  price,
  pricingFaq,
  referralProgramSummary,
  setupStandeeLine,
  whatsappUrl,
} from "@/lib/site";

type Props = {
  siteUrl: string;
};

const proof = [
  { value: brochureProof.businesses, label: "Businesses" },
  { value: String(brochureProof.scans), label: "Scans" },
  { value: String(brochureProof.drafts), label: "Drafts" },
  { value: String(brochureProof.copyContinue), label: "Copy & Continue" },
] as const;

const guestSees = [
  "Name, city, address, and phone on a branded page",
  "Why trust us behind an info icon",
  "Optional Founder card — photo, name, role, and contact",
  "The services and products you set",
  "English, Hindi, or Hinglish, with a natural voice",
  "A draft they edit, then Copy & Continue opens Google",
] as const;

const samples = [
  ["English", MARKETING_DRAFT_SAMPLES.english],
  ["Hindi", MARKETING_DRAFT_SAMPLES.hindi],
  ["Hinglish", MARKETING_DRAFT_SAMPLES.hinglish],
] as const;

const cardClass = "rounded-2xl border border-slate-200 bg-white p-5 sm:p-6";

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="brochure-section mt-12">
      <h2 className="caption-1 text-muted">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function ProductBrochure({ siteUrl }: Props) {
  return (
    <article className="brochure-sheet mx-auto max-w-3xl px-6 py-12 text-ink sm:px-8 sm:py-16">
      <header>
        <Image
          src="/logo.png"
          alt="Zust Scan"
          width={1493}
          height={675}
          className="h-9 w-auto"
          priority
        />
        <h1 className="mt-10 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
          One scan. A Google review your guest is happy to post.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-muted">
          Place a QR where the visit happens. The guest picks what they used, gets a draft in their
          own language, and posts it on Google themselves. Zust Scan never submits a review.
        </p>
        <div className="mt-10 rounded-2xl bg-navy px-5 py-6 text-white sm:px-6">
          <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {proof.map((item) => (
              <div key={item.label}>
                <dd className="text-3xl font-semibold tabular-nums">{item.value}</dd>
                <dt className="mt-1 text-xs tracking-wide text-white/60 uppercase">{item.label}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-white/60">Live totals across businesses on Zust Scan.</p>
        </div>
      </header>

      <Section title="Two products">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={`${cardClass} brochure-keep border-blue/30`}>
            <p className="text-xs font-semibold tracking-wide text-blue uppercase">Everyday</p>
            <h3 className="mt-2 text-xl font-semibold">QR standee</h3>
            <p className="mt-3 text-3xl font-semibold text-blue">{price}</p>
            <p className="mt-1 text-sm text-muted">
              <span className="line-through">{listPrice}</span>
              <span className="ml-2 font-semibold text-ink">Festive Offer, save {launchOfferSavings}</span>
            </p>
            <p className="mt-4 text-sm leading-6 text-muted">
              Table, counter, room, or reception. {setupStandeeLine}
            </p>
            <ul className="mt-4 space-y-1.5 text-sm leading-6">
              <li>One QR and a printed standee, delivered</li>
              <li>Branded guest page, services, and products</li>
              <li>Optional Founder card</li>
              <li>Drafts in English, Hindi, or Hinglish</li>
            </ul>
          </div>
          <div className="brochure-keep rounded-2xl bg-navy p-5 text-white sm:p-6">
            <p className="text-xs font-semibold tracking-wide text-blue-200 uppercase">For a function</p>
            <h3 className="mt-2 text-xl font-semibold">Event standee</h3>
            <p className="mt-3 text-3xl font-semibold">{eventStandeePrice}</p>
            <p className="mt-1 text-sm text-white/65">Per standee, print and delivery included</p>
            <p className="mt-4 text-sm leading-6 text-white/80">
              Weddings, birthdays, and corporate nights. Reviews describe that evening.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm leading-6 text-white/90">
              {eventStandeeIncludes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="How a guest uses it">
        <ol className={cardClass}>
          {journey.map((item, index) => (
            <li key={item.step} className="brochure-keep relative flex gap-4 pb-6 last:pb-0">
              {index < journey.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-8 left-[15px] h-[calc(100%-1.25rem)] w-px bg-blue/35"
                />
              ) : null}
              <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue text-xs font-semibold text-white">
                {index + 1}
              </span>
              <div className="pt-0.5">
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="What the guest sees">
        <div className={cardClass}>
        <ul className="flex flex-wrap gap-2">
          {guestSees.map((item) => (
            <li key={item} className="rounded-full bg-blue/10 px-3 py-1.5 text-sm leading-5 text-ink">
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-3">
          {samples.map(([label, sample]) => (
            <blockquote key={label} className="border-l-4 border-blue bg-mist px-4 py-3">
              <p className="text-xs font-semibold tracking-wide text-blue uppercase">{label}</p>
              <p className="mt-1 text-sm leading-6">{sample}</p>
            </blockquote>
          ))}
        </div>
        <p className="mt-4 text-xs leading-5 text-muted">
          Hindi and Hinglish also offer a neutral, female, or male voice.
        </p>
        </div>
      </Section>

      <Section title={`Included in ${price}`}>
        <div className={cardClass}>
        <ul className="space-y-2 text-sm leading-6">
          {planIncludes.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="font-semibold text-blue" aria-hidden="true">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-6 text-muted">
          {referralProgramSummary} A second outlet is {additionalOutletPrice}.
        </p>
        </div>
      </Section>

      <Section title="Who it is for">
        <ul className="grid gap-4 sm:grid-cols-2">
          {audiences.map((item) => (
            <li key={item.title} className={`${cardClass} brochure-keep border-l-4 border-l-blue text-sm leading-6`}>
              <p className="font-semibold text-blue">{item.title}</p>
              <p className="mt-1 text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Questions">
        <dl className={`${cardClass} space-y-5`}>
          {pricingFaq.map((item) => (
            <div key={item.question} className="brochure-keep">
              <dt className="font-semibold">{item.question}</dt>
              <dd className="mt-1 text-sm leading-6 text-muted">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <footer className="brochure-section brochure-keep mt-12 rounded-2xl bg-navy px-5 py-6 text-white sm:px-6">
        <h2 className="text-xs font-semibold tracking-[0.16em] text-blue-200 uppercase">Talk to us</h2>
        <p className="mt-4 max-w-xl text-sm leading-6 text-white/80">
          Tell us your business or event. We confirm the standee, setup, and price on WhatsApp.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${primaryButtonClass} brochure-no-print mt-5`}
        >
          WhatsApp us
        </a>
        <p className="mt-6 text-sm leading-7 text-white/90">
          <a href={siteUrl} className="hover:underline">
            {siteUrl.replace(/^https?:\/\//, "")}
          </a>
          <span className="mx-2 text-white/35">/</span>
          <a href={emailHref} className="hover:underline">
            {email}
          </a>
          <span className="mx-2 text-white/35">/</span>
          <a href={phoneHref} className="hover:underline">
            {phoneDisplay}
          </a>
          <span className="brochure-no-print">
            <span className="mx-2 text-white/35">/</span>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </span>
        </p>
        <p className="mt-8 text-xs text-white/50">© Zust Scan</p>
      </footer>
    </article>
  );
}
