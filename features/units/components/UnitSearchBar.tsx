"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";
import { propertiesService, type Property } from "@/features/admin/projects/properties.service";
import { citiesService } from "@/features/admin/cities/cities.service";
import { unitsService, type Unit } from "@/features/admin/units/units.service";
import { useMenuOptions } from "@/features/admin/menus/useMenuOptions";
import { mapPublicUnits } from "@/features/units/mapPublicUnits";
import type { City } from "@/features/admin/cities/data";
import type { Locale } from "@/lib/i18n/types";
import {
  ALL_SEARCH,
  readUnitSearch,
  unitSearchHref,
  type UnitSearchValues,
} from "@/features/units/unit-search";

type FilterOption = { value: string; label: string };

function named(city: City | undefined, locale: Locale) {
  if (!city) return "";
  return locale === "ar" ? city.name.ar || city.name.en : city.name.en || city.name.ar;
}

function neighborhoodName(city: City | undefined, neighborhoodId: string | undefined, locale: Locale) {
  if (!city || !neighborhoodId) return "";
  const neighborhood = city.neighborhoods?.find((item) => item.id === neighborhoodId);
  if (!neighborhood) return "";
  return locale === "ar" ? neighborhood.name.ar || neighborhood.name.en : neighborhood.name.en || neighborhood.name.ar;
}

function SelectField({
  label,
  value,
  onChange,
  options,
  tone = "light",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  tone?: "light" | "dark";
}) {
  const safeValue = options.some((option) => option.value === value) ? value : ALL_SEARCH;

  return (
    <div
      className={cn(
        "flex min-w-[200px] flex-1 flex-col border-b-2 pb-3",
        tone === "dark" ? "border-white/25" : "border-[#8c8c8c]"
      )}
    >
      <label
        className={cn(
          "mb-6 text-base font-medium tracking-wide whitespace-nowrap",
          tone === "dark" ? "text-white/45" : "text-gray-500"
        )}
      >
        {label}
      </label>
      <div className="relative w-full">
        <select
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full cursor-pointer appearance-none bg-transparent ps-3 pe-10 text-lg font-semibold focus:outline-none sm:text-xl",
            tone === "dark" ? "text-white" : "text-[#0a0f1d]"
          )}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          className={cn(
            "pointer-events-none absolute top-1/2 end-3 h-4 w-4 flex-shrink-0 -translate-y-1/2",
            tone === "dark" ? "text-white" : "text-[#0a0f1d]"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

function SearchBarFallback({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <div className="mt-4 flex w-full max-w-[1150px] flex-col items-stretch gap-6 sm:flex-row sm:items-end sm:gap-5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "flex min-w-[200px] flex-1 flex-col border-b-2 pb-3",
            tone === "dark" ? "border-white/25" : "border-[#8c8c8c]"
          )}
        >
          <div className={cn("mb-6 h-4 w-20 rounded", tone === "dark" ? "bg-white/10" : "bg-gray-200")} />
          <div className={cn("h-7 w-32 rounded", tone === "dark" ? "bg-white/10" : "bg-gray-100")} />
        </div>
      ))}
      <div className="mt-6 h-14 w-14 shrink-0 rounded-full bg-[#17C3B3]/40 sm:mt-0 sm:ms-6" />
    </div>
  );
}

