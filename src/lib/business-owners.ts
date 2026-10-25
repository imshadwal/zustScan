import "server-only";

import { compare, hash } from "bcryptjs";
import { connection } from "next/server";
import {
  evaluateSetup,
  isValidBusinessName,
  isValidBrief,
  isValidCatalogName,
  isValidCity,
  isValidPhoneInput,
  isValidMapLinkInput,
  MAX_PRODUCTS_PER_SERVICE,
  MAX_SERVICES,
  normalizeBrief,
  normalizeBusinessName,
  normalizeCatalogName,
  normalizeCity,
  normalizeMapLink,
  normalizePhone,
  type SetupChecklist,
} from "@/lib/business-validation";
import {
  isValidLoginId,
  isValidPassword,
  normalizeLoginId,
  parseSoldPrice,
} from "@/lib/login-id";
import { OwnerStoreError } from "@/lib/store-error";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type BusinessOwnerListRecord = {
  loginId: string;
  businessName: string | null;
  createdAt: string;
  soldPrice: number;
  setupComplete: boolean;
};

export type BusinessOwnerPublic = {
  loginId: string;
  businessName: string | null;
  city: string | null;
  setupComplete: boolean;
};

export type BusinessOwnerProfile = {
  loginId: string;
  businessName: string | null;
  city: string | null;
  phone: string | null;
  mapLink: string | null;
  brief: string | null;
  setupComplete: boolean;
  checklist: SetupChecklist;
};

const notReady =
  "The business_owners table is not ready. Run supabase/migrate-customers-to-business-owners.sql or supabase/business-owners.sql in the Supabase SQL editor.";
const notConnected =
  "Supabase is not connected. Add the project URL and service role key, then run the business owner SQL.";

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
  if (error.code === "23505") {
    return new OwnerStoreError("That login id is already in use.", 409);
  }
  if (
    error.code === "42P01" ||
    error.code === "42703" ||
    error.code === "PGRST204" ||
    error.code === "PGRST205" ||
    /does not exist|schema cache/i.test(error.message ?? "")
  ) {
    return new OwnerStoreError(notReady, 503);
  }
  return new OwnerStoreError("The business owner could not be saved.", 500);
}

type OwnerRow = {
  id: string;
  login_id: string;
  password_hash: string;
  sold_price: number;
  business_name: string | null;
  city: string | null;
  phone: string | null;
  map_link: string | null;
  brief: string | null;
  setup_complete: boolean;
  created_at: string;
};

async function ownerIdByLogin(loginId: string) {
  const id = normalizeLoginId(loginId);
  const { data, error } = await database()
    .from("business_owners")
    .select("id")
    .eq("login_id", id)
    .maybeSingle();
  if (error) throw mapDbError(error);
  return data?.id as string | undefined;
}

async function productCountsForOwner(ownerId: string) {
  const { data: services, error: servicesError } = await database()
    .from("business_services")
    .select("id")
    .eq("business_owner_id", ownerId)
    .order("sort_order", { ascending: true });
  if (servicesError) throw mapDbError(servicesError);
  const serviceIds = (services ?? []).map((row) => row.id as string);
  if (serviceIds.length === 0) return [] as { productCount: number }[];

  const { data: products, error: productsError } = await database()
    .from("business_products")
    .select("service_id")
    .in("service_id", serviceIds);
  if (productsError) throw mapDbError(productsError);

  const counts = new Map<string, number>();
  for (const sid of serviceIds) counts.set(sid, 0);
  for (const row of products ?? []) {
    const sid = row.service_id as string;
    counts.set(sid, (counts.get(sid) ?? 0) + 1);
  }
  return serviceIds.map((sid) => ({ productCount: counts.get(sid) ?? 0 }));
}

