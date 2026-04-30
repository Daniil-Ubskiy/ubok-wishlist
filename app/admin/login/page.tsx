import { redirect } from "next/navigation";
import Header from "@/components/Header";
import { isAdmin } from "@/lib/admin";
import { AdminLoginForm } from "@/components/AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-md flex-1 px-6 py-16">
        <h1 className="text-3xl font-semibold text-text">Админка</h1>
        <p className="mt-2 text-text-muted">
          Введи пароль, чтобы добавлять и редактировать подарки.
        </p>
        <div className="mt-8">
          <AdminLoginForm />
        </div>
      </main>
    </>
  );
}
