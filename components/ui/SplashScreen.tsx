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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onComplete();
      return;
    }

    const showLogo = setTimeout(() => setPhase("text"), 200);
    const startFade = setTimeout(() => setPhase("fade"), 1100);
    const done = setTimeout(() => onComplete(), 1600);

    return () => {
      clearTimeout(showLogo);
      clearTimeout(startFade);
      clearTimeout(done);
    };
  }, [onComplete]);

  const displayBrand = brand || "MAQSED";
  const isArabic = displayBrand === "مقصد";

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#F4F1F7] transition-transform duration-[500ms] ease-[cubic-bezier(0.65,0,0.05,1)] ${
        phase === "fade" ? "-translate-y-full" : "translate-y-0"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
      aria-hidden="true"
      role="presentation"
    >
      <div
        className={`flex items-center justify-center overflow-hidden transition-[height] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          phase === "text" || phase === "fade" ? "h-28" : "h-0"
        }`}
      >
        <img
          src="/splashscreen.png"
          alt={displayBrand}
          className="h-auto w-[220px] object-contain select-none sm:w-[260px]"
          draggable={false}
        />
      </div>
    </div>
  );
}
