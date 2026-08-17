"use client";

import Image from "next/image";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { useLocale } from "@/components/providers/LocaleProvider";

const partners = [
  { id: 1, name: "Partner 1", logo: "/1779208393076_P25.svg" },
  { id: 2, name: "Partner 2", logo: "/1779208393076_P25.svg" },
  { id: 3, name: "Partner 3", logo: "/1779208393076_P25.svg" },
  { id: 4, name: "Partner 4", logo: "/1779208393076_P25.svg" },
  { id: 5, name: "Partner 5", logo: "/1779208393076_P25.svg" },
];

export function PartnersSection() {
  const { t, locale } = useLocale();

  return (
    <section className="relative z-30 w-full overflow-hidden bg-[#F3F3F1] py-20 lg:py-28">
      {/* Left and Right Background Images */}
      <div
        className="pointer-events-none absolute start-0 bottom-0 select-none opacity-60 mix-blend-multiply"
        aria-hidden
      >
        <Image
          src="/faq_left.png"
          alt=""
          width={280}
          height={400}
          className="h-auto w-[140px] md:w-[200px] lg:w-[260px] object-bottom object-left"
        />
      </div>
      <div
        className="pointer-events-none absolute end-0 bottom-0 select-none opacity-60 mix-blend-multiply"
        aria-hidden
      >
        <Image
          src="/faq_right.png"
          alt=""
          width={280}
          height={400}
          className="h-auto w-[140px] md:w-[200px] lg:w-[260px] object-bottom object-right"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20">
        <div className="mb-16 flex justify-center text-center">
          <h2 className="text-3xl font-bold tracking-[0.02em] text-[#0a0f1d] sm:text-4xl">
            <DiaTextReveal
              key={`partners-title-${locale}`}
              text={t("partners.title")}
              textColor="#0a0f1d"
              colors={["#0a0f1d"]}
            />
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-16 md:justify-between lg:gap-20">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="relative h-16 w-32 sm:h-20 sm:w-40 transition-all duration-300 hover:scale-105"
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
    </section>
  );
}
