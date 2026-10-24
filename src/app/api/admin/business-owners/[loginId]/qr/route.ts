import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { hasAdminSession } from "@/lib/admin-session";
import { json } from "@/lib/admin-http";
import { findBusinessOwnerPublic } from "@/lib/business-owners";
import { guestPageUrl, isValidLoginId, normalizeLoginId } from "@/lib/login-id";
import { OwnerStoreError } from "@/lib/store-error";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ loginId: string }> },
) {
  if (!(await hasAdminSession())) {
    return json({ error: "Sign in required." }, 401);
  }

  const { loginId } = await params;
  const id = normalizeLoginId(loginId);
  if (!isValidLoginId(id)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const owner = await findBusinessOwnerPublic(id);
    if (!owner) return new NextResponse("Not found", { status: 404 });
    const png = await QRCode.toBuffer(guestPageUrl(id), {
      type: "png",
      width: 640,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#071428", light: "#ffffff" },
    });
    const download = new URL(request.url).searchParams.get("download") === "1";
    return new NextResponse(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "private, no-store",
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${id}-qr.png"`,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (error instanceof OwnerStoreError) {
      return json({ error: error.message }, error.status);
    }
    console.error(error);
    return json({ error: "The QR could not be created." }, 500);
  }
}
