"use client";

import Link from "next/link";
import { primaryButtonClass, quietButtonClass } from "@/components/admin/styles";

export function BrochurePrintBar() {
  return (
    <div className="brochure-no-print sticky top-0 z-50 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
        <Link href="/" className={`${quietButtonClass} text-sm`}>
          ← Back to site
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className={`${primaryButtonClass} text-sm`}
        >
          Save as PDF
        </button>
      </div>
      <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-muted">
        Opens your browser print dialog — choose &quot;Save as PDF&quot; as the destination.
      </p>
    </div>
  );
}
