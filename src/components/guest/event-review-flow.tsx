"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GuestDraftLoadingPanel } from "@/components/guest/guest-draft-loading";
import { BusinessOwnerMark } from "@/components/initials-badge";
import { trackGuestMetric } from "@/lib/guest-analytics-client";
import {
  guestAccentTextClass,
  guestChipClass,
  guestFlowFooterClass,
  guestPanelClass,
  guestPrimaryButtonClass,
  guestSelectedChipClass,
} from "@/components/guest/styles";
import { fieldClass, quietButtonClass } from "@/components/admin/styles";
import type { EventGuestExperience } from "@/lib/business-events";
import { guestThemeCssVars, resolveGuestTheme } from "@/lib/guest-themes";
import {
  GUEST_LANGUAGE_OPTIONS,
  type GuestLanguage,
} from "@/lib/guest-languages";
import { GUEST_TIERS, starsForTier, type GuestTier } from "@/lib/guest-tier";
import {
  GUEST_VOICE_OPTIONS,
  type GuestVoice,
} from "@/lib/guest-voice";
import { formatGuestContactPhone, guestAddressLine } from "@/lib/guest-display";
import { formatEventDateForDisplay } from "@/lib/format-event-date";
import { displayTitle } from "@/lib/initials";

const STEPS = ["Experience", "Rating", "Draft"] as const;
type StepIndex = 0 | 1 | 2;

type Props = { experience: EventGuestExperience };

const backButtonClass =
  "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-[var(--guest-border,#cbd5e1)] bg-[var(--guest-panel,#f4f7fb)] px-4 py-2.5 text-xs font-semibold text-ink transition-colors hover:border-[var(--guest-accent)] hover:text-[var(--guest-accent)] disabled:cursor-not-allowed disabled:opacity-60";

async function copyDraftToClipboard(text: string, textarea: HTMLTextAreaElement | null) {
  const value = text.trim();
  if (!value) return false;
  if (textarea) {
    textarea.focus();
    textarea.select();
  }
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    /* fallback */
  }
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  }
}

