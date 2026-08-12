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
  { id: 6, name: "Partner 6", logo: "/1779208393076_P25.svg" },
  { id: 7, name: "Partner 7", logo: "/1779208393076_P25.svg" },
  { id: 8, name: "Partner 8", logo: "/1779208393076_P25.svg" },
];

export function PartnersSection() {
  const { t, locale } = useLocale();

  return (
    <section className="relative z-30 w-full bg-white px-6 py-24 md:px-12 lg:px-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="group mb-8 inline-flex cursor-default items-center gap-2 rounded-full border border-gray-200 px-3.5 py-1.5 transition-colors duration-300 hover:bg-[#0a0f1d]">
            <div className="h-3 w-3 flex-shrink-0 rounded-full bg-[#0a0f1d] transition-colors duration-300 group-hover:bg-white" />
            <span className="text-sm font-medium tracking-wide text-[#0a0f1d] transition-colors duration-300 group-hover:text-white">
              {t("partners.pill")}
            </span>
          </div>

          <h2 className="flex justify-center text-5xl leading-tight font-bold tracking-tight text-[#0a0f1d] sm:text-6xl lg:text-6xl">
            <DiaTextReveal
              key={`partners-${locale}`}
              text={t("partners.title")}
              textColor="#0a0f1d"
              colors={["#0a0f1d"]}
            />
          </h2>

          <p className="mt-6 max-w-lg text-lg leading-snug font-semibold tracking-normal text-[#8c8c8c]">
            {t("partners.description")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[#0a0f1d]/10 md:grid-cols-4">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="group flex h-28 items-center justify-center bg-white px-8 transition-colors duration-300 hover:bg-[#0a0f1d] sm:h-32 md:h-36"
            >
              <div className="relative h-10 w-32 opacity-45 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 group-hover:brightness-0 group-hover:invert">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
