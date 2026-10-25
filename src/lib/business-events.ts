import "server-only";

import {
  isValidCatalogName,
  MAX_SERVICES,
  normalizeCatalogName,
} from "@/lib/business-validation";
import {
  evaluateEventSetup,
  isValidEventDateInput,
  isValidEventName,
  normalizeEventDate,
  normalizeEventName,
  type EventSetupChecklist,
} from "@/lib/event-validation";
import { businessLogoPublicUrl } from "@/lib/business-logos";
import { isGuestThemeId } from "@/lib/guest-themes";
import { normalizeLoginId, isValidLoginId } from "@/lib/login-id";
import { normalizeStandeeType, type StandeeType } from "@/lib/standee-type";
import { OwnerStoreError } from "@/lib/store-error";
import { supabaseAdmin } from "@/lib/supabase/admin";

function database() {
  return supabaseAdmin();
}

function mapDbError(error: { code?: string; message?: string }) {
  if (error.code === "23505") {
    return new OwnerStoreError("That name is already in use.", 409);
  }
  if (
    error.code === "42P01" ||
    error.code === "42703" ||
    error.code === "PGRST204" ||
    error.code === "PGRST205" ||
    /does not exist|schema cache/i.test(error.message ?? "")
  ) {
    return new OwnerStoreError(
      "Event standee tables are missing. Run supabase/business-event-standee.sql in Supabase.",
      503,
    );
  }
  return new OwnerStoreError("Could not save event details.", 500);
}

async function ownerRowByLogin(loginId: string) {
  const id = normalizeLoginId(loginId);
  const { data, error } = await database()
    .from("business_owners")
    .select(
      "id, login_id, standee_type, business_name, city, business_category, business_category_other, address, why_trust_us, phone, map_link, setup_complete, qr_active, guest_theme_id, logo_path",
    )
    .eq("login_id", id)
    .maybeSingle();
  if (error) throw mapDbError(error);
  return data as
    | {
        id: string;
        login_id: string;
        standee_type: string | null;
        business_name: string | null;
        city: string | null;
        business_category: string | null;
        business_category_other: string | null;
        address: string | null;
        why_trust_us: string | null;
        phone: string | null;
        map_link: string | null;
        setup_complete: boolean;
        qr_active: boolean;
        guest_theme_id: string | null;
        logo_path: string | null;
      }
    | null;
}

export type EventAreaRecord = { id: string; name: string; sortOrder: number };

export type EventPortalState = {
  eventName: string;
  eventDate: string | null;
  areas: EventAreaRecord[];
  checklist: EventSetupChecklist;
};

export type EventGuestExperience = {
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
  eventName: string;
  eventDate: string;
  areas: EventAreaRecord[];
};

function guestDraftContext(whyTrustUs: string | null, businessName: string | null) {
  const trust = whyTrustUs?.trim() ?? "";
  if (trust.length >= 10) return trust.slice(0, 2000);
  const name = businessName?.trim();
  if (name) return `${name}. Honest Google reviews from guests who attended.`;
  return null;
}

export async function countEventAreas(ownerId: string) {
  const { count, error } = await database()
    .from("business_event_areas")
    .select("id", { count: "exact", head: true })
    .eq("business_owner_id", ownerId);
  if (error) throw mapDbError(error);
  return count ?? 0;
}

async function fetchEventProfile(ownerId: string) {
  const { data, error } = await database()
    .from("business_event_profiles")
    .select("event_name, event_date")
    .eq("business_owner_id", ownerId)
    .maybeSingle();
  if (error) throw mapDbError(error);
  return data as { event_name: string; event_date: string | null } | null;
}

export async function listEventAreasForOwnerId(ownerId: string): Promise<EventAreaRecord[]> {
  const { data, error } = await database()
    .from("business_event_areas")
    .select("id, name, sort_order")
    .eq("business_owner_id", ownerId)
    .order("sort_order", { ascending: true });
  if (error) throw mapDbError(error);
  return (data ?? []).map((item) => ({
    id: item.id as string,
    name: item.name as string,
    sortOrder: item.sort_order as number,
  }));
}

export async function listEventAreasForOwner(loginId: string): Promise<EventAreaRecord[]> {
  const row = await ownerRowByLogin(loginId);
  if (!row) throw new OwnerStoreError("That business owner was not found.", 404);
  return listEventAreasForOwnerId(row.id);
}

type EventSetupRow = NonNullable<Awaited<ReturnType<typeof ownerRowByLogin>>>;

type EventSetupPrefetch = {
  eventName?: string | null;
  eventDate?: string | null;
  areaCount?: number;
};

