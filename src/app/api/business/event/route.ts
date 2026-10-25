import { failure, json } from "@/lib/admin-http";
import { requireBusinessOwnerSession } from "@/lib/business-api";
import { getEventPortalState, saveEventDetails } from "@/lib/business-events";

export async function GET() {
  const session = await requireBusinessOwnerSession();
  if (!session.loginId) return session.response!;
  try {
    const state = await getEventPortalState(session.loginId);
    if (!state) {
      return json({ error: "This account is not an event standee." }, 400);
    }
    return json(state);
  } catch (error) {
    return failure(error);
  }
}

export async function PATCH(request: Request) {
  const session = await requireBusinessOwnerSession();
  if (!session.loginId) return session.response!;
  const body = await request.json().catch(() => null);
  const eventName = typeof body?.eventName === "string" ? body.eventName : "";
  const eventDate = typeof body?.eventDate === "string" ? body.eventDate : "";
  try {
    const result = await saveEventDetails(session.loginId, { eventName, eventDate });
    return json(result);
  } catch (error) {
    return failure(error);
  }
}
