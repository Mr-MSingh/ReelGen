"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import LandingTreeScene from "./landing-tree-scene";
import LanguageToggle from "./language-toggle";
import { useLanguage } from "./language-provider";
import { LANDING_COPY } from "./site-language";
import ThemeToggle from "./theme-toggle";

type SectionState = {
  hero: number;
  pipeline: number;
  release: number;
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function mix(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function sectionProgress(section: HTMLElement | null) {
  if (!section) {
    return 0;
  }

  const rect = section.getBoundingClientRect();
  const distance = Math.max(rect.height - window.innerHeight, 1);
  return clamp(-rect.top / distance);
}

function getPageProgress() {
  const maxScroll =
    Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) -
    window.innerHeight;

  return clamp(window.scrollY / Math.max(maxScroll, 1));
}

export default function HomeExperience() {
  const { language } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const pipelineRef = useRef<HTMLElement>(null);
  const releaseRef = useRef<HTMLElement>(null);

  const [progress, setProgress] = useState<SectionState>({
    hero: 0,
    pipeline: 0,
    release: 0,
  });
  const [pageProgress, setPageProgress] = useState(0);
  const copy = LANDING_COPY[language];
  const heroMetrics = copy.heroMetrics;
  const pipelineSteps = copy.pipeline.steps;
  const systemModules = copy.pipeline.modules;
  const releaseSignals = copy.release.signals;
  const releaseStats = copy.release.stats;

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setProgress({
        hero: sectionProgress(heroRef.current),
        pipeline: sectionProgress(pipelineRef.current),
        release: sectionProgress(releaseRef.current),
      });
      setPageProgress(getPageProgress());
    };

    const requestUpdate = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  const activeStepIndex = Math.min(
    pipelineSteps.length - 1,
    Math.floor(progress.pipeline * pipelineSteps.length)
  );
  const activeStep = pipelineSteps[activeStepIndex] ?? pipelineSteps[0];

  return (
    <div className="relative overflow-x-clip bg-[var(--landing-bg)] text-[var(--landing-fg)] transition-colors duration-500">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="landing-backdrop absolute inset-0" />
        <div className="hero-orb hero-orb-a absolute left-[-10rem] top-[8vh] h-[22rem] w-[22rem] rounded-full bg-[var(--landing-glow-a)] blur-3xl" />
        <div className="hero-orb hero-orb-b absolute right-[-8rem] top-[12vh] h-[26rem] w-[24rem] rounded-full bg-[var(--landing-glow-b)] blur-3xl" />
        <div className="hero-grid absolute inset-0 opacity-30" />
        <div className="hero-grain absolute inset-0 opacity-25" />
      </div>

      <LandingTreeScene
        heroProgress={progress.hero}
        pipelineProgress={progress.pipeline}
        releaseProgress={progress.release}
        pageProgress={pageProgress}
      />

      <header className="fixed left-0 right-0 top-0 z-40">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
          <div className="rounded-full border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-[var(--landing-heading)] backdrop-blur-md">
            ReelGen
          </div>

          <nav className="flex items-center gap-3 sm:gap-4">
            <a
              href="#architecture"
              className="hidden rounded-full border border-transparent px-3 py-2 text-xs uppercase tracking-[0.24em] text-[var(--landing-muted)] transition hover:border-[var(--landing-panel-border)] hover:bg-[var(--landing-panel-bg)] sm:block"
            >
              {copy.nav.stack}
            </a>
            <a
              href="#release"
              className="hidden rounded-full border border-transparent px-3 py-2 text-xs uppercase tracking-[0.24em] text-[var(--landing-muted)] transition hover:border-[var(--landing-panel-border)] hover:bg-[var(--landing-panel-bg)] sm:block"
            >
              {copy.nav.release}
            </a>
            <LanguageToggle />
            <ThemeToggle />
            <Link
              href="/sign-in"
              aria-label={copy.nav.signInIconLabel}
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--landing-outline)] bg-[var(--landing-panel-bg)] text-[var(--landing-heading)] backdrop-blur-sm transition hover:border-[var(--landing-outline-strong)] hover:bg-[var(--landing-panel-bg-strong)]"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h3a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-3" />
                <path d="M10 17l5-5-5-5" />
                <path d="M15 12H3" />
              </svg>
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full border border-[var(--landing-outline)] bg-[var(--landing-panel-bg)] px-4 py-2 text-sm font-medium text-[var(--landing-heading)] backdrop-blur-sm transition hover:border-[var(--landing-outline-strong)] hover:bg-[var(--landing-panel-bg-strong)]"
            >
              {copy.nav.signUp}
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-20">
        <section ref={heroRef} className="relative min-h-[188vh]">
          <div className="sticky top-0 flex min-h-screen items-center">
            <div className="mx-auto grid w-full max-w-7xl gap-14 px-6 pb-12 pt-28 lg:grid-cols-[1.02fr_0.98fr]">
              <div className="relative z-10 flex flex-col justify-center">
                <div
                  className="mb-7 inline-flex w-fit items-center gap-3 rounded-full border border-[var(--landing-chip-border)] bg-[var(--landing-chip-bg)] px-4 py-2 text-xs uppercase tracking-[0.28em] text-[var(--landing-chip-text)] backdrop-blur-sm"
                  style={{
                    opacity: clamp(1 - progress.hero * 0.08, 0.74, 1),
                    transform: `translateY(${mix(0, -10, progress.hero)}px)`,
                  }}
                >
                  <span className="hero-dot" />
                  {copy.chip}
                </div>

                <div
                  className="headline-lockup max-w-[14ch]"
                  style={{
                    opacity: clamp(0.5 + (1 - progress.hero * 0.08), 0.5, 1),
                    transform: `translateY(${mix(0, 10, progress.hero)}px)`,
                  }}
                >
                  <div
                    className="headline-line"
                    style={{
                      opacity: clamp((progress.hero + 0.25) / 0.45, 0.35, 1),
                      transform: `translate3d(${mix(-18, 0, clamp(progress.hero / 0.32))}px, ${mix(
                        22,
                        0,
                        clamp(progress.hero / 0.32)
                      )}px, 0)`,
                    }}
                  >
                    <span className="headline-solid">{copy.headline.first}</span>
                    <span className="headline-accent">{copy.headline.firstAccent}</span>
                  </div>
                  <div
                    className="headline-line"
                    style={{
                      opacity: clamp((progress.hero + 0.08) / 0.52, 0.35, 1),
                      transform: `translate3d(${mix(20, 0, clamp((progress.hero + 0.06) / 0.34))}px, ${mix(
                        28,
                        0,
                        clamp((progress.hero + 0.06) / 0.34)
                      )}px, 0)`,
                    }}
                  >
                    <span className="headline-solid">{copy.headline.second}</span>
                    <span className="headline-accent-soft">{copy.headline.secondAccent}</span>
                  </div>
                  <div
                    className="headline-line"
                    style={{
                      opacity: clamp(progress.hero / 0.58, 0.35, 1),
                      transform: `translate3d(${mix(-12, 0, clamp((progress.hero + 0.14) / 0.4))}px, ${mix(
                        34,
                        0,
                        clamp((progress.hero + 0.14) / 0.4)
                      )}px, 0)`,
                    }}
                  >
                    <span className="headline-solid">{copy.headline.third}</span>
                  </div>
                </div>

                <p
                  className="mt-8 max-w-2xl text-lg leading-8 text-[var(--landing-muted)]"
                  style={{
                    opacity: clamp(1 - progress.hero * 0.2, 0.55, 1),
                    transform: `translateY(${mix(0, 18, progress.hero)}px)`,
                  }}
                >
                  {copy.description}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href="/sign-in"
                    className="rounded-full bg-[linear-gradient(135deg,var(--landing-button-grad-start)_0%,var(--landing-button-grad-end)_100%)] px-6 py-3 text-sm font-semibold text-[var(--landing-button-fg)] shadow-[0_18px_44px_rgba(55,31,28,0.18)] transition hover:translate-y-[-2px]"
                  >
                    {copy.buttons.enterApp}
                  </Link>
                  <Link
                    href="/pricing"
                    className="rounded-full border border-[var(--landing-outline)] bg-[var(--landing-panel-bg)] px-6 py-3 text-sm font-semibold text-[var(--landing-heading)] backdrop-blur-sm transition hover:bg-[var(--landing-panel-bg-strong)]"
                  >
                    {copy.buttons.viewPricing}
                  </Link>
                </div>

                <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
                  {heroMetrics.map((item, index) => {
                    const reveal = clamp((progress.hero - index * 0.09) / 0.35);

                    return (
                      <div
                        key={item}
                        className="soft-rise rounded-2xl border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg)] p-4 text-sm text-[var(--landing-muted)] backdrop-blur-sm"
                        style={{
                          opacity: reveal,
                          transform: `translateY(${mix(20, 0, reveal)}px)`,
                          animationDelay: `${index * 180}ms`,
                        }}
                      >
                        {item}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative min-h-[33rem] lg:min-h-[40rem]">
                <div className="relative rounded-[2.5rem] border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg)] p-5 shadow-[0_26px_90px_rgba(73,45,40,0.14)] backdrop-blur-md">
                  <div className="absolute inset-x-6 top-6 h-[8.6rem] rounded-[1.6rem] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.44),transparent_56%),radial-gradient(circle_at_80%_20%,rgba(242,196,208,0.46),transparent_58%)]" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-[var(--landing-soft)]">
                      <span>{copy.cockpit.title}</span>
                      <span>
                        {Math.round(mix(14, 100, progress.hero))}% {copy.cockpit.syncedSuffix}
                      </span>
                    </div>
                    <div className="mt-5 space-y-3">
                      {copy.cockpit.rows.map((line, index) => {
                        const reveal = clamp((progress.hero - index * 0.1) / 0.34);

                        return (
                          <div
                            key={line}
                            className="rounded-2xl border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg-strong)] px-4 py-3"
                            style={{
                              opacity: clamp(0.28 + reveal, 0.28, 1),
                              transform: `translateX(${mix(38, 0, reveal)}px)`,
                            }}
                          >
                            <div className="flex items-center justify-between gap-3 text-sm text-[var(--landing-heading)]">
                              <span>{line}</span>
                              <span className="hero-dot" />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg-strong)] p-4">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--landing-soft)]">
                          {copy.cockpit.outputLabel}
                        </p>
                        <p className="mt-2 text-xl font-semibold text-[var(--landing-heading)]">
                          {copy.cockpit.outputValue}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg-strong)] p-4">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--landing-soft)]">
                          {copy.cockpit.publishLabel}
                        </p>
                        <p className="mt-2 text-xl font-semibold text-[var(--landing-heading)]">
                          {copy.cockpit.publishValue}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg-strong)] p-4">
                      {[0.33, 0.52, 0.78, 0.64].map((width, index) => (
                        <div key={index} className="mt-2 h-2 rounded-full bg-black/8 first:mt-0">
                          <div
                            className="timeline-bar h-2 rounded-full bg-[var(--landing-accent)]"
                            style={{
                              width: `${mix(width * 38, width * 100, progress.hero)}%`,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="architecture" ref={pipelineRef} className="relative min-h-[196vh]">
          <div className="sticky top-0 flex min-h-screen items-center">
            <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-24 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="flex flex-col justify-center">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--landing-accent)]">
                  {copy.pipeline.sectionLabel}
                </p>
                <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-tight text-[var(--landing-heading)] sm:text-5xl">
                  {copy.pipeline.title}
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--landing-muted)]">
                  {copy.pipeline.description}
                </p>

                <div className="mt-8 space-y-4">
                  {pipelineSteps.map((step, index) => {
                    const reveal = clamp((progress.pipeline - index * 0.11) / 0.34);
                    const isActive = index === activeStepIndex;

                    return (
                      <div
                        key={step.id}
                        className={`rounded-[1.7rem] border p-5 transition-all duration-500 ${
                          isActive
                            ? "border-[var(--landing-outline)] bg-[var(--landing-panel-bg-strong)] shadow-[0_20px_60px_rgba(89,52,45,0.12)]"
                            : "border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg)]"
                        }`}
                        style={{
                          opacity: clamp(0.35 + reveal, 0.35, 1),
                          transform: `translateX(${mix(26, 0, reveal)}px)`,
                        }}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--landing-accent)]">
                            {step.label}
                          </p>
                          <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--landing-soft)]">
                            {step.stat}
                          </span>
                        </div>
                        <h3 className="mt-3 text-2xl font-semibold text-[var(--landing-heading)]">
                          {step.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-[var(--landing-muted)]">
                          {step.body}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative lg:pl-4">
                <div className="sticky top-24 rounded-[2.4rem] border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg)] p-6 shadow-[0_24px_80px_rgba(86,52,44,0.12)] backdrop-blur-md">
                  <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-[var(--landing-soft)]">
                    <span>{copy.pipeline.surfaceTitle}</span>
                    <span>{activeStep.stat}</span>
                  </div>

                  <div className="relative overflow-hidden rounded-[2rem] border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg-strong)] p-6">
                    <div
                      className="absolute inset-x-6 top-10 h-px bg-[var(--landing-panel-border)]"
                      style={{
                        transform: `scaleX(${mix(0.22, 1, progress.pipeline)})`,
                      }}
                    />
                    <div
                      className="absolute inset-y-8 left-1/2 w-px -translate-x-1/2"
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--landing-panel-border) 74%, transparent)",
                      }}
                    />

                    <div className="relative z-10 grid gap-4 sm:grid-cols-2">
                      {systemModules.map((moduleName, index) => {
                        const row = Math.floor(index / 2);
                        const col = index % 2;
                        const reveal = clamp((progress.pipeline - index * 0.07) / 0.3);

                        return (
                          <div
                            key={moduleName}
                            className="kinetic-card rounded-2xl border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg)] p-4"
                            style={{
                              opacity: clamp(0.3 + reveal, 0.3, 1),
                              transform: `translate3d(${mix(
                                col === 0 ? -24 : 24,
                                0,
                                reveal
                              )}px, ${mix(28 + row * 4, 0, reveal)}px, 0) scale(${mix(
                                0.9,
                                1,
                                reveal
                              )})`,
                            }}
                          >
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--landing-soft)]">
                              {copy.pipeline.modulePrefix} {String(index + 1).padStart(2, "0")}
                            </p>
                            <p className="mt-2 text-lg font-semibold text-[var(--landing-heading)]">
                              {moduleName}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6 rounded-[1.8rem] border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg)] p-5">
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-[var(--landing-soft)]">
                        <span>{copy.pipeline.currentEmphasis}</span>
                        <span>{activeStep.label}</span>
                      </div>
                      <div
                        className="mt-5 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            "color-mix(in srgb, var(--landing-panel-border) 55%, transparent)",
                        }}
                      >
                        <div
                          className="h-2 rounded-full"
                          style={{
                            background:
                              "linear-gradient(90deg, var(--landing-accent), color-mix(in srgb, var(--landing-accent) 36%, white))",
                            width: `${mix(8, 100, progress.pipeline)}%`,
                          }}
                        />
                      </div>
                      <p className="mt-5 max-w-xl text-base leading-8 text-[var(--landing-muted)]">
                        {activeStep.body}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section ref={releaseRef} id="release" className="relative min-h-[176vh] pb-10">
          <div className="sticky top-0 flex min-h-screen items-center">
            <div className="mx-auto w-full max-w-7xl px-6 py-24">
              <div className="rounded-[2.8rem] border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg)] px-8 py-10 shadow-[0_24px_80px_rgba(86,52,44,0.12)] backdrop-blur-md sm:px-12 sm:py-14">
                <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--landing-accent)]">
                      {copy.release.sectionLabel}
                    </p>
                    <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-[var(--landing-heading)] sm:text-6xl">
                      {copy.release.title}
                    </h2>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--landing-muted)]">
                      {copy.release.description}
                    </p>

                    <div className="mt-10 grid gap-4 sm:grid-cols-3">
                      {releaseStats.map((item, index) => {
                        const reveal = clamp((progress.release - index * 0.12) / 0.4);

                        return (
                          <div
                            key={item.label}
                            className="stats-card rounded-[1.8rem] border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg-strong)] p-5"
                            style={{
                              opacity: reveal,
                              transform: `translateY(${mix(24, 0, reveal)}px)`,
                            }}
                          >
                            <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--landing-soft)]">
                              {item.label}
                            </p>
                            <p className="mt-3 text-lg font-semibold leading-7 text-[var(--landing-heading)]">
                              {item.value}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="relative min-h-[28rem]">
                    <div className="release-stage absolute inset-0 rounded-[2.2rem] border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg-strong)] p-6">
                      <div className="release-ribbon absolute inset-x-6 top-8 h-16 rounded-full opacity-70" />
                      <div className="relative z-10 flex h-full flex-col justify-between">
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-[var(--landing-soft)]">
                          <span>{copy.release.boardTitle}</span>
                          <span>
                            {Math.round(mix(18, 100, progress.release))}% {copy.release.armedSuffix}
                          </span>
                        </div>

                        <div className="grid gap-4">
                          {releaseSignals.map((item, index) => {
                            const readiness = clamp((progress.release - index * 0.11) / 0.34);

                            return (
                              <div
                                key={item}
                                className="rounded-2xl border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg)] p-4"
                                style={{
                                  opacity: clamp(0.26 + readiness, 0.26, 1),
                                  transform: `translateX(${mix(34, 0, readiness)}px)`,
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <span
                                    className="h-3 w-3 rounded-full bg-[var(--landing-accent)]"
                                    style={{
                                      boxShadow: `0 0 ${mix(0, 18, readiness)}px var(--landing-accent)`,
                                    }}
                                  />
                                  <span className="text-sm font-medium text-[var(--landing-heading)]">
                                    {item}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                          <Link
                            href="/sign-in"
                            className="rounded-full bg-[linear-gradient(135deg,var(--landing-button-grad-start)_0%,var(--landing-button-grad-end)_100%)] px-6 py-3 text-sm font-semibold text-[var(--landing-button-fg)]"
                          >
                            {copy.buttons.startBuilding}
                          </Link>
                          <Link
                            href="/dashboard"
                            className="rounded-full border border-[var(--landing-outline)] bg-[var(--landing-panel-bg)] px-6 py-3 text-sm font-semibold text-[var(--landing-heading)]"
                          >
                            {copy.buttons.openDashboard}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
