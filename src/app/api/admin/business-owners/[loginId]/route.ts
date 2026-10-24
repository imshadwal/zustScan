import { hasAdminSession } from "@/lib/admin-session";
import { failure, json } from "@/lib/admin-http";
import { deleteBusinessOwner } from "@/lib/business-owners";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ loginId: string }> },
) {
  if (!(await hasAdminSession())) {
    return json({ error: "Sign in required." }, 401);
  }
  const { loginId } = await params;
  try {
    const removed = await deleteBusinessOwner(loginId);
    return json(removed);
  } catch (error) {
    return failure(error);
  }
}
