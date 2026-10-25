"use client";

import { useEffect, useId } from "react";
import { quietButtonClass } from "@/components/admin/styles";

type Props = {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function OwnerManageModal({ open, title, subtitle, onClose, children }: Props) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-navy/75"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white text-ink shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.12em] text-blue uppercase">
              Business owner
            </p>
            <h2 id={titleId} className="mt-1 truncate text-xl font-semibold tracking-tight">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-0.5 truncate font-mono text-sm text-muted">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Close"
            className={`${quietButtonClass} shrink-0 !px-3 !py-2`}
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
