"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { Clock, Building2, ArrowUpRight, Layers } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";
import { propertiesService, propertyPublicPath, type Property } from "@/features/admin/projects/properties.service";
import { citiesService } from "@/features/admin/cities/cities.service";
import { unitsService, type Unit } from "@/features/admin/units/units.service";
import { asStringArray } from "@/features/admin/menus/menu-options.service";
import { useMenuOptions } from "@/features/admin/menus/useMenuOptions";
import { formatProjectPriceRange, projectPriceRangeFromUnits } from "@/features/properties/project-price";
import type { City } from "@/features/admin/cities/data";
import type { Locale } from "@/lib/i18n/types";

const ALL_FILTER = "All Properties";

const CATEGORY_LABELS: Record<string, { ar: string; en: string }> = {
  luxury: { ar: "فاخرة", en: "Luxury" },
  medium: { ar: "متوسطة", en: "Medium" },
  economic: { ar: "اقتصادية", en: "Economic" },
  فاخرة: { ar: "فاخرة", en: "Luxury" },
  متوسطة: { ar: "متوسطة", en: "Medium" },
  اقتصادية: { ar: "اقتصادية", en: "Economic" },
};

function named(city: City | undefined, locale: Locale) {
  if (!city) return "";
  return locale === "ar" ? city.name.ar || city.name.en : city.name.en || city.name.ar;
}

function neighborhoodLabel(city: City | undefined, neighborhoodId: string | undefined, locale: Locale) {
  if (!city || !neighborhoodId) return "";
  const neighborhood = city.neighborhoods?.find((item) => item.id === neighborhoodId);
  if (!neighborhood) return "";
  return locale === "ar" ? neighborhood.name.ar || neighborhood.name.en : neighborhood.name.en || neighborhood.name.ar;
}

function categoryLabel(category: string | undefined, isRtl: boolean) {
  if (!category) return "";
  const mapped = CATEGORY_LABELS[category];
  if (mapped) return isRtl ? mapped.ar : mapped.en;
  return category;
}

function normalizeStatus(status: string | undefined) {
  return String(status || "").toLowerCase().replace(/\s+/g, "");
}

function isListedProject(status: string | undefined) {
  const value = normalizeStatus(status);
  return value === "active" || value === "soon";
}

function isSoon(status: string | undefined) {
  return normalizeStatus(status) === "soon";
}

function projectImage(property: Property) {
  const images = property.images as unknown;
  if (!Array.isArray(images)) return "";

  for (const item of images) {
    if (typeof item === "string" && item.trim() && !item.startsWith("blob:")) {
      return item.trim();
    }
    if (item && typeof item === "object") {
      const record = item as { url?: string; preview?: string; src?: string };
      const url = record.url || record.preview || record.src || "";
      if (url.trim() && !url.startsWith("blob:")) return url.trim();
    }
  }

  return "";
}

function unitsCountForProject(property: Property, units: Unit[]) {
  const counted = units.filter((unit) => unit.projectId === property.id).length;
  if (counted > 0) return counted;
  const stored = Number(property.totalUnitsCount);
  if (Number.isFinite(stored) && stored > 0) return stored;
  const fromBuildings = (property.buildings || []).reduce(
    (sum, building) => sum + (Number(building.expectedUnitsCount) || 0),
    0
  );
  return fromBuildings;
}

function ProjectCover({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return <div className="h-full w-full bg-gray-200" />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      onError={() => setFailed(true)}
    />
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="aspect-[4/3] w-full animate-pulse bg-gray-200" />
      <div className="flex flex-col p-5">
        <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-100" />
        <div className="mb-2 h-7 w-2/3 animate-pulse rounded-md bg-gray-200" />
        <div className="mb-3 h-4 w-1/2 animate-pulse rounded bg-gray-100" />
        <div className="h-8 w-full animate-pulse rounded bg-gray-100" />
        <hr className="my-5 border-gray-100" />
        <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  );
}

