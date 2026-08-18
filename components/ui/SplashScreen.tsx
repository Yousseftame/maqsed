"use client";

import { useEffect, useState } from "react";
import { LOCALE_STORAGE_KEY } from "@/lib/i18n/types";

function getSplashBrand() {
  try {
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem(LOCALE_STORAGE_KEY) === "ar") return "مقصد";
      if (document.documentElement.classList.contains("locale-ar")) return "مقصد";
      if (document.documentElement.lang === "ar") return "مقصد";
    }
  } catch {
    // ignore
  }
  return "MAQSED";
}

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"dot" | "line" | "text" | "fade">("dot");
  const [brand, setBrand] = useState<string | null>(null);

  useEffect(() => {
    setBrand(getSplashBrand());
  }, []);

  useEffect(() => {
    // 1. Initial sleep then Dot -> Line
    const t1 = setTimeout(() => setPhase("line"), 600);
    // 2. Line -> Reveal Text
    const t2 = setTimeout(() => setPhase("text"), 1400);
    // 3. Hold text then Fade/Rise the curtain
    const t3 = setTimeout(() => setPhase("fade"), 3000);
    // 4. Fully unmount component globally
    const t4 = setTimeout(() => onComplete(), 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  // Remove the null return so the splash screen covers the site immediately on mount

  const displayBrand = brand || "MAQSED";
  const isArabic = displayBrand === "مقصد";
  const bottomText = isArabic ? "ننمو معاً" : "GROWING TOGETHER";

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#F4F1F7] transition-transform duration-[800ms] ease-[cubic-bezier(0.65,0,0.05,1)] ${
        phase === "fade" ? "-translate-y-full" : "translate-y-0"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="relative flex h-40 w-full max-w-lg flex-col items-center justify-center">
        {/* The Central Line/Dot */}
        <div
          className={`absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-[#17C3B3] transition-all duration-[800ms] ease-[cubic-bezier(0.85,0,0.15,1)] ${
            phase === "dot"
              ? "h-[4px] w-[4px] rounded-full shadow-[0_0_12px_rgba(23,195,179,0.25)]"
              : phase === "line" || phase === "text"
                ? "h-[1px] w-[70%] shadow-[0_0_10px_rgba(23,195,179,0.18)] sm:w-[300px]"
                : "h-[1px] w-[70%] opacity-0 shadow-none sm:w-[300px]"
          }`}
        ></div>

        {/* Top Text: Brand */}
        <div
          className={`absolute bottom-1/2 left-0 flex w-full items-end justify-center overflow-hidden transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            phase === "text" ? "h-20 opacity-100" : "h-0 opacity-0"
          }`}
        >
          <h1
            suppressHydrationWarning
            className="translate-y-1 pb-[2px] text-4xl font-bold tracking-normal text-[#6A2B92] uppercase sm:text-5xl"
          >
            {displayBrand}
          </h1>
        </div>

        {/* Bottom Text: Subtitle */}
        <div
          className={`absolute top-1/2 left-0 flex w-full items-start justify-center overflow-hidden transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            phase === "text" ? "h-16 opacity-100" : "h-0 opacity-0"
          }`}
        >
          <h2
            suppressHydrationWarning
            className="-translate-y-1 pt-3 text-xs font-medium tracking-widest text-[#9A8BA8] uppercase sm:text-sm"
          >
            {bottomText}
          </h2>
        </div>
      </div>
    </div>
  );
}
