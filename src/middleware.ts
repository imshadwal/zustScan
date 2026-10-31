import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function canonicalOrigin(): URL | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return null;
  try {
    const normalized = raw.endsWith("/") ? raw.slice(0, -1) : raw;
    return new URL(normalized);
  } catch {
    return null;
  }
}

/**
 * Printed QRs encode whatever host was in NEXT_PUBLIC_SITE_URL at download time.
 * Redirect legacy *.vercel.app (and non-canonical host) to the live domain so old standees still work.
 */
export function middleware(request: NextRequest) {
  const canonical = canonicalOrigin();
  if (!canonical) return NextResponse.next();

  const hostHeader =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const requestHost = hostHeader.split(",")[0]?.trim().toLowerCase() ?? "";
  const canonicalHost = canonical.host.toLowerCase();

  if (!requestHost || requestHost === canonicalHost) {
    return NextResponse.next();
  }

  const isVercelApp = requestHost.endsWith(".vercel.app");
  if (!isVercelApp) {
    return NextResponse.next();
  }

  const destination = new URL(
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
    canonical,
  );
  return NextResponse.redirect(destination, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png|.*\\.(?:png|jpg|jpeg|webp|svg|ico)$).*)"],
};
