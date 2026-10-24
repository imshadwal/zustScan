"use client";

import { useState } from "react";
import { quietButtonClass } from "@/components/admin/styles";

export function GuestLinkCopy({ url, onDark = false }: { url: string; onDark?: boolean }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
      <p
        className={`min-w-0 flex-1 break-all font-mono text-sm ${onDark ? "text-white/75" : "text-muted"}`}
      >
        {url}
      </p>
      <button type="button" onClick={copy} className={`${quietButtonClass} shrink-0`}>
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
