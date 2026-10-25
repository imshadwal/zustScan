"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { fieldClass, primaryButtonClass } from "@/components/admin/styles";
import { useToast } from "@/components/toast/toast-provider";
import { displayGuestBusinessTitle } from "@/lib/initials";

type Profile = {
  businessName: string | null;
  city: string | null;
  phone: string | null;
  mapLink: string | null;
  brief: string | null;
};

export function ProfileForm({ initial }: { initial: Profile }) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [businessName, setBusinessName] = useState(initial.businessName ?? "");
  const [city, setCity] = useState(initial.city ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [mapLink, setMapLink] = useState(initial.mapLink ?? "");
  const [brief, setBrief] = useState(initial.brief ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const guestHeadingPreview = displayGuestBusinessTitle(
    businessName || null,
    "your-business",
    city || null,
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      const response = await fetch("/api/business/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, city, phone, mapLink, brief }),
      });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        const message = body?.error ?? "The profile could not be saved.";
        setError(message);
        toastError(message);
        setPending(false);
        return;
      }
      success("Profile saved.");
      setPending(false);
      router.refresh();
    } catch {
      const message = "The request could not be sent.";
      setError(message);
      toastError(message);
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
          <label className="block text-sm font-semibold text-ink" htmlFor="business-city">
            City <span className="text-red-600">*</span>
          </label>
          <input
            id="business-city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Varanasi"
            className={`${fieldClass} mt-2`}
            required
            minLength={2}
            maxLength={80}
          />
          <p className="mt-1.5 text-xs text-muted">
            Guest page heading:{" "}
            <span className="font-semibold text-ink">{guestHeadingPreview}</span>
          </p>
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
            Google review link <span className="text-red-600">*</span>
          </label>
          <input
            id="business-map"
            type="url"
            value={mapLink}
            onChange={(e) => setMapLink(e.target.value)}
            placeholder="https://g.page/r/…/review"
            className={`${fieldClass} mt-2`}
            required
          />
          <p className="mt-1.5 text-xs text-muted">
            From Google Business Profile → Get more reviews. Maps or share links also work, but
            g.page … /review opens Write a review directly.
          </p>
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
      <button type="submit" className={`${primaryButtonClass} mt-6`} disabled={pending}>
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
