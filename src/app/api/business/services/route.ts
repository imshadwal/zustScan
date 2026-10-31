import { failure, json } from "@/lib/admin-http";
import { requireBusinessOwnerSession } from "@/lib/business-api";
import { createService, listServicesForOwner } from "@/lib/business-owners";
import { revalidateGuestExperienceCache } from "@/lib/guest-cache";

export async function GET() {
  const session = await requireBusinessOwnerSession();
  if (!session.loginId) return session.response!;
  try {
    const services = await listServicesForOwner(session.loginId);
    return json({ services });
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: Request) {
  const session = await requireBusinessOwnerSession();
  if (!session.loginId) return session.response!;
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name : "";
  try {
    const service = await createService(session.loginId, name);
    revalidateGuestExperienceCache(session.loginId);
    return json({ service }, 201);
  } catch (error) {
    return failure(error);
  }
}
