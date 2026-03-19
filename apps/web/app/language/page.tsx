"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "../language-provider";
import { LANDING_COPY, LANGUAGE_OPTIONS } from "../site-language";

export default function LanguagePage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const copy = LANDING_COPY[language];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--landing-bg)] text-[var(--landing-fg)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="landing-backdrop absolute inset-0" />
        <div className="hero-orb hero-orb-a absolute left-[-10rem] top-[8vh] h-[22rem] w-[22rem] rounded-full bg-[var(--landing-glow-a)] blur-3xl" />
        <div className="hero-orb hero-orb-b absolute right-[-8rem] top-[12vh] h-[26rem] w-[24rem] rounded-full bg-[var(--landing-glow-b)] blur-3xl" />
        <div className="hero-grid absolute inset-0 opacity-20" />
        <div className="hero-grain absolute inset-0 opacity-25" />
      </div>

      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl">
          <div className="mx-auto mb-10 w-fit rounded-full border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg)] px-5 py-2 text-xs uppercase tracking-[0.3em] text-[var(--landing-muted)] backdrop-blur-sm">
            ReelGen
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.34em] text-[var(--landing-accent)]">
              {copy.selector.title}
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-[var(--landing-heading)] sm:text-6xl">
              {language === "hi" ? "English या हिन्दी" : "English or हिन्दी"}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--landing-muted)] sm:text-lg">
              {copy.selector.subtitle}
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {LANGUAGE_OPTIONS.map((option) => {
              const isActive = option.code === language;

              return (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => {
                    setLanguage(option.code);
                    router.push("/");
                  }}
                  className={`group rounded-[2.5rem] border px-8 py-10 text-left backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(83,51,44,0.14)] ${
                    isActive
                      ? "border-[var(--landing-outline-strong)] bg-[var(--landing-panel-bg-strong)]"
                      : "border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg)]"
                  }`}
                >
                  <p className="text-xs font-medium tracking-[0.16em] text-[var(--landing-accent)]">
                    {option.nativeLabel}
                  </p>
                  <div className="text-[clamp(3rem,8vw,5rem)] font-semibold leading-none tracking-[-0.06em] text-[var(--landing-heading)]">
                    {option.nativeLabel}
                  </div>
                  <p className="mt-4 max-w-md text-base leading-7 text-[var(--landing-muted)]">
                    {option.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <p className="text-sm tracking-[0.14em] text-[var(--landing-soft)]">
                      {option.label}
                    </p>
                    <span className="rounded-full border border-[var(--landing-outline)] px-4 py-2 text-xs font-semibold tracking-[0.08em] text-[var(--landing-heading)] transition group-hover:bg-[var(--landing-heading)] group-hover:text-[var(--landing-bg)]">
                      {option.actionLabel}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
