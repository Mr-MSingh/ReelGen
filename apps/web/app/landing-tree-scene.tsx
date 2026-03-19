"use client";

import { useEffect, useRef } from "react";

type LandingTreeSceneProps = {
  heroProgress: number;
  pipelineProgress: number;
  releaseProgress: number;
  pageProgress: number;
};

type PetalState = {
  el: HTMLSpanElement;
  x: number;
  y: number;
  z: number;
  xSpeedVariation: number;
  ySpeed: number;
  rotationAxis: "X" | "Y" | "Z";
  rotationValue: number;
  rotationSpeed: number;
  rotationX: number;
};

const PETAL_VARIANTS = ["petal-style-1", "petal-style-2", "petal-style-3", "petal-style-4"] as const;
const PETAL_COUNT = 72;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

export default function LandingTreeScene({
  heroProgress,
  pipelineProgress,
  releaseProgress,
  pageProgress,
}: LandingTreeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef({
    pipelineProgress,
    releaseProgress,
    pageProgress,
  });

  useEffect(() => {
    progressRef.current = {
      pipelineProgress,
      releaseProgress,
      pageProgress,
    };
  }, [pipelineProgress, releaseProgress, pageProgress]);

  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;

    if (!container || !stage) {
      return;
    }

    const petals: PetalState[] = [];
    let width = container.offsetWidth;
    let height = container.offsetHeight;
    let timer = 0;
    let windMagnitude = 1.2;
    let windDuration = 180;
    let raf = 0;

    const randomVariant = () =>
      PETAL_VARIANTS[Math.floor(Math.random() * PETAL_VARIANTS.length)];

    const resetPetal = (petal: PetalState) => {
      petal.x = width * 2 - Math.random() * width * 1.8;
      petal.y = -40 - Math.random() * 120;
      petal.z = Math.random() * 280 - 140;

      if (petal.x > width) {
        petal.x = width + petal.el.offsetWidth;
        petal.y = Math.random() * (height * 0.45);
      }

      const axisRoll = Math.random();
      petal.rotationAxis =
        axisRoll > 0.58 ? "X" : axisRoll > 0.28 ? "Y" : "Z";
      petal.rotationValue = Math.random() * 360 - 180;
      petal.rotationSpeed =
        petal.rotationAxis === "Z"
          ? Math.random() * 2.2 + 0.4
          : Math.random() * 8 + 1.4;
      petal.rotationX =
        petal.rotationAxis === "Y" ? Math.random() * 180 + 80 : 0;
      petal.xSpeedVariation = Math.random() * 1.2 - 0.6;
      petal.ySpeed = Math.random() * 1.4 + 0.8;
    };

    const calculateWindSpeed = (t: number, y: number) => {
      const amplitude =
        (windMagnitude / 2) * ((height - (2 * y) / 3) / Math.max(height, 1));
      return (
        amplitude *
          Math.sin((2 * Math.PI * t) / Math.max(windDuration, 1) + (3 * Math.PI) / 2) +
        amplitude
      );
    };

    const createPetal = () => {
      const el = document.createElement("span");
      el.className = `falling-petal ${randomVariant()}`;
      el.style.position = "absolute";
      el.style.backfaceVisibility = "visible";

      const petal: PetalState = {
        el,
        x: 0,
        y: 0,
        z: 0,
        xSpeedVariation: 0,
        ySpeed: 0,
        rotationAxis: "X",
        rotationValue: 0,
        rotationSpeed: 0,
        rotationX: 0,
      };

      stage.appendChild(el);
      resetPetal(petal);
      petals.push(petal);
    };

    const updateWind = () => {
      windMagnitude = 0.8 + Math.random() * 3.8;
      windDuration = Math.round(windMagnitude * 55 + (Math.random() * 50 - 20));
    };

    const updatePetal = (petal: PetalState) => {
      const currentProgress = progressRef.current;
      const windSpeed =
        calculateWindSpeed(timer, petal.y) +
        petal.xSpeedVariation +
        currentProgress.pageProgress * 0.9 +
        currentProgress.pipelineProgress * 0.35;

      petal.x -= windSpeed;
      petal.y += petal.ySpeed + currentProgress.releaseProgress * 0.25;
      petal.rotationValue += petal.rotationSpeed;

      let transform = `translateX(${petal.x}px) translateY(${petal.y}px) translateZ(${petal.z}px) rotate${petal.rotationAxis}(${petal.rotationValue}deg)`;

      if (petal.rotationAxis !== "X") {
        transform += ` rotateX(${petal.rotationX}deg)`;
      }

      petal.el.style.transform = transform;

      if (petal.x < -90 || petal.y > height + 60) {
        resetPetal(petal);
      }
    };

    const updateFrame = () => {
      if (timer >= windDuration) {
        updateWind();
        timer = 0;
      }

      for (const petal of petals) {
        updatePetal(petal);
      }

      timer += 1;
      raf = window.requestAnimationFrame(updateFrame);
    };

    const handleResize = () => {
      width = container.offsetWidth;
      height = container.offsetHeight;
      stage.style.width = `${width}px`;
      stage.style.height = `${height}px`;
    };

    stage.innerHTML = "";
    stage.style.width = `${width}px`;
    stage.style.height = `${height}px`;

    for (let index = 0; index < PETAL_COUNT; index += 1) {
      createPetal();
    }

    updateWind();
    raf = window.requestAnimationFrame(updateFrame);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(raf);
      stage.innerHTML = "";
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="blossom-field absolute inset-0">
        <div
          className="blossom-aura blossom-aura-a absolute left-[-8rem] top-[10vh] h-[22rem] w-[22rem]"
          style={{ opacity: clamp(0.32 - releaseProgress * 0.08, 0.16, 0.32) }}
        />
        <div
          className="blossom-aura blossom-aura-b absolute right-[-9rem] top-[18vh] h-[28rem] w-[26rem]"
          style={{ opacity: clamp(0.34 - releaseProgress * 0.1, 0.18, 0.34) }}
        />
        <div
          className="blossom-sheet absolute inset-0"
          style={{
            opacity: clamp(0.5 + heroProgress * 0.16, 0.5, 0.72),
            transform: `scale(${1 + pageProgress * 0.04})`,
          }}
        />
        <div ref={containerRef} className="absolute inset-0 [perspective:1400px]">
          <div
            ref={stageRef}
            className="blossom-plane absolute inset-0"
            style={{
              transform: `rotateX(${6 - heroProgress * 3}deg) rotateY(${pipelineProgress * 4 - 2}deg)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
