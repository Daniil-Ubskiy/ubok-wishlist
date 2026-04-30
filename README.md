# Gift Wishlist

Лёгкий вишлист-сайт к ДР: друзья выбирают и бронируют подарки, владелец видит только сами подарки (но не кто что забронировал).

## Стек

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4
- Supabase (Postgres + Storage)
- Vercel для деплоя

## Setup

### 1. Supabase

1. Создай проект на [supabase.com](https://supabase.com).
2. В **SQL Editor** выполни:

```sql
create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  token text unique not null default encode(gen_random_bytes(32), 'hex'),
  created_at timestamptz default now()
);

create table gifts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  link_url text,
  position int default 0,
  created_at timestamptz default now()
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  gift_id uuid not null references gifts(id) on delete cascade unique,
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz default now()
);

alter table users enable row level security;
alter table gifts enable row level security;
alter table bookings enable row level security;

create policy gifts_read on gifts for select using (true);
```

3. В **Storage** создай bucket `gifts`, отметь как public (для чтения).

### 2. Env

Скопируй шаблон и заполни:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>
ADMIN_PASSWORD=<пароль для входа в /admin>
ADMIN_TOKEN=<длинный random hex, сгенерируй: openssl rand -hex 32>
```

Ключи Supabase лежат в `Settings → API`.

### 3. Запуск

```bash
npm install
npm run dev
```

Открой http://localhost:3000.

## Маршруты

| Путь | Кто | Что |
|---|---|---|
| `/` | все | список подарков, статусы броней |
| `/login` | все | вход по имени |
| `/me` | залогиненные | мои бронирования |
| `/admin/login` → `/admin` | владелец | управление подарками (без видимости броней) |

## Анонимность от админа

В UI админки нет ни одного следа броней — ни кто, ни сколько. Технически можно посмотреть таблицу `bookings` через Supabase Studio, но это «социальный» барьер: договорённость не лезть руками.

## Деплой

1. Запушь в GitHub-репо.
2. Импортируй в Vercel.
3. Передай env-переменные (те же что в `.env.local`).
4. Deploy.

## Структура

```
app/
  page.tsx              — главная
  login/page.tsx        — вход
  me/page.tsx           — мои брони
  admin/login/page.tsx  — пароль
  admin/page.tsx        — CRUD
  api/...               — API routes
lib/
  supabase.ts           — клиенты (anon + service-role)
  auth.ts               — auth по cookie
  admin.ts              — admin auth
  gifts.ts              — server-side helpers
  types.ts
components/
  GiftCard.tsx          — карточка подарка
  GiftList.tsx          — список с интерактивом бронирования
  GiftForm.tsx          — форма create/edit
  AdminGiftsManager.tsx — админский CRUD
  ...
```
