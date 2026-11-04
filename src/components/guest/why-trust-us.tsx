"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function WhyTrustUsInfo({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      buttonRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Why trust us"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center text-white"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="8" r="1.15" fill="currentColor" />
          <path d="M12 11.2v5.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      {open
        ? createPortal(
            <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center">
              <button
                type="button"
                aria-label="Close"
                className="absolute inset-0 bg-navy/60"
                onClick={() => setOpen(false)}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="relative w-full max-w-sm rounded-3xl bg-white p-5 text-ink shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
              >
                <h2 id={titleId} className="text-lg font-semibold">
                  Why trust us
                </h2>
                <p className="mt-3 text-sm leading-6 text-ink">{text}</p>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-5 w-full cursor-pointer rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Close
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
