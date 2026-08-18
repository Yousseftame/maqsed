"use client";

import { useEffect } from "react";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { MapPin, Key, ArrowUpRight } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

const units = [
  {
    id: 1,
    name: "Amberwood Homestead",
    type: "Family House · Ready to Reserve",
    location: "Vancouver, Canada",
    status: "Priority Booking Open",
    image: "/properites/1.webp",
  },
  {
    id: 2,
    name: "Aurora Tower",
    type: "Luxury Apartment · Limited Units",
    location: "Dubai, UAE",
    status: "Reserve from Phase 2",
    image: "/properites/2.webp",
  },
  {
    id: 3,
    name: "Azure Bay Villa",
    type: "Modern Villa · Exclusive Release",
    location: "Santorini, Greece",
    status: "Private Reservation",
    image: "/properites/3.webp",
  },
  {
    id: 4,
    name: "Urban Skyline Penthouse",
    type: "Penthouse · High Demand",
    location: "New York, USA",
    status: "Book a Viewing Slot",
    image: "/properites/4.avif",
  },
  {
    id: 5,
    name: "Golden Horizon Estate",
    type: "Family Estate · Now Available",
    location: "Los Angeles, USA",
    status: "Reserve This Unit",
    image: "/properites/5.avif",
  },
  {
    id: 6,
    name: "Minimalist Zen Retreat",
    type: "Boutique Residence · Soft Launch",
    location: "Kyoto, Japan",
    status: "Early Booking Open",
    image: "/properites/6.webp",
  },
];

export function AgentsSection() {
  const { t, locale, isRtl } = useLocale();
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

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit({ direction: isRtl ? "rtl" : "ltr" });
  }, [emblaApi, isRtl]);

  return (
    <section className="relative z-30 w-full overflow-hidden bg-white px-6 py-24 md:px-12 lg:px-20">
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
          <div className="flex -ms-6">
            {units.map((unit) => (
              <div
                key={unit.id}
                className="min-w-0 flex-[0_0_100%] ps-6 sm:flex-[0_0_50%] lg:flex-[0_0_25%]"
              >
                <div className="group flex cursor-pointer flex-col">
                  <div className="relative mb-6 aspect-[4/5] w-full overflow-hidden rounded-2xl">
                    <Image
                      src={unit.image}
                      alt={unit.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="mb-3 flex items-start justify-between">
                    <h4 className="pe-2 text-2xl font-bold text-[#0a0f1d]">
                      {unit.name}
                    </h4>
                  </div>

                  <p className="mb-5 text-base font-medium text-[#8c8c8c]">
                    {unit.type}
                  </p>

                  <div className="mb-8 flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-[#0a0f1d]">
                      <MapPin className="h-6 w-6 stroke-[2.5] text-[#17C3B3]" />
                      <span className="text-base font-semibold">
                        {unit.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[#0a0f1d]">
                      <Key className="h-6 w-6 stroke-[2.5] text-[#17C3B3]" />
                      <span className="text-base font-semibold">
                        {unit.status}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full rounded-xl border border-gray-300 py-4 text-lg font-extrabold text-[#6A2B92] transition-colors duration-300 group-hover:border-[#17C3B3] group-hover:bg-[#17C3B3] group-hover:text-white"
                  >
                    {t("agents.reserveUnit")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <button
            type="button"
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#17C3B3] px-6 py-3.5 text-sm font-medium tracking-wide text-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white hover:text-[#17C3B3] hover:ring-1 hover:ring-[#17C3B3]/15 active:scale-[0.98]"
          >
            {t("agents.seeAll")}
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5"
              strokeWidth={2}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
