import "server-only";

import { normalizeLoginId } from "@/lib/login-id";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type GuestMetric = "page_view" | "draft" | "copy_continue";

export type GuestAnalyticsCounts = {
  pageViews: number;
  draftsGenerated: number;
  copyContinueTaps: number;
};

const emptyCounts = (): GuestAnalyticsCounts => ({
  pageViews: 0,
  draftsGenerated: 0,
  copyContinueTaps: 0,
});

const columnForMetric: Record<
  GuestMetric,
  "page_views" | "drafts_generated" | "copy_continue_taps"
> = {
  page_view: "page_views",
  draft: "drafts_generated",
  copy_continue: "copy_continue_taps",
};

function database() {
  return supabaseAdmin();
}

function isMissingTable(error: { code?: string; message?: string }) {
  return (
    error.code === "42P01" ||
    error.code === "PGRST204" ||
    error.code === "PGRST205" ||
    /guest_analytics|does not exist|schema cache/i.test(error.message ?? "")
  );
}

async function ownerIdForLogin(loginId: string) {
  const id = normalizeLoginId(loginId);
  if (!id) return null;
  const { data, error } = await database()
    .from("business_owners")
    .select("id, qr_active")
    .eq("login_id", id)
    .maybeSingle();
  if (error) {
    if (isMissingTable(error)) return null;
    if (error.code === "42703") return null;
    throw error;
  }
  if (!data?.id || data.qr_active === false) return null;
  return data.id as string;
}

/** Best-effort increment; never throws to callers. */
export async function recordGuestMetric(loginId: string, metric: GuestMetric) {
  try {
    const ownerId = await ownerIdForLogin(loginId);
    if (!ownerId) return;

    const column = columnForMetric[metric];
    const { data: row, error: readError } = await database()
      .from("guest_analytics")
      .select("page_views, drafts_generated, copy_continue_taps")
      .eq("business_owner_id", ownerId)
      .maybeSingle();

    if (readError && isMissingTable(readError)) return;
    if (readError) return;

    if (!row) {
      const insert = {
        business_owner_id: ownerId,
        page_views: metric === "page_view" ? 1 : 0,
        drafts_generated: metric === "draft" ? 1 : 0,
        copy_continue_taps: metric === "copy_continue" ? 1 : 0,
      };
      const { error: insertError } = await database().from("guest_analytics").insert(insert);
      if (insertError && !isMissingTable(insertError)) {
        /* ignore */
      }
      return;
    }

    const current = Number(row[column] ?? 0);
    const { error: updateError } = await database()
      .from("guest_analytics")
      .update({
        [column]: current + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("business_owner_id", ownerId);
    if (updateError && !isMissingTable(updateError)) {
      /* ignore */
    }
  } catch {
    /* analytics must not break guest flow */
  }
}

function mapRow(row: {
  page_views: number;
  drafts_generated: number;
  copy_continue_taps: number;
}): GuestAnalyticsCounts {
  return {
    pageViews: Number(row.page_views) || 0,
    draftsGenerated: Number(row.drafts_generated) || 0,
    copyContinueTaps: Number(row.copy_continue_taps) || 0,
  };
}

export async function getGuestAnalyticsForLogin(
  loginId: string,
): Promise<GuestAnalyticsCounts> {
  try {
    const ownerId = await ownerIdForLogin(loginId);
    if (!ownerId) return emptyCounts();

    const { data, error } = await database()
      .from("guest_analytics")
      .select("page_views, drafts_generated, copy_continue_taps")
      .eq("business_owner_id", ownerId)
      .maybeSingle();

    if (error) {
      if (isMissingTable(error)) return emptyCounts();
      return emptyCounts();
    }
    if (!data) return emptyCounts();
    return mapRow(data);
  } catch {
    return emptyCounts();
  }
}

export async function listGuestAnalyticsForOwners(
  loginIds: string[],
): Promise<Record<string, GuestAnalyticsCounts>> {
  const result: Record<string, GuestAnalyticsCounts> = {};
  for (const raw of loginIds) {
    const loginId = normalizeLoginId(raw);
    if (loginId) result[loginId] = emptyCounts();
  }
  if (loginIds.length === 0) return result;

  try {
    const { data: owners, error: ownersError } = await database()
      .from("business_owners")
      .select("id, login_id")
      .in(
        "login_id",
        loginIds.map((id) => normalizeLoginId(id)).filter(Boolean),
      );
    if (ownersError) {
      if (isMissingTable(ownersError)) return result;
      return result;
    }

    const idToLogin = new Map<string, string>();
    for (const row of owners ?? []) {
      idToLogin.set(row.id as string, row.login_id as string);
    }
    const ownerIds = [...idToLogin.keys()];
    if (ownerIds.length === 0) return result;

    const { data: rows, error } = await database()
      .from("guest_analytics")
      .select("business_owner_id, page_views, drafts_generated, copy_continue_taps")
      .in("business_owner_id", ownerIds);

    if (error) {
      if (isMissingTable(error)) return result;
      return result;
    }

    for (const row of rows ?? []) {
      const loginId = idToLogin.get(row.business_owner_id as string);
      if (!loginId) continue;
      result[loginId] = mapRow(row as Parameters<typeof mapRow>[0]);
    }
    return result;
  } catch {
    return result;
  }
}

export async function sumGuestAnalytics(
  loginIds: string[],
): Promise<GuestAnalyticsCounts> {
  const byLogin = await listGuestAnalyticsForOwners(loginIds);
  const totals = emptyCounts();
  for (const counts of Object.values(byLogin)) {
    totals.pageViews += counts.pageViews;
    totals.draftsGenerated += counts.draftsGenerated;
    totals.copyContinueTaps += counts.copyContinueTaps;
  }
  return totals;
}
