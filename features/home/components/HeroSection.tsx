"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import {
  DEFAULT_HERO_IMAGE,
  heroService,
  resolveHeroCopy,
  resolveHeroImages,
} from "@/features/home/hero.service";

function preloadImage(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const finish = (ok: boolean) => resolve(ok);
    img.onload = () => {
      if (typeof img.decode === "function") {
        img.decode().then(() => finish(true)).catch(() => finish(true));
        return;
      }
      finish(true);
    };
    img.onerror = () => finish(false);
    img.src = src;
  });
}

function HeroBackground({ images }: { images: string[] }) {
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [activeSrc, setActiveSrc] = useState(DEFAULT_HERO_IMAGE);
  const loadedRef = useRef(loaded);
  loadedRef.current = loaded;

  const slides = useMemo(
    () => images.map((src) => src.trim()).filter(Boolean),
    [images]
  );

  useEffect(() => {
    const toLoad = [DEFAULT_HERO_IMAGE, ...slides.filter((src) => src !== DEFAULT_HERO_IMAGE)];
    let cancelled = false;
    const links: HTMLLinkElement[] = [];

    toLoad.forEach((src, i) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      if (i === 0) link.setAttribute("fetchpriority", "high");
      document.head.appendChild(link);
      links.push(link);

      void preloadImage(src).then((ok) => {
        if (cancelled || !ok) return;
        setLoaded((prev) => (prev[src] ? prev : { ...prev, [src]: true }));
      });
    });

    return () => {
      cancelled = true;
      links.forEach((link) => link.remove());
    };
  }, [slides]);

  useEffect(() => {
    const firstReady = slides.find((src) => loaded[src]);
    if (!firstReady) return;

    setActiveSrc((current) => {
      if (slides.includes(current) && loaded[current]) return current;
      return firstReady;
    });
  }, [slides, loaded]);

  useEffect(() => {
    if (slides.length < 2) return;

    const id = window.setInterval(() => {
      setActiveSrc((current) => {
        const ready = slides.filter((src) => loadedRef.current[src]);
        if (ready.length === 0) return current;
        const pos = ready.indexOf(current);
        return ready[(pos + 1) % ready.length] ?? current;
      });
    }, 5500);

    return () => window.clearInterval(id);
  }, [slides]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#1a0f24]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#3E1854] via-[#1a0f24] to-[#0a0f1d]" />
      <img
        src={DEFAULT_HERO_IMAGE}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
        decoding="async"
        draggable={false}
      />
      {slides.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: src === activeSrc && loaded[src] ? 1 : 0 }}
          fetchPriority={i === 0 ? "high" : "low"}
          decoding="async"
          loading="eager"
          draggable={false}
        />
      ))}
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
}

export function HeroSection() {
  const { t, locale } = useLocale();
  const { data } = useQuery({
    queryKey: ["herosection"],
    queryFn: () => heroService.getHero(),
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
