import "server-only";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True once the Supabase project exists and env vars are set. */
export const supabaseConfigured = Boolean(url && serviceKey);

/**
 * Service-role client for trusted server paths only (contact inserts, the
 * admin panel's reads and writes). Never import this into a client
 * component — the key must not reach the browser.
 */
export function createServiceClient() {
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