async function recomputeSetupComplete(ownerId: string, row: OwnerRow) {
  const services = await productCountsForOwner(ownerId);
  const checklist = evaluateSetup({
    businessName: row.business_name,
    city: row.city ?? null,
    phone: row.phone,
    mapLink: row.map_link,
    brief: row.brief,
    services,
  });
  if (checklist.complete !== row.setup_complete) {
    const { error } = await database()
      .from("business_owners")
      .update({
        setup_complete: checklist.complete,
        updated_at: new Date().toISOString(),
      })
      .eq("id", ownerId);
    if (error) throw mapDbError(error);
  }
  return checklist;
}

export async function listBusinessOwners(): Promise<BusinessOwnerListRecord[]> {
  const { data, error } = await database()
    .from("business_owners")
    .select("login_id, business_name, created_at, sold_price, setup_complete")
    .order("created_at", { ascending: false });
  if (error) throw mapDbError(error);
  return (data ?? []).map((row) => ({
    loginId: row.login_id,
    businessName: row.business_name,
    createdAt: row.created_at,
    soldPrice: row.sold_price,
    setupComplete: row.setup_complete,
  }));
}

export type PublicBusinessListing = {
  loginId: string;
  businessName: string;
};

/** Ready businesses for the marketing homepage. Returns [] if the store is unavailable. */
export async function listPublicBusinesses(): Promise<PublicBusinessListing[]> {
  await connection();
  try {
    const { data, error } = await database()
      .from("business_owners")
      .select("login_id, business_name")
      .eq("setup_complete", true)
      .not("business_name", "is", null)
      .order("created_at", { ascending: false })
      .limit(24);
    if (error) return [];
    return (data ?? []).flatMap((row) => {
      const businessName = row.business_name?.trim();
      if (!businessName) return [];
      return [{ loginId: row.login_id as string, businessName }];
    });
  } catch {
    return [];
  }
}

export type GuestExperience = {
  loginId: string;
  businessName: string | null;
  city: string | null;
  phone: string | null;
  mapLink: string;
  brief: string;
  services: ServiceRecord[];
};

/** Public guest page data when setup is complete. */
export async function loadGuestExperience(loginId: string): Promise<GuestExperience | null> {
  const id = normalizeLoginId(loginId);
  if (!isValidLoginId(id)) return null;
  const { data, error } = await database()
    .from("business_owners")
    .select(
      "id, login_id, business_name, city, phone, map_link, brief, setup_complete, password_hash, sold_price, created_at",
    )
    .eq("login_id", id)
    .maybeSingle();
  if (error) throw mapDbError(error);
  if (!data) return null;

  const ownerId = data.id as string;
  const checklist = await recomputeSetupComplete(ownerId, data as OwnerRow);
  if (!checklist.complete) return null;

  const mapLink = data.map_link?.trim();
  const brief = data.brief?.trim();
  if (!mapLink || !brief) return null;

  const services = await listServicesForOwner(id);
  if (services.length === 0) return null;
  const hasProduct = services.some((service) => service.products.length > 0);
  if (!hasProduct) return null;

  return {
    loginId: data.login_id,
    businessName: data.business_name,
    city: data.city?.trim() || null,
    phone: data.phone,
    mapLink,
    brief,
    services,
  };
}

export async function findBusinessOwnerPublic(
  loginId: string,
): Promise<BusinessOwnerPublic | null> {
  const id = normalizeLoginId(loginId);
  if (!isValidLoginId(id)) return null;
  const { data, error } = await database()
    .from("business_owners")
    .select(
      "id, login_id, business_name, city, phone, map_link, brief, setup_complete, password_hash, sold_price, created_at",
    )
    .eq("login_id", id)
    .maybeSingle();
  if (error) throw mapDbError(error);
  if (!data) return null;
  const ownerId = data.id as string;
  const checklist = await recomputeSetupComplete(ownerId, data as OwnerRow);
  return {
    loginId: data.login_id,
    businessName: data.business_name,
    city: data.city,
    setupComplete: checklist.complete,
  };
}

