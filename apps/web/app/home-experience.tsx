"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import ThemeToggle from "./theme-toggle";

type SectionState = {
  hero: number;
  architecture: number;
  release: number;
};

const BLOSSOMS = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  anchorX: 6 + (index % 8) * 4.8 + (index % 2) * 1.4,
  anchorY: 6 + Math.floor(index / 8) * 6.8 + (index % 3) * 1.2,
  driftX: -140 + ((index * 37) % 280),
  driftY: 300 + ((index * 41) % 260),
  release: index / 30,
  rotate: -45 + ((index * 53) % 90),
  scale: 0.72 + (index % 4) * 0.12,
}));

const GROUND_BLOSSOMS = Array.from({ length: 16 }, (_, index) => ({
  id: index,
  left: 12 + index * 4.6,
  lift: 10 + (index % 4) * 9,
  rotate: -40 + index * 11,
  scale: 0.8 + (index % 3) * 0.18,
}));

const PHASES = [
  {
    id: "queue",
    label: "BullMQ Queue",
    title: "Every reel request becomes a tracked generation job.",
    body:
      "Series settings are frozen into a project snapshot, credits are debited, and a worker pipeline starts writing checkpoints instead of hiding work behind a spinner.",
    detail: "Queued, audited, checkpointed",
    stat: "Idempotent enqueue",
  },
  {
    id: "assets",
    label: "Asset Layer",
    title: "Scripts, storyboard scenes, voice tracks, and subtitles stay addressable.",
    body:
      "The page now reflects the actual product model: generated assets land in S3-compatible storage, metadata stays in MongoDB, and each stage can be retried safely.",
    detail: "Object storage + metadata",
    stat: "S3-compatible asset graph",
  },
  {
    id: "render",
    label: "FFmpeg Render",
    title: "Render specs converge into a 1080 x 1920 vertical master.",
    body:
      "FFmpeg workers compose the timeline, normalize media, and output a final video plus thumbnail instead of pretending the render is a black box.",
    detail: "Timeline, output, thumbnail",
    stat: "Vertical master export",
  },
  {
    id: "publish",
    label: "Distribution",
    title: "OAuth accounts, schedules, retries, and Stripe all sync back to the workspace.",
    body:
      "Publishing is modeled as a queue too: scheduled posts become attempts, platform status is tracked, and billing state remains visible in the same surface.",
    detail: "OAuth, schedules, retries",
    stat: "Publisher-safe release flow",
  },
] as const;

