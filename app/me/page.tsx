import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import { getCurrentUser } from "@/lib/auth";
import { listGifts } from "@/lib/gifts";
import { MyBookings } from "@/components/gift/MyBookings";

export const dynamic = "force-dynamic";

export default async function MePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const all = await listGifts(user.id);
  const mine = all.filter((g) => g.booked_by_me);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <h1 className="text-3xl font-semibold text-text">Мои брони</h1>
        <p className="mt-2 text-text-muted">
          Подарки, которые ты забронировал. Можешь отменить — тогда они снова
          станут доступны другим.
        </p>
        <MyBookings initialGifts={mine} />
      </main>
    </>
  );
}
