import { redirect } from "next/navigation";
import Header from "@/components/Header";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-md flex-1 px-6 py-16">
        <h1 className="text-3xl font-semibold text-text">Кто ты?</h1>
        <p className="mt-2 text-text-muted">
          Войди по имени — после этого можно бронировать подарки.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </main>
    </>
  );
}
