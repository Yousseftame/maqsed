"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { OptimizedCoverImage } from "@/components/media/OptimizedCoverImage";
import {
  DEFAULT_HERO_IMAGE,
  heroService,
  resolveHeroCopy,
  resolveHeroImages,
  type HeroSectionData,
} from "@/features/home/hero.service";

function HeroBackground({ images }: { images: string[] }) {
  const slides = useMemo(
    () => images.map((src) => src.trim()).filter(Boolean),
    [images]
  );
  const [activeSrc, setActiveSrc] = useState(slides[0] || DEFAULT_HERO_IMAGE);
  const [loadRest, setLoadRest] = useState(false);
  const activeRef = useRef(activeSrc);
  activeRef.current = activeSrc;

  useEffect(() => {
    if (slides.length === 0) return;
    setActiveSrc((current) => (slides.includes(current) ? current : slides[0]));
  }, [slides]);

  useEffect(() => {
    if (slides.length < 2) return;
    const warm = window.setTimeout(() => setLoadRest(true), 2500);
    const id = window.setInterval(() => {
      const current = activeRef.current;
      const pos = slides.indexOf(current);
      setActiveSrc(slides[(pos + 1) % slides.length] ?? current);
    }, 5500);
    return () => {
      window.clearTimeout(warm);
      window.clearInterval(id);
    };
  }, [slides]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#1a0f24]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#3E1854] via-[#1a0f24] to-[#0a0f1d]" />
      {slides.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: src === activeSrc ? 1 : 0 }}
        >
          {i === 0 || loadRest ? (
            <OptimizedCoverImage
              src={src}
              alt=""
              sizes="100vw"
              quality={60}
              priority={i === 0}
              className="object-cover"
            />
          ) : null}
        </div>
      ))}
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
}

export function HeroSection({ initialHero }: { initialHero?: HeroSectionData | null }) {
  const { t, locale } = useLocale();
  const { data } = useQuery({
    queryKey: ["herosection"],
    queryFn: () => heroService.getHero(),
    ...(initialHero !== undefined ? { initialData: initialHero } : {}),
  });

  const { title, subtitle } = resolveHeroCopy(data, locale, {
    title: t("hero.title"),
    subtitle: t("hero.subtitle3"),
  });
  const backgroundImages = resolveHeroImages(data);

  return (
    <section className="relative flex min-h-[600px] sm:min-h-[700px] w-full items-center justify-center overflow-hidden bg-[#1a0f24]">
      <HeroBackground images={backgroundImages} />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 flex flex-col items-center justify-center text-center text-white pointer-events-none">
        <h1 className="mb-6 text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.3] tracking-tight text-white w-full whitespace-pre-line drop-shadow-lg">
          <DiaTextReveal
            text={title}
            textColor="#ffffff"
            colors={["#ffffff"]}
            className="block w-full whitespace-pre-line"
          />
        </h1>

        <p className="mb-10 text-lg sm:text-xl lg:text-2xl font-medium text-gray-100 drop-shadow-md">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
