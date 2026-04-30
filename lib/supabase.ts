import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Missing env variable ${name}. See .env.local.example for the full list.`,
    );
  }
  return value;
}

export function supabaseAnon(): SupabaseClient {
  return createClient(
    requireEnv(url, "NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv(anonKey, "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  );
}

export function supabaseAdmin(): SupabaseClient {
  return createClient(
    requireEnv(url, "NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv(serviceRoleKey, "SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

export const GIFTS_BUCKET = "gifts";
