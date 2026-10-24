"use client";

import { useMemo, useState } from "react";
import { fieldClass, primaryButtonClass, quietButtonClass } from "@/components/admin/styles";
import type { GuestExperience } from "@/lib/business-owners";
import {
  GUEST_LANGUAGE_OPTIONS,
  type GuestLanguage,
} from "@/lib/guest-languages";
import { starsForTier, type GuestTier } from "@/lib/guest-tier";
import {
  GUEST_VOICE_OPTIONS,
  type GuestVoice,
} from "@/lib/guest-voice";
import { GoogleReviewHandoff } from "@/components/guest/google-handoff";
import { displayTitle } from "@/lib/initials";

type Props = {
  experience: GuestExperience;
};

const STEPS = ["Service", "Product", "Rating", "Draft"] as const;

type WizardStep = 0 | 1 | 2 | 3;

function StepHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      {hint ? <p className="mt-0.5 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-2xl border-2 border-slate-300 bg-mist p-4 shadow-[0_2px_8px_rgba(7,20,40,0.06)] ${className}`}
    >
      {children}
    </section>
  );
}

const optionIdleClass =
  "border-2 border-slate-300 bg-white text-ink shadow-[0_1px_3px_rgba(7,20,40,0.08)] hover:border-blue/60";

const backButtonClass =
  "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-slate-300 bg-mist px-4 py-2.5 text-xs font-semibold text-ink transition-colors hover:border-blue hover:text-blue disabled:cursor-not-allowed disabled:opacity-60";