export function PropertiesSection() {
  const { t, locale, isRtl } = useLocale();
  const { label } = useMenuOptions();
  const [activeFilter, setActiveFilter] = useState(ALL_FILTER);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const results = useQueries({
    queries: [
      { queryKey: ["properties"], queryFn: () => propertiesService.getProperties() },
      { queryKey: ["cities"], queryFn: () => citiesService.getCities() },
      { queryKey: ["units"], queryFn: () => unitsService.getUnits() },
    ],
  });

  const properties = (results[0].data || []) as Property[];
  const cities = (results[1].data || []) as City[];
  const units = (results[2].data || []) as Unit[];
  const isPending = results.some((item) => item.isPending);
  const propertiesFailed = results[0].isError;

  const projects = useMemo(() => {
    const citiesById = new Map(cities.map((city) => [city.id, city]));

    return properties
      .filter((property) => isListedProject(property.status))
      .map((property) => {
        const city = citiesById.get(property.cityId);
        const cityName = named(city, locale);
        const areaName = neighborhoodLabel(city, property.neighborhoodId, locale);
        const location = [areaName, cityName].filter(Boolean).join(isRtl ? " - " : " - ");
        const typeLabel = property.projectType?.trim() || "";
        const category = categoryLabel(property.category, isRtl);

        return {
          id: property.id,
          href: propertyPublicPath(property),
          name: property.name?.trim() || (isRtl ? "مشروع" : "Project"),
          image: projectImage(property),
          typeLabel,
          category,
          location,
          soon: isSoon(property.status),
          priceLabel: formatProjectPriceRange(projectPriceRangeFromUnits(property.id, units), isRtl),
          unitsCount: unitsCountForProject(property, units),
          features: asStringArray(property.features)
            .map((value) => label(value))
            .filter(Boolean)
            .slice(0, 4),
        };
      });
  }, [properties, cities, units, locale, isRtl, label]);

  const typeFilters = useMemo(() => {
    const unique = Array.from(new Set(projects.map((project) => project.typeLabel).filter(Boolean)));
    return unique;
  }, [projects]);

  const filters = useMemo(
    () => [{ key: ALL_FILTER, label: t("properties.filters.all") }, ...typeFilters.map((key) => ({ key, label: key }))],
    [t, typeFilters]
  );

  useEffect(() => {
    if (activeFilter !== ALL_FILTER && !typeFilters.includes(activeFilter)) {
      setActiveFilter(ALL_FILTER);
    }
  }, [activeFilter, typeFilters]);

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

  const visibleProperties = (
    activeFilter === ALL_FILTER ? projects : projects.filter((project) => project.typeLabel === activeFilter)
  ).slice(0, 6);

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

        {!isPending && filters.length > 1 ? (
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
        ) : (
          <div className="mb-16 flex flex-wrap items-center justify-center gap-3">
            <div className="h-10 w-28 animate-pulse rounded-full bg-gray-100" />
            <div className="h-10 w-24 animate-pulse rounded-full bg-gray-100" />
            <div className="h-10 w-24 animate-pulse rounded-full bg-gray-100" />
          </div>
        )}

        {isPending ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : propertiesFailed || visibleProperties.length === 0 ? (
          <div className="flex w-full items-center justify-center py-16">
            <p className="text-sm font-medium text-[#8c8c8c]">
              {isRtl ? "لا توجد مشاريع متاحة حالياً" : "No projects to show yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {visibleProperties.map((prop) => (
              <Link
                key={prop.id}
                href={prop.href}
                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                onMouseEnter={() => setIsHoveringCard(true)}
                onMouseLeave={() => setIsHoveringCard(false)}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-200">
                  <ProjectCover src={prop.image} alt={prop.name} />

                  {prop.category ? (
                    <div className="absolute top-4 start-4 z-10 flex flex-row-reverse items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-sm font-bold text-[#3E1854] shadow-sm backdrop-blur-md">
                      <Layers className="h-4 w-4" />
                      <span>{prop.category}</span>
                    </div>
                  ) : null}

                  {prop.soon ? (
                    <div className="absolute top-4 end-4 z-10 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-sm font-medium text-white shadow-sm backdrop-blur-md">
                      <Clock className="h-4 w-4" />
                      <span>{isRtl ? "قريباً" : "Soon"}</span>
                    </div>
                  ) : (
                    <div className="absolute top-4 end-4 z-10 rounded-full bg-[#17C3B3] px-4 py-1.5 text-sm font-bold text-white shadow-sm">
                      {isRtl ? "متاح" : "Available"}
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5 text-start">
                  {prop.typeLabel ? (
                    <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-[#8c8c8c]">
                      <Building2 className="h-4 w-4" />
                      <span>{prop.typeLabel}</span>
                    </div>
                  ) : null}

                  <div className="mb-3 flex flex-col">
                    <h3 className="mb-1 line-clamp-1 text-2xl font-bold text-[#0a0f1d]">{prop.name}</h3>
                    {prop.location ? (
                      <p className="line-clamp-1 text-sm font-medium text-[#8c8c8c]">{prop.location}</p>
                    ) : null}
                  </div>

                  <div className="min-h-[2.75rem]">
                    {prop.soon ? (
                      <p className="line-clamp-2 text-sm leading-relaxed text-[#8c8c8c]">
                        {isRtl
                          ? "مشروع جديد قيد الإعداد - سجل اهتمامك فالوحدات لتكون أول من يعرف عند الانطلاق"
                          : "New project in preparation - register your interest in the units to be the first to know at launch."}
                      </p>
                    ) : (
                      <div className="line-clamp-2 text-sm font-bold leading-relaxed text-[#0a0f1d]">
                        <span className="text-[#8c8c8c]">{isRtl ? "الوحدات:" : "Units:"}</span>{" "}
                        <span>{prop.unitsCount}</span>
                        {prop.features.length > 0 ? (
                          <>
                            <span className="mx-2 text-[#d4d4d4]">·</span>
                            <span className="text-[#8c8c8c]">{isRtl ? "مميزات المشروع:" : "Project features:"}</span>{" "}
                            <span>{prop.features.join(" · ")}</span>
                          </>
                        ) : null}
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-5">
                    <hr className="mb-5 border-gray-100" />
                    <div className="flex min-h-5 items-end justify-between gap-3 text-sm font-bold">
                      <div className={cn("min-w-0 leading-snug", prop.soon ? "text-[#8c8c8c]" : "text-[#0a0f1d]")}>
                        {prop.soon
                          ? isRtl
                            ? "يتاح للحجز"
                            : "Available for booking"
                          : prop.priceLabel}
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5 text-[#0a0f1d] transition-colors group-hover:text-[#6A2B92]">
                        {!isRtl && <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
                        <span>{isRtl ? "اكتشف المزيد" : "Discover More"}</span>
                        {isRtl && <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

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
