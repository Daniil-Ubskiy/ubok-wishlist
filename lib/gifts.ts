import { supabaseAdmin } from "./supabase";
import type { Gift, GiftWithStatus } from "./types";

export async function listGifts(
  currentUserId: string | null,
): Promise<GiftWithStatus[]> {
  const sb = supabaseAdmin();

  const giftsPromise = sb
    .from("gifts")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  const allBookingsPromise = sb.from("bookings").select("gift_id");

  const myBookingsPromise = currentUserId
    ? sb.from("bookings").select("id, gift_id").eq("user_id", currentUserId)
    : null;

  const [giftsRes, allBookingsRes, myBookingsRes] = await Promise.all([
    giftsPromise,
    allBookingsPromise,
    myBookingsPromise,
  ]);

  if (giftsRes.error) throw giftsRes.error;
  if (allBookingsRes.error) throw allBookingsRes.error;
  if (myBookingsRes?.error) throw myBookingsRes.error;

  const bookedSet = new Set<string>();
  for (const b of (allBookingsRes.data ?? []) as { gift_id: string }[]) {
    bookedSet.add(b.gift_id);
  }

  const myBookingByGift = new Map<string, string>();
  for (const b of (myBookingsRes?.data ?? []) as {
    id: string;
    gift_id: string;
  }[]) {
    myBookingByGift.set(b.gift_id, b.id);
  }

  return ((giftsRes.data ?? []) as Gift[]).map((g) => {
    const myBookingId = myBookingByGift.get(g.id) ?? null;
    return {
      ...g,
      is_booked: bookedSet.has(g.id),
      booked_by_me: myBookingId !== null,
      booking_id: myBookingId,
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