export function EventGuestReviewFlow({ experience }: Props) {
  const theme = resolveGuestTheme(experience.guestThemeId);
  const title = displayTitle(experience.businessName, experience.loginId);
  const addressLine = guestAddressLine(experience.address, experience.city);
  const contactPhone = formatGuestContactPhone(experience.phone);
  const eventDateLabel = formatEventDateForDisplay(experience.eventDate);
  const eventSubtitle = [experience.eventName, eventDateLabel].filter(Boolean).join(" · ");

  const [step, setStep] = useState<StepIndex>(0);
  const [areaIds, setAreaIds] = useState<string[]>(
    experience.areas.length === 1 ? [experience.areas[0]!.id] : [],
  );
  const [tier, setTier] = useState<GuestTier | null>(null);
  const [language, setLanguage] = useState<GuestLanguage>("english");
  const [voice, setVoice] = useState<GuestVoice>("neutral");
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [draftFetchComplete, setDraftFetchComplete] = useState(false);
  const [draftLoadKey, setDraftLoadKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const pageViewSent = useRef(false);
  const draftTextareaRef = useRef<HTMLTextAreaElement>(null);
  const draftPendingRef = useRef<string | null>(null);

  useEffect(() => {
    if (pageViewSent.current) return;
    pageViewSent.current = true;
    trackGuestMetric(experience.loginId, "page_view");
  }, [experience.loginId]);

  const stars = tier ? starsForTier(tier) : 0;
  const selectedAreaNames = experience.areas
    .filter((a) => areaIds.includes(a.id))
    .map((a) => a.name);

  const canAdvance =
    (step === 0 && areaIds.length > 0) || (step === 1 && tier !== null);

  function toggleArea(id: string) {
    setAreaIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
    setDraft("");
    setError(null);
  }

  const handleDraftReveal = useCallback(() => {
    const text = draftPendingRef.current;
    if (!text) return;
    setDraft(text);
    draftPendingRef.current = null;
    setDraftFetchComplete(false);
    setPending(false);
    setStep((current) => (current === 1 ? 2 : current));
  }, []);

  async function buildDraft() {
    if (!tier || areaIds.length === 0) return false;
    setDraftLoadKey((key) => key + 1);
    setDraftFetchComplete(false);
    draftPendingRef.current = null;
    setPending(true);
    setError(null);
    setCopied(false);
    try {
      const response = await fetch("/api/guest/event-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          loginId: experience.loginId,
          areaIds,
          tier,
          language,
          voice,
          variationSeed: crypto.randomUUID(),
        }),
      });
      const body = (await response.json().catch(() => null)) as
        | { draft?: string; error?: string }
        | null;
      if (!response.ok || !body?.draft) {
        setError(body?.error ?? "The draft could not be created.");
        setPending(false);
        setDraftFetchComplete(false);
        return false;
      }
      draftPendingRef.current = body.draft;
      setDraftFetchComplete(true);
      return true;
    } catch {
      setError("The request could not be sent.");
      setPending(false);
      setDraftFetchComplete(false);
      return false;
    }
  }

  async function goNext() {
    setError(null);
    if (step === 0 && areaIds.length > 0) {
      setStep(1);
      return;
    }
    if (step === 1 && tier) {
      await buildDraft();
    }
  }

  function goBack() {
    setError(null);
    if (step === 2) {
      setDraft("");
      setStep(1);
      return;
    }
    if (step === 1) setStep(0);
  }

  async function copyAndContinue() {
    if (!draft.trim()) return;
    const ok = await copyDraftToClipboard(draft, draftTextareaRef.current);
    if (!ok) {
      setError("Copy failed. Long-press the draft, copy, then open Google.");
      return;
    }
    trackGuestMetric(experience.loginId, "copy_continue");
    setCopied(true);
    window.open(experience.mapLink, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex min-h-0 flex-col" data-guest-flow style={guestThemeCssVars(theme)}>
      <div
        className="px-5 py-7 text-white sm:px-6 sm:py-8"
        style={{ backgroundColor: theme.header }}
      >
        <div className="flex items-start gap-4 sm:gap-5">
          <BusinessOwnerMark
            businessName={experience.businessName}
            loginId={experience.loginId}
            logoUrl={experience.logoUrl}
            size="xl"
          />
          <div className="min-w-0 flex-1 pt-0.5">
            <p
              className="text-[11px] font-semibold tracking-[0.16em] uppercase sm:text-xs"
              style={{ color: theme.headerEyebrow }}
            >
              Share your experience
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
            {eventSubtitle ? (
              <p className="mt-2 text-sm font-medium text-white/90">{eventSubtitle}</p>
            ) : null}
            {addressLine ? (
              <p className="mt-2 text-sm leading-5 text-white/70">{addressLine}</p>
            ) : null}
            {contactPhone ? (
              <a
                href={`tel:${experience.phone}`}
                className="mt-1.5 block text-sm font-medium text-white/90 hover:underline"
              >
                {contactPhone}
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="bg-[var(--guest-surface,white)] px-4 py-4 sm:px-5">
        <ol className="flex gap-1" aria-label="Progress">
          {STEPS.map((label, index) => {
            const progressStep = pending && step === 1 ? 2 : step;
            const done = index < progressStep;
            const current = index === progressStep;
            return (
              <li key={label} className="flex-1">
                <div
                  className={`h-1.5 rounded-full transition-colors ${
                    done || current ? "bg-[var(--guest-accent)]" : "bg-slate-300"
                  }`}
                />
                <p
                  className={`mt-1.5 truncate text-center text-[10px] font-semibold uppercase tracking-wide ${
                    current ? guestAccentTextClass : "text-muted"
                  }`}
                >
                  {label}
                </p>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-5 sm:px-5 sm:pb-6">
        {step === 0 ? (
          <section className={guestPanelClass}>
            <h2 className="text-sm font-semibold text-ink">What stood out?</h2>
            <ul className="mt-3 space-y-2">
              {experience.areas.map((item) => {
                const selected = areaIds.includes(item.id);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleArea(item.id)}
                      className={`flex w-full cursor-pointer items-center rounded-xl px-4 py-3.5 text-left text-sm font-semibold transition-all ${
                        selected ? guestSelectedChipClass : guestChipClass
                      }`}
                    >
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {step === 1 && pending ? (
          <GuestDraftLoadingPanel
            key={draftLoadKey}
            fetchComplete={draftFetchComplete}
            onReveal={handleDraftReveal}
          />
        ) : null}

        {step === 1 && !pending ? (
          <section className={guestPanelClass}>
            <h2 className="text-sm font-semibold text-ink">How was it?</h2>
            <p className="mt-0.5 text-xs text-muted">
              {selectedAreaNames.join(" · ")} · stars follow your pick
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {GUEST_TIERS.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setTier(label);
                    setDraft("");
                  }}
                  className={`cursor-pointer rounded-xl py-3 text-sm font-semibold ${
                    tier === label ? guestSelectedChipClass : guestChipClass
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-xl border-2 border-[var(--guest-border,#cbd5e1)] bg-[var(--guest-panel,#fff)] px-4 py-3 shadow-sm">
              <p className="text-xs font-semibold text-muted">Star rating</p>
              <p className="mt-0.5 text-xs text-muted">
                {tier
                  ? `${tier} · ${stars} star${stars === 1 ? "" : "s"} on Google`
                  : "Fills when you pick Good, Great, or Exceptional"}
              </p>
              <p className="mt-1 text-[11px] text-muted">
                Stars are chosen on Google — they are not written in your draft.
              </p>
              <div
                className="mt-2 flex justify-center gap-2"
                role="img"
                aria-label={tier ? `${stars} out of 5 stars` : "Star rating not set yet"}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <span
                    key={value}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${
                      tier && value <= stars
                        ? "bg-[#fff8e6] text-[#e5a100]"
                        : "border border-slate-300 bg-slate-100 text-slate-400"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-muted">Review language</p>
              <p className="mt-0.5 text-xs text-muted">Pick one.</p>
              <div className="mt-2 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Review language">
                {GUEST_LANGUAGE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={language === option.id}
                    onClick={() => {
                      setLanguage(option.id);
                      if (option.id === "english") setVoice("neutral");
                      setDraft("");
                    }}
                    className={`cursor-pointer rounded-xl py-3 text-sm font-semibold ${
                      language === option.id ? guestSelectedChipClass : guestChipClass
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {language === "hindi" || language === "hinglish" ? (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-muted">Review voice</p>
                  <div
                    className="mt-2 grid grid-cols-3 gap-2"
                    role="radiogroup"
                    aria-label="Review voice"
                  >
                    {GUEST_VOICE_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={voice === option.id}
                        onClick={() => {
                          setVoice(option.id);
                          setDraft("");
                        }}
                        className={`cursor-pointer rounded-xl py-3 text-sm font-semibold ${
                          voice === option.id ? guestSelectedChipClass : guestChipClass
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {step === 2 && pending ? (
          <GuestDraftLoadingPanel
            key={draftLoadKey}
            fetchComplete={draftFetchComplete}
            onReveal={handleDraftReveal}
          />
        ) : null}

        {step === 2 && !pending && draft ? (
          <section className={guestPanelClass}>
            <h2 className="text-sm font-semibold text-ink">Your draft</h2>
            <p className="mt-1 text-xs text-muted">Edit anything before you post on Google.</p>
            <div className="mb-4 mt-3 rounded-xl border-2 border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-950">
              Google opens empty on purpose — it does not accept pre-filled reviews. Copy &
              Continue puts your words on the clipboard; you choose the same stars and paste on
              Google.
            </div>
            <p className="mb-2 text-center text-lg tracking-wide text-[#e5a100]" aria-hidden="true">
              {"★".repeat(stars)}
              <span className="text-slate-200">{"★".repeat(5 - stars)}</span>
            </p>
            <textarea
              ref={draftTextareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={6}
              className={`${fieldClass} mt-3 resize-y text-base leading-7`}
            />
            <button
              type="button"
              onClick={copyAndContinue}
              className={`${guestPrimaryButtonClass} mt-4 w-full py-3.5`}
            >
              {copied ? "Copied — paste on Google" : "Copy & Continue"}
            </button>
            <button
              type="button"
              onClick={buildDraft}
              disabled={pending}
              className={`${quietButtonClass} mt-2 w-full`}
            >
              Regenerate draft
            </button>
            <p className="mt-3 text-center text-xs leading-5 text-muted">
              Tap {stars} star{stars === 1 ? "" : "s"} on Google, paste this text, then Post.
            </p>
          </section>
        ) : null}

        {error ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        {step < 2 ? (
          <div className={`-mx-4 mt-5 flex gap-2 px-4 py-4 sm:-mx-5 sm:px-5 ${guestFlowFooterClass}`}>
            {step > 0 ? (
              <button type="button" onClick={goBack} className={backButtonClass} disabled={pending}>
                Back
              </button>
            ) : null}
            <button
              type="button"
              disabled={!canAdvance || pending}
              onClick={goNext}
              className={`${guestPrimaryButtonClass} min-w-0 flex-1 py-3.5`}
            >
              {step === 1 ? (pending ? "Writing draft…" : "Next — get draft") : "Next"}
            </button>
          </div>
        ) : (
          <div className={`-mx-4 mt-5 px-4 py-4 sm:-mx-5 sm:px-5 ${guestFlowFooterClass}`}>
            <button type="button" onClick={goBack} className={backButtonClass}>
              Back
            </button>
          </div>
        )}

        {step === 0 && experience.whyTrustUs ? (
          <section className={`${guestPanelClass} mt-4`}>
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">Why trust us</p>
            <p className="mt-2 text-sm leading-6 text-ink">{experience.whyTrustUs}</p>
          </section>
        ) : null}
      </div>
    </div>
  );
}
