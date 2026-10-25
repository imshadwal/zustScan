import { hasAdminSession } from "@/lib/admin-session";
import { failure, json } from "@/lib/admin-http";
import { updateBusinessOwnerStandeeType } from "@/lib/business-owners";
import { isValidLoginId, normalizeLoginId } from "@/lib/login-id";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ loginId: string }> },
) {
  if (!(await hasAdminSession())) {
    return json({ error: "Sign in required." }, 401);
  }

  const { loginId } = await params;
  const id = normalizeLoginId(loginId);
  if (!isValidLoginId(id)) {
    return json({ error: "That business owner was not found." }, 404);
  }

  const body = await request.json().catch(() => null);
  const standeeType = body?.standeeType;

  try {
    const result = await updateBusinessOwnerStandeeType(id, standeeType);
    return json(result);
  } catch (error) {
    return failure(error);
  }
}
