import "server-only";

import {
  FALLBACK_CATEGORY_OPTIONS,
  isValidCategorySlug,
  OTHERS_CATEGORY_ID,
  slugFromCategoryLabel,
  type BusinessCategoryOption,
} from "@/lib/business-categories";
import { OwnerStoreError } from "@/lib/store-error";
import { supabaseAdmin } from "@/lib/supabase/admin";

const notReady =
  "The business_category_options table is not ready. Run supabase/business-category-options.sql in the Supabase SQL editor.";
const notConnected =
  "Supabase is not connected. Add the project URL and service role key, then run the category SQL.";

function database() {
  try {
    return supabaseAdmin();
  } catch (error) {
    if (error instanceof Error && error.name === "SupabaseNotConfigured") {
      throw new OwnerStoreError(notConnected, 503);
    }
    throw error;
  }
}

function mapDbError(error: { code?: string; message?: string }) {
  if (
    error.code === "42P01" ||
    error.code === "42703" ||
    error.code === "PGRST204" ||
    error.code === "PGRST205" ||
    /does not exist|schema cache/i.test(error.message ?? "")
  ) {
    return new OwnerStoreError(notReady, 503);
  }
  if (error.code === "23505") {
    return new OwnerStoreError("That category id is already in use.", 409);
  }
  return new OwnerStoreError("Categories could not be saved.", 500);
}

type Row = {
  id: string;
  label: string;
  sort_order: number;
  is_others: boolean;
};

function mapRow(row: Row): BusinessCategoryOption {
  return {
    id: row.id,
    label: row.label,
    sortOrder: row.sort_order,
    isOthers: row.is_others === true,
  };
}

function normalizeLabel(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function isValidCategoryLabel(value: string) {
  const label = normalizeLabel(value);
  return label.length >= 2 && label.length <= 80;
}

async function uniqueSlug(base: string) {
  let candidate = base;
  let suffix = 2;
  for (;;) {
    const { data, error } = await database()
      .from("business_category_options")
      .select("id")
      .eq("id", candidate)
      .maybeSingle();
    if (error) throw mapDbError(error);
    if (!data) return candidate;
    candidate = `${base}-${suffix}`.slice(0, 40);
    suffix += 1;
  }
}

/** Ordered list for business profile and validation. Falls back to built-in seed if DB is empty. */
export async function listBusinessCategoryOptions(): Promise<BusinessCategoryOption[]> {
  try {
    const { data, error } = await database()
      .from("business_category_options")
      .select("id, label, sort_order, is_others")
      .order("sort_order", { ascending: true })
      .order("label", { ascending: true });
    if (error) throw mapDbError(error);
    const rows = (data ?? []) as Row[];
    if (rows.length === 0) return [...FALLBACK_CATEGORY_OPTIONS];
    return rows.map(mapRow);
  } catch (error) {
    if (error instanceof OwnerStoreError && error.status === 503) {
      return [...FALLBACK_CATEGORY_OPTIONS];
    }
    throw error;
  }
}

export async function createBusinessCategoryOption(input: { label: string }) {
  if (!isValidCategoryLabel(input.label)) {
    throw new OwnerStoreError("Use a category label of 2 to 80 characters.", 400);
  }

  const label = normalizeLabel(input.label);
  const baseSlug = slugFromCategoryLabel(label);
  if (!isValidCategorySlug(baseSlug)) {
    throw new OwnerStoreError("Could not derive a valid category id from that label.", 400);
  }
  if (baseSlug === OTHERS_CATEGORY_ID) {
    throw new OwnerStoreError('The id "others" is reserved.', 400);
  }

  const id = await uniqueSlug(baseSlug);

  const { data: last } = await database()
    .from("business_category_options")
    .select("sort_order")
    .eq("is_others", false)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sortOrder = typeof last?.sort_order === "number" ? last.sort_order + 1 : 0;

  const { data, error } = await database()
    .from("business_category_options")
    .insert({
      id,
      label,
      why_trust_template: null,
      sort_order: sortOrder,
      is_others: false,
    })
    .select("id, label, sort_order, is_others")
    .single();
  if (error) throw mapDbError(error);
  return mapRow(data as Row);
}

export async function updateBusinessCategoryOption(
  id: string,
  input: {
    label?: string;
    sortOrder?: number;
  },
) {
  if (!isValidCategorySlug(id)) {
    throw new OwnerStoreError("That category was not found.", 404);
  }

  const { data: existing, error: findError } = await database()
    .from("business_category_options")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  if (findError) throw mapDbError(findError);
  if (!existing) throw new OwnerStoreError("That category was not found.", 404);

  const patch: Partial<Row> & { updated_at: string } = {
    updated_at: new Date().toISOString(),
  };

  if (input.label !== undefined) {
    if (!isValidCategoryLabel(input.label)) {
      throw new OwnerStoreError("Use a category label of 2 to 80 characters.", 400);
    }
    patch.label = normalizeLabel(input.label);
  }

  if (input.sortOrder !== undefined) {
    if (!Number.isFinite(input.sortOrder) || input.sortOrder < 0 || input.sortOrder > 999) {
      throw new OwnerStoreError("Sort order must be between 0 and 999.", 400);
    }
    patch.sort_order = Math.round(input.sortOrder);
  }

  const { data, error } = await database()
    .from("business_category_options")
    .update(patch)
    .eq("id", id)
    .select("id, label, sort_order, is_others")
    .single();
  if (error) throw mapDbError(error);
  return mapRow(data as Row);
}

export async function deleteBusinessCategoryOption(id: string) {
  if (!isValidCategorySlug(id)) {
    throw new OwnerStoreError("That category was not found.", 404);
  }
  if (id === OTHERS_CATEGORY_ID) {
    throw new OwnerStoreError('The "Others" category cannot be deleted.', 400);
  }

  const { data: existing, error: findError } = await database()
    .from("business_category_options")
    .select("id, is_others")
    .eq("id", id)
    .maybeSingle();
  if (findError) throw mapDbError(findError);
  if (!existing) throw new OwnerStoreError("That category was not found.", 404);
  if (existing.is_others) {
    throw new OwnerStoreError('The "Others" category cannot be deleted.', 400);
  }

  const { count, error: countError } = await database()
    .from("business_owners")
    .select("id", { count: "exact", head: true })
    .eq("business_category", id);
  if (countError) throw mapDbError(countError);
  if ((count ?? 0) > 0) {
    throw new OwnerStoreError(
      "This category is still used by business owners. Change their profile first.",
      400,
    );
  }

  const { error } = await database().from("business_category_options").delete().eq("id", id);
  if (error) throw mapDbError(error);
  return { id };
}