export async function verifyBusinessOwnerPassword(loginId: string, password: string) {
  const id = normalizeLoginId(loginId);
  if (!isValidLoginId(id)) return false;
  const { data, error } = await database()
    .from("business_owners")
    .select("password_hash")
    .eq("login_id", id)
    .maybeSingle();
  if (error) throw mapDbError(error);
  if (!data?.password_hash) return false;
  return compare(password, data.password_hash);
}

export async function createBusinessOwner(
  loginId: string,
  password: string,
  soldPriceInput: string,
) {
  const id = normalizeLoginId(loginId);
  const soldPrice = parseSoldPrice(soldPriceInput);
  if (!isValidLoginId(id)) {
    throw new OwnerStoreError("Use 2 to 40 letters, numbers, and hyphens.", 400);
  }
  if (!isValidPassword(password)) {
    throw new OwnerStoreError("Use a password of 8 to 72 characters.", 400);
  }
  if (soldPrice === null) {
    throw new OwnerStoreError("Enter the price in whole rupees.", 400);
  }
  const passwordHash = await hash(password, 12);
  const { error } = await database().from("business_owners").insert({
    login_id: id,
    password_hash: passwordHash,
    sold_price: soldPrice,
  });
  if (error) throw mapDbError(error);
  return { loginId: id, password };
}

export async function deleteBusinessOwner(loginId: string) {
  const id = normalizeLoginId(loginId);
  if (!isValidLoginId(id)) {
    throw new OwnerStoreError("That business owner was not found.", 404);
  }
  const { data, error } = await database()
    .from("business_owners")
    .delete()
    .eq("login_id", id)
    .select("login_id")
    .maybeSingle();
  if (error) throw mapDbError(error);
  if (!data) throw new OwnerStoreError("That business owner was not found.", 404);
  return { loginId: id };
}

export async function resetBusinessOwnerPassword(loginId: string, password: string) {
  const id = normalizeLoginId(loginId);
  if (!isValidLoginId(id)) {
    throw new OwnerStoreError("That business owner was not found.", 404);
  }
  if (!isValidPassword(password)) {
    throw new OwnerStoreError("Use a password of 8 to 72 characters.", 400);
  }
  const passwordHash = await hash(password, 12);
  const { data, error } = await database()
    .from("business_owners")
    .update({ password_hash: passwordHash })
    .eq("login_id", id)
    .select("login_id")
    .maybeSingle();
  if (error) throw mapDbError(error);
  if (!data) throw new OwnerStoreError("That business owner was not found.", 404);
  return { loginId: id, password };
}

export async function getBusinessOwnerProfile(
  loginId: string,
): Promise<BusinessOwnerProfile | null> {
  const id = normalizeLoginId(loginId);
  const { data, error } = await database()
    .from("business_owners")
    .select(
      "id, login_id, business_name, city, phone, map_link, brief, setup_complete, password_hash",
    )
    .eq("login_id", id)
    .maybeSingle();
  if (error) throw mapDbError(error);
  if (!data) return null;
  const ownerId = data.id as string;
  const row = data as OwnerRow;
  const checklist = await recomputeSetupComplete(ownerId, row);
  return {
    loginId: row.login_id,
    businessName: row.business_name,
    city: row.city,
    phone: row.phone,
    mapLink: row.map_link,
    brief: row.brief,
    setupComplete: checklist.complete,
    checklist,
  };
}

