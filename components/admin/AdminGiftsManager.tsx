"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { Button } from "../ui/Button";
import { GiftForm } from "../gift/GiftForm";
import type { Gift } from "@/lib/types";

interface Props {
  initialGifts: Gift[];
}

export function AdminGiftsManager({ initialGifts }: Props) {
  const [gifts, setGifts] = useState<Gift[]>(initialGifts);
  const [editing, setEditing] = useState<Gift | null>(null);
  const [creating, setCreating] = useState(false);

  function handleCreated(gift: Gift) {
    setGifts((prev) => [...prev, gift]);
    setCreating(false);
  }
  function handleUpdated(gift: Gift) {
    setGifts((prev) => prev.map((g) => (g.id === gift.id ? gift : g)));
    setEditing(null);
  }
  async function handleDelete(id: string) {
    if (!confirm("Точно удалить этот подарок?")) return;
    const res = await fetch(`/api/gifts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setGifts((prev) => prev.filter((g) => g.id !== id));
    }
  }

  if (creating) {
    return (
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text">Новый подарок</h2>
          <Button variant="ghost" onClick={() => setCreating(false)}>
            <X className="h-4 w-4" /> Отмена
          </Button>
        </div>
        <div className="mt-4">
          <GiftForm onSaved={handleCreated} />
        </div>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text">
            Редактировать подарок
          </h2>
          <Button variant="ghost" onClick={() => setEditing(null)}>
            <X className="h-4 w-4" /> Отмена
          </Button>
        </div>
        <div className="mt-4">
          <GiftForm initialGift={editing} onSaved={handleUpdated} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 flex justify-end">
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" /> Добавить подарок
        </Button>
      </div>
      {gifts.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-border bg-surface p-12 text-center text-text-muted">
          Подарков пока нет. Нажми «Добавить подарок».
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-2xl border border-border bg-surface">
          {gifts.map((gift) => (
            <li key={gift.id} className="flex items-center gap-4 p-4">
              <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                {gift.image_url ? (
                  <Image
                    src={gift.image_url}
                    alt={gift.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-medium text-text">
                  {gift.title}
                </h3>
                {gift.description ? (
                  <p className="line-clamp-1 text-sm text-text-muted">
                    {gift.description}
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditing(gift)}
                  aria-label="Редактировать"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(gift.id)}
                  aria-label="Удалить"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
