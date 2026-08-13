"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type Lenis from "lenis";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

const SHOW_AFTER_PX = 280;
const RING_SIZE = 56;
const STROKE_WIDTH = 2.5;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2 - 1;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScrollToTopButton({ lenis }: { lenis: Lenis | null }) {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);
  const progressRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!lenis) return;

    const setProgress = (value: number) => {
      const progress = Math.min(1, Math.max(0, value));
      if (progressRef.current) {
        progressRef.current.style.strokeDashoffset = String(
          CIRCUMFERENCE * (1 - progress)
        );
      }
    };

    const onScroll = (instance: Lenis) => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        0
      );
      const progress = maxScroll > 0 ? instance.scroll / maxScroll : 0;

      setVisible(instance.scroll > SHOW_AFTER_PX);
      setProgress(progress);
    };

    onScroll(lenis);
    lenis.on("scroll", onScroll);

    return () => {
      lenis.off("scroll", onScroll);
    };
  }, [lenis]);

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.4 });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={t("nav.scrollToTop")}
      className={cn(
        "group fixed right-[calc(1rem+3.75rem+0.5rem)] bottom-6 z-40 flex size-14 items-center justify-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 active:scale-95 sm:right-[calc(2rem+3.75rem+0.5rem)] sm:bottom-8",
        visible
          ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-6 scale-75 opacity-0"
      )}
    >
      <svg
        className="pointer-events-none absolute inset-0 size-full -rotate-90"
        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
        aria-hidden="true"
      >
        <circle
          ref={progressRef}
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="#0a0f1d"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
        />
      </svg>

      <span className="relative z-10 flex size-[46px] items-center justify-center overflow-hidden rounded-full bg-white text-[#0a0f1d] shadow-[0_8px_24px_rgba(10,15,29,0.1)] transition-shadow duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:shadow-[0_12px_32px_rgba(10,15,29,0.16)]">
        <span className="absolute inset-0 origin-center scale-0 rounded-full bg-[#0a0f1d] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100" />
        <ArrowUp
          className="relative z-10 size-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:text-white"
          strokeWidth={2.6}
        />
      </span>
    </button>
  );
}
