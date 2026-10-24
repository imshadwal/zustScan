"use client";

import { primaryButtonClass, quietButtonClass } from "@/components/admin/styles";

type Props = {
  open: boolean;
  stars: number;
  mapLink: string;
  onClose: () => void;
};

export function GoogleReviewHandoff({ open, stars, mapLink, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-navy/70"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="google-handoff-title"
        className="relative w-full max-w-md rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
      >
        <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
          Google review
        </p>
        <h2 id="google-handoff-title" className="mt-2 text-xl font-semibold text-ink">
          Paste there — stars are manual
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Google never pre-fills review text or stars from a link (any app). Your draft is
          copied — finish these steps on Google.
        </p>
        <p className="mt-4 text-center text-2xl tracking-wide text-[#e5a100]" aria-hidden="true">
          {"★".repeat(stars)}
          <span className="text-slate-200">{"★".repeat(5 - stars)}</span>
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-ink">
          <li>
            On Google, tap <strong>{stars} star{stars === 1 ? "" : "s"}</strong> (same as above).
          </li>
          <li>Tap the review box, then paste (long-press → Paste on phone).</li>
          <li>Tap Post when it looks right.</li>
        </ol>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`${quietButtonClass} w-full text-center sm:w-auto`}
          >
            Open Google again
          </a>
          <button type="button" onClick={onClose} className={`${primaryButtonClass} w-full sm:w-auto`}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
