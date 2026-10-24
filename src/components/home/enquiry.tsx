"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { whatsappUrl } from "@/lib/site";

type EnquiryContextValue = {
  openEnquiry: () => void;
};

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

const businessTypes = ["Restaurant", "Hotel", "Retail", "Service", "Other"];

const emptyForm = {
  name: "",
  business: "",
  phone: "",
  type: "Hotel",
  city: "",
  outlets: "1",
  referral: "",
  message: "",
};

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  function update(field: keyof typeof emptyForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const lines = [
      "Hello Zust Scan, I would like to enquire.",
      "",
      `Name: ${form.name.trim()}`,
      `Business: ${form.business.trim()}`,
      `Phone: ${form.phone.trim()}`,
      `Type: ${form.type}`,
      `City: ${form.city.trim()}`,
      `Outlets: ${form.outlets.trim() || "1"}`,
    ];
    if (form.referral.trim()) {
      lines.push(`Referral / referred by: ${form.referral.trim()}`);
    }
    if (form.message.trim()) {
      lines.push(`Note: ${form.message.trim()}`);
    }
    const url = `${whatsappUrl}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setForm(emptyForm);
    setOpen(false);
  }

  return (
    <EnquiryContext.Provider value={{ openEnquiry: () => setOpen(true) }}>
      {children}
      {open ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center p-3 sm:items-center sm:p-6">
          <button
            type="button"
            aria-label="Close enquiry form"
            className="absolute inset-0 bg-navy/70"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[28px] bg-white p-6 shadow-[0_24px_80px_rgba(7,20,40,0.28)] sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-blue uppercase">
                  Enquiry
                </p>
                <h2 id={titleId} className="mt-2 text-2xl font-semibold text-ink">
                  Tell us about the business
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  These details open in WhatsApp so we can reply on the same chat.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mist text-ink"
                onClick={() => setOpen(false)}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <form className="mt-6 space-y-4" onSubmit={submit}>
              <Field label="Your name" value={form.name} onChange={(value) => update("name", value)} autoComplete="name" />
              <Field label="Business name" value={form.business} onChange={(value) => update("business", value)} autoComplete="organization" />
              <Field label="Phone number" value={form.phone} onChange={(value) => update("phone", value)} type="tel" autoComplete="tel" inputMode="tel" />
              <label className="block text-sm font-medium text-ink">
                Business type
                <select
                  required
                  value={form.type}
                  onChange={(event) => update("type", event.target.value)}
                  className="mt-1.5 h-12 w-full rounded-2xl border border-[#d9e2ef] bg-white px-4 text-base text-ink outline-none focus:border-blue"
                >
                  {businessTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>
              <Field label="City" value={form.city} onChange={(value) => update("city", value)} autoComplete="address-level2" />
              <label className="block text-sm font-medium text-ink">
                How many outlets?
                <select
                  value={form.outlets}
                  onChange={(event) => update("outlets", event.target.value)}
                  className="mt-1.5 h-12 w-full rounded-2xl border border-[#d9e2ef] bg-white px-4 text-base text-ink outline-none focus:border-blue"
                >
                  <option value="1">1 location</option>
                  <option value="2">2 (second outlet add-on)</option>
                  <option value="3+">3 or more</option>
                </select>
              </label>
              <Field
                label="Referral (optional)"
                value={form.referral}
                onChange={(value) => update("referral", value)}
                autoComplete="off"
                required={false}
              />
              <p className="-mt-2 text-xs text-muted">
                Name or phone of who referred you — ₹500 off each when both businesses go live.
              </p>
              <label className="block text-sm font-medium text-ink">
                Anything we should know
                <textarea
                  value={form.message}
                  onChange={(event) => update("message", event.target.value)}
                  rows={3}
                  className="mt-1.5 w-full resize-none rounded-2xl border border-[#d9e2ef] px-4 py-3 text-base text-ink outline-none focus:border-blue"
                />
              </label>
              <button
                type="submit"
                className="inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-blue text-sm font-semibold text-white transition-colors hover:bg-blue-deep"
              >
                Continue on WhatsApp
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </EnquiryContext.Provider>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  inputMode,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  inputMode?: "tel" | "text";
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <input
        required={required}
        type={type}
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 h-12 w-full rounded-2xl border border-[#d9e2ef] px-4 text-base text-ink outline-none focus:border-blue"
      />
    </label>
  );
}

export function useEnquiry() {
  const value = useContext(EnquiryContext);
  if (!value) {
    throw new Error("Enquiry buttons must be inside EnquiryProvider");
  }
  return value;
}

export function EnquiryButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { openEnquiry } = useEnquiry();
  return (
    <button type="button" onClick={openEnquiry} className={`cursor-pointer ${className ?? ""}`}>
      {children}
    </button>
  );
}
