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
        className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center text-ink"
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
                className="relative w-full max-w-sm rounded-2xl border border-black/5 bg-white p-5 text-ink"
              >
                <h2 id={titleId} className="heading-4">
                  Why trust us
                </h2>
                <p className="body-2 mt-3 text-ink">{text}</p>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn-primary mt-6 w-full"
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
