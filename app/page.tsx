import Image from "next/image";
import Header from "@/components/Header";
import { getCurrentUser } from "@/lib/auth";
import { listGifts } from "@/lib/gifts";
import { GiftList } from "@/components/GiftList";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getCurrentUser();
  const gifts = await listGifts(user?.id ?? null);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <section className="relative overflow-hidden rounded-2xl border border-brand-purple/20 bg-brand-purple/5 p-6 sm:p-8 md:p-10">
          <div className="pointer-events-none absolute right-3 top-1/2 z-0 hidden -translate-y-1/2 sm:right-5 sm:block md:right-8">
            <Image
              src="/wishlist_my_own_photo.jpg"
              alt=""
              width={240}
              height={320}
              priority
              sizes="(min-width: 768px) 192px, (min-width: 640px) 144px, 0px"
              className="pointer-events-auto h-auto w-32 rotate-[6deg] rounded-2xl object-cover shadow-2xl ring-1 ring-white/40 transition-transform duration-500 ease-out hover:rotate-[3deg] hover:-translate-x-1 hover:-translate-y-1 sm:w-36 md:w-48 dark:ring-white/10"
            />
          </div>

          <div className="relative z-10 max-w-2xl sm:pr-40 md:pr-56">
            <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl md:text-4xl">
              Всем привет, я Даня 👋
            </h1>
            <div className="mt-4 flex flex-col gap-3 text-base leading-relaxed text-text sm:mt-5 sm:gap-4 sm:text-lg">
              <p>
                Мне исполняется 28 — ещё два года до момента, когда говорить «у
                меня кризис среднего возраста» будет моей нормой
              </p>
              <p>
                Если вы здесь — скорее всего знаете меня лично. Тут я собрал
                список подарков: что-то скромное, что-то, что хочу сам, но жаба
                душит. Главное всё равно — ваше внимание, так что этот список — просто на
                случай, если нужна конкретика, пользуйтесь
              </p>
            </div>
          </div>
        </section>

        <div className="mt-10 flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-text">WishList</h2>
          <p className="text-text-muted">
            Выбери карточку — забронируй подарок. Один подарок — один даритель.
            {!user && (
              <>
                {" "}
                <a href="/login" className="text-brand-blue hover:underline">
                  Войди
                </a>
                , чтобы бронировать.
              </>
            )}
          </p>
        </div>
        <GiftList initialGifts={gifts} isLoggedIn={Boolean(user)} />

        <footer className="mt-16 border-t border-border pt-6 text-sm text-text-muted">
          P.S. Сайт навайбкоден с помощью Claude Code. Если будут баги —
          приходите в личку{" "}
          <a
            href="https://t.me/ubskiy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-blue hover:underline"
          >
            @ubskiy
          </a>{" "}
          в Telegram, решим.
        </footer>
      </main>
    </>
  );
}
