"use client";

import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { useLocale } from "@/components/providers/LocaleProvider";
import { SellForm } from "./SellForm";

export function SellPage() {
  const { t, locale, isRtl } = useLocale();

  return (
    <div className={`flex w-full flex-col bg-white ${isRtl ? "text-right" : "text-left"}`}>
      <section className="relative overflow-hidden bg-[#3E1854] rounded-b-[2.5rem] md:rounded-b-[3.5rem] lg:rounded-b-[4rem] px-6 pb-24 pt-20 md:px-12 lg:px-20 lg:pb-28 lg:pt-28">
        
        {/* Background Pattern */}
        <div
          className="absolute inset-0 z-0 h-full w-full bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{ backgroundImage: "url('/patern-maqsed.jpg')" }}
        />

        <div className="relative mx-auto flex max-w-[1400px] flex-col items-start lg:items-center lg:text-center z-10">
          <h1 className="flex max-w-4xl flex-col items-start text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:items-center lg:text-7xl">
            <DiaTextReveal
              key={`sell-title1-${locale}`}
              text={t("sellPage.hero.title1")}
              textColor="#ffffff"
              colors={["#ffffff"]}
              startOnView={false}
            />
            <DiaTextReveal
              key={`sell-title2-${locale}`}
              text={t("sellPage.hero.title2")}
              textColor="#ffffff"
              colors={["#ffffff"]}
              startOnView={false}
              delay={0.15}
            />
          </h1>

          <p className="mt-8 max-w-xl text-lg font-semibold leading-snug tracking-normal text-[#8c8c8c] lg:text-center">
            {t("sellPage.hero.description")}
          </p>
        </div>
      </section>

      <section className="relative z-10 -mt-10 px-6 pb-24 md:px-12 lg:px-20 lg:pb-32">
        <SellForm />
      </section>
    </div>
  );
}
