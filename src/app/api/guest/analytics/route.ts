import { json } from "@/lib/admin-http";
import { recordGuestMetric, type GuestMetric } from "@/lib/guest-analytics";
import { normalizeLoginId } from "@/lib/login-id";

const allowed: GuestMetric[] = ["page_view", "draft", "copy_continue"];

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const loginId = normalizeLoginId(typeof body?.loginId === "string" ? body.loginId : "");
  const event = typeof body?.event === "string" ? body.event : "";

  if (!loginId || !allowed.includes(event as GuestMetric)) {
    return json({ error: "Invalid request." }, 400);
  }

  await recordGuestMetric(loginId, event as GuestMetric);
  return json({ ok: true });
}
