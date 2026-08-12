"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { useSplashDone } from "@/components/providers/SplashProvider";
import { useLocale } from "@/components/providers/LocaleProvider";

export function HeroSection() {
  const splashDone = useSplashDone();
  const { t, locale } = useLocale();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (section) {
        section.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="sticky top-16 flex h-[calc(100vh-64px)] min-h-[700px] w-full flex-col justify-end overflow-hidden bg-white"
    >
      <div
        className="pointer-events-none absolute top-0 left-0 z-[100] hidden h-[105px] w-[105px] items-center justify-center rounded-full bg-[#0a0f1d] text-center text-white shadow-xl lg:flex"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: `translate(${mousePos.x - 52.5}px, ${mousePos.y - 52.5}px) scale(${isHovered ? 1 : 0})`,
          transition: "transform 0.15s ease-out, opacity 0.3s ease",
        }}
      >
        <div className="flex flex-col items-center justify-center text-[19px] leading-none font-black tracking-tight">
          <span>{t("hero.scroll")}</span>
          <span className="tracking-normal">{t("hero.down")}</span>
        </div>
      </div>

      <div
        className={`absolute left-0 z-[1] flex w-full justify-center px-4 ${
          locale === "ar"
            ? "top-0 sm:top-[1%] -translate-x-28 sm:-translate-x-40 lg:-translate-x-56 -translate-y-2 sm:-translate-y-4"
            : "top-[8%] sm:top-[12%]"
        }`}
      >
        <h1
          className="leading-none font-bold tracking-tighter text-[#0a0f1d] select-none"
          style={{ fontSize: "clamp(120px, 22vw, 400px)" }}
        >
          {splashDone ? (
            <DiaTextReveal
              key={`hero-maqsed-${locale}`}
              text={locale === "ar" ? "مقصد" : "MAQSED"}
              textColor="#0a0f1d"
              colors={["#0a0f1d"]}
              startOnView={false}
              once
              duration={1.6}
              className="inline-block leading-none font-bold tracking-tighter"
            />
          ) : (
            <span
              className="inline-block leading-none font-bold tracking-tighter opacity-0"
              aria-hidden
            >
              {locale === "ar" ? "مقصد" : "MAQSED"}
            </span>
          )}
        </h1>
      </div>

      <div className="absolute top-[22%] left-0 z-10 h-[100%] w-full sm:top-[26%]">
        <Image
          src="/herosectionimg.avif"
          alt={t("hero.imageAlt")}
          fill
          priority
          className="pointer-events-none object-cover object-top mix-blend-darken"
          sizes="100vw"
        />
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-[40%] w-full bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute right-0 bottom-12 left-0 z-20 mx-auto flex w-full max-w-[1600px] flex-col items-start justify-between gap-6 px-6 sm:bottom-16 sm:flex-row sm:items-end md:px-12 lg:px-20">
        <div className="max-w-[320px] text-white sm:max-w-md">
          <p className="text-base leading-relaxed font-medium drop-shadow-md sm:text-lg">
            {t("hero.description")}
          </p>
        </div>

        <div className="flex flex-col items-start text-start text-white sm:items-end sm:text-end">
          <h3 className="text-lg font-bold tracking-tight drop-shadow-md sm:text-xl">
            {t("hero.featureTitle")}
          </h3>
          <p className="mt-1 text-sm font-medium text-gray-200 drop-shadow-md sm:text-base">
            {t("hero.featureAddress")}
          </p>
        </div>
      </div>
    </section>
  );
}