export async function updateBusinessOwnerProfile(
  loginId: string,
  input: {
    businessName: string;
    city: string;
    phone: string;
    mapLink: string;
    brief: string;
  },
) {
  const id = normalizeLoginId(loginId);
  const ownerId = await ownerIdByLogin(id);
  if (!ownerId) throw new OwnerStoreError("That business owner was not found.", 404);

  if (!isValidBusinessName(input.businessName)) {
    throw new OwnerStoreError("Use a business name of 2 to 80 characters.", 400);
  }
  if (!isValidCity(input.city)) {
    throw new OwnerStoreError(
      "Enter a city (2 to 80 characters). Guests see it after your business name.",
      400,
    );
  }
  if (!isValidPhoneInput(input.phone)) {
    throw new OwnerStoreError("Enter a valid 10-digit Indian mobile number.", 400);
  }
  const mapLink = normalizeMapLink(input.mapLink);
  if (!mapLink) {
    throw new OwnerStoreError(
      "Enter a valid Google review link (g.page/…/review) or Maps link.",
      400,
    );
  }
  if (!isValidBrief(input.brief)) {
    throw new OwnerStoreError("The brief must be 20 to 2000 characters.", 400);
  }

  const businessName = normalizeBusinessName(input.businessName);
  const city = normalizeCity(input.city);
  const phone = normalizePhone(input.phone)!;
  const brief = normalizeBrief(input.brief);

  const { data, error } = await database()
    .from("business_owners")
    .update({
      business_name: businessName,
      city,
      phone,
      map_link: mapLink,
      brief,
      updated_at: new Date().toISOString(),
    })
    .eq("id", ownerId)
    .select(
      "id, login_id, business_name, city, phone, map_link, brief, setup_complete, password_hash, sold_price, created_at",
    )
    .maybeSingle();
  if (error) throw mapDbError(error);
  if (!data) throw new OwnerStoreError("That business owner was not found.", 404);
  const checklist = await recomputeSetupComplete(ownerId, data as OwnerRow);
  return { checklist };
}

export type ServiceRecord = {
  id: string;
  name: string;
  sortOrder: number;
  products: { id: string; name: string; sortOrder: number }[];
};

export async function listServicesForOwner(loginId: string): Promise<ServiceRecord[]> {
  const ownerId = await ownerIdByLogin(loginId);
  if (!ownerId) throw new OwnerStoreError("That business owner was not found.", 404);

  const { data: services, error } = await database()
    .from("business_services")
    .select("id, name, sort_order")
    .eq("business_owner_id", ownerId)
    .order("sort_order", { ascending: true });
  if (error) throw mapDbError(error);

  const serviceIds = (services ?? []).map((s) => s.id as string);
  if (serviceIds.length === 0) return [];

  const { data: products, error: productsError } = await database()
    .from("business_products")
    .select("id, name, sort_order, service_id")
    .in("service_id", serviceIds)
    .order("sort_order", { ascending: true });
  if (productsError) throw mapDbError(productsError);

  const byService = new Map<string, ServiceRecord["products"]>();
  for (const sid of serviceIds) byService.set(sid, []);
  for (const row of products ?? []) {
    const sid = row.service_id as string;
    byService.get(sid)?.push({
      id: row.id as string,
      name: row.name as string,
      sortOrder: row.sort_order as number,
    });
  }

  return (services ?? []).map((service) => ({
    id: service.id as string,
    name: service.name as string,
    sortOrder: service.sort_order as number,
    products: byService.get(service.id as string) ?? [],
  }));
}

async function touchOwnerSetup(ownerId: string) {
  const { data, error } = await database()
    .from("business_owners")
    .select(
      "id, login_id, business_name, city, phone, map_link, brief, setup_complete, password_hash, sold_price, created_at",
    )
    .eq("id", ownerId)
    .maybeSingle();
  if (error) throw mapDbError(error);
  if (!data) return;
  await recomputeSetupComplete(ownerId, data as OwnerRow);
}

