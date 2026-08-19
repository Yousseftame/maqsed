"use client";

import Image from "next/image";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

const partners = [
  { id: 1, name: "Partner 1", logo: "/1779208393076_P25.svg" },
  { id: 2, name: "Masakn", logo: "/masakn.svg" },
  { id: 3, name: "Lbab", logo: "/lbab.svg" },
  { id: 4, name: "Partner 4", logo: "/1779208393076_P25.svg" },
  { id: 5, name: "Masakn", logo: "/masakn.svg" },
  { id: 6, name: "Lbab", logo: "/lbab.svg" },
];

export function PartnersSection() {
  const { t, locale, isRtl } = useLocale();

  return (
    <section className="relative z-30 w-full overflow-hidden bg-[#F3F3F1] py-20 lg:py-28">
      {/* Left and Right Background Images */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 select-none"
        aria-hidden
      >
        <Image
          src="/faq_left.png"
          alt=""
          width={600}
          height={600}
          className="h-[200px] w-auto max-w-none object-contain opacity-100 md:h-[280px]"
        />
      </div>
      <div
        className="pointer-events-none absolute bottom-0 right-0 select-none"
        aria-hidden
      >
        <Image
          src="/faq_right.png"
          alt=""
          width={600}
          height={600}
          className="h-[200px] w-auto max-w-none object-contain opacity-100 md:h-[280px]"
        />
      </div>

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

        {/* Infinite Marquee Container */}
        <div className="group relative flex w-full overflow-hidden">
          {/* We use two containers that animate infinitely to create a seamless loop */}
          <div className={cn("flex w-max shrink-0 items-center justify-around gap-12 sm:gap-16 lg:gap-24 pe-12 sm:pe-16 lg:pe-24", isRtl ? "animate-marquee-rtl" : "animate-marquee")}>
            {partners.map((partner) => (
              <div
                key={`primary-${partner.id}`}
                className="relative h-16 w-32 shrink-0 sm:h-20 sm:w-40 transition-all duration-300 hover:scale-105"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain opacity-80 grayscale contrast-200 transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                />
              </div>
            ))}
          </div>
          
          <div className={cn("flex w-max shrink-0 items-center justify-around gap-12 sm:gap-16 lg:gap-24 pe-12 sm:pe-16 lg:pe-24", isRtl ? "animate-marquee-rtl" : "animate-marquee")} aria-hidden="true">
            {partners.map((partner) => (
              <div
                key={`secondary-${partner.id}`}
                className="relative h-16 w-32 shrink-0 sm:h-20 sm:w-40 transition-all duration-300 hover:scale-105"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain opacity-80 grayscale contrast-200 transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
