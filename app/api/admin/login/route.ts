import { NextResponse } from "next/server";
import { checkAdminPassword, setAdminCookie } from "@/lib/admin";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const password = body?.password;

  if (typeof password !== "string" || !checkAdminPassword(password)) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }

  await setAdminCookie();
  return NextResponse.json({ ok: true });
}