export async function createService(loginId: string, nameInput: string) {
  const ownerId = await ownerIdByLogin(loginId);
  if (!ownerId) throw new OwnerStoreError("That business owner was not found.", 404);
  const name = normalizeCatalogName(nameInput);
  if (!isValidCatalogName(name)) {
    throw new OwnerStoreError("Use a service name of 1 to 80 characters.", 400);
  }

  const { count, error: countError } = await database()
    .from("business_services")
    .select("id", { count: "exact", head: true })
    .eq("business_owner_id", ownerId);
  if (countError) throw mapDbError(countError);
  if ((count ?? 0) >= MAX_SERVICES) {
    throw new OwnerStoreError(`You can add up to ${MAX_SERVICES} services.`, 400);
  }

  const { data: last } = await database()
    .from("business_services")
    .select("sort_order")
    .eq("business_owner_id", ownerId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sortOrder = typeof last?.sort_order === "number" ? last.sort_order + 1 : 0;

  const { data, error } = await database()
    .from("business_services")
    .insert({ business_owner_id: ownerId, name, sort_order: sortOrder })
    .select("id, name, sort_order")
    .single();
  if (error) throw mapDbError(error);
  await touchOwnerSetup(ownerId);
  return {
    id: data.id as string,
    name: data.name as string,
    sortOrder: data.sort_order as number,
    products: [],
  };
}

export async function renameService(loginId: string, serviceId: string, nameInput: string) {
  const ownerId = await ownerIdByLogin(loginId);
  if (!ownerId) throw new OwnerStoreError("That business owner was not found.", 404);
  const name = normalizeCatalogName(nameInput);
  if (!isValidCatalogName(name)) {
    throw new OwnerStoreError("Use a service name of 1 to 80 characters.", 400);
  }
  const { data, error } = await database()
    .from("business_services")
    .update({ name })
    .eq("id", serviceId)
    .eq("business_owner_id", ownerId)
    .select("id")
    .maybeSingle();
  if (error) throw mapDbError(error);
  if (!data) throw new OwnerStoreError("That service was not found.", 404);
}

export async function deleteService(loginId: string, serviceId: string) {
  const ownerId = await ownerIdByLogin(loginId);
  if (!ownerId) throw new OwnerStoreError("That business owner was not found.", 404);
  const { data, error } = await database()
    .from("business_services")
    .delete()
    .eq("id", serviceId)
    .eq("business_owner_id", ownerId)
    .select("id")
    .maybeSingle();
  if (error) throw mapDbError(error);
  if (!data) throw new OwnerStoreError("That service was not found.", 404);
  await touchOwnerSetup(ownerId);
}

export async function createProduct(loginId: string, serviceId: string, nameInput: string) {
  const ownerId = await ownerIdByLogin(loginId);
  if (!ownerId) throw new OwnerStoreError("That business owner was not found.", 404);

  const { data: service, error: serviceError } = await database()
    .from("business_services")
    .select("id")
    .eq("id", serviceId)
    .eq("business_owner_id", ownerId)
    .maybeSingle();
  if (serviceError) throw mapDbError(serviceError);
  if (!service) throw new OwnerStoreError("That service was not found.", 404);

  const name = normalizeCatalogName(nameInput);
  if (!isValidCatalogName(name)) {
    throw new OwnerStoreError("Use a product name of 1 to 80 characters.", 400);
  }

  const { count, error: countError } = await database()
    .from("business_products")
    .select("id", { count: "exact", head: true })
    .eq("service_id", serviceId);
  if (countError) throw mapDbError(countError);
  if ((count ?? 0) >= MAX_PRODUCTS_PER_SERVICE) {
    throw new OwnerStoreError(
      `You can add up to ${MAX_PRODUCTS_PER_SERVICE} products per service.`,
      400,
    );
  }

  const { data: last } = await database()
    .from("business_products")
    .select("sort_order")
    .eq("service_id", serviceId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sortOrder = typeof last?.sort_order === "number" ? last.sort_order + 1 : 0;

  const { data, error } = await database()
    .from("business_products")
    .insert({ service_id: serviceId, name, sort_order: sortOrder })
    .select("id, name, sort_order")
    .single();
  if (error) throw mapDbError(error);
  await touchOwnerSetup(ownerId);
  return {
    id: data.id as string,
    name: data.name as string,
    sortOrder: data.sort_order as number,
  };
}

export async function createProductsBatch(
  loginId: string,
  serviceId: string,
  nameInputs: string[],
) {
  const ownerId = await ownerIdByLogin(loginId);
  if (!ownerId) throw new OwnerStoreError("That business owner was not found.", 404);

  const { data: service, error: serviceError } = await database()
    .from("business_services")
    .select("id")
    .eq("id", serviceId)
    .eq("business_owner_id", ownerId)
    .maybeSingle();
  if (serviceError) throw mapDbError(serviceError);
  if (!service) throw new OwnerStoreError("That service was not found.", 404);

  const names: string[] = [];
  const seen = new Set<string>();
  for (const raw of nameInputs) {
    const name = normalizeCatalogName(raw);
    if (!isValidCatalogName(name)) {
      throw new OwnerStoreError("Use a product name of 1 to 80 characters.", 400);
    }
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    names.push(name);
  }
  if (names.length === 0) {
    throw new OwnerStoreError("Add at least one product name.", 400);
  }

  const { count, error: countError } = await database()
    .from("business_products")
    .select("id", { count: "exact", head: true })
    .eq("service_id", serviceId);
  if (countError) throw mapDbError(countError);
  const existing = count ?? 0;
  if (existing + names.length > MAX_PRODUCTS_PER_SERVICE) {
    throw new OwnerStoreError(
      `You can add up to ${MAX_PRODUCTS_PER_SERVICE} products per service.`,
      400,
    );
  }

  const { data: last } = await database()
    .from("business_products")
    .select("sort_order")
    .eq("service_id", serviceId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  let sortOrder = typeof last?.sort_order === "number" ? last.sort_order + 1 : 0;

  const rows = names.map((name) => ({
    service_id: serviceId,
    name,
    sort_order: sortOrder++,
  }));

  const { data, error } = await database()
    .from("business_products")
    .insert(rows)
    .select("id, name, sort_order");
  if (error) throw mapDbError(error);

  await touchOwnerSetup(ownerId);

  return (data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    sortOrder: row.sort_order as number,
  }));
}

export async function renameProduct(loginId: string, productId: string, nameInput: string) {
  const ownerId = await ownerIdByLogin(loginId);
  if (!ownerId) throw new OwnerStoreError("That business owner was not found.", 404);
  const name = normalizeCatalogName(nameInput);
  if (!isValidCatalogName(name)) {
    throw new OwnerStoreError("Use a product name of 1 to 80 characters.", 400);
  }

  const { data: product, error: findError } = await database()
    .from("business_products")
    .select("id, service_id")
    .eq("id", productId)
    .maybeSingle();
  if (findError) throw mapDbError(findError);
  if (!product) throw new OwnerStoreError("That product was not found.", 404);

  const { data: service, error: serviceError } = await database()
    .from("business_services")
    .select("id")
    .eq("id", product.service_id as string)
    .eq("business_owner_id", ownerId)
    .maybeSingle();
  if (serviceError) throw mapDbError(serviceError);
  if (!service) throw new OwnerStoreError("That product was not found.", 404);

  const { error } = await database()
    .from("business_products")
    .update({ name })
    .eq("id", productId);
  if (error) throw mapDbError(error);
}

export async function deleteProduct(loginId: string, productId: string) {
  const ownerId = await ownerIdByLogin(loginId);
  if (!ownerId) throw new OwnerStoreError("That business owner was not found.", 404);

  const { data: product, error: findError } = await database()
    .from("business_products")
    .select("id, service_id")
    .eq("id", productId)
    .maybeSingle();
  if (findError) throw mapDbError(findError);
  if (!product) throw new OwnerStoreError("That product was not found.", 404);

  const { data: service, error: serviceError } = await database()
    .from("business_services")
    .select("id")
    .eq("id", product.service_id as string)
    .eq("business_owner_id", ownerId)
    .maybeSingle();
  if (serviceError) throw mapDbError(serviceError);
  if (!service) throw new OwnerStoreError("That product was not found.", 404);

  const { error } = await database().from("business_products").delete().eq("id", productId);
  if (error) throw mapDbError(error);
  await touchOwnerSetup(ownerId);
}
