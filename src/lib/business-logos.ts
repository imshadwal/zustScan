import "server-only";

import { normalizeLoginId, isValidLoginId } from "@/lib/login-id";
import { OwnerStoreError } from "@/lib/store-error";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { serverEnv } from "@/lib/server-env";

const BUCKET = "business-logos";
const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp"]);

function database() {
  return supabaseAdmin();
}

export function businessLogoPublicUrl(logoPath: string | null | undefined): string | null {
  if (!logoPath?.trim()) return null;
  const base = serverEnv("NEXT_PUBLIC_SUPABASE_URL")?.replace(/\/$/, "");
  if (!base) return null;
  return `${base}/storage/v1/object/public/${BUCKET}/${logoPath}`;
}

function logoObjectPath(loginId: string, ext: "png" | "jpg" | "webp") {
  return `${loginId}/logo.${ext}`;
}

function extForMime(mime: string): "png" | "jpg" | "webp" | null {
  if (mime === "image/png") return "png";
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/webp") return "webp";
  return null;
}

export async function uploadBusinessLogo(
  loginId: string,
  bytes: Uint8Array,
  contentType: string,
) {
  const id = normalizeLoginId(loginId);
  if (!isValidLoginId(id)) {
    throw new OwnerStoreError("That business owner was not found.", 404);
  }
  if (!ALLOWED.has(contentType)) {
    throw new OwnerStoreError("Use a PNG, JPEG, or WebP image.", 400);
  }
  if (bytes.byteLength > MAX_BYTES) {
    throw new OwnerStoreError("Logo must be 2 MB or smaller.", 400);
  }
  const ext = extForMime(contentType);
  if (!ext) throw new OwnerStoreError("Use a PNG, JPEG, or WebP image.", 400);

  const path = logoObjectPath(id, ext);
  const storage = database().storage.from(BUCKET);

  for (const oldExt of ["png", "jpg", "webp"] as const) {
    await storage.remove([logoObjectPath(id, oldExt)]).catch(() => undefined);
  }

  const { error: uploadError } = await storage.upload(path, bytes, {
    contentType,
    upsert: true,
  });
  if (uploadError) {
    console.error("[business-logos] upload:", uploadError);
    const detail = uploadError.message?.trim() ?? "";
    const bucketHint =
      /bucket|not found|does not exist/i.test(detail) || uploadError.message === "Bucket not found"
        ? " Run supabase/business-logos-storage.sql in the Supabase SQL editor for this project, then try again."
        : detail
          ? ` ${detail}`
          : " Try a PNG, JPEG, or WebP under 2 MB.";
    throw new OwnerStoreError(`Logo upload failed.${bucketHint}`, 503);
  }

  const { error: dbError } = await database()
    .from("business_owners")
    .update({ logo_path: path, updated_at: new Date().toISOString() })
    .eq("login_id", id);
  if (dbError) {
    throw new OwnerStoreError("Logo path could not be saved.", 500);
  }

  return { logoPath: path, logoUrl: businessLogoPublicUrl(path) };
}

export async function removeBusinessLogo(loginId: string) {
  const id = normalizeLoginId(loginId);
  if (!isValidLoginId(id)) {
    throw new OwnerStoreError("That business owner was not found.", 404);
  }
  const storage = database().storage.from(BUCKET);
  for (const ext of ["png", "jpg", "webp"] as const) {
    await storage.remove([logoObjectPath(id, ext)]).catch(() => undefined);
  }
  const { error } = await database()
    .from("business_owners")
    .update({ logo_path: null, updated_at: new Date().toISOString() })
    .eq("login_id", id);
  if (error) throw new OwnerStoreError("Logo could not be removed.", 500);
  return { ok: true as const };
}