const ORBITS = [
  "Series schema",
  "Prompt shaping",
  "Scene timing",
  "Voice synthesis",
  "Subtitle alignment",
  "Render spec",
  "Queue dispatch",
  "Publish state",
];

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function mix(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function sectionProgress(element: HTMLElement | null) {
  if (!element) {
    return 0;
  }

  const rect = element.getBoundingClientRect();
  const distance = Math.max(rect.height - window.innerHeight, 1);
  return clamp(-rect.top / distance);
}

function windowProgress() {
  const body = document.body;
  const root = document.documentElement;
  const scrollTop = window.scrollY;
  const maxScroll = Math.max(root.scrollHeight, body.scrollHeight) - window.innerHeight;
  return clamp(scrollTop / Math.max(maxScroll, 1));
}

export default function HomeExperience() {
  const heroRef = useRef<HTMLElement>(null);
  const architectureRef = useRef<HTMLElement>(null);
  const releaseRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState<SectionState>({
    hero: 0,
    architecture: 0,
    release: 0,
  });
  const [pageProgress, setPageProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setProgress({
        hero: sectionProgress(heroRef.current),
        architecture: sectionProgress(architectureRef.current),
        release: sectionProgress(releaseRef.current),
      });
      setPageProgress(windowProgress());
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

  const activePhaseIndex = Math.min(
    PHASES.length - 1,
    Math.floor(progress.architecture * PHASES.length)
  );
  const activePhase = PHASES[activePhaseIndex];

  const heroWords = useMemo(
    () => [
      "Generate,",
      "render,",
      "and schedule",
      "vertical videos",
      "in one workspace.",
    ],
    []
  );

  return (
    <div className="relative overflow-hidden bg-[var(--landing-bg)] text-[var(--landing-fg)] transition-colors duration-500">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="landing-backdrop absolute inset-0" />
        <div className="hero-orb hero-orb-a absolute left-[-8rem] top-[10vh] h-[20rem] w-[20rem] rounded-full bg-[var(--landing-glow-a)] blur-3xl" />
        <div className="hero-orb hero-orb-b absolute right-[-7rem] top-[18vh] h-[26rem] w-[24rem] rounded-full bg-[var(--landing-glow-b)] blur-3xl" />
        <div className="hero-grid absolute inset-0 opacity-35" />
        <div className="hero-grain absolute inset-0 opacity-25" />
      </div>

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
              Stack
            </a>
            <a
              href="#release"
              className="hidden rounded-full border border-transparent px-3 py-2 text-xs uppercase tracking-[0.24em] text-[var(--landing-muted)] transition hover:border-[var(--landing-panel-border)] hover:bg-[var(--landing-panel-bg)] sm:block"
            >
              Release
            </a>
            <ThemeToggle />
            <Link
              href="/sign-in"
              className="rounded-full border border-[var(--landing-outline)] bg-[var(--landing-panel-bg)] px-4 py-2 text-sm font-medium text-[var(--landing-heading)] backdrop-blur-sm transition hover:border-[var(--landing-outline-strong)] hover:bg-[var(--landing-panel-bg-strong)]"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <section ref={heroRef} className="relative h-[340vh]">
        <div className="sticky top-0 flex min-h-screen items-center overflow-hidden">
          <div className="mx-auto grid w-full max-w-7xl gap-14 px-6 pb-12 pt-28 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative z-10 flex flex-col justify-center">
              <div
                className="mb-6 inline-flex w-fit items-center gap-3 rounded-full border border-[var(--landing-chip-border)] bg-[var(--landing-chip-bg)] px-4 py-2 text-xs uppercase tracking-[0.28em] text-[var(--landing-chip-text)] backdrop-blur-sm"
                style={{
                  transform: `translateY(${mix(0, -10, progress.hero)}px)`,
                }}
              >
                <span className="hero-dot" />
                Faceless video operating system
              </div>

              <div className="space-y-2">
                {heroWords.map((word, index) => {
                  const offset = progress.hero * (index % 2 === 0 ? -26 : 26);
                  const lift = progress.hero * index * 18;
                  const blur = progress.hero * index * 0.8;
                  const opacity = clamp(1 - progress.hero * 0.12 + index * 0.02, 0.4, 1);

                  return (
                    <div
                      key={word}
                      className="overflow-hidden"
                      style={{
                        opacity,
                        transform: `translate3d(${offset}px, ${lift}px, 0)`,
                        filter: `blur(${blur}px)`,
                      }}
                    >
                      <span className="headline-sheen block text-5xl font-semibold leading-[0.95] sm:text-6xl lg:text-7xl">
                        {word}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p
                className="mt-8 max-w-2xl text-lg leading-8 text-[var(--landing-muted)]"
                style={{
                  opacity: clamp(1 - progress.hero * 0.18, 0.55, 1),
                  transform: `translateY(${mix(0, 22, progress.hero)}px)`,
                }}
              >
                ReelGen is built as a real production pipeline: series
                configuration feeds BullMQ jobs, AI stages checkpoint into
                MongoDB, assets land in S3-compatible storage, FFmpeg renders the
                final 1080 x 1920 master, and publishing adapters queue release
                instead of hiding it.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/sign-in"
                  className="rounded-full bg-[linear-gradient(135deg,var(--landing-button-grad-start)_0%,var(--landing-button-grad-end)_100%)] px-6 py-3 text-sm font-semibold text-[var(--landing-button-fg)] shadow-[0_18px_44px_rgba(55,31,28,0.18)] transition hover:translate-y-[-2px]"
                >
                  Enter the app
                </Link>
                <Link
                  href="/pricing"
                  className="rounded-full border border-[var(--landing-outline)] bg-[var(--landing-panel-bg)] px-6 py-3 text-sm font-semibold text-[var(--landing-heading)] backdrop-blur-sm transition hover:bg-[var(--landing-panel-bg-strong)]"
                >
                  View pricing
                </Link>
              </div>

              <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
                {[
                  "Series -> queue -> render",
                  "OAuth + scheduling",
                  "Credits, plans, audit logs",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="soft-rise rounded-2xl border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg)] p-4 text-sm text-[var(--landing-muted)] backdrop-blur-sm"
                    style={{
                      animationDelay: `${index * 180}ms`,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[34rem] lg:min-h-[42rem]">
              <div className="sticky top-28">
                <div
                  className="hero-tree-stage relative h-[34rem] rounded-[2.6rem] border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg)] shadow-[0_28px_90px_rgba(78,50,44,0.12)] backdrop-blur-md lg:h-[42rem]"
                  style={{
                    transform: `translateY(${mix(0, -20, progress.hero)}px)`,
                  }}
                >
                  <div className="absolute inset-0 rounded-[2.6rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_32%)]" />
                  <div
                    className="absolute inset-x-8 top-8 h-[2px]"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--landing-panel-border) 60%, transparent)",
                      transform: `scaleX(${mix(0.68, 1.08, progress.hero)})`,
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-28 rounded-b-[2.6rem] bg-[linear-gradient(180deg,transparent,rgba(101,68,57,0.18))]" />

                  <div
                    className="tree-trunk absolute bottom-0 left-[14%] w-16 rounded-t-[2rem]"
                    style={{
                      height: `${mix(220, 260, progress.hero)}px`,
                    }}
                  />
                  <div
                    className="tree-branch branch-a absolute left-[19%] top-[36%] h-5 w-[19rem] rounded-full"
                    style={{
                      transform: `rotate(${mix(-9, -2, progress.hero)}deg)`,
                    }}
                  />
                  <div
                    className="tree-branch branch-b absolute left-[13%] top-[29%] h-4 w-[15rem] rounded-full"
                    style={{
                      transform: `rotate(${mix(-26, -16, progress.hero)}deg)`,
                    }}
                  />
                  <div
                    className="tree-branch branch-c absolute left-[18%] top-[21%] h-4 w-[13rem] rounded-full"
                    style={{
                      transform: `rotate(${mix(18, 8, progress.hero)}deg)`,
                    }}
                  />

                  <div
                    className="tree-canopy absolute left-[2%] top-[4%] h-[14rem] w-[22rem] rounded-[48%]"
                    style={{
                      opacity: mix(1, 0.45, progress.hero),
                      transform: `scale(${mix(1, 0.88, progress.hero)}) translateY(${mix(0, -14, progress.hero)}px)`,
                    }}
                  />
                  <div
                    className="tree-canopy absolute left-[12%] top-[9%] h-[11rem] w-[16rem] rounded-[44%]"
                    style={{
                      opacity: mix(0.94, 0.3, progress.hero),
                      transform: `scale(${mix(1, 0.82, progress.hero)}) translateY(${mix(0, -20, progress.hero)}px)`,
                    }}
                  />

                  {BLOSSOMS.map((petal) => {
                    const fall = clamp(
                      (progress.hero - petal.release) / (1 - petal.release)
                    );
                    const x = mix(0, petal.driftX, fall);
                    const y = mix(0, petal.driftY, Math.pow(fall, 1.12));
                    const rotate = mix(petal.rotate, petal.rotate + 460, fall);

                    return (
                      <span
                        key={petal.id}
                        className="scroll-blossom"
                        style={
                          {
                            left: `${petal.anchorX}%`,
                            top: `${petal.anchorY}%`,
                            opacity: clamp(1 - fall * 0.08, 0.84, 1),
                            transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${petal.scale})`,
                          } as CSSProperties
                        }
                      />
                    );
                  })}

                  {GROUND_BLOSSOMS.map((petal) => {
                    const gather = clamp((progress.hero - 0.42) / 0.58);

                    return (
                      <span
                        key={petal.id}
                        className="ground-blossom"
                        style={
                          {
                            left: `${petal.left}%`,
                            bottom: `${mix(-24, 20 + (petal.id % 4) * 4, gather)}px`,
                            opacity: gather,
                            transform: `rotate(${petal.rotate}deg) scale(${mix(
                              0.65,
                              petal.scale,
                              gather
                            )})`,
                          } as CSSProperties
                        }
                      />
                    );
                  })}

                  <div
                    className="preview-device absolute right-[6%] top-[13%] w-[48%] min-w-[18rem] rounded-[2rem] border border-white/15 bg-[#120f12]/72 p-4 text-white shadow-[0_20px_70px_rgba(16,10,14,0.4)]"
                    style={{
                      transform: `translateY(${mix(0, 24, progress.hero)}px) rotate(${mix(-5, 5, progress.hero)}deg)`,
                    }}
                  >
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-white/60">
                      <span>Live reel preview</span>
                      <span>{Math.round(mix(0, 100, progress.hero))}%</span>
                    </div>
                    <div className="relative mt-4 overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30 p-4">
                      <div className="preview-beam absolute inset-y-0 left-[-30%] w-[40%]" />
                      <div className="preview-halo absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
                      <div className="relative z-10 space-y-4">
                        <div className="inline-flex rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/74">
                          Worker checkpoint
                        </div>
                        <div className="space-y-2">
                          {[
                            "Title generated",
                            "Storyboard parsed",
                            "Voice + subtitles synced",
                            "FFmpeg render armed",
                          ].map((line, index) => (
                            <div
                              key={line}
                              className="rounded-2xl border border-white/10 bg-white/8 p-3"
                              style={{
                                transform: `translateX(${mix(
                                  0,
                                  (index + 1) * 10,
                                  progress.hero
                                )}px)`,
                                opacity: clamp(0.68 + progress.hero * 0.5, 0.68, 1),
                              }}
                            >
                              <div className="flex items-center justify-between gap-3 text-sm">
                                <span>{line}</span>
                                <span className="blink-dot" />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                          <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-white/54">
                            <span>Render timeline</span>
                            <span>1080 x 1920</span>
                          </div>
                          <div className="space-y-2">
                            {[0.28, 0.62, 0.82, 0.46].map((width, index) => (
                              <div
                                key={index}
                                className="h-2 rounded-full bg-white/10"
                              >
                                <div
                                  className="timeline-bar h-2 rounded-full bg-white"
                                  style={{
                                    width: `${mix(width * 40, width * 100, progress.hero)}%`,
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-6 right-6 flex gap-3">
                    {["Series locked", "Queue live", "Release armed"].map(
                      (tag, index) => {
                        const reveal = clamp((progress.hero - index * 0.2) / 0.35);

                        return (
                          <div
                            key={tag}
                            className="rounded-full border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--landing-heading)] backdrop-blur-sm"
                            style={{
                              opacity: reveal,
                              transform: `translateY(${mix(22, 0, reveal)}px)`,
                            }}
                          >
                            {tag}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="architecture"
        ref={architectureRef}
        className="relative h-[280vh]"
      >
        <div className="sticky top-0 flex min-h-screen items-center">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-24 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col justify-center">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--landing-accent)]">
                Technical fidelity
              </p>
              <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-tight text-[var(--landing-heading)] sm:text-5xl">
                The motion now follows the product model instead of hiding it.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--landing-muted)]">
                This section moves through the actual MVP architecture: queueing,
                asset persistence, render orchestration, and publishing state.
                Each scroll step promotes the next phase instead of repeating the
                same marketing claim.
              </p>

              <div className="mt-8 space-y-4">
                {PHASES.map((phase, index) => {
                  const isActive = index === activePhaseIndex;

                  return (
                    <div
                      key={phase.id}
                      className={`rounded-[1.7rem] border p-5 transition-all duration-500 ${
                        isActive
                          ? "border-[var(--landing-outline)] bg-[var(--landing-panel-bg-strong)] shadow-[0_20px_60px_rgba(89,52,45,0.12)]"
                          : "border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg)] opacity-55"
                      }`}
                    >
                      <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--landing-accent)]">
                        {phase.label}
                      </p>
                      <h3 className="mt-3 text-2xl font-semibold text-[var(--landing-heading)]">
                        {phase.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[var(--landing-muted)]">
                        {phase.body}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative lg:pl-4">
              <div className="sticky top-24 rounded-[2.4rem] border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg)] p-6 shadow-[0_24px_80px_rgba(86,52,44,0.12)] backdrop-blur-md">
                <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-[var(--landing-soft)]">
                  <span>Pipeline Surface</span>
                  <span>{activePhase.stat}</span>
                </div>

                <div className="relative overflow-hidden rounded-[2rem] border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg-strong)] p-6">
                  <div
                    className="absolute inset-x-6 top-10 h-px bg-[var(--landing-panel-border)]"
                    style={{
                      transform: `scaleX(${mix(0.35, 1, progress.architecture)})`,
                    }}
                  />
                  <div
                    className="absolute inset-y-8 left-1/2 w-px -translate-x-1/2"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--landing-panel-border) 70%, transparent)",
                    }}
                  />

                  <div className="relative z-10 grid gap-4 sm:grid-cols-2">
                    {ORBITS.map((orbit, index) => {
                      const row = Math.floor(index / 2);
                      const col = index % 2;
                      const localProgress = clamp(
                        (progress.architecture - index * 0.08) / 0.34
                      );

                      return (
                        <div
                          key={orbit}
                          className="kinetic-card rounded-2xl border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg)] p-4"
                          style={{
                            opacity: clamp(0.35 + localProgress * 0.9, 0.35, 1),
                            transform: `translate3d(${mix(
                              col === 0 ? -24 : 24,
                              0,
                              localProgress
                            )}px, ${mix(28 + row * 4, 0, localProgress)}px, 0) scale(${mix(
                              0.9,
                              1,
                              localProgress
                            )})`,
                          }}
                        >
                          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--landing-soft)]">
                            Module {String(index + 1).padStart(2, "0")}
                          </p>
                          <p className="mt-2 text-lg font-semibold text-[var(--landing-heading)]">
                            {orbit}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 rounded-[1.8rem] border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg)] p-5">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-[var(--landing-soft)]">
                      <span>Current emphasis</span>
                      <span>{activePhase.label}</span>
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
                            "linear-gradient(90deg, var(--landing-accent), color-mix(in srgb, var(--landing-accent) 40%, white))",
                          width: `${mix(12, 100, progress.architecture)}%`,
                        }}
                      />
                    </div>
                    <p className="mt-5 max-w-xl text-base leading-8 text-[var(--landing-muted)]">
                      {activePhase.body}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={releaseRef} id="release" className="relative h-[230vh]">
        <div className="sticky top-0 flex min-h-screen items-center">
          <div className="mx-auto w-full max-w-7xl px-6 py-24">
            <div className="rounded-[2.8rem] border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg)] px-8 py-10 shadow-[0_24px_80px_rgba(86,52,44,0.12)] backdrop-blur-md sm:px-12 sm:py-14">
              <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--landing-accent)]">
                    Release choreography
                  </p>
                  <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-[var(--landing-heading)] sm:text-6xl">
                    Scroll into the launch sequence and watch the page tighten.
                  </h2>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--landing-muted)]">
                    By the end of the page, the animation stops being decorative
                    and starts confirming the product promise: jobs are queued,
                    renders are previewable, platforms are connected, and
                    scheduling is a first-class action.
                  </p>

                  <div className="mt-10 grid gap-4 sm:grid-cols-3">
                    {[
                      {
                        label: "Audit coverage",
                        value: "connect, delete, publish",
                      },
                      {
                        label: "Billing model",
                        value: "Stripe + credits ledger",
                      },
                      {
                        label: "Infra",
                        value: "MongoDB, Redis, MinIO",
                      },
                    ].map((item, index) => {
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
                        <span>Workspace release board</span>
                        <span>{Math.round(mix(18, 100, progress.release))}% armed</span>
                      </div>

                      <div className="grid gap-4">
                        {[
                          "Connected account validated",
                          "Schedule queued with retries",
                          "Publish attempt logged",
                          "Post URL returned to dashboard",
                        ].map((item, index) => {
                          const readiness = clamp(
                            (progress.release - index * 0.11) / 0.35
                          );

                          return (
                            <div
                              key={item}
                              className="rounded-2xl border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg)] p-4"
                              style={{
                                opacity: clamp(0.28 + readiness, 0.28, 1),
                                transform: `translateX(${mix(
                                  36,
                                  0,
                                  readiness
                                )}px)`,
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className="h-3 w-3 rounded-full bg-[var(--landing-accent)]"
                                  style={{
                                    boxShadow: `0 0 ${mix(
                                      0,
                                      18,
                                      readiness
                                    )}px var(--landing-accent)`,
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
                          Start building
                        </Link>
                        <Link
                          href="/dashboard"
                          className="rounded-full border border-[var(--landing-outline)] bg-[var(--landing-panel-bg)] px-6 py-3 text-sm font-semibold text-[var(--landing-heading)]"
                        >
                          Open dashboard
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

      <div
        className="fixed bottom-5 left-1/2 z-30 hidden -translate-x-1/2 rounded-full border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg)] px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[var(--landing-soft)] backdrop-blur-sm md:flex"
        style={{
          opacity: clamp(1 - progress.release * 0.75, 0.18, 1),
          transform: `translateX(-50%) translateY(${mix(0, 8, pageProgress)}px)`,
        }}
      >
        Scroll to shed the blossoms
      </div>
    </div>
  );
}
