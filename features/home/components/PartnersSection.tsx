"use client";

import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";
import { usePartners } from "@/features/partners/usePartners";

export function PartnersSection() {
  const { t, locale, isRtl } = useLocale();
  const partners = usePartners();

  return (
    <section className="relative z-30 w-full overflow-hidden bg-[#F3F3F1] py-20 lg:py-28">
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20">
        <div className="mb-16 flex justify-center text-center">
          <h2 className="text-3xl font-bold tracking-[0.02em] text-[#6A2B92] sm:text-4xl">
            <DiaTextReveal
              key={`partners-title-${locale}`}
              text={t("partners.title")}
              textColor="#6A2B92"
              colors={["#6A2B92"]}
            />
          </h2>
        </div>

        <div className="group relative flex w-full overflow-hidden">
          <div className={cn("flex w-max shrink-0 items-center justify-around gap-12 sm:gap-16 lg:gap-24 pe-12 sm:pe-16 lg:pe-24", isRtl ? "animate-marquee-rtl" : "animate-marquee")}>
            {partners.map((partner) => (
              <div
                key={`primary-${partner.id}`}
                className="relative flex h-20 w-40 shrink-0 items-center justify-center sm:h-24 sm:w-52"
              >
                <img
                  src={partner.logo}
                  alt={partner.name || t("partners.title")}
                  className="max-h-full max-w-full object-contain opacity-80 grayscale transition-all duration-300 hover:scale-105 hover:opacity-100 hover:grayscale-0"
                />
              </div>
            ))}
          </div>

          <div className={cn("flex w-max shrink-0 items-center justify-around gap-12 sm:gap-16 lg:gap-24 pe-12 sm:pe-16 lg:pe-24", isRtl ? "animate-marquee-rtl" : "animate-marquee")} aria-hidden="true">
            {partners.map((partner) => (
              <div
                key={`secondary-${partner.id}`}
                className="relative flex h-20 w-40 shrink-0 items-center justify-center sm:h-24 sm:w-52"
              >
                <img
                  src={partner.logo}
                  alt=""
                  className="max-h-full max-w-full object-contain opacity-80 grayscale transition-all duration-300 hover:scale-105 hover:opacity-100 hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
