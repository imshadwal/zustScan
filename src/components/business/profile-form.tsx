"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { fieldClass, primaryButtonClass } from "@/components/admin/styles";
import { useToast } from "@/components/toast/toast-provider";
import { GuestBrandingFields } from "@/components/business/guest-branding-fields";
import { displayTitle } from "@/lib/initials";
import { guestAddressLine } from "@/lib/guest-display";
import {
  isBusinessCategoryId,
  OTHERS_CATEGORY_ID,
  type BusinessCategoryOption,
} from "@/lib/business-categories";
import { isGuestThemeId, type GuestThemeId } from "@/lib/guest-themes";

type Profile = {
  businessName: string | null;
  city: string | null;
  businessCategory: string | null;
  businessCategoryOther: string | null;
  address: string | null;
  whyTrustUs: string | null;
  phone: string | null;
  mapLink: string | null;
  guestThemeId: GuestThemeId;
  logoUrl: string | null;
};

export function ProfileForm({
  initial,
  categories,
}: {
  initial: Profile;
  categories: BusinessCategoryOption[];
}) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [businessName, setBusinessName] = useState(initial.businessName ?? "");
  const [city, setCity] = useState(initial.city ?? "");
  const [businessCategory, setBusinessCategory] = useState(
    initial.businessCategory ?? "",
  );
  const [businessCategoryOther, setBusinessCategoryOther] = useState(
    initial.businessCategoryOther ?? "",
  );
  const [address, setAddress] = useState(initial.address ?? "");
  const [whyTrustUs, setWhyTrustUs] = useState(initial.whyTrustUs ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [mapLink, setMapLink] = useState(initial.mapLink ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [generateTrustPending, setGenerateTrustPending] = useState(false);

  const categoryId = isBusinessCategoryId(businessCategory, categories)
    ? businessCategory
    : null;
  const canGenerateTrust = categoryId !== null;

  const guestNamePreview = displayTitle(businessName || null, "your-business");
  const guestAddressPreview = guestAddressLine(address, city);

  const generateTrustLabel = useMemo(() => {
    if (!categoryId) return "Generate";
    if (categoryId === OTHERS_CATEGORY_ID && !businessCategoryOther.trim()) {
      return "Generate (add business type first)";
    }
    return "Generate";
  }, [categoryId, businessCategoryOther]);

  async function generateWhyTrust() {
    if (!categoryId) return;
    if (categoryId === OTHERS_CATEGORY_ID && businessCategoryOther.trim().length < 2) {
      toastError("Describe your business type under Others first.");
      return;
    }
    if (!businessName.trim()) {
      toastError("Enter a business name first.");
      return;
    }
    setGenerateTrustPending(true);
    try {
      const response = await fetch("/api/business/why-trust/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          city,
          address,
          categoryId,
          categoryOther: businessCategoryOther,
        }),
      });
      const body = (await response.json().catch(() => null)) as {
        whyTrustUs?: string;
        error?: string;
      } | null;
      if (!response.ok || !body?.whyTrustUs) {
        toastError(body?.error ?? "Could not generate. Try again or write your own line.");
        setGenerateTrustPending(false);
        return;
      }
      setWhyTrustUs(body.whyTrustUs);
      success("Why trust us generated — edit if you like.");
      setGenerateTrustPending(false);
    } catch {
      toastError("The request could not be sent.");
      setGenerateTrustPending(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      const form = event.currentTarget;
      const themeField = form.elements.namedItem("guestThemeId") as HTMLInputElement | null;
      const guestThemeIdRaw = themeField?.value ?? initial.guestThemeId;
      const guestThemeId = isGuestThemeId(guestThemeIdRaw)
        ? guestThemeIdRaw
        : initial.guestThemeId;

      const response = await fetch("/api/business/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          city,
          businessCategory,
          businessCategoryOther,
          address,
          whyTrustUs,
          phone,
          mapLink,
          guestThemeId,
        }),
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
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink" htmlFor="business-category">
            Category <span className="text-red-600">*</span>
          </label>
          <select
            id="business-category"
            value={businessCategory}
            onChange={(e) => setBusinessCategory(e.target.value)}
            className={`${fieldClass} mt-2`}
            required
          >
            <option value="">Select Category…</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        {businessCategory === OTHERS_CATEGORY_ID ? (
          <div>
            <label className="block text-sm font-semibold text-ink" htmlFor="business-category-other">
              Your business type <span className="text-red-600">*</span>
            </label>
            <input
              id="business-category-other"
              value={businessCategoryOther}
              onChange={(e) => setBusinessCategoryOther(e.target.value)}
              placeholder="e.g. Photography studio"
              className={`${fieldClass} mt-2`}
              required
              minLength={2}
              maxLength={80}
            />
          </div>
        ) : null}
        <div>
          <label className="block text-sm font-semibold text-ink" htmlFor="business-address">
            Address <span className="text-red-600">*</span>
          </label>
          <input
            id="business-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Shop 12, MG Road, Varanasi"
            className={`${fieldClass} mt-2`}
            required
            minLength={5}
            maxLength={200}
          />
          <p className="mt-1.5 text-xs text-muted">
            Shown in small text under your name on the guest page.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-mist/60 p-4">
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">
            Guest page preview (top)
          </p>
          <p className="mt-2 text-lg font-semibold text-ink">{guestNamePreview}</p>
          {guestAddressPreview ? (
            <p className="mt-0.5 text-xs text-muted">{guestAddressPreview}</p>
          ) : (
            <p className="mt-0.5 text-xs text-muted">Address line appears here</p>
          )}
          {phone ? (
            <p className="mt-2 text-xs text-ink">
              <span className="font-semibold text-muted">Contact number · </span>
              {phone}
            </p>
          ) : null}
          {whyTrustUs ? (
            <p className="mt-2 text-xs leading-5 text-ink">
              <span className="font-semibold text-muted">Why trust us · </span>
              {whyTrustUs}
            </p>
          ) : null}
        </div>
        <div>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <label className="block text-sm font-semibold text-ink" htmlFor="business-why-trust">
              Why trust us <span className="text-red-600">*</span>
            </label>
            <button
              type="button"
              onClick={() => void generateWhyTrust()}
              disabled={!canGenerateTrust || generateTrustPending}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-sm transition hover:bg-mist disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generateTrustPending ? "Generating…" : generateTrustLabel}
            </button>
          </div>
          <textarea
            id="business-why-trust"
            value={whyTrustUs}
            onChange={(e) => setWhyTrustUs(e.target.value)}
            rows={3}
            placeholder="Family-run since 2010. Real reviews from guests — we never post for you."
            className={`${fieldClass} mt-2 resize-y`}
            required
            minLength={10}
            maxLength={300}
          />
          <p className="mt-1.5 text-xs text-muted">
            10 to 300 characters. Shown on the guest page and used as context for AI review drafts.
            Pick a category, then Generate writes a starter line with AI — edit before you save.
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

        <GuestBrandingFields
          initialThemeId={initial.guestThemeId}
          initialLogoUrl={initial.logoUrl}
        />
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
