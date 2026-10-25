import "server-only";

import { compare, hash } from "bcryptjs";
import { connection } from "next/server";
import {
  evaluateSetup,
  isValidBusinessName,
  isValidAddress,
  isValidCatalogName,
  isValidCity,
  isValidPhoneInput,
  isValidMapLinkInput,
  isValidWhyTrustUs,
  MAX_PRODUCTS_PER_SERVICE,
  MAX_SERVICES,
  normalizeAddress,
  normalizeBusinessName,
  normalizeCatalogName,
  normalizeCity,
  normalizeMapLink,
  normalizePhone,
  normalizeWhyTrustUs,
  type SetupChecklist,
} from "@/lib/business-validation";
import {
  isValidLoginId,
  isValidPassword,
  normalizeLoginId,
  parseSoldPrice,
} from "@/lib/login-id";
import {
  isBusinessCategoryId,
  isValidCategoryOther,
  normalizeCategoryOther,
  type BusinessCategoryOption,
} from "@/lib/business-categories";
import { listBusinessCategoryOptions } from "@/lib/business-category-options";
import { businessLogoPublicUrl } from "@/lib/business-logos";
import { isGuestThemeId } from "@/lib/guest-themes";
import {
  countEventAreas,
  getEventPortalState,
  recomputeEventSetupComplete,
  seedDefaultEventAreas,
} from "@/lib/business-events";
import { OwnerStoreError } from "@/lib/store-error";
import { normalizeStandeeType, type StandeeType } from "@/lib/standee-type";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { EventSetupChecklist } from "@/lib/event-validation";

export type BusinessOwnerListRecord = {
  loginId: string;
  businessName: string | null;
  createdAt: string;
  soldPrice: number;
  setupComplete: boolean;
  qrActive: boolean;
  standeeType: StandeeType;
};

export type BusinessOwnerPublic = {
  loginId: string;
  businessName: string | null;
  city: string | null;
  setupComplete: boolean;
  qrActive: boolean;
  standeeType: StandeeType;
};

export type BusinessOwnerProfile = {
  loginId: string;
  businessName: string | null;
  city: string | null;
  businessCategory: string | null;
  businessCategoryOther: string | null;
  phone: string | null;
  mapLink: string | null;
  address: string | null;
  whyTrustUs: string | null;
  guestThemeId: string;
  logoUrl: string | null;
  setupComplete: boolean;
  standeeType: StandeeType;
  checklist: SetupChecklist;
  eventChecklist: EventSetupChecklist | null;
};

function notReadyMessage(error: { code?: string; message?: string }) {
  if (error.code === "42703" || error.code === "PGRST204") {
    const detail = error.message?.trim();
    return detail
      ? `Database schema is out of date (${detail}). Run supabase/business-owners-upgrade.sql in the Supabase SQL editor, then reload the API schema.`
      : "Database schema is out of date. Run supabase/business-owners-upgrade.sql in the Supabase SQL editor, then reload the API schema.";
  }
  return "The business_owners table is not ready. Run supabase/migrate-customers-to-business-owners.sql or supabase/business-owners.sql in the Supabase SQL editor.";
}
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
    return new OwnerStoreError(notReadyMessage(error), 503);
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
  business_category: string | null;
  business_category_other: string | null;
  address: string | null;
  why_trust_us: string | null;
  phone: string | null;
  map_link: string | null;
  brief: string | null;
  setup_complete: boolean;
  qr_active: boolean;
  guest_theme_id: string;
  standee_type: string | null;
  logo_path: string | null;
  created_at: string;
};

function mapBrandingFields(row: {
  guest_theme_id?: string | null;
  logo_path?: string | null;
}) {
  const guestThemeId =
    row.guest_theme_id && isGuestThemeId(row.guest_theme_id)
      ? row.guest_theme_id
      : "zust-default";
  return {
    guestThemeId,
    logoUrl: businessLogoPublicUrl(row.logo_path ?? null),
  };
}

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

/** Context string for AI review drafts (from Why trust us, not a separate brief field). */
function guestDraftContext(row: OwnerRow): string | null {
  const trust = row.why_trust_us?.trim() ?? "";
  if (trust.length >= 20) return trust.slice(0, 2000);
  if (trust && isValidWhyTrustUs(trust)) {
    return `${trust} Guests share honest reviews on Google.`.slice(0, 2000);
  }
  const name = row.business_name?.trim();
  if (name) {
    return `${name}. Honest Google reviews from guests who visited.`;
  }
  return null;
}

