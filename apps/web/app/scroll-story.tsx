"use client";

import { useEffect, useState } from "react";

const steps = [
  {
    id: "signal",
    eyebrow: "01 Signal",
    title: "Turn a niche into a rhythm that keeps publishing.",
    body:
      "Start with a series, set the visual tone, define the voice, and let the system keep the structure coherent across every short.",
    caption: "Series DNA",
    detail: "Niche, tone, style, cadence",
    metric: "Series-first setup",
    background:
      "linear-gradient(135deg, #efb1c1 0%, #f7d7cb 50%, #fff1dd 100%)",
  },
  {
    id: "script",
    eyebrow: "02 Script",
    title: "Watch the copy tighten itself into hooks, scenes, and captions.",
    body:
      "The page should feel like the output is being choreographed in real time, with each section locking the next one into place.",
    caption: "Narrative Engine",
    detail: "Hook, scenes, subtitles, CTA",
    metric: "Structured generation",
    background:
      "linear-gradient(135deg, #ffdfb8 0%, #f1c7bb 48%, #e4b8d9 100%)",
  },
  {
    id: "render",
    eyebrow: "03 Render",
    title: "Move from storyboard to a vertical reel that feels cinematic.",
    body:
      "Rendering should read like a calm machine room: assets syncing, timing settling, subtitles falling into place, output becoming tangible.",
    caption: "Render Stack",
    detail: "Voice, motion, timeline, master",
    metric: "1080 x 1920 vertical",
    background:
      "linear-gradient(135deg, #1f1717 0%, #6d4450 45%, #d08ba6 100%)",
  },
  {
    id: "publish",
    eyebrow: "04 Publish",
    title: "End the scroll with distribution already lined up.",
    body:
      "Once the reel is ready, the story pivots to release: accounts connected, time selected, queue armed, and posting reduced to a clean final move.",
    caption: "Publishing Orbit",
    detail: "Schedule, accounts, queue, launch",
    metric: "Queue-ready delivery",
    background:
      "linear-gradient(135deg, #f7d6e0 0%, #f2e7dd 50%, #d7c0b8 100%)",
  },
];

export default function ScrollStory() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-story-step]")
    );

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) {
          return;
        }

        const nextIndex = Number(visible.target.dataset.index);
        if (!Number.isNaN(nextIndex)) {
          setActiveIndex(nextIndex);
        }
      },
      {
        threshold: [0.25, 0.5, 0.75],
        rootMargin: "-20% 0px -20% 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const activeStep = steps[activeIndex];

  return (
    <section className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-6 pb-28 pt-8 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="lg:order-2">
        {steps.map((step, index) => {
          const isActive = index === activeIndex;

          return (
            <article
              key={step.id}
              data-story-step
              data-index={index}
              className="flex min-h-[78vh] items-center py-10"
            >
              <div
                className={`max-w-xl transition-all duration-700 ${
                  isActive
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-35"
                }`}
              >
                <p className="mb-5 text-xs uppercase tracking-[0.3em] text-[var(--landing-accent)]">
                  {step.eyebrow}
                </p>
                <h2 className="text-4xl font-semibold leading-tight text-[var(--landing-heading)] sm:text-5xl">
                  {step.title}
                </h2>
                <p className="mt-6 max-w-lg text-lg leading-8 text-[var(--landing-muted)]">
                  {step.body}
                </p>
                <div className="mt-8 inline-flex rounded-full border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg)] px-4 py-2 text-sm text-[var(--landing-soft)] backdrop-blur-sm">
                  {step.metric}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="lg:order-1">
        <div className="sticky top-20">
          <div className="rounded-[2.25rem] border border-[var(--landing-panel-border)] bg-[var(--landing-panel-bg)] p-5 shadow-[0_24px_80px_rgba(86,52,44,0.12)] backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-[var(--landing-soft)]">
              <span>Scroll Film</span>
              <span>
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(steps.length).padStart(2, "0")}
              </span>
            </div>

            <div className="story-device relative overflow-hidden rounded-[2rem] border border-[var(--landing-panel-border)] bg-[#120f11] p-4">
              <div
                className="story-screen-gradient absolute inset-0"
                style={{ backgroundImage: activeStep.background }}
              />
              <div className="story-grid absolute inset-0 opacity-30" />
              <div className="story-pulse-ring absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30" />

              <div className="relative z-10 flex min-h-[31rem] flex-col justify-between rounded-[1.55rem] border border-white/18 bg-black/28 p-6 text-white">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-white/70">
                  <span>{activeStep.caption}</span>
                  <span>{activeStep.eyebrow}</span>
                </div>

                <div className="space-y-6">
                  <div className="story-float inline-flex rounded-full border border-white/18 bg-white/12 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/78">
                    {activeStep.detail}
                  </div>
                  <div className="max-w-sm">
                    <h3 className="text-3xl font-semibold leading-tight">
                      {activeStep.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-white/76">
                      The reel preview morphs as you scroll, giving the page a
                      sense of motion before the user even presses generate.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    {steps.map((step, index) => (
                      <span
                        key={step.id}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                          index <= activeIndex
                            ? "bg-white"
                            : "bg-white/18"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/14 bg-white/10 p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/58">
                        Output
                      </p>
                      <p className="mt-2 text-xl font-semibold">
                        {activeStep.metric}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/14 bg-white/10 p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/58">
                        Status
                      </p>
                      <p className="mt-2 text-xl font-semibold">In motion</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
