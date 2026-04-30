"use client";

import { useState } from "react";
import Link from "next/link";
import { GiftCard } from "./GiftCard";
import type { GiftWithStatus } from "@/lib/types";

interface Props {
  initialGifts: GiftWithStatus[];
}

export function MyBookings({ initialGifts }: Props) {
  const [gifts, setGifts] = useState<GiftWithStatus[]>(initialGifts);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleCancel(bookingId: string) {
    setPendingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setGifts((prev) => prev.filter((g) => g.booking_id !== bookingId));
      }
    } finally {
      setPendingId(null);
    }
  }

  if (gifts.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-border bg-surface p-12 text-center">
        <p className="text-text-muted">Ты ещё ничего не забронировал.</p>
        <Link
          href="/"
          className="mt-4 inline-block text-brand-blue hover:underline"
        >
          Посмотреть подарки →
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {gifts.map((gift) => (
        <GiftCard
          key={gift.id}
          gift={gift}
          isLoggedIn
          onCancel={handleCancel}
          pending={pendingId === gift.booking_id}
        />
      ))}
    </div>
  );
}
