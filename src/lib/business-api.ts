import "server-only";

import { getBusinessSessionLoginId } from "@/lib/business-session";
import { json } from "@/lib/admin-http";

export async function requireBusinessOwnerSession() {
  const loginId = await getBusinessSessionLoginId();
  if (!loginId) {
    return { loginId: null as null, response: json({ error: "Sign in required." }, 401) };
  }
  return { loginId, response: null as null };
}
