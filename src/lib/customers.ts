import "server-only";

import { hash } from "bcryptjs";
import { CustomerStoreError } from "@/lib/customer-error";
import {
  isValidLoginId,
  isValidPassword,
  normalizeLoginId,
  parseSoldPrice,
} from "@/lib/customer-id";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type CustomerRecord = {
  loginId: string;
  createdAt: string;
  soldPrice: number;
};

const notReady =
  "The customers table is not ready. Run supabase/customers.sql in the Supabase SQL editor.";
const notConnected =
  "Supabase is not connected. Add the project URL and service role key, then run supabase/customers.sql.";

function database() {
  try {
    return supabaseAdmin();
  } catch (error) {
    if (error instanceof Error && error.name === "SupabaseNotConfigured") {
      throw new CustomerStoreError(notConnected, 503);
    }
    throw error;
  }
}

function mapDbError(error: { code?: string; message?: string }) {
  if (error.code === "23505") {
    return new CustomerStoreError("That customer id is already in use.", 409);
  }
  if (
    error.code === "42P01" ||
    error.code === "42703" ||
    error.code === "PGRST204" ||
    error.code === "PGRST205" ||
    /does not exist|schema cache/i.test(error.message ?? "")
  ) {
    return new CustomerStoreError(notReady, 503);
  }
  return new CustomerStoreError("The customer could not be saved.", 500);
}

export async function listCustomers(): Promise<CustomerRecord[]> {
  const { data, error } = await database()
    .from("customers")
    .select("login_id, created_at, sold_price")
    .order("created_at", { ascending: false });
  if (error) throw mapDbError(error);
  return (data ?? []).map((row) => ({
    loginId: row.login_id,
    createdAt: row.created_at,
    soldPrice: row.sold_price,
  }));
}

export async function findCustomer(loginId: string) {
  const id = normalizeLoginId(loginId);
  if (!isValidLoginId(id)) return null;
  const { data, error } = await database()
    .from("customers")
    .select("login_id, created_at")
    .eq("login_id", id)
    .maybeSingle();
  if (error) throw mapDbError(error);
  if (!data) return null;
  return { loginId: data.login_id, createdAt: data.created_at };
}

export async function createCustomer(
  loginId: string,
  password: string,
  soldPriceInput: string,
) {
  const id = normalizeLoginId(loginId);
  const soldPrice = parseSoldPrice(soldPriceInput);
  if (!isValidLoginId(id)) {
    throw new CustomerStoreError("Use 2 to 40 letters, numbers, and hyphens.", 400);
  }
  if (!isValidPassword(password)) {
    throw new CustomerStoreError("Use a password of 8 to 72 characters.", 400);
  }
  if (soldPrice === null) {
    throw new CustomerStoreError("Enter the price in whole rupees.", 400);
  }
  const passwordHash = await hash(password, 12);
  const { error } = await database()
    .from("customers")
    .insert({ login_id: id, password_hash: passwordHash, sold_price: soldPrice });
  if (error) throw mapDbError(error);
  return { loginId: id, password };
}

export async function resetCustomerPassword(loginId: string, password: string) {
  const id = normalizeLoginId(loginId);
  if (!isValidLoginId(id)) {
    throw new CustomerStoreError("That customer was not found.", 404);
  }
  if (!isValidPassword(password)) {
    throw new CustomerStoreError("Use a password of 8 to 72 characters.", 400);
  }
  const passwordHash = await hash(password, 12);
  const { data, error } = await database()
    .from("customers")
    .update({ password_hash: passwordHash })
    .eq("login_id", id)
    .select("login_id")
    .maybeSingle();
  if (error) throw mapDbError(error);
  if (!data) throw new CustomerStoreError("That customer was not found.", 404);
  return { loginId: id, password };
}
