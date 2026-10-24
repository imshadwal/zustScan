"use client";

import { useState } from "react";
import { fieldClass } from "@/components/admin/styles";

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M3 12s3.5-7 9-7c1.8 0 3.4.5 4.7 1.2M21 12s-3.5 7-9 7c-1.8 0-3.4-.5-4.7-1.2M9.5 9.5a3 3 0 014 4M14.5 14.5a3 3 0 01-4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M3 3l18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

type PasswordInputProps = {
  id: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  inputClassName?: string;
  wrapperClassName?: string;
};

export function PasswordInput({
  id,
  name,
  value,
  onChange,
  autoComplete,
  placeholder,
  required,
  inputClassName,
  wrapperClassName = "",
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const inputCls = inputClassName ?? fieldClass;

  return (
    <div className={`relative ${wrapperClassName}`.trim()}>
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputCls} pr-12`}
      />
      <button
        type="button"
        className="absolute top-1/2 right-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition-colors hover:bg-mist hover:text-ink"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        aria-controls={id}
      >
        <EyeIcon open={visible} />
      </button>
    </div>
  );
}

export function RevealableSecret({
  value,
  className = "mt-1 font-mono text-lg break-all",
}: {
  value: string;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-wrap items-start gap-3">
      <p className={className}>{visible ? value : "•".repeat(Math.min(value.length, 24))}</p>
      <button
        type="button"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:border-blue hover:text-blue"
        onClick={() => setVisible((current) => !current)}
        aria-pressed={visible}
      >
        <EyeIcon open={visible} />
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
