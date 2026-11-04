import { failure, json } from "@/lib/admin-http";
import { requireBusinessOwnerSession } from "@/lib/business-api";
import { removeFounderPhoto, uploadFounderPhoto } from "@/lib/founder-photo";
import { revalidateGuestExperienceCache } from "@/lib/guest-cache";

export async function POST(request: Request) {
  const session = await requireBusinessOwnerSession();
  if (!session.loginId) return session.response!;

  const form = await request.formData().catch(() => null);
  const file = form?.get("photo");
  if (!(file instanceof File)) {
    return json({ error: "Choose an image file." }, 400);
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const contentType = file.type || "application/octet-stream";

  try {
    const result = await uploadFounderPhoto(session.loginId, bytes, contentType);
    revalidateGuestExperienceCache(session.loginId);
    return json(result);
  } catch (error) {
    return failure(error);
  }
}

export async function DELETE() {
  const session = await requireBusinessOwnerSession();
  if (!session.loginId) return session.response!;

  try {
    await removeFounderPhoto(session.loginId);
    revalidateGuestExperienceCache(session.loginId);
    return json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
