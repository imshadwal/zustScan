import { cookies } from "next/headers";
import { json } from "@/lib/admin-http";
import {
  BUSINESS_COOKIE,
  businessSessionCookieOptions,
  createBusinessSessionValue,
} from "@/lib/business-session";
import { verifyBusinessOwnerPassword } from "@/lib/business-owners";
import { normalizeLoginId } from "@/lib/login-id";
import { serverEnv } from "@/lib/server-env";
export async function POST(request: Request) {
  if (!serverEnv("ZUST_PORTAL_SECRET")) {
    return json({ error: "Business sign-in is not configured." }, 503);
  }
  const body = await request.json().catch(() => null);
  const loginRaw = typeof body?.loginId === "string" ? body.loginId : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const loginId = normalizeLoginId(loginRaw);

  if (!loginId || !password) {
    return json({ error: "That login id or password is not right." }, 401);
  }

  let ok = false;
  try {
    ok = await verifyBusinessOwnerPassword(loginId, password);
  } catch {
    return json({ error: "Something went wrong." }, 500);
  }

  if (!ok) {
    return json({ error: "That login id or password is not right." }, 401);
  }

  const jar = await cookies();
  jar.set(BUSINESS_COOKIE, createBusinessSessionValue(loginId), businessSessionCookieOptions());
  return json({ ok: true });
}
