import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { serverEnv } from "@/lib/server-env";

export const BUSINESS_COOKIE = "zust_business";
const SESSION_MAX_AGE = 24 * 60 * 60;

function sessionSecret() {
  const secret = serverEnv("ZUST_PORTAL_SECRET");
  if (!secret) {
    throw new Error("ZUST_PORTAL_SECRET is not set");
  }
  return secret;
}

function sign(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function createBusinessSessionValue(loginId: string) {
  const payload = Buffer.from(
    JSON.stringify({
      role: "business_owner",
      loginId,
      exp: Date.now() + SESSION_MAX_AGE * 1000,
    }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readBusinessSession(value: string | undefined) {
  if (!value || !serverEnv("ZUST_PORTAL_SECRET")) return null;
  const dot = value.lastIndexOf(".");
  if (dot <= 0) return null;
  const payload = value.slice(0, dot);
  const mac = value.slice(dot + 1);
  const expected = sign(payload);
  const left = Buffer.from(mac);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      role?: string;
      loginId?: string;
      exp?: number;
    };
    if (
      data.role !== "business_owner" ||
      typeof data.loginId !== "string" ||
      typeof data.exp !== "number" ||
      data.exp <= Date.now()
    ) {
      return null;
    }
    return { loginId: data.loginId };
  } catch {
    return null;
  }
}

export async function getBusinessSessionLoginId() {
  await connection();
  const jar = await cookies();
  const session = readBusinessSession(jar.get(BUSINESS_COOKIE)?.value);
  return session?.loginId ?? null;
}

export function businessSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}
