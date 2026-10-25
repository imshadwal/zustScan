import { hasAdminSession } from "@/lib/admin-session";
import { failure, json } from "@/lib/admin-http";
import {
  createBusinessCategoryOption,
  listBusinessCategoryOptions,
} from "@/lib/business-category-options";

export async function GET() {
  if (!(await hasAdminSession())) {
    return json({ error: "Sign in required." }, 401);
  }
  try {
    const categories = await listBusinessCategoryOptions();
    return json({ categories });
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return json({ error: "Sign in required." }, 401);
  }
  const body = await request.json().catch(() => null);
  const label = typeof body?.label === "string" ? body.label : "";
  try {
    const category = await createBusinessCategoryOption({ label });
    return json({ category }, 201);
  } catch (error) {
    return failure(error);
  }
}
