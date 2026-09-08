"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Layers, ChevronRight, ChevronLeft, ArrowUpRight } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { propertiesService, propertyPublicPath, type Property } from "@/features/admin/projects/properties.service";
import { citiesService } from "@/features/admin/cities/cities.service";
import { unitsService, type Unit } from "@/features/admin/units/units.service";
import { asStringArray } from "@/features/admin/menus/menu-options.service";
import { useMenuOptions } from "@/features/admin/menus/useMenuOptions";
import type { City } from "@/features/admin/cities/data";
import type { Locale } from "@/lib/i18n/types";
import useEmblaCarousel from "embla-carousel-react";

const CATEGORY_LABELS: Record<string, { ar: string; en: string }> = {
  luxury: { ar: "فاخرة", en: "Luxury" },
  medium: { ar: "متوسطة", en: "Medium" },
  economic: { ar: "اقتصادية", en: "Economic" },
  فاخرة: { ar: "فاخرة", en: "Luxury" },
  متوسطة: { ar: "متوسطة", en: "Medium" },
  اقتصادية: { ar: "اقتصادية", en: "Economic" },
};

function isSoldOut(status: string | undefined) {
  return String(status || "").toLowerCase().replace(/\s+/g, "") === "soldout";
}

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
      className="h-full w-full object-cover transition-transform duration-700 group-hover/link:scale-105"
      onError={() => setFailed(true)}
    />
  );
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

function CardSkeleton() {
  return (
    <div className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4 rtl:pl-0 rtl:pr-4 py-2">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="aspect-[4/3] w-full animate-pulse bg-gray-200" />
        <div className="flex flex-col p-5">
          <div className="h-6 w-2/3 animate-pulse rounded-md bg-gray-200" />
          <div className="mt-2 h-4 w-1/2 animate-pulse rounded-md bg-gray-100" />
          <hr className="my-5 border-gray-100" />
          <div className="h-4 w-24 animate-pulse rounded-md bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

export function CurrentPropertiesSection() {
  const { isRtl, locale, t } = useLocale();
  const { label } = useMenuOptions();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    direction: isRtl ? "rtl" : "ltr",
    dragFree: true,
  });

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
      .filter((property) => isSoldOut(property.status))
      .map((property) => {
        const city = citiesById.get(property.cityId);
        const cityName = named(city, locale) || "";
        const areaName = neighborhoodLabel(city, property.neighborhoodId, locale);
        const location = [areaName, cityName].filter(Boolean).join(isRtl ? " | " : " | ");
        const bodyLocation = [areaName, cityName].filter(Boolean).join(isRtl ? "، " : ", ");

        return {
          id: property.id,
          href: propertyPublicPath(property),
          name: property.name?.trim() || (isRtl ? "مشروع" : "Project"),
          image: projectImage(property),
          category: categoryLabel(property.category, isRtl),
          location,
          bodyLocation,
          features: asStringArray(property.features)
            .map((value) => label(value))
            .filter(Boolean)
            .slice(0, 4),
          unitsCount: unitsCountForProject(property, units),
          projectType: property.projectType?.trim() || "",
        };
      })
      .slice(0, 6);
  }, [properties, cities, units, locale, isRtl, label]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit({ direction: isRtl ? "rtl" : "ltr" });
    }
  }, [emblaApi, isRtl, projects.length, isPending]);

  return (
    <section className="relative z-30 w-full bg-white px-6 py-24 md:px-12 lg:px-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="text-center mb-16 flex justify-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#6A2B92] flex justify-center">
            <DiaTextReveal
              key={`current-props-title-${isRtl}`}
              text={isRtl ? "اكتشف مشاريعنا الحصرية" : "Discover Our Current Projects"}
              textColor="#6A2B92"
              colors={["#6A2B92"]}
            />
          </h2>
        </div>

        <div className="relative w-full group">
          {!isPending && projects.length > 1 ? (
            <>
              <button
                onClick={isRtl ? scrollNext : scrollPrev}
                className="absolute -left-4 lg:-left-6 top-[35%] -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-[#17C3B3] shadow-lg text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#14b0a1] hover:scale-110 disabled:opacity-0"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2]" />
              </button>

              <button
                onClick={isRtl ? scrollPrev : scrollNext}
                className="absolute -right-4 lg:-right-6 top-[35%] -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-[#17C3B3] shadow-lg text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#14b0a1] hover:scale-110 disabled:opacity-0"
              >
                <ChevronRight className="w-6 h-6 stroke-[2]" />
              </button>
            </>
          ) : null}

          <div className="overflow-hidden" ref={emblaRef} dir={isRtl ? "rtl" : "ltr"}>
            <div className="flex backface-hidden touch-pan-y -ml-4 rtl:-ml-0 rtl:-mr-4">
              {isPending ? (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              ) : propertiesFailed || projects.length === 0 ? (
                <div className="flex w-full items-center justify-center py-16 pl-4 rtl:pl-0 rtl:pr-4">
                  <p className="text-sm font-medium text-[#8c8c8c]">
                    {isRtl ? "لا توجد مشاريع مباعة بالكامل حالياً" : "No sold-out projects to show yet"}
                  </p>
                </div>
              ) : (
                projects.map((project) => (
                  <div key={project.id} className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4 rtl:pl-0 rtl:pr-4 py-2">
                    <Link href={project.href} className="group/link flex h-full cursor-pointer select-none flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <ProjectCover src={project.image} alt={project.name} />
                        <div className="pointer-events-none absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover/link:opacity-0" />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                        {project.category ? (
                          <div className="absolute top-4 start-4 z-10 flex flex-row-reverse items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-sm font-bold text-[#3E1854] shadow-sm backdrop-blur-md">
                            <Layers className="h-4 w-4" />
                            <span>{project.category}</span>
                          </div>
                        ) : null}

                        <div className="absolute bottom-5 start-5 z-10 flex flex-col items-start text-start text-white">
                          <h3 className="text-3xl font-bold tracking-tight">
                            {project.name}
                          </h3>
                          {project.location ? (
                            <p className="mt-1 text-base font-medium text-white/90">
                              {project.location}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex flex-col p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex min-w-0 flex-col items-start gap-1">
                            <h4 className="text-xl font-bold text-[#0a0f1d]">
                              {project.name}
                            </h4>
                            {project.bodyLocation ? (
                              <p className="text-sm font-medium text-[#8c8c8c]">
                                {project.bodyLocation}
                              </p>
                            ) : null}
                          </div>
                          <div className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700 shrink-0">
                            {isRtl ? "بدأ البيع" : "Now Selling"}
                          </div>
                        </div>

                        <hr className="my-5 border-gray-100" />

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-bold text-[#0a0f1d]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#8c8c8c]">{isRtl ? "الوحدات:" : "Units:"}</span>
                            <span>{project.unitsCount}</span>
                          </div>
                          {project.projectType ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[#8c8c8c]">{isRtl ? "النوع:" : "Type:"}</span>
                              <span>{project.projectType}</span>
                            </div>
                          ) : null}
                          {project.features.length > 0 ? (
                            <div className="flex min-w-0 items-center gap-1.5">
                              <span className="shrink-0 text-[#8c8c8c]">
                                {isRtl ? "مميزات المشروع:" : "Project features:"}
                              </span>
                              <span className="truncate">{project.features.join(" · ")}</span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            href="/properties?status=soldOut"
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
