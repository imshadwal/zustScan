"use client";

import { useMemo, useState } from "react";
import { fieldClass, primaryButtonClass, quietButtonClass } from "@/components/admin/styles";
import type { GuestExperience } from "@/lib/business-owners";
import {
  GUEST_LANGUAGE_OPTIONS,
  type GuestLanguage,
} from "@/lib/guest-languages";
import { displayTitle } from "@/lib/initials";

type Tier = "Good" | "Better" | "Best";

type Props = {
  experience: GuestExperience;
};

const STEPS = ["Service", "Product", "Rating", "Draft"] as const;

function stepIndex(state: {
  serviceIds: string[];
  productIds: string[];
  draft: string;
}) {
  if (state.draft) return 3;
  if (state.productIds.length > 0) return 2;
  if (state.serviceIds.length > 0) return 1;
  return 0;
}

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
    <section className={`rounded-2xl border border-slate-200 bg-mist/60 p-4 ${className}`}>
      {children}
    </section>
  );
}

export function GuestReviewFlow({ experience }: Props) {
  const title = displayTitle(experience.businessName, experience.loginId);
  const [serviceIds, setServiceIds] = useState<string[]>(
    experience.services.length === 1 ? [experience.services[0]!.id] : [],
  );
  const [productIds, setProductIds] = useState<string[]>([]);
  const [tier, setTier] = useState<Tier | null>(null);
  const [stars, setStars] = useState<number>(4);
  const [language, setLanguage] = useState<GuestLanguage>("english");
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  const activeStep = stepIndex({ serviceIds, productIds, draft });

  const canDraft =
    serviceIds.length > 0 &&
    productIds.length > 0 &&
    tier &&
    stars >= 1 &&
    stars <= 5 &&
    !pending;

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

  async function buildDraft() {
    if (!canDraft) return;
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
          stars,
          language,
        }),
      });
      const body = (await response.json().catch(() => null)) as
        | { draft?: string; error?: string }
        | null;
      if (!response.ok || !body?.draft) {
        setError(body?.error ?? "The draft could not be created.");
        setPending(false);
        return;
      }
      setDraft(body.draft);
      setPending(false);
    } catch {
      setError("The request could not be sent.");
      setPending(false);
    }
  }

  async function copyAndContinue() {
    if (!draft.trim()) return;
    try {
      await navigator.clipboard.writeText(draft.trim());
      setCopied(true);
    } catch {
      setError("Copy failed. Select the text and copy it yourself.");
      return;
    }
    window.open(experience.mapLink, "_blank", "noopener,noreferrer");
  }

  const productHint =
    selectedServices.length === 1
      ? selectedServices[0]!.name
      : `${selectedServices.length} services`;

  return (
    <div className="flex flex-col">
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
            const done = index < activeStep;
            const current = index === activeStep;
            return (
              <li key={label} className="flex-1">
                <div
                  className={`h-1.5 rounded-full transition-colors ${
                    done || current ? "bg-blue" : "bg-slate-200"
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

      <div className="flex flex-1 flex-col gap-4 px-4 pb-5 sm:px-5 sm:pb-6">
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
                        : "border border-slate-200 bg-white text-ink hover:border-blue/50"
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

        {selectedServices.length > 0 ? (
          <Panel>
            <StepHeader
              title="Choose products"
              hint={`${productHint} · pick one or more`}
            />
            <div className="space-y-4">
              {selectedServices.map((service) => (
                <div key={service.id}>
                  {selectedServices.length > 1 ? (
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
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
                                ? "bg-white text-blue ring-2 ring-blue shadow-sm"
                                : "border border-slate-200/80 bg-white text-ink hover:border-blue/40"
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

        {productIds.length > 0 && selectedProducts.length > 0 ? (
          <Panel>
            <StepHeader
              title="How was it?"
              hint={`${selectedProducts.map((p) => p.name).join(" · ")} · tap Good, Better, or Best`}
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
                      : "border border-slate-200 bg-white text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs font-semibold text-muted">Star rating</p>
              <div className="mt-2 flex justify-center gap-2" role="group" aria-label="Star rating">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setStars(value);
                      setDraft("");
                    }}
                    className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-xl transition-colors ${
                      value <= stars
                        ? "bg-[#fff8e6] text-[#e5a100]"
                        : "bg-mist text-slate-300"
                    }`}
                    aria-label={`${value} star${value === 1 ? "" : "s"}`}
                  >
                    ★
                  </button>
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
                      setDraft("");
                    }}
                    className={`cursor-pointer rounded-xl py-3 text-sm font-semibold transition-all ${
                      language === option.id
                        ? "bg-blue text-white shadow-md"
                        : "border border-slate-200 bg-white text-ink"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </Panel>
        ) : null}

        {!draft && productIds.length > 0 ? (
          <button
            type="button"
            disabled={!canDraft}
            onClick={buildDraft}
            className={`${primaryButtonClass} w-full py-3.5 shadow-[0_8px_24px_rgba(0,96,240,0.35)] disabled:shadow-none`}
          >
            {pending ? "Writing draft…" : "Get review draft"}
          </button>
        ) : null}

        {draft ? (
          <Panel className="border-blue/20 bg-gradient-to-b from-blue/[0.06] to-white">
            <StepHeader title="Your draft" hint="Edit anything before you post on Google." />
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
              Paste on Google, match the stars, and tap Post yourself.
            </p>
          </Panel>
        ) : null}

        {error ? (
          <p
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
