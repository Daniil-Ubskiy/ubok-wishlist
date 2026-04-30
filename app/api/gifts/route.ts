import { NextResponse } from "next/server";
import { listGifts } from "@/lib/gifts";
import { getCurrentUser } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const user = await getCurrentUser();
  try {
    const gifts = await listGifts(user?.id ?? null);
    return NextResponse.json({ gifts });
  } catch (e) {
    console.error("[GET /api/gifts] failed:", e);
    const message = e instanceof Error ? e.message : "failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (!title) {
    return NextResponse.json({ error: "title required" }, { status: 400 });
  }

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("gifts")
    .insert({
      title,
      description:
        typeof body?.description === "string"
          ? body.description.trim() || null
          : null,
      image_url: typeof body?.image_url === "string" ? body.image_url : null,
      link_url: typeof body?.link_url === "string" ? body.link_url : null,
      position: typeof body?.position === "number" ? body.position : 0,
    })
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "create failed" },
      { status: 500 },
    );
  }
  return NextResponse.json({ gift: data }, { status: 201 });
}
