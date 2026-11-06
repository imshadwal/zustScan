"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode, type RefObject, type TransitionEvent } from "react";
import { formatGuestContactPhone } from "@/lib/guest-display";
import type { GuestFounder } from "@/lib/founder";
import { initialsFromBusinessName } from "@/lib/initials";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced;
}

function FounderFace({
  founder,
  onBack,
  backRef,
}: {
  founder: GuestFounder;
  onBack: () => void;
  backRef: RefObject<HTMLButtonElement | null>;
}) {
  const phoneLabel = formatGuestContactPhone(founder.phone);
  const initials = initialsFromBusinessName(founder.name);

  return (
    <div className="bg-[var(--guest-surface,white)] px-4 py-4 sm:px-5">
      <button
        ref={backRef}
        type="button"
        onClick={onBack}
        className="inline-flex cursor-pointer items-center gap-1 rounded-full px-1 py-1 text-sm font-semibold text-[var(--guest-accent)]"
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
          <path
            d="M12.5 4.5 7 10l5.5 5.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Review
      </button>
      <div className="mt-2 flex flex-col items-center text-center">
        {founder.photoUrl ? (
          <div className="relative h-28 w-28 overflow-hidden rounded-full border-[3px] border-[var(--guest-accent)] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
            <Image src={founder.photoUrl} alt="" fill className="object-cover" unoptimized />
          </div>
        ) : (
          <span className="inline-flex h-28 w-28 items-center justify-center rounded-full bg-[var(--guest-accent)] text-3xl font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
            {initials}
          </span>
        )}
        <h2 className="mt-4 text-2xl font-semibold text-ink">{founder.name}</h2>
        {founder.role ? (
          <p className="mt-2 rounded-full bg-[color-mix(in_srgb,var(--guest-accent)_14%,white)] px-3 py-1 text-xs font-semibold tracking-wide text-[var(--guest-accent)] uppercase">
            {founder.role}
          </p>
        ) : null}
        {founder.note ? (
          <p className="mt-4 max-w-xs text-sm leading-6 text-ink">{founder.note}</p>
        ) : null}
      </div>
      {phoneLabel || founder.email ? (
        <div className="mt-5 space-y-2">
          {phoneLabel && founder.phone ? (
            <a
              href={`tel:${founder.phone}`}
              className="flex items-center gap-3 rounded-2xl border-2 border-[var(--guest-border,#cbd5e1)] bg-[var(--guest-panel,#f4f7fb)] px-3 py-2.5"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--guest-accent)] text-white">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                  <path
                    fill="currentColor"
                    d="M7.4 3.8c.4-.4 1-.5 1.5-.3l2.2.9c.5.2.8.7.8 1.2l-.1 2.2a1.3 1.3 0 0 1-.8 1.1l-1.3.6a10.6 10.6 0 0 0 4.5 4.5l.6-1.3c.2-.4.6-.7 1.1-.8l2.2-.1c.5 0 1 .3 1.2.8l.9 2.2c.2.5.1 1.1-.3 1.5l-1.4 1.4c-.4.4-1 .6-1.6.5C10.8 17.6 6.4 13.2 5.5 7.8c-.1-.6.1-1.2.5-1.6l1.4-1.4Z"
                  />
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold tracking-wide text-muted uppercase">Call</span>
                <span className="block text-sm font-semibold text-ink">{phoneLabel}</span>
              </span>
            </a>
          ) : null}
          {founder.email ? (
            <a
              href={`mailto:${founder.email}`}
              className="flex items-center gap-3 rounded-2xl border-2 border-[var(--guest-border,#cbd5e1)] bg-[var(--guest-panel,#f4f7fb)] px-3 py-2.5"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--guest-accent)] text-white">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                  <path
                    fill="currentColor"
                    d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Zm2.2.3 5.3 3.7a.8.8 0 0 0 .9 0l5.4-3.7a.8.8 0 0 0-.5-1.3h-10.6a.8.8 0 0 0-.5 1.3Z"
                  />
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold tracking-wide text-muted uppercase">Email</span>
                <span className="block truncate text-sm font-semibold text-ink">{founder.email}</span>
              </span>
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function FounderFlip({
  founder,
  children,
}: {
  founder: GuestFounder | null;
  children: ReactNode;
}) {
  const reduced = usePrefersReducedMotion();
  const [showFounder, setShowFounder] = useState(false);
  const [angle, setAngle] = useState(0);
  const [animate, setAnimate] = useState(true);
  const phase = useRef<"idle" | "closing" | "opening">("idle");
  const moved = useRef(false);
  const frontRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);

  function beginFlip() {
    if (reduced) {
      moved.current = true;
      setShowFounder((value) => !value);
      return;
    }
    if (phase.current !== "idle") return;
    phase.current = "closing";
    setAnimate(true);
    setAngle(90);
  }

  function onTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
    if (phase.current === "closing") {
      moved.current = true;
      setShowFounder((value) => !value);
      setAnimate(false);
      setAngle(-90);
      phase.current = "opening";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimate(true);
          setAngle(0);
        });
      });
      return;
    }
    if (phase.current === "opening") {
      phase.current = "idle";
      moved.current = true;
    }
  }

  useEffect(() => {
    if (!moved.current) return;
    if (showFounder) backRef.current?.focus();
    else frontRef.current?.focus();
  }, [showFounder]);

  if (!founder) return <>{children}</>;

  return (
    <div
      className={
        animate
          ? "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          : undefined
      }
      style={{ transform: `rotateY(${angle}deg)`, transformOrigin: "center" }}
      onTransitionEnd={onTransitionEnd}
    >
      <div className={showFounder ? "hidden" : undefined} aria-hidden={showFounder} inert={showFounder}>
        <div className="bg-[var(--guest-surface,white)] px-4 pt-4">
          <button
            ref={frontRef}
            type="button"
            onClick={beginFlip}
            className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-[var(--guest-accent)] bg-white px-4 py-3 text-left"
          >
            {founder.photoUrl ? (
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-[var(--guest-accent)] bg-white">
                <Image src={founder.photoUrl} alt="" fill className="object-cover" unoptimized />
              </span>
            ) : (
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--guest-accent)] text-sm font-semibold text-white">
                {initialsFromBusinessName(founder.name)}
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="caption-1 block text-[var(--guest-accent)]">
                Meet {founder.name.trim().split(/\s+/)[0]}
              </span>
              <span className="title-3 block truncate text-ink">
                {founder.role?.trim() || "The founder"}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--guest-accent)] text-white"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4">
                <path
                  d="M5 12h12M13 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
        {children}
      </div>
      <div className={showFounder ? undefined : "hidden"} aria-hidden={!showFounder} inert={!showFounder}>
        <FounderFace founder={founder} onBack={beginFlip} backRef={backRef} />
      </div>
    </div>
  );
}
