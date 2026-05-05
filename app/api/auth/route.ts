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
  const normalized = name.toLowerCase();

  const existing = await sb
    .from("users")
    .select("*")
    .eq("name_normalized", normalized)
    .maybeSingle();

  if (existing.error) {
    return NextResponse.json({ error: "Ошибка БД" }, { status: 500 });
  }

  let user = existing.data;
  if (!user) {
    const created = await sb
      .from("users")
      .insert({ name })
      .select("*")
      .single();
    if (created.error || !created.data) {
      return NextResponse.json(
        { error: "Не удалось создать пользователя" },
        { status: 500 },
      );
    }
    user = created.data;
  }

  await setAuthCookie(user.token);
  return NextResponse.json({
    ok: true,
    user: { id: user.id, name: user.name },
  });
}

export async function DELETE() {
  await clearAuthCookie();
  return NextResponse.json({ ok: true });
}
