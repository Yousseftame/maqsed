"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Clock, Filter, Layers, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";
import { propertiesService, propertyPublicPath, type Property } from "@/features/admin/projects/properties.service";
import { citiesService } from "@/features/admin/cities/cities.service";
import { unitsService, type Unit } from "@/features/admin/units/units.service";
import { asStringArray } from "@/features/admin/menus/menu-options.service";
import { useMenuOptions } from "@/features/admin/menus/useMenuOptions";
import type { City } from "@/features/admin/cities/data";
import type { Locale } from "@/lib/i18n/types";
import {
  ALL_SEARCH,
  PROPERTIES_RESULTS_ID,
  propertySearchHref,
  readPropertySearch,
} from "@/features/properties/property-search";
import { formatProjectPriceRange, projectPriceRangeFromUnits } from "@/features/properties/project-price";
import { MostViewedBadge } from "@/features/analytics/MostViewedBadge";
import { ProjectDeveloperOverlay } from "@/features/properties/components/ProjectDeveloperOverlay";
import { ContainedCover } from "@/components/ui/ContainedCover";

const ALL = ALL_SEARCH;
const PAGE_SIZE = 8;

const CATEGORY_LABELS: Record<string, { ar: string; en: string }> = {
  luxury: { ar: "فاخرة", en: "Luxury" },
  medium: { ar: "متوسطة", en: "Medium" },
  economic: { ar: "اقتصادية", en: "Economic" },
  فاخرة: { ar: "فاخرة", en: "Luxury" },
  متوسطة: { ar: "متوسطة", en: "Medium" },
  اقتصادية: { ar: "اقتصادية", en: "Economic" },
};

type PublicStatus = "active" | "soon" | "soldOut";

