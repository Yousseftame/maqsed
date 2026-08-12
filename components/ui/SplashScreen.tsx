"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type AnimationEvent,
} from "react";
import { LOCALE_STORAGE_KEY } from "@/lib/i18n/types";

interface SplashScreenProps {
  onComplete: () => void;
}

function getSplashBrand() {
  try {
    if (window.localStorage.getItem(LOCALE_STORAGE_KEY) === "ar") return "مقصد";
    if (document.documentElement.classList.contains("locale-ar")) return "مقصد";
    if (document.documentElement.lang === "ar") return "مقصد";
  } catch {
    // ignore
  }
  return "Maqsed";
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  // null until mount — SSR + first client paint stay identical
  const [brand, setBrand] = useState<string | null>(null);
  const isArabic = brand === "مقصد";
  const lastLetterIndex = brand ? brand.length - 1 : 0;

  const [exiting, setExiting] = useState(false);
  const drawDone = useRef(false);
  const textDone = useRef(false);
  const exitStarted = useRef(false);
  const completed = useRef(false);

  useEffect(() => {
    setBrand(getSplashBrand());
  }, []);

  const tryStartExit = useCallback(() => {
    if (exitStarted.current || !drawDone.current || !textDone.current) return;
    exitStarted.current = true;
    setExiting(true);
  }, []);

  const handleDrawEnd = useCallback(
    (event: AnimationEvent<SVGPathElement>) => {
      if (event.animationName !== "splash-draw") return;
      drawDone.current = true;
      tryStartExit();
    },
    [tryStartExit]
  );

  const handleLetterEnd = useCallback(
    (event: AnimationEvent<HTMLSpanElement>, index: number) => {
      if (event.animationName !== "brand-letter-in") return;
      if (index !== lastLetterIndex) return;
      textDone.current = true;
      tryStartExit();
    },
    [tryStartExit, lastLetterIndex]
  );

  const handleExitEnd = useCallback(
    (event: AnimationEvent<HTMLDivElement>) => {
      if (event.animationName !== "splash-split-bottom") return;
      if (completed.current) return;
      completed.current = true;
      onComplete();
    },
    [onComplete]
  );

  const buildingPath = [
    "M 0,210",
    "H 550",
    "V 140",
    "H 560",
    "V 90",
    "H 570",
    "V 40",
    "L 585,20",
    "L 620,45",
    "V 90",
    "H 630",
    "V 140",
    "H 640",
    "V 210",
    "H 1200",
  ].join(" ");

  return (
    <>
      <style>{`
        @keyframes splash-draw {
          from { stroke-dashoffset: 1800; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes brand-letter-in {
          0% {
            opacity: 0;
            filter: blur(14px);
            transform: translateY(1.1em) scale(0.92);
          }
          60% {
            opacity: 1;
            filter: blur(0);
          }
          100% {
            opacity: 1;
            filter: blur(0);
            transform: translateY(0) scale(1);
          }
        }
        @keyframes brand-mask-open {
          0% { clip-path: inset(0 50% 0 50%); }
          100% { clip-path: inset(0 0 0 0); }
        }
        @keyframes brand-glow-settle {
          0% { text-shadow: 0 0 0 transparent; }
          40% { text-shadow: 0 0 28px rgba(255, 255, 255, 0.22); }
          100% { text-shadow: 0 0 0 transparent; }
        }
        @keyframes splash-svg-exit {
          from { opacity: 1; transform: scale(1); filter: blur(0px); }
          to   { opacity: 0; transform: scale(1.05); filter: blur(4px); }
        }
        @keyframes splash-split-top {
          from { transform: translateY(0); }
          to   { transform: translateY(-100%); }
        }
        @keyframes splash-split-bottom {
          from { transform: translateY(0); }
          to   { transform: translateY(100%); }
        }
        .splash-path {
          stroke-dasharray: 1800;
          stroke-dashoffset: 1800;
          animation: splash-draw 2.2s cubic-bezier(0.25, 0.1, 0.25, 1) 0.2s forwards;
        }
        .splash-brand {
          position: relative;
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 0;
          overflow: visible;
          padding: 0.35em 0.5em;
          font-family: var(--font-manrope), var(--font-plus-jakarta), system-ui, sans-serif;
          font-size: clamp(1.35rem, 3.4vw, 1.85rem);
          font-weight: 500;
          color: rgba(255, 255, 255, 0.94);
          letter-spacing: 0;
          text-transform: uppercase;
          clip-path: none;
          animation: brand-glow-settle 0.85s ease-out 0.85s both;
        }
        .splash-brand.is-ar {
          font-family: var(--font-cairo), var(--font-noto-kufi), sans-serif;
          font-weight: 800;
          text-transform: none;
          letter-spacing: 0;
          font-size: clamp(1.55rem, 3.8vw, 2.15rem);
          padding: 0.5em 1em;
        }
        .splash-brand-word {
          display: inline-block;
          opacity: 0;
          will-change: transform, filter, opacity;
          animation: brand-letter-in 0.95s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards;
        }
        .splash-svg-exit {
          animation: splash-svg-exit 0.28s ease-out forwards;
        }
        .splash-exit-top {
          animation: splash-split-top 0.45s cubic-bezier(0.76, 0, 0.24, 1) forwards;
        }
        .splash-exit-bottom {
          animation: splash-split-bottom 0.45s cubic-bezier(0.76, 0, 0.24, 1) forwards;
        }
      `}</style>

      <div className="pointer-events-none fixed inset-0 z-[9999]">
        <div
          className={`absolute inset-x-0 top-0 h-[62vh] bg-[#090c1b] ${exiting ? "splash-exit-top" : ""}`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 h-[38vh] bg-[#090c1b] ${exiting ? "splash-exit-bottom" : ""}`}
          onAnimationEnd={handleExitEnd}
        />

        <div
          className={`absolute top-[62vh] z-10 w-full -translate-y-1/2 ${exiting ? "splash-svg-exit" : ""}`}
        >
          <svg
            viewBox="0 0 1200 420"
            preserveAspectRatio="xMidYMid meet"
            className="w-full"
            style={{ height: "auto", display: "block" }}
          >
            <path
              className="splash-path"
              d={buildingPath}
              fill="none"
              stroke="rgba(255,255,255,0.82)"
              strokeWidth="1.2"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              onAnimationEnd={handleDrawEnd}
            />
          </svg>
        </div>

        <div
          className={`pointer-events-none absolute top-[62vh] left-0 z-20 mt-6 flex w-full items-start justify-center ${exiting ? "splash-svg-exit" : ""}`}
        >
          {brand && (
            <div
              className={`splash-brand${isArabic ? " is-ar" : ""}`}
              aria-label={brand}
              dir={isArabic ? "rtl" : "ltr"}
              lang={isArabic ? "ar" : "en"}
            >
              <span
                className="splash-brand-word"
                onAnimationEnd={(event) =>
                  handleLetterEnd(event, lastLetterIndex)
                }
              >
                {brand}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
