import { failure, json } from "@/lib/admin-http";
import { requireBusinessOwnerSession } from "@/lib/business-api";
import { deleteService, renameService } from "@/lib/business-owners";
import { revalidateGuestExperienceCache } from "@/lib/guest-cache";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ serviceId: string }> },
) {
  const session = await requireBusinessOwnerSession();
  if (!session.loginId) return session.response!;
  const { serviceId } = await params;
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name : "";
  try {
    await renameService(session.loginId, serviceId, name);
    revalidateGuestExperienceCache(session.loginId);
    return json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ serviceId: string }> },
) {
  const session = await requireBusinessOwnerSession();
  if (!session.loginId) return session.response!;
  const { serviceId } = await params;
  try {
    await deleteService(session.loginId, serviceId);
    revalidateGuestExperienceCache(session.loginId);
    return json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
