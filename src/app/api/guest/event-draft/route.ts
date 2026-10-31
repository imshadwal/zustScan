import { AiRateLimitError, enforceGuestDraftRateLimits } from "@/lib/ai-rate-limit";
import { json } from "@/lib/admin-http";
import { loadEventGuestExperience } from "@/lib/business-events";
import { recordGuestMetric } from "@/lib/guest-analytics";
import {
  generateEventGuestDraft,
  guestDraftModel,
  GuestDraftUnavailableError,
} from "@/lib/guest-draft";
import { normalizeGuestLanguages } from "@/lib/guest-languages";
import { isGuestTier, starsForTier } from "@/lib/guest-tier";
import { normalizeGuestVoice } from "@/lib/guest-voice";
import { displayTitle } from "@/lib/initials";
import { normalizeLoginId } from "@/lib/login-id";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const loginRaw = typeof body?.loginId === "string" ? body.loginId : "";
  const areaIdsRaw = body?.areaIds;
  const tier = typeof body?.tier === "string" ? body.tier : "";
  const loginId = normalizeLoginId(loginRaw);
  if (!loginId) {
    return json({ error: "Invalid request." }, 400);
  }

  if (!isGuestTier(tier)) {
    return json({ error: "Pick Good, Great, or Exceptional." }, 400);
  }
  const stars = starsForTier(tier);

  let experience: Awaited<ReturnType<typeof loadEventGuestExperience>> = null;
  try {
    const [, loaded] = await Promise.all([
      enforceGuestDraftRateLimits(request, loginId),
      loadEventGuestExperience(loginId),
    ]);
    experience = loaded;
  } catch (error) {
    if (error instanceof AiRateLimitError) {
      return json({ error: error.message }, 429);
    }
    return json({ error: "Something went wrong." }, 500);
  }
  if (!experience) {
    return json({ error: "This event page is not ready yet." }, 404);
  }

  const areaIds: string[] = Array.isArray(areaIdsRaw)
    ? areaIdsRaw.filter((item): item is string => typeof item === "string" && item.length > 0)
    : [];

  if (areaIds.length === 0) {
    return json({ error: "Pick at least one area." }, 400);
  }

  const areaNames: string[] = [];
  for (const id of areaIds) {
    const area = experience.areas.find((item) => item.id === id);
    if (!area) {
      return json({ error: "One of those areas is not available." }, 400);
    }
    areaNames.push(area.name);
  }

  const businessName = displayTitle(experience.businessName, experience.loginId);
  const languages = normalizeGuestLanguages(body?.languages ?? body?.language);
  const voice = normalizeGuestVoice(body?.voice);
  const variationRaw =
    typeof body?.variationSeed === "string" ? body.variationSeed.trim() : "";
  const variationSeed =
    variationRaw.length > 0 && variationRaw.length <= 64
      ? variationRaw
      : `${loginId}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  try {
    const draft = await generateEventGuestDraft({
      businessName,
      city: experience.city,
      brief: experience.brief,
      eventName: experience.eventName,
      eventDate: experience.eventDate,
      areaNames,
      tier: tier as "Good" | "Great" | "Exceptional",
      stars,
      languages,
      voice,
      variationSeed,
    });
    void recordGuestMetric(loginId, "draft");
    return json({
      draft,
      draftSource: "openai" as const,
      draftModel: guestDraftModel(),
    });
  } catch (error) {
    if (error instanceof GuestDraftUnavailableError) {
      return json({ error: error.guestMessage }, 503);
    }
    return json({ error: "The draft could not be created." }, 500);
  }
}
