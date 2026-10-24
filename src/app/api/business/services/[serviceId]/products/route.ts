import { failure, json } from "@/lib/admin-http";
import { requireBusinessOwnerSession } from "@/lib/business-api";
import { createProduct, createProductsBatch } from "@/lib/business-owners";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ serviceId: string }> },
) {
  const session = await requireBusinessOwnerSession();
  if (!session.loginId) return session.response!;
  const { serviceId } = await params;
  const body = await request.json().catch(() => null);
  const rawNames = body?.names;
  const namesFromArray = Array.isArray(rawNames)
    ? rawNames.filter((item: unknown): item is string => typeof item === "string")
    : [];
  const singleName = typeof body?.name === "string" ? body.name : "";

  try {
    if (namesFromArray.length > 0) {
      const products = await createProductsBatch(session.loginId, serviceId, namesFromArray);
      return json({ products }, 201);
    }
    if (singleName) {
      const product = await createProduct(session.loginId, serviceId, singleName);
      return json({ product }, 201);
    }
    return json({ error: "Add a product name." }, 400);
  } catch (error) {
    return failure(error);
  }
}
