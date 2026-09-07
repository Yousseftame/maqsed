"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { heroService, resolveHeroCopy, resolveHeroImages } from "@/features/home/hero.service";

function HeroBackground({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [images.join("|")]);

  useEffect(() => {
    if (images.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, [images.length]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {images.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className="absolute inset-0 h-full w-full bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url("${src}")`,
            opacity: i === index ? 1 : 0,
          }}
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
    <section className="relative flex min-h-[600px] sm:min-h-[700px] w-full items-center justify-center overflow-hidden">
      
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
