"use client";

import { useMemo, useState } from "react";
import { fieldClass, primaryButtonClass, quietButtonClass } from "@/components/admin/styles";
import type { GuestExperience } from "@/lib/business-owners";
import { displayTitle } from "@/lib/initials";

type Tier = "Good" | "Better" | "Best";

type Props = {
  experience: GuestExperience;
};

export function GuestReviewFlow({ experience }: Props) {
  const title = displayTitle(experience.businessName, experience.loginId);
  const [serviceId, setServiceId] = useState<string | null>(
    experience.services.length === 1 ? experience.services[0]!.id : null,
  );
  const [productId, setProductId] = useState<string | null>(null);
  const [tier, setTier] = useState<Tier | null>(null);
  const [stars, setStars] = useState<number>(4);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const service = useMemo(
    () => experience.services.find((item) => item.id === serviceId) ?? null,
    [experience.services, serviceId],
  );

  const canDraft =
    serviceId && productId && tier && stars >= 1 && stars <= 5 && !pending;

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
          serviceId,
          productId,
          tier,
          stars,
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

  function selectService(id: string) {
    setServiceId(id);
    setProductId(null);
    setDraft("");
    setError(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.14em] text-blue uppercase">Your visit</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink">{title}</h1>
        {experience.phone ? (
          <p className="mt-2 text-sm text-muted">
            Questions?{" "}
            <a href={`tel:${experience.phone}`} className="font-semibold text-blue hover:underline">
              {experience.phone}
            </a>
          </p>
        ) : null}
      </div>

      <section>
        <h2 className="text-sm font-semibold text-ink">Choose a service</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {experience.services.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectService(item.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                serviceId === item.id
                  ? "bg-blue text-white"
                  : "border border-slate-200 bg-white text-ink hover:border-blue"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </section>

      {service ? (
        <section>
          <h2 className="text-sm font-semibold text-ink">{service.name}</h2>
          <ul className="mt-3 space-y-2">
            {service.products.map((product) => (
              <li key={product.id}>
                <button
                  type="button"
                  onClick={() => {
                    setProductId(product.id);
                    setDraft("");
                    setError(null);
                  }}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                    productId === product.id
                      ? "bg-blue/10 text-blue ring-2 ring-blue"
                      : "border border-slate-200 bg-white text-ink hover:border-blue/40"
                  }`}
                >
                  {product.name}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {productId ? (
        <>
          <section>
            <h2 className="text-sm font-semibold text-ink">How was it?</h2>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {(["Good", "Better", "Best"] as const).map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setTier(label);
                    setDraft("");
                  }}
                  className={`rounded-xl py-2.5 text-sm font-semibold ${
                    tier === label
                      ? "bg-blue text-white"
                      : "border border-slate-200 bg-white text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold text-muted">Stars</p>
              <div className="mt-2 flex gap-1" role="group" aria-label="Star rating">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setStars(value);
                      setDraft("");
                    }}
                    className="text-2xl leading-none"
                    aria-label={`${value} star${value === 1 ? "" : "s"}`}
                  >
                    {value <= stars ? "★" : "☆"}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {!draft ? (
            <button
              type="button"
              disabled={!canDraft}
              onClick={buildDraft}
              className={`${primaryButtonClass} w-full`}
            >
              {pending ? "Writing draft…" : "Get review draft"}
            </button>
          ) : (
            <section>
              <h2 className="text-sm font-semibold text-ink">Your draft</h2>
              <p className="mt-1 text-xs text-muted">Edit anything before you post on Google.</p>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={5}
                className={`${fieldClass} mt-3 resize-y`}
              />
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={copyAndContinue}
                  className={`${primaryButtonClass} flex-1`}
                >
                  {copied ? "Copied — opening Google…" : "Copy & Continue"}
                </button>
                <button
                  type="button"
                  onClick={buildDraft}
                  disabled={pending}
                  className={`${quietButtonClass} flex-1`}
                >
                  Regenerate
                </button>
              </div>
              <p className="mt-3 text-xs leading-5 text-muted">
                Copy & Continue opens Google’s review page for this business. Paste your words,
                confirm stars, and tap Post yourself.
              </p>
            </section>
          )}
        </>
      ) : null}

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
