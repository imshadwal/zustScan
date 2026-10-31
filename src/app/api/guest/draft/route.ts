import { AiRateLimitError, enforceGuestDraftRateLimits } from "@/lib/ai-rate-limit";
import { json } from "@/lib/admin-http";
import { loadGuestExperience } from "@/lib/business-owners";
import { recordGuestMetric } from "@/lib/guest-analytics";
import {
  generateGuestDraft,
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
  const serviceIdsRaw = body?.serviceIds;
  const productIdsRaw = body?.productIds;
  const legacyServiceId = typeof body?.serviceId === "string" ? body.serviceId : "";
  const legacyProductId = typeof body?.productId === "string" ? body.productId : "";
  const tier = typeof body?.tier === "string" ? body.tier : "";
  const loginId = normalizeLoginId(loginRaw);
  if (!loginId) {
    return json({ error: "Invalid request." }, 400);
  }

  if (!isGuestTier(tier)) {
    return json({ error: "Pick Good, Great, or Exceptional." }, 400);
  }
  const stars = starsForTier(tier);

  let experience: Awaited<ReturnType<typeof loadGuestExperience>> = null;
  try {
    const [, loaded] = await Promise.all([
      enforceGuestDraftRateLimits(request, loginId),
      loadGuestExperience(loginId),
    ]);
    experience = loaded;
  } catch (error) {
    if (error instanceof AiRateLimitError) {
      return json({ error: error.message }, 429);
    }
    return json({ error: "Something went wrong." }, 500);
  }
  if (!experience) {
    return json({ error: "This business is not ready for reviews yet." }, 404);
  }

  const serviceIds: string[] = Array.isArray(serviceIdsRaw)
    ? serviceIdsRaw.filter((item): item is string => typeof item === "string" && item.length > 0)
    : legacyServiceId
      ? [legacyServiceId]
      : [];
  const productIds: string[] = Array.isArray(productIdsRaw)
    ? productIdsRaw.filter((item): item is string => typeof item === "string" && item.length > 0)
    : legacyProductId
      ? [legacyProductId]
      : [];

  if (serviceIds.length === 0) {
    return json({ error: "Pick at least one service." }, 400);
  }
  if (productIds.length === 0) {
    return json({ error: "Pick at least one product." }, 400);
  }

  const serviceNames: string[] = [];
  for (const id of serviceIds) {
    const service = experience.services.find((item) => item.id === id);
    if (!service) {
      return json({ error: "One of those services is not available." }, 400);
    }
    serviceNames.push(service.name);
  }

  const productNames: string[] = [];
  for (const id of productIds) {
    let found: { name: string } | null = null;
    for (const service of experience.services) {
      const product = service.products.find((item) => item.id === id);
      if (product) {
        found = product;
        break;
      }
    }
    if (!found) {
      return json({ error: "One of those products is not available." }, 400);
    }
    productNames.push(found.name);
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
    const draft = await generateGuestDraft({
      businessName,
      brief: experience.brief,
      serviceNames,
      productNames,
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
