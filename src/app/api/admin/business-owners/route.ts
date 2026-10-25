import { hasAdminSession } from "@/lib/admin-session";
import { failure, json } from "@/lib/admin-http";
import { createBusinessOwner, listBusinessOwners } from "@/lib/business-owners";

export async function GET() {
  if (!(await hasAdminSession())) {
    return json({ error: "Sign in required." }, 401);
  }
  try {
    const owners = await listBusinessOwners();
    return json({ owners });
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return json({ error: "Sign in required." }, 401);
  }
  const body = await request.json().catch(() => null);
  const loginId = typeof body?.loginId === "string" ? body.loginId : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const soldPrice = typeof body?.soldPrice === "string" ? body.soldPrice : "";
  const standeeType = body?.standeeType;
  try {
    const created = await createBusinessOwner(loginId, password, soldPrice, standeeType);
    return json(created, 201);
  } catch (error) {
    return failure(error);
  }
}
