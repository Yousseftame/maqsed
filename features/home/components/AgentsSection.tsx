"use client";

import { useEffect, useMemo } from "react";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { ArrowUpRight } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { useLocale } from "@/components/providers/LocaleProvider";
import { UnitCard } from "@/features/units/components/UnitCard";
import { unitsService, type Unit } from "@/features/admin/units/units.service";
import { propertiesService, type Property } from "@/features/admin/projects/properties.service";
import { citiesService } from "@/features/admin/cities/cities.service";
import type { City } from "@/features/admin/cities/data";
import { useMenuOptions } from "@/features/admin/menus/useMenuOptions";
import { mapPublicUnits } from "@/features/units/mapPublicUnits";

const HOME_UNITS_LIMIT = 8;

function CardSkeleton() {
  return (
    <div className="min-w-0 flex-[0_0_100%] ps-6 sm:flex-[0_0_50%] lg:flex-[0_0_25%]">
      <div className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
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
    </div>
  );
}

export function AgentsSection() {
  const { t, locale, isRtl } = useLocale();
  const { label } = useMenuOptions();
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: true,
      direction: isRtl ? "rtl" : "ltr",
    },
    [
      AutoScroll({
        playOnInit: true,
        speed: 1,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

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
    () => mapPublicUnits(units, properties, cities, locale, isRtl, label).slice(0, HOME_UNITS_LIMIT),
    [units, properties, cities, locale, isRtl, label]
  );

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit({
      loop: mappedUnits.length > 4,
      align: "start",
      dragFree: true,
      direction: isRtl ? "rtl" : "ltr",
    });
  }, [emblaApi, isRtl, mappedUnits.length, isPending]);

  return (
    <section className="relative z-30 w-full overflow-hidden bg-white px-6 pt-12 pb-8 md:px-12 md:pt-16 md:pb-10 lg:px-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16 flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="group mb-8 inline-flex cursor-default items-center gap-2 rounded-full border border-gray-200 px-3.5 py-1.5 transition-colors duration-300 hover:bg-[#6A2B92]">
              <div className="h-3 w-3 flex-shrink-0 rounded-full bg-[#6A2B92] transition-colors duration-300 group-hover:bg-white" />
              <span className="text-sm font-medium tracking-wide text-[#6A2B92] transition-colors duration-300 group-hover:text-white">
                {t("agents.pill")}
              </span>
            </div>
            <h2 className="flex flex-col items-start text-5xl leading-tight font-bold tracking-tight text-[#6A2B92] sm:text-6xl lg:text-6xl">
              <DiaTextReveal
                key={`agents-1-${locale}`}
                text={t("agents.titleLine1")}
                textColor="#6A2B92"
                colors={["#6A2B92"]}
              />
              <DiaTextReveal
                key={`agents-2-${locale}`}
                text={t("agents.titleLine2")}
                textColor="#6A2B92"
                colors={["#6A2B92"]}
              />
            </h2>
          </div>

          <div className="max-w-lg">
            <p className="text-lg leading-snug font-semibold tracking-normal text-[#8c8c8c]">
              {t("agents.description")}
            </p>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ms-6 py-4">
            {isPending ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : unitsFailed || mappedUnits.length === 0 ? (
              <div className="flex w-full items-center justify-center py-16 ps-6">
                <p className="text-sm font-medium text-[#8c8c8c]">
                  {isRtl ? "لا توجد وحدات متاحة حالياً" : "No units to show yet"}
                </p>
              </div>
            ) : (
              mappedUnits.map(({ listing, projectName }) => (
                <div
                  key={listing.pathId || listing.id}
                  className="min-w-0 flex-[0_0_100%] ps-6 sm:flex-[0_0_50%] lg:flex-[0_0_25%]"
                >
                  <div className="h-full">
                    <UnitCard
                      unit={listing}
                      isRtl={isRtl}
                      projectName={projectName || undefined}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            href="/units"
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#17C3B3] px-6 py-3.5 text-sm font-medium tracking-wide text-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white hover:text-[#17C3B3] hover:ring-1 hover:ring-[#17C3B3]/15 active:scale-[0.98]"
          >
            {t("agents.seeAll")}
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
