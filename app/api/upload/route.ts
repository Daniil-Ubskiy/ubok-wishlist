import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { supabaseAdmin, GIFTS_BUCKET } from "@/lib/supabase";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

type ImageType = "jpeg" | "png" | "webp" | "gif";

function detectImageType(buf: Buffer): ImageType | null {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  )
    return "png";
  if (
    buf.slice(0, 4).toString("ascii") === "RIFF" &&
    buf.slice(8, 12).toString("ascii") === "WEBP"
  )
    return "webp";
  const head = buf.slice(0, 6).toString("ascii");
  if (head === "GIF87a" || head === "GIF89a") return "gif";
  return null;
}

const TYPE_TO_MIME: Record<ImageType, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

const TYPE_TO_EXT: Record<ImageType, string> = {
  jpeg: "jpg",
  png: "png",
  webp: "webp",
  gif: "gif",
};

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

  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = detectImageType(buffer);
  if (!detected) {
    return NextResponse.json(
      { error: "Поддерживаются только JPEG / PNG / WebP / GIF" },
      { status: 415 },
    );
  }

  const filename = `${crypto.randomUUID()}.${TYPE_TO_EXT[detected]}`;

  const sb = supabaseAdmin();
  const { error } = await sb.storage
    .from(GIFTS_BUCKET)
    .upload(filename, buffer, {
      contentType: TYPE_TO_MIME[detected],
      upsert: false,
    });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const { data } = sb.storage.from(GIFTS_BUCKET).getPublicUrl(filename);
  return NextResponse.json({ url: data.publicUrl });
}
