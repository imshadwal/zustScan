import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";

/** Per IP on public guest draft routes (includes Regenerate). */
export const GUEST_DRAFT_IP_LIMIT = { maxHits: 15, windowSeconds: 10 * 60 };

/** Per business login — many guests at one venue, but caps scripted abuse on one QR. */
export const GUEST_DRAFT_BUSINESS_LIMIT = { maxHits: 120, windowSeconds: 60 * 60 };

/** Logged-in owner profile “Generate” for Why trust us. */
export const WHY_TRUST_OWNER_LIMIT = { maxHits: 20, windowSeconds: 60 * 60 };

export class AiRateLimitError extends Error {
  readonly status = 429;
  readonly retryAfterSec: number;

  constructor(message: string, retryAfterSec: number) {
    super(message);
    this.name = "AiRateLimitError";
    this.retryAfterSec = retryAfterSec;
  }
}

export function clientIpFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 128);
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 128);
  return "unknown";
}

function isMissingRateLimit(error: { code?: string; message?: string }) {
  return (
    error.code === "42883" ||
    error.code === "PGRST202" ||
    error.code === "42P01" ||
    /check_ai_rate_limit|ai_rate_limits|does not exist|schema cache/i.test(error.message ?? "")
  );
}

type LimitConfig = { maxHits: number; windowSeconds: number };

/**
 * Fixed-window counter in Postgres (via RPC). Fails open if migration not applied yet.
 */
export async function enforceAiRateLimit(bucket: string, config: LimitConfig): Promise<void> {
  const key = bucket.trim().slice(0, 200);
  if (!key) return;

  const { data, error } = await supabaseAdmin().rpc("check_ai_rate_limit", {
    p_bucket: key,
    p_max_hits: config.maxHits,
    p_window_seconds: config.windowSeconds,
  });

  if (error) {
    if (isMissingRateLimit(error)) {
      console.warn(
        "[ai-rate-limit] check_ai_rate_limit unavailable — run supabase/ai-rate-limits.sql",
      );
      return;
    }
    console.error("[ai-rate-limit] RPC error:", error.message);
    return;
  }

  const allowed = data?.allowed !== false;
  const retryAfterSec =
    typeof data?.retry_after_seconds === "number" ? data.retry_after_seconds : 60;

  if (!allowed) {
    throw new AiRateLimitError(
      "Too many AI requests. Please wait a few minutes and try again.",
      retryAfterSec,
    );
  }
}

export async function enforceGuestDraftRateLimits(request: Request, loginId: string) {
  const ip = clientIpFromRequest(request);
  await enforceAiRateLimit(`guest-draft:ip:${ip}`, GUEST_DRAFT_IP_LIMIT);
  await enforceAiRateLimit(`guest-draft:biz:${loginId}`, GUEST_DRAFT_BUSINESS_LIMIT);
}

export async function enforceWhyTrustRateLimit(loginId: string) {
  await enforceAiRateLimit(`why-trust:owner:${loginId}`, WHY_TRUST_OWNER_LIMIT);
}
