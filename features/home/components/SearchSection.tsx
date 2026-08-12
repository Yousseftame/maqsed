"use client";

import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { PropertySearchBar } from "@/features/home/components/PropertySearchBar";
import { useLocale } from "@/components/providers/LocaleProvider";

export function SearchSection() {
  const { t, locale } = useLocale();

  return (
    <section className="relative z-30 flex w-full flex-col items-center bg-white px-6 py-24">
      <div className="group mb-8 inline-flex cursor-default items-center gap-2 rounded-full border border-gray-200 px-3.5 py-1.5 transition-colors duration-300 hover:bg-[#0a0f1d]">
        <div className="h-3 w-3 flex-shrink-0 rounded-full bg-[#0a0f1d] transition-colors duration-300 group-hover:bg-white" />
        <span className="text-sm font-medium tracking-wide text-[#0a0f1d] transition-colors duration-300 group-hover:text-white">
          {t("search.pill")}
        </span>
      </div>

      <h2 className="mb-4 flex justify-center text-center text-[clamp(36px,6vw,72px)] leading-tight font-bold tracking-tight text-[#0a0f1d]">
        <DiaTextReveal
          key={`search-title-${locale}`}
          text={t("search.title")}
          textColor="#0a0f1d"
          colors={["#0a0f1d"]}
        />
      </h2>

      <p className="mb-16 max-w-sm text-center text-base leading-relaxed text-[#8c8c8c]">
        {t("search.description")}
      </p>

      <PropertySearchBar />
    </section>
  );
}