async function recomputeSetupComplete(ownerId: string, row: OwnerRow) {
  if (normalizeStandeeType(row.standee_type) === "event") {
    const eventChecklist = await recomputeEventSetupComplete(ownerId, {
      id: ownerId,
      login_id: row.login_id,
      standee_type: row.standee_type,
      business_name: row.business_name,
      city: row.city,
      business_category: row.business_category,
      business_category_other: row.business_category_other,
      address: row.address,
      why_trust_us: row.why_trust_us,
      phone: row.phone,
      map_link: row.map_link,
      setup_complete: row.setup_complete,
      qr_active: row.qr_active,
      guest_theme_id: row.guest_theme_id,
      logo_path: row.logo_path,
    });
    return {
      businessName: eventChecklist.businessName,
      city: eventChecklist.city,
      category: eventChecklist.category,
      phone: eventChecklist.phone,
      mapLink: eventChecklist.mapLink,
      hasService: eventChecklist.hasArea,
      everyServiceHasProduct: eventChecklist.hasArea,
      complete: eventChecklist.complete,
      missingLabels: eventChecklist.missingLabels,
    };
  }

  const services = await productCountsForOwner(ownerId);
  const categoryOptions = await listBusinessCategoryOptions();
  const checklist = evaluateSetup({
    businessName: row.business_name,
    city: row.city ?? null,
    businessCategory: row.business_category ?? null,
    businessCategoryOther: row.business_category_other ?? null,
    phone: row.phone,
    mapLink: row.map_link,
    services,
    isBusinessCategoryId: (value) => isBusinessCategoryId(value, categoryOptions),
    isValidCategoryOther,
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
    .select("login_id, business_name, created_at, sold_price, setup_complete, qr_active, standee_type")
    .order("created_at", { ascending: false });
  if (error) throw mapDbError(error);
  return (data ?? []).map((row) => ({
    loginId: row.login_id,
    businessName: row.business_name,
    createdAt: row.created_at,
    soldPrice: row.sold_price,
    setupComplete: row.setup_complete,
    qrActive: row.qr_active !== false,
    standeeType: normalizeStandeeType(row.standee_type),
  }));
}

export type PublicBusinessListing = {
  loginId: string;
  businessName: string;
  logoUrl: string | null;
};

/** Ready businesses for the marketing homepage. Returns [] if the store is unavailable. */
export async function listPublicBusinesses(): Promise<PublicBusinessListing[]> {
  await connection();
  try {
    const { data, error } = await database()
      .from("business_owners")
      .select("login_id, business_name, logo_path")
      .eq("setup_complete", true)
      .eq("qr_active", true)
      .not("business_name", "is", null)
      .order("created_at", { ascending: false })
      .limit(24);
    if (error) return [];
    return (data ?? []).flatMap((row) => {
      const businessName = row.business_name?.trim();
      if (!businessName) return [];
      const logoPath = row.logo_path as string | null | undefined;
      return [
        {
          loginId: row.login_id as string,
          businessName,
          logoUrl: businessLogoPublicUrl(logoPath ?? null),
        },
      ];
    });
  } catch {
    return [];
  }
}

export type GuestExperience = {
  loginId: string;
  businessName: string | null;
  city: string | null;
  address: string | null;
  whyTrustUs: string | null;
  phone: string | null;
  mapLink: string;
  brief: string;
  guestThemeId: string;
  logoUrl: string | null;
  services: ServiceRecord[];
};

/** Public guest page data when setup is complete. */
export async function loadGuestExperience(loginId: string): Promise<GuestExperience | null> {
  const id = normalizeLoginId(loginId);
  if (!isValidLoginId(id)) return null;
  const ownerPeek = await database()
    .from("business_owners")
    .select("standee_type")
    .eq("login_id", id)
    .maybeSingle();
  if (ownerPeek.data && normalizeStandeeType(ownerPeek.data.standee_type) === "event") {
    return null;
  }
  const { data, error } = await database()
    .from("business_owners")
    .select(
      "id, login_id, business_name, city, business_category, business_category_other, address, why_trust_us, phone, map_link, brief, setup_complete, qr_active, guest_theme_id, logo_path, password_hash, sold_price, created_at",
    )
    .eq("login_id", id)
    .maybeSingle();
  if (error) throw mapDbError(error);
  if (!data) return null;
  if (data.qr_active === false) return null;

  const ownerId = data.id as string;
  const checklist = await recomputeSetupComplete(ownerId, data as OwnerRow);
  if (!checklist.complete) return null;

  const mapLink = data.map_link?.trim();
  const draftContext = guestDraftContext(data as OwnerRow);
  if (!mapLink || !draftContext) return null;

  const services = await listServicesForOwner(id);
  if (services.length === 0) return null;
  const hasProduct = services.some((service) => service.products.length > 0);
  if (!hasProduct) return null;

  const branding = mapBrandingFields(data);

  return {
    loginId: data.login_id,
    businessName: data.business_name,
    city: data.city?.trim() || null,
    address: data.address?.trim() || null,
    whyTrustUs: data.why_trust_us?.trim() || null,
    phone: data.phone,
    mapLink,
    brief: draftContext,
    guestThemeId: branding.guestThemeId,
    logoUrl: branding.logoUrl,
    services,
  };
}

/** Minimal lookup for admin QR PNG — avoids setup recompute and tolerates pre-migration DB. */
export async function getBusinessOwnerQrLink(
  loginId: string,
): Promise<{ loginId: string; standeeType: StandeeType } | null> {
  const id = normalizeLoginId(loginId);
  if (!isValidLoginId(id)) return null;

  const { data, error } = await database()
    .from("business_owners")
    .select("login_id, standee_type")
    .eq("login_id", id)
    .maybeSingle();

  if (error?.code === "42703" || error?.code === "PGRST204") {
    const { data: fallback, error: fallbackError } = await database()
      .from("business_owners")
      .select("login_id")
      .eq("login_id", id)
      .maybeSingle();
    if (fallbackError) throw mapDbError(fallbackError);
    if (!fallback) return null;
    return { loginId: fallback.login_id as string, standeeType: "table" };
  }

  if (error) throw mapDbError(error);
  if (!data) return null;
  return {
    loginId: data.login_id as string,
    standeeType: normalizeStandeeType(
      (data as { standee_type?: string | null }).standee_type,
    ),
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
      "id, login_id, business_name, city, business_category, business_category_other, address, why_trust_us, phone, map_link, brief, setup_complete, qr_active, standee_type, password_hash, sold_price, created_at",
    )
    .eq("login_id", id)
    .maybeSingle();
  if (error) throw mapDbError(error);
  if (!data) return null;
  const ownerId = data.id as string;
  const row = data as OwnerRow;
  const checklist = await recomputeSetupComplete(ownerId, row);
  return {
    loginId: data.login_id,
    businessName: data.business_name,
    city: data.city,
    setupComplete: checklist.complete,
    qrActive: row.qr_active !== false,
    standeeType: normalizeStandeeType(row.standee_type),
  };
}

export async function setBusinessOwnerQrActive(loginId: string, qrActive: boolean) {
  const id = normalizeLoginId(loginId);
  if (!isValidLoginId(id)) {
    throw new OwnerStoreError("That business owner was not found.", 404);
  }
  const { data, error } = await database()
    .from("business_owners")
    .update({
      qr_active: qrActive,
      updated_at: new Date().toISOString(),
    })
    .eq("login_id", id)
    .select("login_id, qr_active")
    .maybeSingle();
  if (error) throw mapDbError(error);
  if (!data) throw new OwnerStoreError("That business owner was not found.", 404);
  return { loginId: data.login_id as string, qrActive: data.qr_active !== false };
}

const ownerRowSelectForSetup =
  "id, login_id, business_name, city, business_category, business_category_other, address, why_trust_us, phone, map_link, brief, setup_complete, qr_active, guest_theme_id, standee_type, logo_path, password_hash, sold_price, created_at";

export async function updateBusinessOwnerStandeeType(
  loginId: string,
  standeeTypeInput: unknown,
) {
  const id = normalizeLoginId(loginId);
  if (!isValidLoginId(id)) {
    throw new OwnerStoreError("That business owner was not found.", 404);
  }
  if (standeeTypeInput !== "table" && standeeTypeInput !== "event") {
    throw new OwnerStoreError("Pick table or event standee.", 400);
  }
  const standeeType = standeeTypeInput;

  const { data, error } = await database()
    .from("business_owners")
    .update({
      standee_type: standeeType,
      updated_at: new Date().toISOString(),
    })
    .eq("login_id", id)
    .select(ownerRowSelectForSetup)
    .maybeSingle();
  if (error) throw mapDbError(error);
  if (!data) throw new OwnerStoreError("That business owner was not found.", 404);

  const ownerId = data.id as string;
  if (standeeType === "event") {
    const areaCount = await countEventAreas(ownerId);
    if (areaCount === 0) await seedDefaultEventAreas(ownerId);
  }

  await recomputeSetupComplete(ownerId, data as OwnerRow);
  return { loginId: id, standeeType: standeeType as StandeeType };
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
  standeeTypeInput?: unknown,
) {
  const id = normalizeLoginId(loginId);
  const soldPrice = parseSoldPrice(soldPriceInput);
  const standeeType = standeeTypeInput === "event" ? "event" : "table";
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
  const { data, error } = await database()
    .from("business_owners")
    .insert({
      login_id: id,
      password_hash: passwordHash,
      sold_price: soldPrice,
      standee_type: standeeType,
    })
    .select("id")
    .single();
  if (error) throw mapDbError(error);
  if (standeeType === "event") {
    await seedDefaultEventAreas(data.id as string);
  }
  return { loginId: id, password, standeeType };
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
      "id, login_id, business_name, city, business_category, business_category_other, address, why_trust_us, phone, map_link, brief, setup_complete, qr_active, guest_theme_id, standee_type, logo_path, password_hash",
    )
    .eq("login_id", id)
    .maybeSingle();
  if (error) throw mapDbError(error);
  if (!data) return null;
  const ownerId = data.id as string;
  const row = data as OwnerRow;
  const standeeType = normalizeStandeeType(row.standee_type);
  const checklist = await recomputeSetupComplete(ownerId, row);
  const branding = mapBrandingFields(row);
  const eventState =
    standeeType === "event" ? await getEventPortalState(id) : null;
  const categoryOptions = await listBusinessCategoryOptions();
  const categoryRaw = row.business_category?.trim();
  const businessCategory =
    categoryRaw && isBusinessCategoryId(categoryRaw, categoryOptions)
      ? categoryRaw
      : null;

  return {
    loginId: row.login_id,
    businessName: row.business_name,
    city: row.city,
    businessCategory,
    businessCategoryOther: row.business_category_other?.trim() || null,
    phone: row.phone,
    mapLink: row.map_link,
    address: row.address,
    whyTrustUs: row.why_trust_us,
    guestThemeId: branding.guestThemeId,
    logoUrl: branding.logoUrl,
    setupComplete: checklist.complete,
    standeeType,
    checklist,
    eventChecklist: eventState?.checklist ?? null,
  };
}

export async function updateBusinessOwnerProfile(
  loginId: string,
  input: {
    businessName: string;
    city: string;
    businessCategory: string;
    businessCategoryOther: string;
    address: string;
    whyTrustUs: string;
    phone: string;
    mapLink: string;
    guestThemeId?: string;
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
  if (!isValidAddress(input.address)) {
    throw new OwnerStoreError("Enter an address (5 to 200 characters) for the guest page.", 400);
  }
  if (!isValidWhyTrustUs(input.whyTrustUs)) {
    throw new OwnerStoreError("Why trust us must be 10 to 300 characters.", 400);
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

  const { data: standeeRow, error: standeeError } = await database()
    .from("business_owners")
    .select("standee_type")
    .eq("id", ownerId)
    .maybeSingle();
  if (standeeError) throw mapDbError(standeeError);
  const isEventStandee = normalizeStandeeType(standeeRow?.standee_type) === "event";

  let businessCategoryPatch: string | null = null;
  let businessCategoryOtherPatch: string | null = null;
  if (!isEventStandee) {
    const categoryOptions = await listBusinessCategoryOptions();
    const categoryRaw = input.businessCategory.trim();
    if (!isBusinessCategoryId(categoryRaw, categoryOptions)) {
      throw new OwnerStoreError("Pick a category from the list.", 400);
    }
    businessCategoryPatch = categoryRaw;
    if (categoryRaw === "others") {
      if (!isValidCategoryOther(input.businessCategoryOther)) {
        throw new OwnerStoreError("Describe your business type (2 to 80 characters).", 400);
      }
      businessCategoryOtherPatch = normalizeCategoryOther(input.businessCategoryOther);
    }
  }

  const businessName = normalizeBusinessName(input.businessName);
  const city = normalizeCity(input.city);
  const address = normalizeAddress(input.address);
  const whyTrustUs = normalizeWhyTrustUs(input.whyTrustUs);
  const phone = normalizePhone(input.phone)!;

  const patch: Record<string, string | null> = {
    business_name: businessName,
    city,
    business_category: businessCategoryPatch,
    business_category_other: businessCategoryOtherPatch,
    address,
    why_trust_us: whyTrustUs,
    phone,
    map_link: mapLink,
    brief: null,
    updated_at: new Date().toISOString(),
  };
  if (input.guestThemeId !== undefined) {
    if (!isGuestThemeId(input.guestThemeId)) {
      throw new OwnerStoreError("Pick a guest page theme from the list.", 400);
    }
    patch.guest_theme_id = input.guestThemeId;
  }

  const { data, error } = await database()
    .from("business_owners")
    .update(patch)
    .eq("id", ownerId)
    .select(ownerRowSelectForSetup)
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
      "id, login_id, business_name, city, business_category, business_category_other, address, why_trust_us, phone, map_link, brief, setup_complete, password_hash, sold_price, created_at",
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
