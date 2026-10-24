import { cookies } from "next/headers";
import { ADMIN_COOKIE, sessionCookieOptions } from "@/lib/admin-session";
import { json } from "@/lib/admin-http";

export async function POST() {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return json({ ok: true });
}
