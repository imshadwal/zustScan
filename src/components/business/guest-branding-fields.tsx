"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { quietButtonClass } from "@/components/admin/styles";
import { useToast } from "@/components/toast/toast-provider";
import { GUEST_THEME_LIST, type GuestThemeId } from "@/lib/guest-themes";

export function GuestBrandingFields({
  initialThemeId,
  initialLogoUrl,
}: {
  initialThemeId: GuestThemeId;
  initialLogoUrl: string | null;
}) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [themeId, setThemeId] = useState<GuestThemeId>(initialThemeId);
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl);
  const [logoPending, setLogoPending] = useState(false);

  async function uploadLogo(file: File) {
    setLogoPending(true);
    try {
      const form = new FormData();
      form.set("logo", file);
      const response = await fetch("/api/business/logo", { method: "POST", body: form });
      const body = (await response.json().catch(() => null)) as
        | { logoUrl?: string; error?: string }
        | null;
      if (!response.ok || !body?.logoUrl) {
        toastError(body?.error ?? "Logo could not be uploaded.");
        setLogoPending(false);
        return;
      }
      setLogoUrl(body.logoUrl);
      success("Logo uploaded.");
      router.refresh();
      setLogoPending(false);
    } catch {
      toastError("The upload could not be sent.");
      setLogoPending(false);
    }
  }

  async function removeLogo() {
    setLogoPending(true);
    try {
      const response = await fetch("/api/business/logo", { method: "DELETE" });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        toastError(body?.error ?? "Logo could not be removed.");
        setLogoPending(false);
        return;
      }
      setLogoUrl(null);
      success("Logo removed.");
      router.refresh();
      setLogoPending(false);
    } catch {
      toastError("The request could not be sent.");
      setLogoPending(false);
    }
  }

  return (
    <>
      <input type="hidden" name="guestThemeId" value={themeId} />

      <div className="border-t border-slate-200 pt-6">
        <h2 className="text-lg font-semibold text-ink">Guest page look</h2>
        <p className="mt-1 text-sm text-muted">
          Logo and colours appear on your QR guest page. The review steps stay the same for every
          business.
        </p>

        <div className="mt-5">
          <p className="text-sm font-semibold text-ink">Logo</p>
          <p className="mt-1 text-xs text-muted">PNG, JPEG, or WebP · max 2 MB · square works best.</p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            {logoUrl ? (
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <Image src={logoUrl} alt="" fill className="object-contain p-1" unoptimized />
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-mist text-xs text-muted">
                No logo
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void uploadLogo(file);
                  event.target.value = "";
                }}
              />
              <button
                type="button"
                disabled={logoPending}
                className={quietButtonClass}
                onClick={() => fileRef.current?.click()}
              >
                {logoPending ? "Uploading…" : logoUrl ? "Replace logo" : "Upload logo"}
              </button>
              {logoUrl ? (
                <button
                  type="button"
                  disabled={logoPending}
                  className={quietButtonClass}
                  onClick={() => void removeLogo()}
                >
                  Remove
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <fieldset className="mt-6">
          <legend className="text-sm font-semibold text-ink">Colour theme</legend>
          <p className="mt-1 text-xs text-muted">Pick a preset — we keep text readable on every theme.</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {GUEST_THEME_LIST.map((theme) => {
              const selected = themeId === theme.id;
              return (
                <li key={theme.id}>
                  <button
                    type="button"
                    onClick={() => setThemeId(theme.id)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl border-2 px-3 py-3 text-left transition-colors ${
                      selected
                        ? "border-blue bg-blue/5 ring-2 ring-blue/20"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <span className="flex shrink-0 gap-1" aria-hidden="true">
                      <span
                        className="h-8 w-8 rounded-lg border border-black/10"
                        style={{ backgroundColor: theme.header }}
                      />
                      <span
                        className="h-8 w-8 rounded-lg border border-black/10"
                        style={{ backgroundColor: theme.accent }}
                      />
                    </span>
                    <span className="text-sm font-semibold text-ink">{theme.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </fieldset>
      </div>
    </>
  );
}
