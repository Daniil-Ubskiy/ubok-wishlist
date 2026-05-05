import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase";
import { deleteGiftImageIfOurs } from "@/lib/storage";

type Ctx = { params: Promise<{ id: string }> };

const ALLOWED_FIELDS = [
  "title",
  "description",
  "image_url",
  "link_url",
  "position",
] as const;

export async function PATCH(req: Request, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));

  const update: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in body) update[key] = body[key];
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "no fields to update" }, { status: 400 });
  }

  const sb = supabaseAdmin();

  const before = await sb
    .from("gifts")
    .select("image_url")
    .eq("id", id)
    .single();
  const oldImageUrl: string | null = before.data?.image_url ?? null;

  const { data, error } = await sb
    .from("gifts")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "update failed" },
      { status: 500 },
    );
  }

  if ("image_url" in update && oldImageUrl && oldImageUrl !== data.image_url) {
    await deleteGiftImageIfOurs(oldImageUrl);
  }

  return NextResponse.json({ gift: data });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const sb = supabaseAdmin();

  const before = await sb
    .from("gifts")
    .select("image_url")
    .eq("id", id)
    .single();
  const oldImageUrl: string | null = before.data?.image_url ?? null;

  const { error } = await sb.from("gifts").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await deleteGiftImageIfOurs(oldImageUrl);

  return NextResponse.json({ ok: true });
}
