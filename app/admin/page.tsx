import { redirect } from "next/navigation";
import Header from "@/components/Header";
import { isAdmin } from "@/lib/admin";
import { listGiftsForAdmin } from "@/lib/gifts";
import { AdminGiftsManager } from "@/components/AdminGiftsManager";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const gifts = await listGiftsForAdmin();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <h1 className="text-3xl font-semibold text-text">
          Управление подарками
        </h1>
        <p className="mt-2 text-text-muted">
          Добавляй, редактируй и удаляй карточки. Бронирования здесь не видны —
          это специально.
        </p>
        <AdminGiftsManager initialGifts={gifts} />
      </main>
    </>
  );
}
