"use client";

import { useState } from "react";
import { GiftCard } from "./GiftCard";
import type { GiftWithStatus } from "@/lib/types";

interface Props {
  initialGifts: GiftWithStatus[];
  isLoggedIn: boolean;
}

export function GiftList({ initialGifts, isLoggedIn }: Props) {
  const [gifts, setGifts] = useState<GiftWithStatus[]>(initialGifts);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refetch() {
    const res = await fetch("/api/gifts", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    setGifts(data.gifts);
  }

  async function handleBook(giftId: string) {
    setPendingId(giftId);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gift_id: giftId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Ошибка бронирования");
      }
      await refetch();
    } finally {
      setPendingId(null);
    }
  }

  async function handleCancel(bookingId: string) {
    setPendingId(bookingId);
    setError(null);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Не получилось отменить");
      }
      await refetch();
    } finally {
      setPendingId(null);
    }
  }

  if (gifts.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-border bg-surface p-12 text-center text-text-muted">
        Пока нет подарков.
      </div>
    );
  }

  return (
    <>
      {error ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {gifts.map((gift) => {
          const isThisPending =
            pendingId !== null &&
            (pendingId === gift.id || pendingId === gift.booking_id);
          return (
            <GiftCard
              key={gift.id}
              gift={gift}
              isLoggedIn={isLoggedIn}
              onBook={handleBook}
              onCancel={handleCancel}
              pending={isThisPending}
            />
          );
        })}
      </div>
    </>
  );
}
