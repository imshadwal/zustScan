import { serverEnv } from "@/lib/server-env";

const LOGIN_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeLoginId(value: string) {
  return value.trim().toLowerCase();
}

export function isValidLoginId(value: string) {
  return value.length >= 2 && value.length <= 40 && LOGIN_ID.test(value);
}

export function isValidPassword(value: string) {
  return value.length >= 8 && value.length <= 72;
}

const MAX_SOLD_PRICE = 10_000_000;

export function parseSoldPrice(value: string) {
  const digits = value.replace(/[₹,\s]/g, "");
  if (!/^\d+$/.test(digits)) return null;
  const price = Number(digits);
  if (!Number.isSafeInteger(price) || price < 1 || price > MAX_SOLD_PRICE) return null;
  return price;
}

export function formatRupees(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function siteOrigin() {
  return (serverEnv("NEXT_PUBLIC_SITE_URL") || "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export function customerPageUrl(loginId: string) {
  return `${siteOrigin()}/c/${loginId}`;
}

export function formatCreatedAt(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);
}
