import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const giftId = body?.gift_id;
  if (typeof giftId !== "string" || !giftId) {
    return NextResponse.json({ error: "gift_id required" }, { status: 400 });
  }

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("bookings")
    .insert({ gift_id: giftId, user_id: user.id })
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Этот подарок уже забронирован" },
      { status: 409 },
    );
  }
  return NextResponse.json({ booking: data }, { status: 201 });
}
