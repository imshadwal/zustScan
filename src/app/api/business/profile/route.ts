import { failure, json } from "@/lib/admin-http";
import { requireBusinessOwnerSession } from "@/lib/business-api";
import { getBusinessOwnerProfile, updateBusinessOwnerProfile } from "@/lib/business-owners";

export async function GET() {
  const session = await requireBusinessOwnerSession();
  if (!session.loginId) return session.response!;
  try {
    const profile = await getBusinessOwnerProfile(session.loginId);
    if (!profile) return json({ error: "That business owner was not found." }, 404);
    return json({ profile });
  } catch (error) {
    return failure(error);
  }
}

export async function PATCH(request: Request) {
  const session = await requireBusinessOwnerSession();
  if (!session.loginId) return session.response!;
  const body = await request.json().catch(() => null);
  const businessName = typeof body?.businessName === "string" ? body.businessName : "";
  const city = typeof body?.city === "string" ? body.city : "";
  const phone = typeof body?.phone === "string" ? body.phone : "";
  const mapLink = typeof body?.mapLink === "string" ? body.mapLink : "";
  const brief = typeof body?.brief === "string" ? body.brief : "";
  try {
    const result = await updateBusinessOwnerProfile(session.loginId, {
      businessName,
      city,
      phone,
      mapLink,
      brief,
    });
    const profile = await getBusinessOwnerProfile(session.loginId);
    return json({ profile, checklist: result.checklist });
  } catch (error) {
    return failure(error);
  }
}
