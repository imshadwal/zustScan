import { hasAdminSession } from "@/lib/admin-session";
import { failure, json } from "@/lib/admin-http";
import { setBusinessOwnerQrActive } from "@/lib/business-owners";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ loginId: string }> },
) {
  if (!(await hasAdminSession())) {
    return json({ error: "Sign in required." }, 401);
  }

  const body = await request.json().catch(() => null);
  if (typeof body?.qrActive !== "boolean") {
    return json({ error: "Send { qrActive: true } or { qrActive: false }." }, 400);
  }

  const { loginId } = await params;
  try {
    const result = await setBusinessOwnerQrActive(loginId, body.qrActive);
    return json(result);
  } catch (error) {
    return failure(error);
  }
}
