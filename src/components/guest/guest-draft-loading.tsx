"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { guestPanelClass } from "@/components/guest/styles";

const STATUS_LINES = [
  "Starting your draft…",
  "Using what you picked…",
  "Writing in your chosen language…",
  "Almost ready — you can edit every word…",
] as const;

const REVEAL_AT = 90;
const FINISH_AT = 100;

/** Reaches ~90% in about 3s while OpenAI runs. */
function progressFromElapsedMs(elapsedMs: number): number {
  const s = elapsedMs / 1000;
  if (s <= 0.35) return (s / 0.35) * 32;
  const t = s - 0.35;
  return Math.min(96, 32 + 64 * (1 - Math.exp(-t / 0.95)));
}

function statusIndexForProgress(progress: number): number {
  if (progress < 22) return 0;
  if (progress < 48) return 1;
  if (progress < 72) return 2;
  return 3;
}

type Props = {
  /** Set when the API returned successfully — bar runs to 90%+ before `onReveal`. */
  fetchComplete?: boolean;
  onReveal?: () => void;
};

export function GuestDraftLoadingPanel({ fetchComplete = false, onReveal }: Props) {
  const [progress, setProgress] = useState(0);
  const revealedRef = useRef(false);
  const fetchCompleteRef = useRef(fetchComplete);

  fetchCompleteRef.current = fetchComplete;

  const displayPercent = Math.round(progress);
  const statusIndex = statusIndexForProgress(progress);

  useEffect(() => {
    revealedRef.current = false;
    setProgress(0);
    const started = performance.now();
    let frame = 0;

    const tick = () => {
      const elapsed = performance.now() - started;
      setProgress((prev) => {
        let target = progressFromElapsedMs(elapsed);
        if (fetchCompleteRef.current && target < REVEAL_AT) {
          target = Math.max(target, Math.min(REVEAL_AT + 3, prev + 4));
        }
        return Math.max(prev, target);
      });
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const tryReveal = useCallback(() => {
    if (revealedRef.current || !fetchComplete || !onReveal) return;
    if (progress < REVEAL_AT) return;
    revealedRef.current = true;
    setProgress(FINISH_AT);
    window.setTimeout(onReveal, 380);
  }, [fetchComplete, onReveal, progress]);

  useEffect(() => {
    tryReveal();
  }, [tryReveal]);

  return (
    <section
      className={`${guestPanelClass} border-[color-mix(in_srgb,var(--guest-accent)_35%,var(--guest-border,#cbd5e1))]`}
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold text-ink">Your draft</h2>
        <span className="text-xs font-semibold tabular-nums text-[var(--guest-accent,#0060f0)]">
          {displayPercent}%
        </span>
      </div>
      <p className="mt-1 min-h-[1.25rem] text-xs text-muted transition-opacity duration-300">
        {STATUS_LINES[statusIndex]}
      </p>

      <div
        className="relative mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-300/85 shadow-inner"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={displayPercent}
        aria-valuetext={`Generating review draft, ${displayPercent} percent`}
      >
        {/* scaleX fill — % width + Tailwind bg-[var(...,#hex)] often fails to paint on mobile */}
        <div
          className="absolute inset-0 origin-left rounded-full motion-reduce:transition-none transition-transform duration-150 ease-out"
          style={{
            transform: `scaleX(${Math.min(1, Math.max(0.03, progress / 100))})`,
            backgroundColor: "var(--guest-accent, #0066ff)",
          }}
        />
      </div>

      <div className="mt-5 space-y-2.5" aria-hidden="true">
        <div
          className="h-3.5 animate-pulse rounded bg-slate-200/90"
          style={{ width: `${Math.min(100, 55 + progress * 0.35)}%` }}
        />
        <div
          className="h-3.5 animate-pulse rounded bg-slate-200/90"
          style={{ width: `${Math.min(100, 40 + progress * 0.45)}%` }}
        />
        <div
          className="h-3.5 animate-pulse rounded bg-slate-200/90"
          style={{ width: `${Math.min(100, 30 + progress * 0.5)}%` }}
        />
      </div>

      <p className="mt-4 text-center text-[11px] leading-5 text-muted">
        Usually a few seconds · powered by AI
      </p>
    </section>
  );
}
