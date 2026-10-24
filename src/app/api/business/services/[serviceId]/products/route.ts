import { failure, json } from "@/lib/admin-http";
import { requireBusinessOwnerSession } from "@/lib/business-api";
import { createProduct } from "@/lib/business-owners";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ serviceId: string }> },
) {
  const session = await requireBusinessOwnerSession();
  if (!session.loginId) return session.response!;
  const { serviceId } = await params;
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name : "";
  try {
    const product = await createProduct(session.loginId, serviceId, name);
    return json({ product }, 201);
  } catch (error) {
    return failure(error);
  }
}
