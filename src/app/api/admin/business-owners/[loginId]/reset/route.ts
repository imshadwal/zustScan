import { hasAdminSession } from "@/lib/admin-session";
import { failure, json } from "@/lib/admin-http";
import { resetBusinessOwnerPassword } from "@/lib/business-owners";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ loginId: string }> },
) {
  if (!(await hasAdminSession())) {
    return json({ error: "Sign in required." }, 401);
  }
  const { loginId } = await params;
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  try {
    const reset = await resetBusinessOwnerPassword(loginId, password);
    return json(reset);
  } catch (error) {
    return failure(error);
  }
}
