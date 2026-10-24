"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { fieldClass, primaryButtonClass } from "@/components/admin/styles";

type Profile = {
  businessName: string | null;
  phone: string | null;
  mapLink: string | null;
  brief: string | null;
};

export function ProfileForm({ initial }: { initial: Profile }) {
  const router = useRouter();
  const [businessName, setBusinessName] = useState(initial.businessName ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [mapLink, setMapLink] = useState(initial.mapLink ?? "");
  const [brief, setBrief] = useState(initial.brief ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);
    setPending(true);
    try {
      const response = await fetch("/api/business/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, phone, mapLink, brief }),
      });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(body?.error ?? "The profile could not be saved.");
        setPending(false);
        return;
      }
      setSaved(true);
      setPending(false);
      router.refresh();
    } catch {
      setError("The request could not be sent.");
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl bg-white p-6 text-ink shadow-[0_12px_40px_rgba(7,20,40,0.08)]"
    >
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-ink" htmlFor="business-name">
            Business name <span className="text-red-600">*</span>
          </label>
          <input
            id="business-name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className={`${fieldClass} mt-2`}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink" htmlFor="business-phone">
            Phone <span className="text-red-600">*</span>
          </label>
          <input
            id="business-phone"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="7007052267"
            className={`${fieldClass} mt-2`}
            required
          />
          <p className="mt-1.5 text-xs text-muted">10-digit Indian mobile.</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink" htmlFor="business-map">
            Google Maps link <span className="text-red-600">*</span>
          </label>
          <input
            id="business-map"
            type="url"
            value={mapLink}
            onChange={(e) => setMapLink(e.target.value)}
            placeholder="https://maps.app.goo.gl/..."
            className={`${fieldClass} mt-2`}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink" htmlFor="business-brief">
            Brief <span className="text-red-600">*</span>
          </label>
          <textarea
            id="business-brief"
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            rows={5}
            className={`${fieldClass} mt-2 resize-y`}
            required
          />
          <p className="mt-1.5 text-xs text-muted">20 to 2000 characters. Used later for review drafts.</p>
        </div>
      </div>
      {error ? (
        <p className="mt-4 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="mt-4 text-sm text-blue" role="status">
          Profile saved.
        </p>
      ) : null}
      <button type="submit" className={`${primaryButtonClass} mt-6`} disabled={pending}>
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
