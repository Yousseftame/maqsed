"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";
import { UnitCard } from "./UnitCard";
import { unitsService, type Unit } from "@/features/admin/units/units.service";
import { propertiesService, type Property } from "@/features/admin/projects/properties.service";
import { citiesService } from "@/features/admin/cities/cities.service";
import { useMenuOptions } from "@/features/admin/menus/useMenuOptions";
import { mapPublicUnits } from "@/features/units/mapPublicUnits";
import { ALL_SEARCH, readUnitSearch, unitSearchHref } from "@/features/units/unit-search";
import type { City } from "@/features/admin/cities/data";

const ALL = ALL_SEARCH;
const PAGE_SIZE = 8;

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

function CardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="aspect-[4/3] w-full animate-pulse bg-gray-200" />
      <div className="flex flex-col p-5">
        <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-100" />
        <div className="mb-2 h-7 w-2/3 animate-pulse rounded-md bg-gray-200" />
        <div className="mb-4 h-4 w-1/2 animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
        <hr className="my-5 border-gray-100" />
        <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  );
}

function UnitsListingInner() {
  const { locale, isRtl } = useLocale();
  const { label } = useMenuOptions();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlFilters = readUnitSearch(searchParams);
  const relationFilter = urlFilters.relation;
  const typeFilter = urlFilters.type;
  const cityFilter = urlFilters.city;
  const neighborhoodFilter = urlFilters.neighborhood;
  const [page, setPage] = useState(1);

  const results = useQueries({
    queries: [
      { queryKey: ["units"], queryFn: () => unitsService.getUnits() },
      { queryKey: ["properties"], queryFn: () => propertiesService.getProperties() },
      { queryKey: ["cities"], queryFn: () => citiesService.getCities() },
    ],
  });

  const units = (results[0].data || []) as Unit[];
  const properties = (results[1].data || []) as Property[];
  const cities = (results[2].data || []) as City[];
  const isPending = results.some((item) => item.isPending);
  const unitsFailed = results[0].isError;

  const mappedUnits = useMemo(
    () => mapPublicUnits(units, properties, cities, locale, isRtl, label),
    [units, properties, cities, locale, isRtl, label]
  );

  const filteredUnits = useMemo(() => {
    return mappedUnits.filter((item) => {
      if (relationFilter !== ALL && item.listing.relation !== relationFilter) return false;
      if (typeFilter !== ALL && item.unitType !== typeFilter && item.listing.typeEn !== typeFilter) return false;
      if (cityFilter !== ALL && item.cityId !== cityFilter) return false;
      if (neighborhoodFilter !== ALL) {
        const [filterCityId, filterNeighborhoodId] = neighborhoodFilter.split(":");
        if (item.cityId !== filterCityId || item.neighborhoodId !== filterNeighborhoodId) return false;
      }
      return true;
    });
  }, [mappedUnits, relationFilter, typeFilter, cityFilter, neighborhoodFilter]);

  const hasActiveFilters =
    relationFilter !== ALL || typeFilter !== ALL || cityFilter !== ALL || neighborhoodFilter !== ALL;
  const totalPages = Math.max(1, Math.ceil(filteredUnits.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [relationFilter, typeFilter, cityFilter, neighborhoodFilter]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedUnits = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredUnits.slice(start, start + PAGE_SIZE);
  }, [filteredUnits, page]);

  const clearFilters = () => {
    router.replace(
      unitSearchHref({
        relation: ALL,
        type: ALL,
        city: ALL,
        neighborhood: ALL,
      }),
      { scroll: false }
    );
  };

  const goToPage = (nextPage: number) => {
    const clamped = Math.min(totalPages, Math.max(1, nextPage));
    setPage(clamped);
    document.getElementById("units-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="units-results" className="relative z-30 w-full bg-white px-6 py-16 md:px-12 lg:px-20 lg:py-20">
      <div className="mx-auto max-w-[1400px]">
        {isPending ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : unitsFailed || filteredUnits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Filter className="h-16 w-16 text-gray-200 mb-4" />
            <h3 className="text-2xl font-bold text-[#6A2B92] mb-2">
              {isRtl ? "لا توجد وحدات مطابقة" : "No units found"}
            </h3>
            <p className="text-gray-500">
              {isRtl
                ? "حاول تغيير إعدادات الفلتر للبحث عن وحدات أخرى"
                : "Try adjusting your filters to see more units."}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={clearFilters}
                className="mt-6 rounded-full bg-[#17C3B3] px-8 py-3 font-bold text-white transition-all hover:opacity-90 hover:scale-105"
              >
                {isRtl ? "مسح الفلاتر" : "Clear Filters"}
              </button>
            ) : null}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {pagedUnits.map(({ listing, projectName }) => (
                <UnitCard
                  key={listing.pathId || listing.id}
                  unit={listing}
                  isRtl={isRtl}
                  projectName={projectName || undefined}
                />
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

export function UnitsListing() {
  return (
    <Suspense
      fallback={
        <section className="relative z-30 w-full bg-white px-6 py-16 md:px-12 lg:px-20 lg:py-20">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          </div>
        </section>
      }
    >
      <UnitsListingInner />
    </Suspense>
  );
}
