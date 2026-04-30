"use client";

import Image from "next/image";
import { ExternalLink, Lock, X } from "lucide-react";
import clsx from "clsx";
import { Button } from "./ui/Button";
import type { GiftWithStatus } from "@/lib/types";

interface Props {
  gift: GiftWithStatus;
  isLoggedIn: boolean;
  onBook?: (giftId: string) => void;
  onCancel?: (bookingId: string) => void;
  pending?: boolean;
}

export function GiftCard({ gift, isLoggedIn, onBook, onCancel, pending }: Props) {
  const showFreeBadge = !gift.is_booked;
  const mineBadge = gift.is_booked && gift.booked_by_me;
  const otherBadge = gift.is_booked && !gift.booked_by_me;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:border-brand-purple/50 hover:shadow-[0_0_28px_-4px_rgba(139,92,246,0.35)]">
      <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-800">
        {gift.image_url ? (
          <Image
            src={gift.image_url}
            alt={gift.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-text-muted">
            Без фото
          </div>
        )}
        <span
          className={clsx(
            "absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm",
            showFreeBadge && "bg-brand-green/15 text-brand-green",
            mineBadge && "bg-brand-purple/15 text-brand-purple",
            otherBadge && "bg-muted/15 text-muted",
          )}
        >
          {showFreeBadge && "Свободен"}
          {mineBadge && "Я забронировал"}
          {otherBadge && "Забронирован"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold leading-tight text-text">
          {gift.title}
        </h3>
        {gift.description ? (
          <p className="line-clamp-3 text-sm text-text-muted">
            {gift.description}
          </p>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          {gift.link_url ? (
            <a
              href={gift.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-brand-blue hover:underline"
            >
              <ExternalLink className="h-4 w-4" aria-hidden /> в магазине
            </a>
          ) : (
            <span />
          )}

          {showFreeBadge && isLoggedIn ? (
            <Button
              size="sm"
              onClick={() => onBook?.(gift.id)}
              disabled={pending}
            >
              Забронировать
            </Button>
          ) : null}

          {mineBadge && gift.booking_id ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCancel?.(gift.booking_id!)}
              disabled={pending}
            >
              <X className="h-4 w-4" aria-hidden /> Отменить
            </Button>
          ) : null}

          {otherBadge ? (
            <span className="inline-flex items-center gap-1 text-sm text-muted">
              <Lock className="h-4 w-4" aria-hidden /> занят
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
