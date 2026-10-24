import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  createAdminSessionValue,
  safeEqual,
  sessionCookieOptions,
} from "@/lib/admin-session";
import { serverEnv } from "@/lib/server-env";
import { json } from "@/lib/admin-http";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const login = typeof body?.login === "string" ? body.login.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const expectedLogin = serverEnv("ADMIN_LOGIN") ?? "";
  const expectedPassword = serverEnv("ADMIN_PASSWORD") ?? "";

  if (!expectedLogin || !expectedPassword) {
    return json({ error: "Admin sign-in is not configured." }, 503);
  }

  const loginOk = safeEqual(login, expectedLogin);
  const passwordOk = safeEqual(password, expectedPassword);
  if (!loginOk || !passwordOk) {
    return json({ error: "That id or password is not right." }, 401);
  }

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, createAdminSessionValue(), sessionCookieOptions());
  return json({ ok: true });
}