export function GuestReviewFlow({ experience }: Props) {
  const title = displayTitle(experience.businessName, experience.loginId);
  const [step, setStep] = useState<WizardStep>(0);
  const [serviceIds, setServiceIds] = useState<string[]>(
    experience.services.length === 1 ? [experience.services[0]!.id] : [],
  );
  const [productIds, setProductIds] = useState<string[]>([]);
  const [tier, setTier] = useState<GuestTier | null>(null);
  const [language, setLanguage] = useState<GuestLanguage>("english");
  const [voice, setVoice] = useState<GuestVoice>("neutral");
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [googleHandoffOpen, setGoogleHandoffOpen] = useState(false);

  const selectedServices = useMemo(
    () => experience.services.filter((item) => serviceIds.includes(item.id)),
    [experience.services, serviceIds],
  );

  const selectedProducts = useMemo(() => {
    const items: { id: string; name: string; serviceName: string }[] = [];
    for (const service of experience.services) {
      if (!serviceIds.includes(service.id)) continue;
      for (const product of service.products) {
        if (productIds.includes(product.id)) {
          items.push({ id: product.id, name: product.name, serviceName: service.name });
        }
      }
    }
    return items;
  }, [experience.services, serviceIds, productIds]);

  const stars = tier ? starsForTier(tier) : 0;

  const canAdvance =
    (step === 0 && serviceIds.length > 0) ||
    (step === 1 && productIds.length > 0) ||
    (step === 2 && tier !== null);

  function clearDraftState() {
    setDraft("");
    setError(null);
  }

  function toggleService(id: string) {
    setServiceIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (next.length === 0) {
        setProductIds([]);
        setTier(null);
      } else if (prev.includes(id)) {
        const removedService = experience.services.find((item) => item.id === id);
        const removedProductIds = new Set(removedService?.products.map((p) => p.id) ?? []);
        setProductIds((products) => products.filter((pid) => !removedProductIds.has(pid)));
      }
      return next;
    });
    clearDraftState();
  }

  function toggleProduct(id: string) {
    setProductIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
    clearDraftState();
  }

  function goBack() {
    setError(null);
    if (step === 3) {
      clearDraftState();
      setStep(2);
      return;
    }
    if (step === 2) setStep(1);
    else if (step === 1) setStep(0);
  }

  async function buildDraft() {
    if (!tier || serviceIds.length === 0 || productIds.length === 0) return;
    setPending(true);
    setError(null);
    setCopied(false);
    try {
      const response = await fetch("/api/guest/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          loginId: experience.loginId,
          serviceIds,
          productIds,
          tier,
          language,
          voice,
        }),
      });
      const body = (await response.json().catch(() => null)) as
        | { draft?: string; error?: string }
        | null;
      if (!response.ok || !body?.draft) {
        setError(body?.error ?? "The draft could not be created.");
        setPending(false);
        return false;
      }
      setDraft(body.draft);
      setPending(false);
      return true;
    } catch {
      setError("The request could not be sent.");
      setPending(false);
      return false;
    }
  }

  async function goNext() {
    setError(null);
    if (step === 0 && serviceIds.length > 0) {
      setStep(1);
      return;
    }
    if (step === 1 && productIds.length > 0) {
      setStep(2);
      return;
    }
    if (step === 2 && tier) {
      const ok = await buildDraft();
      if (ok) setStep(3);
    }
  }

  async function copyAndContinue() {
    if (!draft.trim()) return;
    setError(null);
    window.open(experience.mapLink, "_blank", "noopener,noreferrer");
    try {
      await navigator.clipboard.writeText(draft.trim());
      setCopied(true);
      setGoogleHandoffOpen(true);
    } catch {
      setError("Copy failed. Select the text in the box above, copy it, then open Google.");
    }
  }

  const productHint =
    selectedServices.length === 1
      ? selectedServices[0]!.name
      : `${selectedServices.length} services`;

  const nextLabel =
    step === 2 ? (pending ? "Writing draft…" : "Next — get draft") : "Next";

  return (
    <div className="flex min-h-0 flex-col">
      <GoogleReviewHandoff
        open={googleHandoffOpen}
        stars={stars}
        mapLink={experience.mapLink}
        onClose={() => setGoogleHandoffOpen(false)}
      />
      <div className="bg-navy px-5 py-6 text-white sm:px-6">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-blue-200 uppercase">
          Your visit
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h1>
        {experience.phone ? (
          <a
            href={`tel:${experience.phone}`}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white/90"
          >
            <span className="text-white/60">Questions</span>
            {experience.phone}
          </a>
        ) : null}
      </div>

      <div className="px-4 py-4 sm:px-5">
        <ol className="flex gap-1" aria-label="Progress">
          {STEPS.map((label, index) => {
            const done = index < step;
            const current = index === step;
            return (
              <li key={label} className="flex-1">
                <div
                  className={`h-1.5 rounded-full transition-colors ${
                    done || current ? "bg-blue" : "bg-slate-300"
                  } ${current ? "ring-2 ring-blue/25" : ""}`}
                  title={label}
                />
                <p
                  className={`mt-1.5 truncate text-center text-[10px] font-semibold uppercase tracking-wide ${
                    current ? "text-blue" : "text-muted"
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
          <Panel>
            <StepHeader
              title="Choose services"
              hint="Pick one or more — tap again to turn off."
            />
            <ul className="space-y-2">
              {experience.services.map((item) => {
                const selected = serviceIds.includes(item.id);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleService(item.id)}
                      className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-semibold transition-all ${
                        selected
                          ? "bg-blue text-white shadow-[0_8px_24px_rgba(0,96,240,0.35)] ring-2 ring-white/20"
                          : optionIdleClass
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                          selected ? "bg-white/20 text-white" : "bg-mist text-blue"
                        }`}
                      >
                        {item.products.length}
                      </span>
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </Panel>
        ) : null}

        {step === 1 ? (
          <Panel>
            <StepHeader
              title="Choose products"
              hint={`${productHint} · pick one or more`}
            />
            <div className="space-y-4">
              {selectedServices.map((service) => (
                <div key={service.id}>
                  {selectedServices.length > 1 ? (
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-600">
                      {service.name}
                    </p>
                  ) : null}
                  <ul className="space-y-2">
                    {service.products.map((item) => {
                      const selected = productIds.includes(item.id);
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            aria-pressed={selected}
                            onClick={() => toggleProduct(item.id)}
                            className={`w-full cursor-pointer rounded-xl px-4 py-3.5 text-left text-sm font-medium transition-all ${
                              selected
                                ? "border-2 border-blue bg-blue/[0.08] text-blue ring-2 ring-blue/25 shadow-sm"
                                : optionIdleClass
                            }`}
                          >
                            {item.name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </Panel>
        ) : null}

        {step === 2 ? (
          <Panel>
            <StepHeader
              title="How was it?"
              hint={`${selectedProducts.map((p) => p.name).join(" · ")} · stars follow your pick`}
            />
            <div className="grid grid-cols-3 gap-2">
              {(["Good", "Better", "Best"] as const).map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setTier(label);
                    setDraft("");
                  }}
                  className={`cursor-pointer rounded-xl py-3 text-sm font-semibold transition-all ${
                    tier === label
                      ? "bg-blue text-white shadow-md"
                      : optionIdleClass
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-xl border-2 border-slate-300 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs font-semibold text-muted">Star rating</p>
              <p className="mt-0.5 text-xs text-muted">
                {tier
                  ? `${tier} · ${stars} star${stars === 1 ? "" : "s"} on Google`
                  : "Fills when you pick Good, Better, or Best"}
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
              <StepHeader title="Review language" hint="Pick one." />
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Review language">
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
                    className={`cursor-pointer rounded-xl py-3 text-sm font-semibold transition-all ${
                      language === option.id
                        ? "bg-blue text-white shadow-md"
                        : optionIdleClass
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {language === "hindi" || language === "hinglish" ? (
                <div className="mt-4">
                  <StepHeader
                    title="Review voice"
                    hint="Neutral avoids raha/rahi in the draft."
                  />
                  <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Review voice">
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
                        className={`cursor-pointer rounded-xl py-3 text-sm font-semibold transition-all ${
                          voice === option.id
                            ? "bg-blue text-white shadow-md"
                            : optionIdleClass
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </Panel>
        ) : null}

        {step === 3 && draft ? (
          <Panel className="border-blue/20 bg-gradient-to-b from-blue/[0.06] to-white">
            <StepHeader title="Your draft" hint="Edit anything before you post on Google." />
            <div className="mb-4 rounded-xl border-2 border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-950">
              Google opens empty on purpose — it does not accept pre-filled reviews. Copy &
              Continue puts your words on the clipboard; you choose the same stars and paste on
              Google.
            </div>
            <p className="mb-2 text-center text-lg tracking-wide text-[#e5a100]" aria-hidden="true">
              {"★".repeat(stars)}
              <span className="text-slate-200">{"★".repeat(5 - stars)}</span>
            </p>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={6}
              className={`${fieldClass} resize-y bg-white text-base leading-7`}
            />
            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={copyAndContinue}
                className={`${primaryButtonClass} w-full py-3.5 shadow-[0_8px_24px_rgba(0,96,240,0.35)]`}
              >
                {copied ? "Copied — opening Google…" : "Copy & Continue"}
              </button>
              <button
                type="button"
                onClick={buildDraft}
                disabled={pending}
                className={`${quietButtonClass} w-full`}
              >
                Regenerate draft
              </button>
            </div>
            <p className="mt-3 text-center text-xs leading-5 text-muted">
              Tap {stars} star{stars === 1 ? "" : "s"} on Google, paste this text, then Post.
            </p>
          </Panel>
        ) : null}

        {error ? (
          <p
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        {step < 3 ? (
          <div className="-mx-4 mt-5 flex items-center gap-2 border-t-2 border-slate-200 bg-mist px-4 py-4 sm:-mx-5 sm:px-5">
            {step > 0 ? (
              <button type="button" onClick={goBack} className={backButtonClass} disabled={pending}>
                Back
              </button>
            ) : null}
            <button
              type="button"
              disabled={!canAdvance || pending}
              onClick={goNext}
              className={`${primaryButtonClass} min-w-0 flex-1 py-3.5 shadow-[0_8px_24px_rgba(0,96,240,0.35)] disabled:shadow-none`}
            >
              {nextLabel}
            </button>
          </div>
        ) : (
          <div className="-mx-4 mt-5 border-t-2 border-slate-200 bg-mist px-4 py-4 sm:-mx-5 sm:px-5">
            <button type="button" onClick={goBack} className={backButtonClass} disabled={pending}>
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
