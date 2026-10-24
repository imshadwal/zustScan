import { cookies } from "next/headers";
import { json } from "@/lib/admin-http";
import { BUSINESS_COOKIE } from "@/lib/business-session";

export async function POST() {
  const jar = await cookies();
  jar.set(BUSINESS_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return json({ ok: true });
}
