"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { primaryButtonClass, quietButtonClass } from "@/components/admin/styles";
import { LaunchOfferNote } from "@/components/home/launch-offer-note";
import { starsForTier, type GuestTier } from "@/lib/guest-tier";
import {
  MARKETING_DRAFT_SAMPLES,
  MARKETING_VOICE_TWEAKS,
} from "@/lib/marketing-samples";
import { GUEST_VOICE_OPTIONS, type GuestVoice } from "@/lib/guest-voice";
import {
  additionalOutletPrice,
  audiences,
  email,
  emailHref,
  journey,
  launchOfferSavings,
  multiLocationSummary,
  phoneDisplay,
  phoneHref,
  planIncludes,
  price,
  pricingFaq,
  referralDiscountAmount,
  referralProgramSummary,
  roiPricingPoints,
  setupStandeeLine,
  setupStandeeTitle,
  whatsappUrl,
} from "@/lib/site";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "flow", label: "Flow" },
  { id: "languages", label: "Languages" },
  { id: "value", label: "Value" },
  { id: "fit", label: "Who fits" },
  { id: "plan", label: "Plan" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
] as const;

type Props = {
  siteUrl: string;
};

export function ProductBrochure({ siteUrl }: Props) {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [journeyStep, setJourneyStep] = useState(0);
  const [tier, setTier] = useState<GuestTier>("Better");
  const [language, setLanguage] = useState<"english" | "hindi" | "hinglish">("hinglish");
  const [voice, setVoice] = useState<GuestVoice>("neutral");
  const [audienceIndex, setAudienceIndex] = useState(0);
  const [checkedPlan, setCheckedPlan] = useState<Set<number>>(new Set());

  const stars = starsForTier(tier);

  let draftSample = MARKETING_DRAFT_SAMPLES[language];
  if (language !== "english" && voice !== "neutral") {
    draftSample = MARKETING_VOICE_TWEAKS[voice][language];
  }

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const nodes = SECTIONS.map((section) => document.getElementById(section.id)).filter(Boolean);
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );

    for (const node of nodes) observer.observe(node!);
    return () => observer.disconnect();
  }, []);

  function togglePlan(index: number) {
    setCheckedPlan((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <>
      <div className="brochure-no-print sticky top-[4.5rem] z-40 border-b border-slate-200 bg-white/95 px-3 py-2 backdrop-blur-sm sm:top-[5rem]">
        <div className="mx-auto flex max-w-3xl gap-1 overflow-x-auto pb-1">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollTo(section.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeSection === section.id
                  ? "bg-blue text-white shadow-sm"
                  : "bg-mist text-ink hover:bg-slate-200"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      <article className="brochure-sheet mx-auto max-w-3xl bg-white px-6 py-10 text-ink sm:px-10 sm:py-12">
        <header id="overview" className="brochure-section scroll-mt-36 border-b-2 border-slate-200 pb-8">
          <Image
            src="/logo.png"
            alt="Zust Scan"
            width={1493}
            height={675}
            className="h-12 w-auto"
            priority
          />
          <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-blue uppercase">
            Product overview
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            One scan. A better Google review.
          </h1>
          <p className="mt-4 text-base leading-7 text-muted">
            AI-powered QR reviews for Indian businesses. Guests pick what they used, get an editable
            draft in English, Hindi, or Hinglish, and post on Google themselves.
          </p>
          <LaunchOfferNote className="mt-6" />
          <div className="brochure-no-print mt-6 rounded-2xl border-2 border-slate-200 bg-mist p-4">
            <p className="text-xs font-semibold text-muted">Try the feel</p>
            <p className="mt-2 text-sm font-semibold text-ink">How was it?</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(["Good", "Better", "Best"] as const).map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setTier(label)}
                  className={`rounded-xl py-2 text-sm font-semibold transition-all ${
                    tier === label
                      ? "bg-blue text-white shadow-md"
                      : "border-2 border-slate-300 bg-white text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-center text-xl tracking-wide text-[#e5a100]" aria-hidden="true">
              {"★".repeat(stars)}
              <span className="text-slate-300">{"★".repeat(5 - stars)}</span>
            </p>
            <p className="mt-1 text-center text-xs text-muted">
              {tier} → {stars} stars on Google (automatic)
            </p>
          </div>
          <div className="mt-6 rounded-2xl border-2 border-blue/30 bg-blue/[0.08] px-5 py-4">
            <p className="text-xs font-semibold tracking-[0.12em] text-blue uppercase">
              {setupStandeeTitle}
            </p>
            <p className="mt-2 text-sm leading-6 text-ink">{setupStandeeLine}</p>
          </div>
          <div className="mt-4 inline-flex flex-col rounded-2xl bg-blue px-5 py-4 text-white">
            <p className="text-3xl font-semibold">{price}</p>
            <p className="mt-1 text-sm text-white/85">
              One location · save {launchOfferSavings} at launch · setup via enquiry
            </p>
          </div>
        </header>

        <section className="brochure-section mt-8 scroll-mt-36">
          <h2 className="text-lg font-semibold text-ink">The problem</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Happy guests skip reviews. Blank Google boxes are hard to write, and generic links do not
            match what they actually experienced.
          </p>
        </section>

        <section id="flow" className="brochure-section mt-8 scroll-mt-36">
          <h2 className="text-lg font-semibold text-ink">How Zust Scan works</h2>
          <p className="mt-1 text-xs text-muted brochure-no-print">Tap a step to read more</p>
          <div className="brochure-no-print mt-4 flex gap-1 overflow-x-auto pb-1">
            {journey.map((item, index) => (
              <button
                key={item.step}
                type="button"
                onClick={() => setJourneyStep(index)}
                className={`flex min-w-[4.5rem] flex-col items-center rounded-xl px-2 py-2 transition-all ${
                  journeyStep === index
                    ? "bg-blue text-white shadow-md"
                    : "border border-slate-200 bg-mist text-ink"
                }`}
              >
                <span className="text-[10px] font-bold">{item.step}</span>
                <span className="mt-0.5 text-[11px] font-semibold">{item.title}</span>
              </button>
            ))}
          </div>
          <div className="brochure-no-print mt-3 rounded-xl border-2 border-blue/20 bg-blue/[0.06] px-4 py-3 text-sm leading-6 text-ink">
            <strong>{journey[journeyStep]!.title}.</strong> {journey[journeyStep]!.body}
          </div>
          <ol className="brochure-print-only mt-4 hidden space-y-3 print:block">
            {journey.map((item) => (
              <li key={item.step} className="flex gap-3 text-sm leading-6">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mist text-xs font-bold text-blue">
                  {item.step}
                </span>
                <span>
                  <strong className="text-ink">{item.title}.</strong> {item.body}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section id="languages" className="brochure-section mt-8 scroll-mt-36">
          <h2 className="text-lg font-semibold text-ink">English, Hindi, Hinglish — and voice</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Guests choose language on the page. For Hindi and Hinglish they can pick neutral, female,
            or male voice so verbs sound natural — no raha/rahi slashes.
          </p>
          <div className="brochure-no-print mt-4 rounded-2xl border-2 border-slate-200 bg-mist p-4">
            <div className="grid grid-cols-3 gap-2">
              {(["english", "hindi", "hinglish"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`rounded-lg py-2 text-xs font-semibold capitalize ${
                    language === lang
                      ? "bg-blue text-white"
                      : "border border-slate-300 bg-white text-ink"
                  }`}
                >
                  {lang === "hindi" ? "हिंदी" : lang}
                </button>
              ))}
            </div>
            {language !== "english" ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {GUEST_VOICE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setVoice(option.id)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      voice === option.id
                        ? "bg-navy text-white"
                        : "border border-slate-300 bg-white text-ink"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}
            <p className="mt-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-ink">
              {draftSample}
            </p>
          </div>
          <div className="brochure-print-only mt-3 hidden space-y-3 print:block">
            {(["english", "hindi", "hinglish"] as const).map((lang) => (
              <div key={lang} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                <p className="text-xs font-semibold uppercase text-blue">{lang}</p>
                <p className="mt-1 leading-6">{MARKETING_DRAFT_SAMPLES[lang]}</p>
              </div>
            ))}
            <p className="text-xs text-muted">
              Hindi/Hinglish also support neutral, female, and male voice on the live guest page.
            </p>
          </div>
        </section>

        <section className="brochure-section mt-8">
          <h2 className="text-lg font-semibold text-ink">What you configure</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">
            <li>Services and products (e.g. Food → Biryani)</li>
            <li>Business name, phone, brief, Google review link (g.page … /review)</li>
            <li>QR for your guest page</li>
          </ul>
        </section>

        <section className="brochure-section mt-8">
          <h2 className="text-lg font-semibold text-ink">What the guest controls</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">
            <li>Services and products to mention</li>
            <li>Language and review voice</li>
            <li>Every word before Copy &amp; Continue</li>
            <li>Final Post on Google — Zust Scan never submits a review</li>
          </ul>
        </section>

        <section className="brochure-section mt-8">
          <h2 className="text-lg font-semibold text-ink">Owner dashboard (activity counts)</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            After setup, your portal shows anonymous funnel numbers: guest page scans, AI drafts
            created, and Copy &amp; Continue taps. No guest names or review text are stored.
          </p>
        </section>

        <section id="value" className="brochure-section mt-8 scroll-mt-36">
          <h2 className="text-lg font-semibold text-ink">Value in rupees</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            {price} once — not another monthly ad bill. We do not promise a review count; we make
            it easier for happy guests to write one that sounds like them.
          </p>
          <ul className="mt-4 space-y-3">
            {roiPricingPoints.map((point) => (
              <li
                key={point.title}
                className="rounded-xl border border-slate-200 bg-mist/80 px-4 py-3 text-sm"
              >
                <p className="text-xs font-semibold uppercase text-blue">{point.title}</p>
                <p className="mt-1 text-lg font-semibold text-ink">{point.amount}</p>
                <p className="mt-1 leading-6 text-muted">{point.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="fit" className="brochure-section mt-8 scroll-mt-36">
          <h2 className="text-lg font-semibold text-ink">Who it fits</h2>
          <p className="mt-1 text-xs text-muted brochure-no-print">Tap a type</p>
          <div className="brochure-no-print mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {audiences.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setAudienceIndex(index)}
                className={`rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all ${
                  audienceIndex === index
                    ? "bg-blue text-white shadow-md"
                    : "border-2 border-slate-300 bg-white text-ink"
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
          <div className="brochure-no-print mt-3 rounded-xl border-2 border-slate-200 bg-mist px-4 py-3 text-sm">
            <p className="font-semibold text-ink">{audiences[audienceIndex]!.title}</p>
            <p className="mt-1 leading-5 text-muted">{audiences[audienceIndex]!.body}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {audiences[audienceIndex]!.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-blue ring-1 ring-blue/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="brochure-print-only mt-3 hidden grid-cols-2 gap-3 print:grid">
            {audiences.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200 bg-mist/80 px-4 py-3 text-sm"
              >
                <p className="font-semibold text-ink">{item.title}</p>
                <p className="mt-1 leading-5 text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="plan" className="brochure-section mt-8 scroll-mt-36">
          <h2 className="text-lg font-semibold text-ink">Included in {price}</h2>
          <p className="mt-1 text-xs text-muted brochure-no-print">Tap to tick (for your checklist)</p>
          <ul className="mt-3 space-y-2">
            {planIncludes.map((item, index) => (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => togglePlan(index)}
                  className={`brochure-no-print flex w-full gap-3 rounded-xl border-2 px-3 py-2.5 text-left text-sm leading-6 transition-colors ${
                    checkedPlan.has(index)
                      ? "border-blue bg-blue/[0.08] text-ink"
                      : "border-slate-200 bg-white text-muted"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      checkedPlan.has(index) ? "bg-blue text-white" : "bg-mist text-blue"
                    }`}
                  >
                    {checkedPlan.has(index) ? "✓" : ""}
                  </span>
                  {item}
                </button>
                <span className="brochure-print-only hidden print:flex print:gap-2 print:text-sm">
                  <span className="font-bold text-blue">✓</span>
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border-2 border-slate-200 bg-white px-4 py-4 text-sm">
              <p className="text-xs font-semibold uppercase text-blue">Referral</p>
              <p className="mt-1 text-lg font-semibold text-ink">{referralDiscountAmount} off each</p>
              <p className="mt-2 leading-6 text-muted">{referralProgramSummary}</p>
            </div>
            <div className="rounded-xl border-2 border-slate-200 bg-white px-4 py-4 text-sm">
              <p className="text-xs font-semibold uppercase text-blue">Multi-location</p>
              <p className="mt-1 text-lg font-semibold text-ink">From {additionalOutletPrice}</p>
              <p className="mt-2 leading-6 text-muted">{multiLocationSummary}</p>
            </div>
          </div>
        </section>

        <section id="faq" className="brochure-section mt-8 scroll-mt-36">
          <h2 className="text-lg font-semibold text-ink">Common questions</h2>
          <ul className="brochure-no-print mt-4 space-y-2">
            {pricingFaq.map((item) => (
              <li key={item.question}>
                <details className="rounded-xl border border-slate-200 bg-mist/50 px-4 py-3">
                  <summary className="cursor-pointer text-sm font-semibold text-ink">
                    {item.question}
                  </summary>
                  <p className="mt-2 text-sm leading-6 text-muted">{item.answer}</p>
                </details>
              </li>
            ))}
          </ul>
          <ul className="brochure-print-only mt-4 hidden space-y-4 print:block">
            {pricingFaq.map((item) => (
              <li key={item.question} className="text-sm">
                <p className="font-semibold text-ink">{item.question}</p>
                <p className="mt-1 leading-6 text-muted">{item.answer}</p>
              </li>
            ))}
          </ul>
        </section>

        <footer id="contact" className="brochure-section mt-10 scroll-mt-36 border-t-2 border-slate-200 pt-8">
          <h2 className="text-lg font-semibold text-ink">Get started</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Scan to share, review to care. Mention referrals and outlet count in your enquiry — we
            confirm pricing on WhatsApp.
          </p>
          <div className="brochure-no-print mt-4 flex flex-wrap gap-2">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={primaryButtonClass}>
              WhatsApp us
            </a>
            <Link href="/contact" className={quietButtonClass}>
              Contact page
            </Link>
            <Link href="/pricing" className={quietButtonClass}>
              Full pricing
            </Link>
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="font-semibold text-ink">Website</dt>
              <dd>
                <a href={siteUrl} className="text-blue hover:underline">
                  {siteUrl}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Email</dt>
              <dd>
                <a href={emailHref} className="text-blue hover:underline">
                  {email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Phone</dt>
              <dd>
                <a href={phoneHref} className="text-blue hover:underline">
                  {phoneDisplay}
                </a>
              </dd>
            </div>
          </dl>
          <p className="mt-6 text-xs text-muted">© Zust Scan · Product brochure</p>
        </footer>
      </article>
    </>
  );
}
