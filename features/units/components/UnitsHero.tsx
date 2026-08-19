"use client";

import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { PropertySearchBar } from "@/features/home/components/PropertySearchBar";
import { useLocale } from "@/components/providers/LocaleProvider";

export function UnitsHero() {
  const { t, locale } = useLocale();

  return (
    <section className="relative z-30 w-full overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute inset-x-0 top-0 h-[55%] bg-white" />
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-[#0a0f1d]" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 py-16 md:px-12 md:py-20 lg:px-20">
        <div className="flex w-full flex-col items-center rounded-[2rem] bg-[#F3F3F1] px-6 py-12 sm:px-10 sm:py-14 lg:rounded-[2.5rem] lg:px-16 lg:py-16">
          <div className="group mb-8 inline-flex cursor-default items-center gap-2 rounded-full border-2 border-[#6A2B92] px-4 py-2 transition-colors duration-300 hover:bg-[#6A2B92]">
            <div className="h-3 w-3 flex-shrink-0 rounded-full bg-[#6A2B92] transition-colors duration-300 group-hover:bg-white" />
            <span className="text-sm font-medium tracking-wide text-[#6A2B92] transition-colors duration-300 group-hover:text-white">
              {t("agents.pill")}
            </span>
          </div>

          <h1 className="mb-5 flex max-w-5xl flex-col items-center justify-center gap-1 overflow-visible text-center text-[clamp(36px,5.5vw,72px)] font-bold leading-[1.2] tracking-tight text-[#6A2B92]">
            <DiaTextReveal
              key={`units-page-1-${locale}`}
              text={t("agents.titleLine1")}
              textColor="#6A2B92"
              colors={["#6A2B92"]}
              startOnView={false}
              className="leading-[1.2]"
            />
            <DiaTextReveal
              key={`units-page-2-${locale}`}
              text={t("agents.titleLine2")}
              textColor="#6A2B92"
              colors={["#6A2B92"]}
              startOnView={false}
              delay={0.12}
              className="leading-[1.2]"
            />
          </h1>

          <p className="mb-16 max-w-2xl text-center text-base font-semibold leading-snug tracking-normal text-[#8c8c8c] sm:text-lg">
            {t("agents.description")}
          </p>

          <PropertySearchBar />
        </div>
      </div>
    </section>
  );
}
