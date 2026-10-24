import { json } from "@/lib/admin-http";
import { loadGuestExperience } from "@/lib/business-owners";
import { generateGuestDraft } from "@/lib/guest-draft";
import { displayTitle } from "@/lib/initials";
import { normalizeLoginId } from "@/lib/login-id";

const TIERS = new Set(["Good", "Better", "Best"]);

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const loginRaw = typeof body?.loginId === "string" ? body.loginId : "";
  const serviceId = typeof body?.serviceId === "string" ? body.serviceId : "";
  const productId = typeof body?.productId === "string" ? body.productId : "";
  const tier = typeof body?.tier === "string" ? body.tier : "";
  const starsRaw = body?.stars;

  const loginId = normalizeLoginId(loginRaw);
  if (!loginId) {
    return json({ error: "Invalid request." }, 400);
  }
  if (!TIERS.has(tier)) {
    return json({ error: "Pick Good, Better, or Best." }, 400);
  }
  const stars = typeof starsRaw === "number" ? starsRaw : Number(starsRaw);
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    return json({ error: "Pick a star rating from 1 to 5." }, 400);
  }

  let experience: Awaited<ReturnType<typeof loadGuestExperience>> = null;
  try {
    experience = await loadGuestExperience(loginId);
  } catch {
    return json({ error: "Something went wrong." }, 500);
  }
  if (!experience) {
    return json({ error: "This business is not ready for reviews yet." }, 404);
  }

  const service = experience.services.find((item) => item.id === serviceId);
  if (!service) {
    return json({ error: "That service is not available." }, 400);
  }
  const product = service.products.find((item) => item.id === productId);
  if (!product) {
    return json({ error: "That product is not available." }, 400);
  }

  const businessName = displayTitle(experience.businessName, experience.loginId);

  try {
    const draft = await generateGuestDraft({
      businessName,
      brief: experience.brief,
      serviceName: service.name,
      productName: product.name,
      tier: tier as "Good" | "Better" | "Best",
      stars,
    });
    return json({ draft });
  } catch {
    return json({ error: "The draft could not be created." }, 500);
  }
}
