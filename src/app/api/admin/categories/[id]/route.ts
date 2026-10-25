import { hasAdminSession } from "@/lib/admin-session";
import { failure, json } from "@/lib/admin-http";
import {
  deleteBusinessCategoryOption,
  updateBusinessCategoryOption,
} from "@/lib/business-category-options";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  if (!(await hasAdminSession())) {
    return json({ error: "Sign in required." }, 401);
  }
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const label = typeof body?.label === "string" ? body.label : undefined;
  const sortOrder =
    typeof body?.sortOrder === "number" ? body.sortOrder : undefined;
  try {
    const category = await updateBusinessCategoryOption(id, {
      label,
      sortOrder,
    });
    return json({ category });
  } catch (error) {
    return failure(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await hasAdminSession())) {
    return json({ error: "Sign in required." }, 401);
  }
  const { id } = await params;
  try {
    const result = await deleteBusinessCategoryOption(id);
    return json(result);
  } catch (error) {
    return failure(error);
  }
}
