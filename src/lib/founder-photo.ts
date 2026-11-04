import "server-only";

import { businessLogoPublicUrl } from "@/lib/business-logos";
import { isValidLoginId, normalizeLoginId } from "@/lib/login-id";
import { serverEnv } from "@/lib/server-env";
import { OwnerStoreError } from "@/lib/store-error";
import { supabaseAdmin } from "@/lib/supabase/admin";

const BUCKET = "business-logos";
const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp"]);

function founderObjectPath(loginId: string, ext: "png" | "jpg" | "webp") {
  return `${loginId}/founder-${Date.now()}.${ext}`;
}

async function removeFounderFiles(loginId: string, keepPath: string | null) {
  const bucket = storage();
  const { data } = await bucket.list(loginId, { limit: 100 });
  const stale = (data ?? [])
    .filter((file) => /^founder[.-]/.test(file.name))
    .map((file) => `${loginId}/${file.name}`)
    .filter((path) => path !== keepPath);
  if (stale.length > 0) {
    await bucket.remove(stale).catch(() => undefined);
  }
}

function extForMime(mime: string): "png" | "jpg" | "webp" | null {
  if (mime === "image/png") return "png";
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/webp") return "webp";
  return null;
}

function storage() {
  const url = serverEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = serverEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    throw new OwnerStoreError(
      "Supabase is not connected. Add the project URL and service role key.",
      503,
    );
  }
  return supabaseAdmin().storage.from(BUCKET);
}

export async function uploadFounderPhoto(
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
    throw new OwnerStoreError("Photo must be 2 MB or smaller.", 400);
  }
  const ext = extForMime(contentType);
  if (!ext) throw new OwnerStoreError("Use a PNG, JPEG, or WebP image.", 400);

  const path = founderObjectPath(id, ext);
  const bucket = storage();

  const { error: uploadError } = await bucket.upload(path, bytes, {
    contentType,
    upsert: true,
  });
  if (uploadError) {
    console.error("[founder-photo] upload:", uploadError);
    const detail = uploadError.message?.trim() ?? "";
    const bucketHint =
      /bucket|not found|does not exist/i.test(detail) || uploadError.message === "Bucket not found"
        ? " Run supabase/business-logos-storage.sql in the Supabase SQL editor for this project, then try again."
        : detail
          ? ` ${detail}`
          : " Try a PNG, JPEG, or WebP under 2 MB.";
    throw new OwnerStoreError(`Photo upload failed.${bucketHint}`, 503);
  }

  const { error: dbError } = await supabaseAdmin()
    .from("business_owners")
    .update({ founder_photo_path: path, updated_at: new Date().toISOString() })
    .eq("login_id", id);
  if (dbError) {
    console.error("[founder-photo] save path:", dbError);
    if (
      dbError.code === "42703" ||
      dbError.code === "PGRST204" ||
      /founder_photo_path|schema cache/i.test(dbError.message ?? "")
    ) {
      throw new OwnerStoreError(
        "Database schema is out of date. Run supabase/business-founder.sql in the Supabase SQL editor, then reload the API schema.",
        503,
      );
    }
    throw new OwnerStoreError("Founder photo could not be saved.", 500);
  }

  await removeFounderFiles(id, path);
  return { photoPath: path, photoUrl: businessLogoPublicUrl(path) };
}

export async function removeFounderPhoto(loginId: string) {
  const id = normalizeLoginId(loginId);
  if (!isValidLoginId(id)) {
    throw new OwnerStoreError("That business owner was not found.", 404);
  }
  await removeFounderFiles(id, null);
  const { error } = await supabaseAdmin()
    .from("business_owners")
    .update({ founder_photo_path: null, updated_at: new Date().toISOString() })
    .eq("login_id", id);
  if (error) {
    if (
      error.code === "42703" ||
      error.code === "PGRST204" ||
      /founder_photo_path|schema cache/i.test(error.message ?? "")
    ) {
      throw new OwnerStoreError(
        "Database schema is out of date. Run supabase/business-founder.sql in the Supabase SQL editor, then reload the API schema.",
        503,
      );
    }
    throw new OwnerStoreError("Founder photo could not be removed.", 500);
  }
  return { ok: true as const };
}
