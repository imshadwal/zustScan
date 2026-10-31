import "server-only";

import { revalidateTag } from "next/cache";
import { isValidLoginId, normalizeLoginId } from "@/lib/login-id";

export function guestExperienceCacheTag(loginId: string) {
  return `guest-exp-${normalizeLoginId(loginId)}`;
}

/** Call after owner updates profile, services, products, or event areas. */
export function revalidateGuestExperienceCache(loginId: string) {
  const id = normalizeLoginId(loginId);
  if (!isValidLoginId(id)) return;
  revalidateTag(guestExperienceCacheTag(id), "max");
}
