import "server-only";

import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "@/lib/server-env";

export function supabaseAdmin() {
  const url = serverEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = serverEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    const error = new Error("SUPABASE_NOT_CONFIGURED");
    error.name = "SupabaseNotConfigured";
    throw error;
  }
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
