import { cache } from "react";
import { cookies } from "next/headers";
import { supabaseAdmin } from "./supabase";
import type { User } from "./types";

export const AUTH_COOKIE = "wl_token";
const ONE_YEAR = 60 * 60 * 24 * 365;

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value ?? null;
}

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const token = await getAuthToken();
  if (!token) return null;

  try {
    const { data, error } = await supabaseAdmin()
      .from("users")
      .select("*")
      .eq("token", token)
      .single();
    if (error || !data) return null;
    return data as User;
  } catch {
    return null;
  }
});

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}
