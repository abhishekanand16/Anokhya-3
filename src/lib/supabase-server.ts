import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client.
 *
 * Uses the **service role** key, which bypasses RLS. That is safe here only
 * because this module is imported exclusively from server actions and route
 * handlers, and the variable has no `NEXT_PUBLIC_` prefix, so it is never
 * shipped to the browser. Never import this from a "use client" component.
 *
 * The tables and functions in supabase/schema.sql are deliberately closed to
 * the anon key, so a leaked anon key can't read or write registrations.
 *
 * Returns `null` when Supabase isn't configured yet, so the site still builds
 * and renders before real keys are added.
 */
export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
