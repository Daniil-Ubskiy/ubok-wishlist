"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import type { Gift } from "@/lib/types";

interface Props {
  initialGift?: Gift;
  onSaved: (gift: Gift) => void;
}

export function GiftForm({ initialGift, onSaved }: Props) {
  const [title, setTitle] = useState<string>(initialGift?.title ?? "");
  const [description, setDescription] = useState<string>(
    initialGift?.description ?? "",
  );
  const [linkUrl, setLinkUrl] = useState<string>(initialGift?.link_url ?? "");
  const [imageUrl, setImageUrl] = useState<string>(
    initialGift?.image_url ?? "",
  );
  const [pending, setPending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Ошибка загрузки");
        return;
      }
      const data = await res.json();
      setImageUrl(data.url);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      link_url: linkUrl.trim() || null,
      image_url: imageUrl || null,
    };
    try {
      const url = initialGift ? `/api/gifts/${initialGift.id}` : "/api/gifts";
      const method = initialGift ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Ошибка сохранения");
        return;
      }
      const data = await res.json();
      onSaved(data.gift);
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6"
    >
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-text">Название</span>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="AirPods Pro 3"
          required
          maxLength={120}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-text">Описание</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Зачем мне это и почему хочу"
          rows={3}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-base text-text placeholder:text-muted focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-text">Ссылка на магазин</span>
        <Input
          type="url"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="https://"
        />
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-text">Фото</span>
        {imageUrl ? (
          <div className="flex flex-col gap-3">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
              <Image
                src={imageUrl}
                alt="preview"
                fill
                className="object-cover"
                sizes="600px"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => replaceInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="h-4 w-4" />
                {uploading ? "Загружаем…" : "Заменить"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setImageUrl("")}
                disabled={uploading}
              >
                <X className="h-4 w-4" /> Удалить
              </Button>
            </div>
            <input
              ref={replaceInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={handleFile}
              disabled={uploading}
            />
          </div>
        ) : (
          <label className="flex h-24 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-bg text-text-muted transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
            <Upload className="h-4 w-4" />
            <span className="text-sm">
              {uploading ? "Загружаем…" : "Выбрать файл (JPEG/PNG/WebP)"}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={handleFile}
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="flex justify-end">
        <Button type="submit" disabled={pending || !title.trim()}>
          {pending ? "Сохраняем…" : initialGift ? "Сохранить" : "Создать"}
        </Button>
      </div>
    </form>
  );
}
