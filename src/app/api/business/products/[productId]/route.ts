import { failure, json } from "@/lib/admin-http";
import { requireBusinessOwnerSession } from "@/lib/business-api";
import { deleteProduct, renameProduct } from "@/lib/business-owners";
import { revalidateGuestExperienceCache } from "@/lib/guest-cache";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const session = await requireBusinessOwnerSession();
  if (!session.loginId) return session.response!;
  const { productId } = await params;
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name : "";
  try {
    await renameProduct(session.loginId, productId, name);
    revalidateGuestExperienceCache(session.loginId);
    return json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const session = await requireBusinessOwnerSession();
  if (!session.loginId) return session.response!;
  const { productId } = await params;
  try {
    await deleteProduct(session.loginId, productId);
    revalidateGuestExperienceCache(session.loginId);
    return json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
