"use client";

import { useEffect, useId } from "react";
import {
  dangerPrimaryButtonClass,
  primaryButtonClass,
  quietButtonClass,
} from "@/components/admin/styles";

type Props = {
  open: boolean;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  pending?: boolean;
  tone?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  pending = false,
  tone = "default",
  onConfirm,
  onCancel,
}: Props) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !pending) onCancel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, pending, onCancel]);

  if (!open) return null;

  const confirmClass = tone === "danger" ? dangerPrimaryButtonClass : primaryButtonClass;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-navy/75"
        disabled={pending}
        onClick={() => {
          if (!pending) onCancel();
        }}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md rounded-3xl bg-white p-6 text-ink shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-7"
      >
        <p className="text-xs font-semibold tracking-[0.16em] text-red-700 uppercase">
          Cannot be undone
        </p>
        <h2 id={titleId} className="mt-2 text-xl font-semibold tracking-tight">
          {title}
        </h2>
        <div className="mt-3 text-sm leading-6 text-muted">{description}</div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            className={`${quietButtonClass} w-full sm:w-auto`}
            disabled={pending}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`${confirmClass} w-full sm:w-auto`}
            disabled={pending}
            onClick={onConfirm}
          >
            {pending ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
