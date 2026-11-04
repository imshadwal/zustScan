import { failure, json } from "@/lib/admin-http";
import { requireBusinessOwnerSession } from "@/lib/business-api";
import { getBusinessOwnerProfile } from "@/lib/business-owners";
import { updateBusinessFounder } from "@/lib/founder-profile";
import { revalidateGuestExperienceCache } from "@/lib/guest-cache";

export async function PATCH(request: Request) {
  const session = await requireBusinessOwnerSession();
  if (!session.loginId) return session.response!;
  const body = await request.json().catch(() => null);
  const founderVisible = body?.founderVisible === true;
  const founderName = typeof body?.founderName === "string" ? body.founderName : "";
  const founderRole = typeof body?.founderRole === "string" ? body.founderRole : "";
  const founderPhone = typeof body?.founderPhone === "string" ? body.founderPhone : "";
  const founderEmail = typeof body?.founderEmail === "string" ? body.founderEmail : "";
  const founderNote = typeof body?.founderNote === "string" ? body.founderNote : "";
  try {
    await updateBusinessFounder(session.loginId, {
      founderVisible,
      founderName,
      founderRole,
      founderPhone,
      founderEmail,
      founderNote,
    });
    revalidateGuestExperienceCache(session.loginId);
    const profile = await getBusinessOwnerProfile(session.loginId, { refreshChecklist: false });
    return json({
      founderVisible: profile?.founderVisible ?? false,
      founderName: profile?.founderName ?? null,
      founderRole: profile?.founderRole ?? null,
      founderPhone: profile?.founderPhone ?? null,
      founderEmail: profile?.founderEmail ?? null,
      founderNote: profile?.founderNote ?? null,
      founderPhotoUrl: profile?.founderPhotoUrl ?? null,
    });
  } catch (error) {
    return failure(error);
  }
}
