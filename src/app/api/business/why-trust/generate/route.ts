import { failure, json } from "@/lib/admin-http";
import { requireBusinessOwnerSession } from "@/lib/business-api";
import { isBusinessCategoryId, OTHERS_CATEGORY_ID, isValidCategoryOther } from "@/lib/business-categories";
import { listBusinessCategoryOptions } from "@/lib/business-category-options";
import { generateWhyTrustLine } from "@/lib/why-trust-generate";
import { OwnerStoreError } from "@/lib/store-error";

export async function POST(request: Request) {
  const session = await requireBusinessOwnerSession();
  if (!session.loginId) return session.response!;

  const body = await request.json().catch(() => null);
  const businessName = typeof body?.businessName === "string" ? body.businessName : "";
  const city = typeof body?.city === "string" ? body.city : "";
  const address = typeof body?.address === "string" ? body.address : "";
  const categoryId = typeof body?.categoryId === "string" ? body.categoryId.trim() : "";
  const categoryOther = typeof body?.categoryOther === "string" ? body.categoryOther : "";

  try {
    const options = await listBusinessCategoryOptions();
    if (!categoryId || !isBusinessCategoryId(categoryId, options)) {
      throw new OwnerStoreError("Pick a category from the list.", 400);
    }
    if (categoryId === OTHERS_CATEGORY_ID && !isValidCategoryOther(categoryOther)) {
      throw new OwnerStoreError("Describe your business type (2 to 80 characters).", 400);
    }
    if (!businessName.trim()) {
      throw new OwnerStoreError("Enter a business name first.", 400);
    }

    const result = await generateWhyTrustLine(
      {
        businessName,
        city,
        address,
        categoryId,
        categoryOther,
      },
      options,
    );
    return json(result);
  } catch (error) {
    return failure(error);
  }
}
