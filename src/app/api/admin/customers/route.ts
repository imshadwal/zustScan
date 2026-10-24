import { hasAdminSession } from "@/lib/admin-session";
import { failure, json } from "@/lib/admin-http";
import { createCustomer, listCustomers } from "@/lib/customers";

export async function GET() {
  if (!(await hasAdminSession())) {
    return json({ error: "Sign in required." }, 401);
  }
  try {
    const customers = await listCustomers();
    return json({ customers });
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
  try {
    const created = await createCustomer(loginId, password, soldPrice);
    return json(created, 201);
  } catch (error) {
    return failure(error);
  }
}
