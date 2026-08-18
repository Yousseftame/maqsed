"use client";

import Image from "next/image";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { PropertySearchBar } from "@/features/home/components/PropertySearchBar";
import { useLocale } from "@/components/providers/LocaleProvider";

export function SearchSection() {
  const { t, locale } = useLocale();

  return (
    <section className="relative z-30 flex w-full flex-col items-center overflow-hidden bg-white px-6 py-24">
      {/* Background Watermark */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 flex justify-center select-none opacity-40"
        aria-hidden
      >
        <Image
          src="/bg_hero.png"
          alt=""
          width={1200}
          height={600}
          className="h-[200px] md:h-[300px] w-auto object-contain object-bottom"
        />
      </div>

      <div className="relative z-10 flex w-full flex-col items-center">
        <div className="group mb-8 inline-flex cursor-default items-center gap-2 rounded-full border border-gray-200 px-3.5 py-1.5 transition-colors duration-300 hover:bg-[#6A2B92]">
        <div className="h-3 w-3 flex-shrink-0 rounded-full bg-[#6A2B92] transition-colors duration-300 group-hover:bg-white" />
        <span className="text-sm font-medium tracking-wide text-[#6A2B92] transition-colors duration-300 group-hover:text-white">
          {t("search.pill")}
        </span>
      </div>

      <h2 className="mb-4 flex justify-center text-center text-[clamp(36px,6vw,72px)] leading-tight font-bold tracking-tight text-[#6A2B92]">
        <DiaTextReveal
          key={`search-title-${locale}`}
          text={t("search.title")}
          textColor="#6A2B92"
          colors={["#6A2B92"]}
        />
      </h2>

      <p className="mb-16 max-w-sm text-center text-base leading-relaxed text-[#8c8c8c]">
        {t("search.description")}
      </p>

        <PropertySearchBar />
      </div>
    </section>
  );
}
