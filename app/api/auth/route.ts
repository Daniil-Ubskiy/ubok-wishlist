import { NextResponse } from "next/server";
import { setAuthCookie, clearAuthCookie } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = typeof body?.name === "string" ? body.name.trim() : "";

  if (!name || name.length > 64) {
    return NextResponse.json(
      { error: "Введи имя (от 1 до 64 символов)" },
      { status: 400 },
    );
  }

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("users")
    .insert({ name })
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Не удалось создать пользователя" },
      { status: 500 },
    );
  }

  await setAuthCookie(data.token);
  return NextResponse.json({
    ok: true,
    user: { id: data.id, name: data.name },
  });
}

export async function DELETE() {
  await clearAuthCookie();
  return NextResponse.json({ ok: true });
}
