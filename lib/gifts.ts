import { supabaseAdmin } from "./supabase";
import type { Gift, GiftWithStatus } from "./types";

export async function listGifts(
  currentUserId: string | null,
): Promise<GiftWithStatus[]> {
  const sb = supabaseAdmin();
  const [giftsRes, bookingsRes] = await Promise.all([
    sb
      .from("gifts")
      .select("*")
      .order("position", { ascending: true })
      .order("created_at", { ascending: true }),
    sb.from("bookings").select("id, gift_id, user_id"),
  ]);

  if (giftsRes.error) throw giftsRes.error;
  if (bookingsRes.error) throw bookingsRes.error;

  const byGift = new Map<string, { id: string; user_id: string }>();
  for (const b of bookingsRes.data ?? []) {
    byGift.set(b.gift_id, { id: b.id, user_id: b.user_id });
  }

  return (giftsRes.data ?? []).map((g: Gift) => {
    const booking = byGift.get(g.id);
    return {
      ...g,
      is_booked: Boolean(booking),
      booked_by_me: Boolean(booking) && booking?.user_id === currentUserId,
      booking_id: booking?.id ?? null,
    };
  });
}

export async function listGiftsForAdmin(): Promise<Gift[]> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("gifts")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Gift[];
}