export async function recomputeEventSetupComplete(
  ownerId: string,
  row: EventSetupRow,
  prefetch?: EventSetupPrefetch,
): Promise<EventSetupChecklist> {
  const standeeType = normalizeStandeeType(row.standee_type);
  if (standeeType !== "event") {
    return evaluateEventSetup({
      standeeType: "table",
      businessName: null,
      city: null,
      phone: null,
      mapLink: null,
      eventName: null,
      eventDate: null,
      areaCount: 0,
    });
  }

  let eventName = prefetch?.eventName;
  let eventDate = prefetch?.eventDate;
  let areaCount = prefetch?.areaCount;
  if (eventName === undefined || eventDate === undefined) {
    const profile = await fetchEventProfile(ownerId);
    if (eventName === undefined) eventName = profile?.event_name ?? null;
    if (eventDate === undefined) eventDate = profile?.event_date ?? null;
  }
  if (areaCount === undefined) {
    areaCount = await countEventAreas(ownerId);
  }

  const checklist = evaluateEventSetup({
    standeeType: "event",
    businessName: row.business_name,
    city: row.city ?? null,
    phone: row.phone,
    mapLink: row.map_link,
    eventName,
    eventDate,
    areaCount,
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

async function buildEventPortalState(row: EventSetupRow): Promise<EventPortalState> {
  const [profile, areas] = await Promise.all([
    fetchEventProfile(row.id),
    listEventAreasForOwnerId(row.id),
  ]);
  const eventName = profile?.event_name ?? null;
  const eventDate = profile?.event_date ?? null;
  const checklist = await recomputeEventSetupComplete(row.id, row, {
    eventName,
    eventDate,
    areaCount: areas.length,
  });
  return {
    eventName: eventName ?? "",
    eventDate,
    areas,
    checklist,
  };
}

export async function getEventPortalState(loginId: string): Promise<EventPortalState | null> {
  const row = await ownerRowByLogin(loginId);
  if (!row || normalizeStandeeType(row.standee_type) !== "event") return null;
  return buildEventPortalState(row);
}

export async function getEventPortalStateForOwnerRow(
  row: EventSetupRow,
): Promise<EventPortalState | null> {
  if (normalizeStandeeType(row.standee_type) !== "event") return null;
  return buildEventPortalState(row);
}

export async function saveEventDetails(
  loginId: string,
  input: { eventName: string; eventDate: string },
) {
  const row = await ownerRowByLogin(loginId);
  if (!row) throw new OwnerStoreError("That business owner was not found.", 404);
  if (normalizeStandeeType(row.standee_type) !== "event") {
    throw new OwnerStoreError("This account is not an event standee.", 400);
  }
  if (!isValidEventName(input.eventName)) {
    throw new OwnerStoreError("Event name must be 2 to 120 characters.", 400);
  }
  if (!isValidEventDateInput(input.eventDate)) {
    throw new OwnerStoreError("Pick a valid event date.", 400);
  }

  const eventName = normalizeEventName(input.eventName);
  const eventDate = normalizeEventDate(input.eventDate)!;

  const { error } = await database().from("business_event_profiles").upsert(
    {
      business_owner_id: row.id,
      event_name: eventName,
      event_date: eventDate,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "business_owner_id" },
  );
  if (error) throw mapDbError(error);

  const areaCount = await countEventAreas(row.id);
  const checklist = await recomputeEventSetupComplete(row.id, row, {
    eventName,
    eventDate,
    areaCount,
  });
  return { checklist };
}

export async function createEventArea(loginId: string, nameInput: string) {
  const row = await ownerRowByLogin(loginId);
  if (!row) throw new OwnerStoreError("That business owner was not found.", 404);
  if (normalizeStandeeType(row.standee_type) !== "event") {
    throw new OwnerStoreError("This account is not an event standee.", 400);
  }
  if (!isValidCatalogName(nameInput)) {
    throw new OwnerStoreError("Use an area name of 1 to 80 characters.", 400);
  }
  const count = await countEventAreas(row.id);
  if (count >= MAX_SERVICES) {
    throw new OwnerStoreError(`You can add up to ${MAX_SERVICES} areas.`, 400);
  }
  const name = normalizeCatalogName(nameInput);
  const { data, error } = await database()
    .from("business_event_areas")
    .insert({
      business_owner_id: row.id,
      name,
      sort_order: count,
    })
    .select("id, name, sort_order")
    .single();
  if (error) throw mapDbError(error);
  await recomputeEventSetupComplete(row.id, row, { areaCount: count + 1 });
  return {
    area: {
      id: data.id as string,
      name: data.name as string,
      sortOrder: data.sort_order as number,
    },
  };
}

export async function deleteEventArea(loginId: string, areaId: string) {
  const row = await ownerRowByLogin(loginId);
  if (!row) throw new OwnerStoreError("That business owner was not found.", 404);
  const { data, error } = await database()
    .from("business_event_areas")
    .delete()
    .eq("id", areaId)
    .eq("business_owner_id", row.id)
    .select("id")
    .maybeSingle();
  if (error) throw mapDbError(error);
  if (!data) throw new OwnerStoreError("That area was not found.", 404);
  const remaining = await countEventAreas(row.id);
  await recomputeEventSetupComplete(row.id, row, { areaCount: remaining });
  return { ok: true as const };
}

export async function loadEventGuestExperience(
  loginId: string,
): Promise<EventGuestExperience | null> {
  const id = normalizeLoginId(loginId);
  if (!isValidLoginId(id)) return null;
  const row = await ownerRowByLogin(id);
  if (!row || normalizeStandeeType(row.standee_type) !== "event") return null;
  if (row.qr_active === false) return null;

  const checklist = await recomputeEventSetupComplete(row.id, row);
  if (!checklist.complete) return null;

  const mapLink = row.map_link?.trim();
  const brief = guestDraftContext(row.why_trust_us, row.business_name);
  if (!mapLink || !brief) return null;

  const profile = await fetchEventProfile(row.id);
  if (!profile?.event_name || !profile.event_date) return null;

  const areas = await listEventAreasForOwner(id);
  if (areas.length === 0) return null;

  const guestThemeId =
    row.guest_theme_id && isGuestThemeId(row.guest_theme_id)
      ? row.guest_theme_id
      : "zust-default";

  return {
    loginId: row.login_id,
    businessName: row.business_name,
    city: row.city?.trim() || null,
    address: row.address?.trim() || null,
    whyTrustUs: row.why_trust_us?.trim() || null,
    phone: row.phone,
    mapLink,
    brief,
    guestThemeId,
    logoUrl: businessLogoPublicUrl(row.logo_path ?? null),
    eventName: profile.event_name,
    eventDate: profile.event_date,
    areas,
  };
}

export function standeeTypeFromRow(value: string | null | undefined): StandeeType {
  return normalizeStandeeType(value);
}
