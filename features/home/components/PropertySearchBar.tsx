"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";
import { propertiesService, type Property } from "@/features/admin/projects/properties.service";
import { citiesService } from "@/features/admin/cities/cities.service";
import { useMenuOptions } from "@/features/admin/menus/useMenuOptions";
import type { City } from "@/features/admin/cities/data";
import type { Locale } from "@/lib/i18n/types";
import {
  ALL_SEARCH,
  PROPERTIES_RESULTS_ID,
  isPublicProjectStatus,
  propertySearchHref,
  propertySearchResultsHref,
  readPropertySearch,
  type PropertySearchValues,
} from "@/features/properties/property-search";

type FilterOption = { value: string; label: string };

const EMPTY_SEARCH: PropertySearchValues = {
  status: ALL_SEARCH,
  type: ALL_SEARCH,
  city: ALL_SEARCH,
  neighborhood: ALL_SEARCH,
};

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

function usePropertySearchOptions(selectedCity: string) {
  const { locale, isRtl } = useLocale();
  const { label } = useMenuOptions();
  const allLabel = isRtl ? "الكل" : "All";

  const results = useQueries({
    queries: [
      { queryKey: ["properties"], queryFn: () => propertiesService.getProperties() },
      { queryKey: ["cities"], queryFn: () => citiesService.getCities() },
    ],
  });

  const properties = (results[0].data || []) as Property[];
  const cities = (results[1].data || []) as City[];
  const isPending = results.some((item) => item.isPending);

  const publicProjects = useMemo(
    () => properties.filter((property) => isPublicProjectStatus(property.status)),
    [properties]
  );

  const statusOptions = useMemo<FilterOption[]>(
    () => [
      { value: ALL_SEARCH, label: allLabel },
      { value: "active", label: isRtl ? "متاح" : "Available" },
      { value: "soon", label: isRtl ? "قريباً" : "Coming Soon" },
      { value: "soldOut", label: isRtl ? "نفدت الوحدات" : "Sold Out" },
    ],
    [allLabel, isRtl]
  );

  const typeOptions = useMemo<FilterOption[]>(() => {
    const unique = Array.from(
      new Set(publicProjects.map((property) => property.projectType?.trim()).filter(Boolean) as string[])
    );
    const options = unique
      .map((value) => ({ value, label: label(value) || value }))
      .sort((a, b) => a.label.localeCompare(b.label, locale));
    return [{ value: ALL_SEARCH, label: allLabel }, ...options];
  }, [publicProjects, allLabel, locale, label]);

  const cityOptions = useMemo<FilterOption[]>(() => {
    const usedIds = new Set(publicProjects.map((property) => property.cityId).filter(Boolean));
    const options = cities
      .filter((city) => usedIds.has(city.id))
      .map((city) => ({ value: city.id, label: named(city, locale) }))
      .filter((item) => item.label)
      .sort((a, b) => a.label.localeCompare(b.label, locale));
    return [{ value: ALL_SEARCH, label: allLabel }, ...options];
  }, [publicProjects, cities, locale, allLabel]);

  const neighborhoodOptions = useMemo<FilterOption[]>(() => {
    const relevant = publicProjects.filter((property) =>
      selectedCity === ALL_SEARCH ? true : property.cityId === selectedCity
    );
    const used = new Map<string, { cityId: string; neighborhoodId: string }>();
    relevant.forEach((property) => {
      if (!property.neighborhoodId) return;
      used.set(`${property.cityId}:${property.neighborhoodId}`, {
        cityId: property.cityId,
        neighborhoodId: property.neighborhoodId,
      });
    });

    const citiesById = new Map(cities.map((city) => [city.id, city]));
    const options = Array.from(used.values())
      .map((item) => {
        const city = citiesById.get(item.cityId);
        const area = neighborhoodName(city, item.neighborhoodId, locale);
        if (!area) return null;
        const cityName = named(city, locale);
        const needsCity = selectedCity === ALL_SEARCH && cityName;
        return {
          value: `${item.cityId}:${item.neighborhoodId}`,
          label: needsCity ? `${area} - ${cityName}` : area,
        };
      })
      .filter((item): item is FilterOption => Boolean(item))
      .sort((a, b) => a.label.localeCompare(b.label, locale));

    return [{ value: ALL_SEARCH, label: allLabel }, ...options];
  }, [publicProjects, cities, selectedCity, locale, allLabel]);

  return { statusOptions, typeOptions, cityOptions, neighborhoodOptions, isPending };
}

function sanitizeSearchValues(
  values: PropertySearchValues,
  typeOptions: FilterOption[],
  cityOptions: FilterOption[],
  neighborhoodOptions: FilterOption[]
): PropertySearchValues {
  const next = { ...values };
  if (next.type !== ALL_SEARCH && !typeOptions.some((option) => option.value === next.type)) {
    next.type = ALL_SEARCH;
  }
  if (next.city !== ALL_SEARCH && !cityOptions.some((option) => option.value === next.city)) {
    next.city = ALL_SEARCH;
    next.neighborhood = ALL_SEARCH;
  }
  if (
    next.neighborhood !== ALL_SEARCH &&
    !neighborhoodOptions.some((option) => option.value === next.neighborhood)
  ) {
    next.neighborhood = ALL_SEARCH;
  }
  return next;
}