type ListedProject = {
  id: string;
  href: string;
  name: string;
  image: string;
  typeLabel: string;
  category: string;
  location: string;
  status: PublicStatus;
  cityId: string;
  neighborhoodId: string;
  priceLabel: string;
  unitsCount: number;
  features: string[];
  views: number;
  developerName: string;
  developerLogo: string;
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

function pageItems(current: number, total: number) {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  const items: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push("ellipsis");
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < total - 1) items.push("ellipsis");
  items.push(total);
  return items;
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

function publicStatus(status: string | undefined): PublicStatus | null {
  const value = normalizeStatus(status);
  if (value === "active") return "active";
  if (value === "soon" || value === "upcoming") return "soon";
  if (value === "soldout") return "soldOut";
  return null;
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
  return (property.buildings || []).reduce(
    (sum, building) => sum + (Number(building.expectedUnitsCount) || 0),
    0
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

function PropertiesListingInner() {
  const { t, locale, isRtl } = useLocale();
  const { label } = useMenuOptions();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(0);

  const urlFilters = readPropertySearch(searchParams);
  const saleStatus = urlFilters.status;
  const unitType = urlFilters.type;
  const cityId = urlFilters.city;
  const neighborhoodId = urlFilters.neighborhood;
  const [page, setPage] = useState(1);

  const clearFilters = () => {
    router.replace(
      propertySearchHref({
        status: ALL,
        type: ALL,
        city: ALL,
        neighborhood: ALL,
      }),
      { scroll: false }
    );
  };

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

  useEffect(() => {
    if (isPending) return;
    if (window.location.hash !== `#${PROPERTIES_RESULTS_ID}`) return;
    const target = document.getElementById(PROPERTIES_RESULTS_ID);
    if (!target) return;
    const timeout = window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
    return () => window.clearTimeout(timeout);
  }, [isPending]);

  const projects = useMemo<ListedProject[]>(() => {
    const citiesById = new Map(cities.map((city) => [city.id, city]));

    return properties.flatMap((property) => {
      const status = publicStatus(property.status);
      if (!status) return [];

      const city = citiesById.get(property.cityId);
      const cityName = named(city, locale);
      const areaName = neighborhoodLabel(city, property.neighborhoodId, locale);

      return [
        {
          id: property.id,
          href: propertyPublicPath(property),
          name: property.name?.trim() || (isRtl ? "مشروع" : "Project"),
          image: projectImage(property),
          typeLabel: property.projectType?.trim() || "",
          category: categoryLabel(property.category, isRtl),
          location: [areaName, cityName].filter(Boolean).join(" - "),
          status,
          cityId: property.cityId || "",
          neighborhoodId: property.neighborhoodId || "",
          priceLabel: formatProjectPriceRange(projectPriceRangeFromUnits(property.id, units), isRtl),
          unitsCount: unitsCountForProject(property, units),
          features: asStringArray(property.features)
            .map((value) => label(value))
            .filter(Boolean)
            .slice(0, 4),
          views: Number(property.views) || 0,
          developerName: property.developerName?.trim() || "",
          developerLogo: property.developerLogo?.trim() || "",
        },
      ];
    });
  }, [properties, cities, units, locale, isRtl, label]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (saleStatus !== ALL && project.status !== saleStatus) return false;
      if (unitType !== ALL && project.typeLabel !== unitType) return false;
      if (cityId !== ALL && project.cityId !== cityId) return false;
      if (neighborhoodId !== ALL) {
        const [filterCityId, filterNeighborhoodId] = neighborhoodId.split(":");
        if (project.cityId !== filterCityId || project.neighborhoodId !== filterNeighborhoodId) return false;
      }
      return true;
    });
  }, [projects, saleStatus, unitType, cityId, neighborhoodId]);

  const hasActiveFilters =
    saleStatus !== ALL || unitType !== ALL || cityId !== ALL || neighborhoodId !== ALL;

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [saleStatus, unitType, cityId, neighborhoodId]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedProjects = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProjects.slice(start, start + PAGE_SIZE);
  }, [filteredProjects, page]);

  const goToPage = (nextPage: number) => {
    const clamped = Math.min(totalPages, Math.max(1, nextPage));
    setPage(clamped);
    document.getElementById(PROPERTIES_RESULTS_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (cursorRef.current) {
        const isHovering = cursorRef.current.dataset.hovering === "true";
        cursorRef.current.style.transform = `translate(${x - 52.5}px, ${y - 52.5}px) scale(${isHovering ? 1 : 0})`;
      }
    };

    const handleScroll = () => {
      isScrollingRef.current = true;
      if (cursorRef.current) {
        cursorRef.current.dataset.hovering = "false";
        cursorRef.current.style.opacity = "0";
        const transform = cursorRef.current.style.transform;
        if (transform.includes("scale(1)")) {
          cursorRef.current.style.transform = transform.replace("scale(1)", "scale(0)");
        }
      }
      window.clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
    };

    section.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  return (
    <section
      id={PROPERTIES_RESULTS_ID}
      ref={sectionRef}
      className="relative z-30 w-full bg-white px-6 py-16 md:px-12 lg:px-20 lg:py-20"
    >
      <div
        ref={cursorRef}
        data-hovering="false"
        className="pointer-events-none absolute top-0 left-0 z-[100] hidden h-[105px] w-[105px] items-center justify-center rounded-full bg-[#17C3B3] text-center text-white shadow-xl lg:flex"
        style={{
          opacity: 0,
          transform: `translate(0px, 0px) scale(0)`,
          transition: "transform 0.1s ease-out, opacity 0.2s ease",
        }}
      >
        <div className="flex flex-col items-center justify-center text-[19px] leading-none font-black tracking-tight">
          <span>{t("properties.view")}</span>
          <span className="tracking-normal">{t("properties.details")}</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px]">
        {isPending ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : propertiesFailed || filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Filter className="mb-4 h-16 w-16 text-gray-200" />
            <h3 className="mb-2 text-2xl font-bold text-[#6A2B92]">
              {isRtl ? "لا توجد عقارات مطابقة" : "No properties found"}
            </h3>
            <p className="text-gray-500">
              {isRtl ? "حاول تغيير إعدادات الفلتر للبحث عن عقارات أخرى" : "Try adjusting your filters to see more properties."}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={clearFilters}
                className="mt-6 rounded-full bg-[#17C3B3] px-8 py-3 font-bold text-white transition-all hover:scale-105 hover:opacity-90"
              >
                {isRtl ? "مسح الفلاتر" : "Clear Filters"}
              </button>
            ) : null}
          </div>
        ) : (
          <>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {pagedProjects.map((prop) => (
              <Link
                key={prop.id}
                href={prop.href}
                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                onMouseEnter={() => {
                  if (!isScrollingRef.current && cursorRef.current) {
                    cursorRef.current.dataset.hovering = "true";
                    cursorRef.current.style.opacity = "1";
                    const transform = cursorRef.current.style.transform;
                    if (transform.includes("scale(0)")) {
                      cursorRef.current.style.transform = transform.replace("scale(0)", "scale(1)");
                    }
                  }
                }}
                onMouseLeave={() => {
                  if (cursorRef.current) {
                    cursorRef.current.dataset.hovering = "false";
                    cursorRef.current.style.opacity = "0";
                    const transform = cursorRef.current.style.transform;
                    if (transform.includes("scale(1)")) {
                      cursorRef.current.style.transform = transform.replace("scale(1)", "scale(0)");
                    }
                  }
                }}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
                  <ContainedCover
                    src={prop.image}
                    alt={prop.name}
                    loading="lazy"
                    imageClassName="transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute top-4 start-4 z-10 flex flex-col items-start gap-2">
                    {prop.category ? (
                      <div className="flex flex-row-reverse items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-sm font-bold text-[#3E1854] shadow-sm backdrop-blur-md">
                        <Layers className="h-4 w-4" />
                        <span>{prop.category}</span>
                      </div>
                    ) : null}
                    <MostViewedBadge views={prop.views} />
                  </div>

                  <ProjectDeveloperOverlay name={prop.developerName} logo={prop.developerLogo} />

                  {prop.status === "soon" ? (
                    <div className="absolute top-4 end-4 z-10 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-sm font-medium text-white shadow-sm backdrop-blur-md">
                      <Clock className="h-4 w-4" />
                      <span>{isRtl ? "قريباً" : "Soon"}</span>
                    </div>
                  ) : prop.status === "soldOut" ? (
                    <div className="absolute top-4 end-4 z-10 rounded-full bg-red-500 px-4 py-1.5 text-sm font-bold text-white shadow-sm">
                      {isRtl ? "مباع" : "Sold"}
                    </div>
                  ) : (
                    <div className="absolute top-4 end-4 z-10 rounded-full bg-[#17C3B3] px-4 py-1.5 text-sm font-bold text-white shadow-sm">
                      {isRtl ? "بدأ البيع" : "Now Selling"}
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
                    {prop.status === "soon" ? (
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
                      <div
                        className={cn(
                          "min-w-0 leading-snug",
                          prop.status === "active" ? "text-[#0a0f1d]" : "text-[#8c8c8c]"
                        )}
                      >
                        {prop.status === "soon"
                          ? isRtl
                            ? "يتاح للحجز"
                            : "Available for booking"
                          : prop.priceLabel}
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5 text-[#0a0f1d] transition-colors group-hover:text-[#6A2B92]">
                        {!isRtl && (
                          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        )}
                        <span>{isRtl ? "اكتشف المزيد" : "Discover More"}</span>
                        {isRtl && (
                          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {totalPages > 1 ? (
            <div className="mt-14 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-[#6A2B92] transition-colors hover:border-[#17C3B3] hover:text-[#17C3B3] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={isRtl ? "السابق" : "Previous"}
              >
                {isRtl ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </button>
              {pageItems(page, totalPages).map((item, index) =>
                item === "ellipsis" ? (
                  <span key={`ellipsis-${index}`} className="px-1 text-sm font-bold text-gray-400">
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => goToPage(item)}
                    className={cn(
                      "flex h-11 min-w-11 items-center justify-center rounded-full px-3 text-sm font-bold transition-colors",
                      page === item
                        ? "bg-[#17C3B3] text-white"
                        : "border border-gray-200 text-[#6A2B92] hover:border-[#17C3B3] hover:text-[#17C3B3]"
                    )}
                  >
                    {item}
                  </button>
                )
              )}
              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-[#6A2B92] transition-colors hover:border-[#17C3B3] hover:text-[#17C3B3] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={isRtl ? "التالي" : "Next"}
              >
                {isRtl ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </button>
            </div>
          ) : null}
          </>
        )}
      </div>
    </section>
  );
}

export function PropertiesListing() {
  return (
    <Suspense
      fallback={
        <section className="relative z-30 w-full bg-white px-6 py-16 md:px-12 lg:px-20 lg:py-20">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-14 h-10 w-48 animate-pulse rounded bg-gray-100" />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        </section>
      }
    >
      <PropertiesListingInner />
    </Suspense>
  );
}
