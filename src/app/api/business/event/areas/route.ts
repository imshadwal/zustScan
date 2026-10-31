import { failure, json } from "@/lib/admin-http";
import { requireBusinessOwnerSession } from "@/lib/business-api";
import { createEventArea } from "@/lib/business-events";
import { revalidateGuestExperienceCache } from "@/lib/guest-cache";

export async function POST(request: Request) {
  const session = await requireBusinessOwnerSession();
  if (!session.loginId) return session.response!;
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name : "";
  try {
    const result = await createEventArea(session.loginId, name);
    revalidateGuestExperienceCache(session.loginId);
    return json(result, 201);
  } catch (error) {
    return failure(error);
  }
}
