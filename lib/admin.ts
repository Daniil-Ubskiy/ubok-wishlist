import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "wl_admin";
const ONE_DAY = 60 * 60 * 24;

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function isAdmin(): Promise<boolean> {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;

  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  return safeEqual(value, expected);
}

export function checkAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(password, expected);
}

export async function setAdminCookie(): Promise<void> {
  const value = process.env.ADMIN_TOKEN;
  if (!value) throw new Error("ADMIN_TOKEN is not set");

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_DAY,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}
