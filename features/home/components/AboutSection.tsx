"use client";

import { useMemo, useState } from "react";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import Image from "next/image";
import { useLocale } from "@/components/providers/LocaleProvider";

export function AboutSection() {
  const { t, locale } = useLocale();
  const [activeId, setActiveId] = useState<number>(3);
  const [isPillActive, setIsPillActive] = useState<boolean>(false);

  const categories = useMemo(
    () => [
      {
        id: 1,
        title: t("about.cards.villa.title"),
        description: t("about.cards.villa.description"),
        count: t("about.cards.villa.count"),
        image: "/properites/1.webp",
      },
      {
        id: 2,
        title: t("about.cards.family.title"),
        description: t("about.cards.family.description"),
        count: t("about.cards.family.count"),
        image: "/properites/2.webp",
      },
      {
        id: 3,
        title: t("about.cards.apartment.title"),
        description: t("about.cards.apartment.description"),
        count: t("about.cards.apartment.count"),
        image: "/properites/3.webp",
      },
      {
        id: 4,
        title: t("about.cards.office.title"),
        description: t("about.cards.office.description"),
        count: t("about.cards.office.count"),
        image: "/properites/4.avif",
      },
    ],
    [t]
  );

  const textColor = isPillActive ? "#ffffff" : "#0a0f1d";

  return (
    <section
      className={`relative z-30 w-full px-6 py-20 transition-colors duration-700 md:px-12 lg:px-20 ${
        isPillActive ? "bg-[#0a0f1d]" : "bg-white"
      }`}
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16 flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <button
              type="button"
              onClick={() => setIsPillActive(!isPillActive)}
              className={`group mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 px-3.5 py-1.5 transition-colors duration-300 ${
                isPillActive ? "bg-[#0a0f1d]" : "hover:bg-[#0a0f1d]"
              }`}
            >
              <div
                className={`h-3 w-3 flex-shrink-0 rounded-full transition-colors duration-300 ${
                  isPillActive ? "bg-white" : "bg-[#0a0f1d] group-hover:bg-white"
                }`}
              />
              <span
                className={`text-sm font-medium tracking-wide transition-colors duration-300 ${
                  isPillActive
                    ? "text-white"
                    : "text-[#0a0f1d] group-hover:text-white"
                }`}
              >
                {isPillActive ? t("about.pill") : t("about.clickMe")}
              </span>
            </button>
            <h2 className="flex flex-col items-start text-5xl leading-tight font-bold tracking-tight transition-colors duration-700 sm:text-6xl lg:text-6xl">
              <DiaTextReveal
                key={`about-1-${locale}-${isPillActive}`}
                text={t("about.titleLine1")}
                textColor={textColor}
                colors={[textColor]}
              />
              <DiaTextReveal
                key={`about-2-${locale}-${isPillActive}`}
                text={t("about.titleLine2")}
                textColor={textColor}
                colors={[textColor]}
              />
            </h2>
          </div>

          <div className="max-w-lg">
            <p className="text-lg leading-snug font-semibold tracking-normal text-[#8c8c8c] transition-colors duration-700">
              {t("about.description")}
            </p>
          </div>
        </div>

        <div className="flex h-[420px] gap-3 sm:h-[460px]" data-aos="fade-up">
          {categories.map((cat) => {
            const isActive = activeId === cat.id;
            return (
              <div
                key={cat.id}
                onMouseEnter={() => setActiveId(cat.id)}
                className="relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ flex: isActive ? "3.5" : "1" }}
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />

                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background: isActive
                      ? "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)"
                      : "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
                  }}
                />

                <div
                  className="absolute right-0 bottom-0 left-0 p-6 text-white transition-all duration-500"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(12px)",
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  <h3 className="mb-2 text-xl font-bold whitespace-nowrap sm:text-2xl">
                    {cat.title}
                  </h3>
                  <p className="mb-3 max-w-xs text-sm leading-relaxed text-gray-300">
                    {cat.description}
                  </p>
                  <span className="text-sm font-semibold text-white/80">
                    {cat.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
