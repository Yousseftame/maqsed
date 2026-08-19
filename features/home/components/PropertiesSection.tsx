"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { Bed, Bath, Map, ArrowUpRight } from "lucide-react";
import { allProperties } from "@/features/properties/data/listings";
import { useLocale } from "@/components/providers/LocaleProvider";

const featuredProperties = allProperties.slice(0, 6);

export function PropertiesSection() {
  const { t, locale, isRtl } = useLocale();
  const [activeFilter, setActiveFilter] = useState("All Properties");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const filters = useMemo(
    () => [
      { key: "All Properties", label: t("properties.filters.all") },
      { key: "Family House", label: t("properties.filters.family") },
      { key: "Modern Vila", label: t("properties.filters.villa") },
      { key: "Luxury Apartment", label: t("properties.filters.apartment") },
    ],
    [t]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    const section = sectionRef.current;
    if (section) section.addEventListener("mousemove", handleMouseMove);
    return () => {
      if (section) section.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const visibleProperties =
    activeFilter === "All Properties"
      ? featuredProperties
      : featuredProperties.filter((prop) => prop.type === activeFilter);

  return (
    <section
      ref={sectionRef}
      className="relative z-30 w-full overflow-hidden bg-white px-6 py-24 md:px-12 lg:px-20"
    >
      <div
        className="pointer-events-none absolute top-0 left-0 z-[100] hidden h-[105px] w-[105px] items-center justify-center rounded-full bg-[#17C3B3] text-center text-white shadow-xl lg:flex"
        style={{
          opacity: isHoveringCard ? 1 : 0,
          transform: `translate(${mousePos.x - 52.5}px, ${mousePos.y - 52.5}px) scale(${isHoveringCard ? 1 : 0})`,
          transition: "transform 0.15s ease-out, opacity 0.3s ease",
        }}
      >
        <div className="flex flex-col items-center justify-center text-[19px] leading-none font-black tracking-tight">
          <span>{t("properties.view")}</span>
          <span className="tracking-normal">{t("properties.details")}</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16 flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <div className="group mb-8 inline-flex cursor-default items-center gap-2 rounded-full border border-gray-200 px-3.5 py-1.5 transition-colors duration-300 hover:bg-[#6A2B92]">
              <div className="h-3 w-3 flex-shrink-0 rounded-full bg-[#6A2B92] transition-colors duration-300 group-hover:bg-white" />
              <span className="text-sm font-medium tracking-wide text-[#6A2B92] transition-colors duration-300 group-hover:text-white">
                {t("properties.pill")}
              </span>
            </div>
            <h2 className="flex flex-col items-start text-5xl leading-tight font-bold tracking-tight text-[#6A2B92] sm:text-6xl lg:text-6xl">
              <DiaTextReveal
                key={`props-1-${locale}`}
                text={t("properties.titleLine1")}
                textColor="#6A2B92"
                colors={["#6A2B92"]}
              />
              <DiaTextReveal
                key={`props-2-${locale}`}
                text={t("properties.titleLine2")}
                textColor="#6A2B92"
                colors={["#6A2B92"]}
              />
            </h2>
          </div>

          <div className="max-w-lg">
            <p className="text-lg leading-snug font-semibold tracking-normal text-[#8c8c8c]">
              {t("properties.description")}
            </p>
          </div>
        </div>

        <div className="mb-16 flex flex-wrap items-center justify-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
              className={`rounded-full border px-4 py-2 text-base font-semibold transition-colors duration-300 ${
                activeFilter === filter.key
                  ? "border-[#17C3B3] bg-[#17C3B3] text-white"
                  : "border-gray-200 bg-white text-[#6A2B92] hover:border-[#6A2B92]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visibleProperties.map((prop) => (
            <Link
              key={prop.id}
              href={`/properties/${prop.id}`}
              className="group flex cursor-pointer flex-col"
              onMouseEnter={() => setIsHoveringCard(true)}
              onMouseLeave={() => setIsHoveringCard(false)}
            >
              <div className="relative mb-6 aspect-[15/16] w-full overflow-hidden rounded-2xl">
                <Image
                  src={prop.image}
                  alt={prop.title}
                  fill
                  className="object-cover transition-transform duration-700"
                />
                <div className="pointer-events-none absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute top-5 start-5 z-10 flex flex-wrap gap-2 items-start pointer-events-none">
                  <div className="flex items-center justify-center rounded-full bg-[#17C3B3] px-3 py-2 text-[17px] leading-none font-bold tracking-tight text-white shadow-md">
                    {prop.type === "Luxury Apartment" ? t("properties.types.apartment") : 
                     prop.type === "Modern Vila" || prop.type === "Modern Villa" ? t("properties.types.villa") :
                     prop.type === "Family House" ? t("properties.types.house") : 
                     prop.type}
                  </div>
                  {prop.tag === "SOLD OUT" && (
                    <div className="flex items-center justify-center rounded-full bg-red-500 px-3 py-2 text-[17px] leading-none font-bold tracking-tight text-white shadow-md">
                      {isRtl ? "مباع" : "Sold Out"}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col px-2">
                <div className="flex items-center justify-between w-full mb-1">
                  <h3 className="text-[2rem] leading-tight font-semibold text-[#0a0f1d]">
                    {prop.price}
                  </h3>
                  {prop.tag === "SOLD OUT" && (prop.buyerEn || prop.buyerAr) && (
                    <p className="text-sm font-bold tracking-wide text-red-600">
                      {isRtl ? `المالك: ${prop.buyerAr}` : `Owned by: ${prop.buyerEn}`}
                    </p>
                  )}
                </div>
                <div className="mb-4 flex flex-col items-start gap-1">
                  <h4 className="text-2xl font-bold text-[#0a0f1d]">
                    {isRtl ? prop.titleAr : prop.title}
                  </h4>
                </div>
                <p className="mb-6 text-[1.05rem] leading-relaxed font-semibold whitespace-pre-line text-[#8c8c8c]">
                  {isRtl ? prop.addressAr : prop.address}
                </p>

                <div className="mt-auto flex items-center gap-6">
                  <div className="flex items-center gap-2 text-[#8c8c8c]">
                    <Bed className="h-6 w-6 stroke-[2] text-[#17C3B3]" />
                    <span className="text-[1rem] font-bold">
                      {prop.beds} {t("properties.bed")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#8c8c8c]">
                    <Bath className="h-6 w-6 stroke-[2] text-[#17C3B3]" />
                    <span className="text-[1rem] font-bold">
                      {prop.baths} {t("properties.bath")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#8c8c8c]">
                    <Map className="h-6 w-6 stroke-[2] text-[#17C3B3]" />
                    <span className="text-[1rem] font-bold">
                      {prop.sqft} {t("properties.sqft")}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            href="/properties"
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#17C3B3] px-6 py-3.5 text-sm font-medium tracking-wide text-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white hover:text-[#17C3B3] hover:ring-1 hover:ring-[#17C3B3]/15 active:scale-[0.98]"
          >
            {t("properties.seeAll")}
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5"
              strokeWidth={2}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
