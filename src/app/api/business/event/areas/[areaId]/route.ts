import { failure, json } from "@/lib/admin-http";
import { requireBusinessOwnerSession } from "@/lib/business-api";
import { deleteEventArea } from "@/lib/business-events";
import { revalidateGuestExperienceCache } from "@/lib/guest-cache";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ areaId: string }> },
) {
  const session = await requireBusinessOwnerSession();
  if (!session.loginId) return session.response!;
  const { areaId } = await params;
  try {
    await deleteEventArea(session.loginId, areaId);
    revalidateGuestExperienceCache(session.loginId);
    return json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
