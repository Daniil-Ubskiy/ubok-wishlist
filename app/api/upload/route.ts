import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { supabaseAdmin, GIFTS_BUCKET } from "@/lib/supabase";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "invalid form data" }, { status: 400 });
  }
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Файл слишком большой (>5 МБ)" },
      { status: 413 },
    );
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Поддерживаются только JPEG / PNG / WebP / GIF" },
      { status: 415 },
    );
  }

  const ext = (file.name.split(".").pop() ?? "bin").toLowerCase();
  const filename = `${crypto.randomUUID()}.${ext}`;
  const buffer = await file.arrayBuffer();

  const sb = supabaseAdmin();
  const { error } = await sb.storage
    .from(GIFTS_BUCKET)
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const { data } = sb.storage.from(GIFTS_BUCKET).getPublicUrl(filename);
  return NextResponse.json({ url: data.publicUrl });
}