function UnitSearchBarInner({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { t, locale, isRtl } = useLocale();
  const { label } = useMenuOptions();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const onUnitsPage = pathname === "/units";
  const urlValues = readUnitSearch(searchParams);

  const [localValues, setLocalValues] = useState<UnitSearchValues>({
    relation: ALL_SEARCH,
    type: ALL_SEARCH,
    city: ALL_SEARCH,
    neighborhood: ALL_SEARCH,
  });

  const values = onUnitsPage ? urlValues : localValues;
  const allLabel = isRtl ? "الكل" : "All";

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

  const mappedUnits = useMemo(
    () => mapPublicUnits(units, properties, cities, locale, isRtl, label),
    [units, properties, cities, locale, isRtl, label]
  );

  const relationOptions = useMemo<FilterOption[]>(
    () => [
      { value: ALL_SEARCH, label: allLabel },
      { value: "Property", label: isRtl ? "مرتبط بمشروع" : "Related to a project" },
      { value: "Standalone", label: isRtl ? "مستقل" : "Independent" },
    ],
    [allLabel, isRtl]
  );

  const typeOptions = useMemo<FilterOption[]>(() => {
    const seen = new Set<string>();
    const options: FilterOption[] = [];
    for (const item of mappedUnits) {
      const value = item.unitType || item.listing.typeEn;
      if (!value || seen.has(value)) continue;
      seen.add(value);
      options.push({ value, label: item.listing.typeAr || label(value) || value });
    }
    options.sort((a, b) => a.label.localeCompare(b.label, locale));
    return [{ value: ALL_SEARCH, label: allLabel }, ...options];
  }, [mappedUnits, label, locale, allLabel]);

  const cityOptions = useMemo<FilterOption[]>(() => {
    const usedIds = new Set(mappedUnits.map((item) => item.cityId).filter(Boolean));
    const options = cities
      .filter((city) => usedIds.has(city.id))
      .map((city) => ({ value: city.id, label: named(city, locale) }))
      .filter((item) => item.label)
      .sort((a, b) => a.label.localeCompare(b.label, locale));
    return [{ value: ALL_SEARCH, label: allLabel }, ...options];
  }, [mappedUnits, cities, locale, allLabel]);

  const neighborhoodOptions = useMemo<FilterOption[]>(() => {
    const relevant = mappedUnits.filter((item) => (values.city === ALL_SEARCH ? true : item.cityId === values.city));
    const used = new Map<string, { cityId: string; neighborhoodId: string }>();
    relevant.forEach((item) => {
      if (!item.neighborhoodId) return;
      used.set(`${item.cityId}:${item.neighborhoodId}`, {
        cityId: item.cityId,
        neighborhoodId: item.neighborhoodId,
      });
    });

    const citiesById = new Map(cities.map((city) => [city.id, city]));
    const options = Array.from(used.values())
      .map((item) => {
        const city = citiesById.get(item.cityId);
        const area = neighborhoodName(city, item.neighborhoodId, locale);
        if (!area) return null;
        const cityName = named(city, locale);
        const needsCity = values.city === ALL_SEARCH && cityName;
        return {
          value: `${item.cityId}:${item.neighborhoodId}`,
          label: needsCity ? `${area} - ${cityName}` : area,
        };
      })
      .filter((item): item is FilterOption => Boolean(item))
      .sort((a, b) => a.label.localeCompare(b.label, locale));

    return [{ value: ALL_SEARCH, label: allLabel }, ...options];
  }, [mappedUnits, cities, values.city, locale, allLabel]);

  useEffect(() => {
    if (isPending || !onUnitsPage) return;
    const next: Partial<UnitSearchValues> = {};
    if (values.relation !== ALL_SEARCH && !relationOptions.some((option) => option.value === values.relation)) {
      next.relation = ALL_SEARCH;
    }
    if (values.type !== ALL_SEARCH && !typeOptions.some((option) => option.value === values.type)) {
      next.type = ALL_SEARCH;
    }
    if (values.city !== ALL_SEARCH && !cityOptions.some((option) => option.value === values.city)) {
      next.city = ALL_SEARCH;
      next.neighborhood = ALL_SEARCH;
    }
    if (
      values.neighborhood !== ALL_SEARCH &&
      !neighborhoodOptions.some((option) => option.value === values.neighborhood)
    ) {
      next.neighborhood = ALL_SEARCH;
    }
    if (Object.keys(next).length) {
      router.replace(unitSearchHref(next, searchParams), { scroll: false });
    }
  }, [
    isPending,
    onUnitsPage,
    values.relation,
    values.type,
    values.city,
    values.neighborhood,
    relationOptions,
    typeOptions,
    cityOptions,
    neighborhoodOptions,
    router,
    searchParams,
  ]);

  const updateValue = (key: keyof UnitSearchValues, value: string) => {
    const extras = key === "city" ? { neighborhood: ALL_SEARCH } : {};
    if (onUnitsPage) {
      router.replace(unitSearchHref({ [key]: value, ...extras }, searchParams), { scroll: false });
      return;
    }
    setLocalValues((current) => ({ ...current, [key]: value, ...extras }));
  };

  const hasActiveFilters = Object.values(values).some((value) => value !== ALL_SEARCH);

  const clearFilters = () => {
    const cleared: UnitSearchValues = {
      relation: ALL_SEARCH,
      type: ALL_SEARCH,
      city: ALL_SEARCH,
      neighborhood: ALL_SEARCH,
    };
    if (onUnitsPage) {
      router.replace(unitSearchHref(cleared), { scroll: false });
      return;
    }
    setLocalValues(cleared);
  };

  const submitSearch = () => {
    if (onUnitsPage) {
      document.getElementById("units-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push(unitSearchHref(values));
  };

  return (
    <form
      className="mt-4 flex w-full max-w-[1150px] flex-col items-stretch gap-6 sm:flex-row sm:items-end sm:gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        submitSearch();
      }}
    >
      <SelectField
        label={isRtl ? "الارتباط بعقار" : "Property Relation"}
        value={values.relation}
        onChange={(value) => updateValue("relation", value)}
        options={relationOptions}
        tone={tone}
      />
      <SelectField
        label={isRtl ? "نوع الوحدة" : "Unit Type"}
        value={values.type}
        onChange={(value) => updateValue("type", value)}
        options={typeOptions}
        tone={tone}
      />
      <SelectField
        label={isRtl ? "المدينة" : "City"}
        value={values.city}
        onChange={(value) => updateValue("city", value)}
        options={cityOptions}
        tone={tone}
      />
      <SelectField
        label={isRtl ? "الحي" : "Neighborhood"}
        value={values.neighborhood}
        onChange={(value) => updateValue("neighborhood", value)}
        options={neighborhoodOptions}
        tone={tone}
      />

      <div className="mt-6 flex w-full flex-shrink-0 items-center gap-3 pb-1 sm:mt-0 sm:w-auto sm:items-end sm:ms-6">
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className={cn(
              "group flex h-14 flex-1 items-center justify-center rounded-full px-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:px-5 active:scale-[0.98] sm:flex-none",
              tone === "dark"
                ? "bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/15"
                : "bg-white text-red-500 ring-1 ring-red-200 hover:bg-red-50"
            )}
            aria-label={isRtl ? "مسح الفلاتر" : "Clear Filters"}
          >
            <span className="me-2.5 overflow-hidden text-sm font-medium tracking-wide whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:me-0 sm:max-w-0 sm:opacity-0 sm:group-hover:me-2.5 sm:group-hover:max-w-[5.5rem] sm:group-hover:opacity-100">
              {isRtl ? "مسح الفلاتر" : "Clear"}
            </span>
            <X className="h-6 w-6 shrink-0" strokeWidth={2} />
          </button>
        ) : null}
        <button
          type="submit"
          className={cn(
            "group flex h-14 flex-1 items-center justify-center rounded-full px-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:px-5 active:scale-[0.98] sm:flex-none sm:w-auto",
            tone === "dark"
              ? "bg-white text-[#0a0f1d] hover:bg-white"
              : "bg-[#17C3B3] text-white hover:bg-[#14b0a1]"
          )}
          aria-label={t("search.search")}
        >
          <span className="me-2.5 overflow-hidden text-sm font-medium tracking-wide whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:me-0 sm:max-w-0 sm:opacity-0 sm:group-hover:me-2.5 sm:group-hover:max-w-[4.5rem] sm:group-hover:opacity-100">
            {t("search.search")}
          </span>
          <Search className="h-6 w-6 shrink-0" strokeWidth={2} />
        </button>
      </div>
    </form>
  );
}

export function UnitSearchBar({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <Suspense fallback={<SearchBarFallback tone={tone} />}>
      <UnitSearchBarInner tone={tone} />
    </Suspense>
  );
}
