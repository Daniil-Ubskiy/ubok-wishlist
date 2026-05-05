import { supabaseAdmin, GIFTS_BUCKET } from "./supabase";

function extractGiftFilename(url: string | null | undefined): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${GIFTS_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  const name = url.slice(idx + marker.length);
  return name && !name.includes("/") ? name : null;
}

export async function deleteGiftImageIfOurs(
  url: string | null | undefined,
): Promise<void> {
  const filename = extractGiftFilename(url);
  if (!filename) return;
  try {
    const sb = supabaseAdmin();
    await sb.storage.from(GIFTS_BUCKET).remove([filename]);
  } catch (e) {
    console.error("[deleteGiftImageIfOurs] failed:", e);
  }
}
