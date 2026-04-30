import Link from "next/link";
import { Gift } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";
import { ThemeToggle } from "./ThemeToggle";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-brand-purple" aria-hidden />
          <span className="text-base font-semibold text-text">WishList</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm sm:gap-4">
          {user ? (
            <>
              <Link
                href="/me"
                className="text-text-muted hover:text-text transition-colors"
              >
                Мои брони
              </Link>
              <span className="hidden text-text-muted sm:inline">·</span>
              <span className="hidden text-text sm:inline">{user.name}</span>
              <span className="hidden text-text-muted sm:inline">·</span>
              <LogoutButton />
            </>
          ) : (
            <Link href="/login" className="text-brand-blue hover:underline">
              Войти
            </Link>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