function PropertySearchForm({
  tone,
  values,
  statusOptions,
  typeOptions,
  cityOptions,
  neighborhoodOptions,
  onChange,
  onClear,
  onSubmit,
}: {
  tone: "light" | "dark";
  values: PropertySearchValues;
  statusOptions: FilterOption[];
  typeOptions: FilterOption[];
  cityOptions: FilterOption[];
  neighborhoodOptions: FilterOption[];
  onChange: (key: keyof PropertySearchValues, value: string) => void;
  onClear: () => void;
  onSubmit: () => void;
}) {
  const { t, isRtl } = useLocale();
  const hasActiveFilters = Object.values(values).some((value) => value !== ALL_SEARCH);

  return (
    <form
      className="mt-4 flex w-full max-w-[1150px] flex-col items-stretch gap-6 sm:flex-row sm:items-end sm:gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <SelectField
        label={isRtl ? "حالة البيع" : "Sales Status"}
        value={values.status}
        onChange={(value) => onChange("status", value)}
        options={statusOptions}
        tone={tone}
      />
      <SelectField
        label={isRtl ? "نوع الوحدة" : "Unit Type"}
        value={values.type}
        onChange={(value) => onChange("type", value)}
        options={typeOptions}
        tone={tone}
      />
      <SelectField
        label={isRtl ? "المدينة" : "City"}
        value={values.city}
        onChange={(value) => onChange("city", value)}
        options={cityOptions}
        tone={tone}
      />
      <SelectField
        label={isRtl ? "الحي" : "Neighborhood"}
        value={values.neighborhood}
        onChange={(value) => onChange("neighborhood", value)}
        options={neighborhoodOptions}
        tone={tone}
      />

      <div className="mt-6 flex w-full flex-shrink-0 items-center gap-3 pb-1 sm:mt-0 sm:w-auto sm:items-end sm:ms-6">
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={onClear}
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

function PropertySearchBarLocal({ tone }: { tone: "light" | "dark" }) {
  const router = useRouter();
  const [values, setValues] = useState<PropertySearchValues>(EMPTY_SEARCH);
  const { statusOptions, typeOptions, cityOptions, neighborhoodOptions, isPending } =
    usePropertySearchOptions(values.city);

  useEffect(() => {
    if (isPending) return;
    setValues((current) => {
      const next = sanitizeSearchValues(current, typeOptions, cityOptions, neighborhoodOptions);
      return next === current ||
        (next.status === current.status &&
          next.type === current.type &&
          next.city === current.city &&
          next.neighborhood === current.neighborhood)
        ? current
        : next;
    });
  }, [isPending, typeOptions, cityOptions, neighborhoodOptions]);

  return (
    <PropertySearchForm
      tone={tone}
      values={values}
      statusOptions={statusOptions}
      typeOptions={typeOptions}
      cityOptions={cityOptions}
      neighborhoodOptions={neighborhoodOptions}
      onChange={(key, value) => {
        const extras = key === "city" ? { neighborhood: ALL_SEARCH } : {};
        setValues((current) => ({ ...current, [key]: value, ...extras }));
      }}
      onClear={() => setValues(EMPTY_SEARCH)}
      onSubmit={() => router.push(propertySearchResultsHref(values))}
    />
  );
}

function PropertySearchBarUrl({ tone }: { tone: "light" | "dark" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const values = readPropertySearch(searchParams);
  const { statusOptions, typeOptions, cityOptions, neighborhoodOptions, isPending } =
    usePropertySearchOptions(values.city);

  useEffect(() => {
    if (isPending) return;
    const next = sanitizeSearchValues(values, typeOptions, cityOptions, neighborhoodOptions);
    const changed =
      next.type !== values.type || next.city !== values.city || next.neighborhood !== values.neighborhood;
    if (!changed) return;
    router.replace(propertySearchHref(next, searchParams), { scroll: false });
  }, [
    isPending,
    values.type,
    values.city,
    values.neighborhood,
    typeOptions,
    cityOptions,
    neighborhoodOptions,
    router,
    searchParams,
  ]);

  return (
    <PropertySearchForm
      tone={tone}
      values={values}
      statusOptions={statusOptions}
      typeOptions={typeOptions}
      cityOptions={cityOptions}
      neighborhoodOptions={neighborhoodOptions}
      onChange={(key, value) => {
        const extras = key === "city" ? { neighborhood: ALL_SEARCH } : {};
        router.replace(propertySearchHref({ [key]: value, ...extras }, searchParams), { scroll: false });
      }}
      onClear={() => router.replace(propertySearchHref(EMPTY_SEARCH), { scroll: false })}
      onSubmit={() => {
        document.getElementById(PROPERTIES_RESULTS_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    />
  );
}

export function PropertySearchBar({ tone = "light" }: { tone?: "light" | "dark" }) {
  const pathname = usePathname().replace(/\/$/, "") || "/";

  if (pathname === "/properties") {
    return (
      <Suspense fallback={<SearchBarFallback tone={tone} />}>
        <PropertySearchBarUrl tone={tone} />
      </Suspense>
    );
  }

  return <PropertySearchBarLocal tone={tone} />;
}
