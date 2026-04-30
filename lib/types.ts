export interface Gift {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  position: number;
  created_at: string;
}

export interface GiftWithStatus extends Gift {
  is_booked: boolean;
  booked_by_me: boolean;
  booking_id: string | null;
}

export interface User {
  id: string;
  name: string;
  token: string;
  created_at: string;
}

export interface Booking {
  id: string;
  gift_id: string;
  user_id: string;
  created_at: string;
}
