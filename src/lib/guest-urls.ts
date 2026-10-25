import "server-only";

import { eventGuestPageUrl, guestPageUrl } from "@/lib/login-id";
import type { StandeeType } from "@/lib/standee-type";

export function guestPageUrlForStandeeType(loginId: string, standeeType: StandeeType) {
  return standeeType === "event" ? eventGuestPageUrl(loginId) : guestPageUrl(loginId);
}
