"use client";

import React, { useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Layers, MapPin, ChevronRight, ChevronLeft, Building2 } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { allProperties } from "@/features/properties/data/listings";
import useEmblaCarousel from "embla-carousel-react";

// Display more properties to allow scrolling
const fakeBuyersAr = ["أحمد الفهد", "محمد السعود", "خالد الراشد", "سارة العبدالله", "عبدالرحمن الماجد", "نورة الدوسري", "فيصل السالم", "فهد التميمي"];
const fakeBuyersEn = ["Ahmed Al-Fahad", "Mohammed Al-Saud", "Khalid Al-Rashed", "Sarah Al-Abdullah", "Abdulrahman Al-Majed", "Noura Al-Dawsari", "Faisal Al-Salem", "Fahad Al-Tamimi"];

const featuredProjects = allProperties.slice(0, 8).map((p, i) => ({
  ...p,
  tag: "SOLD OUT" as const,
  buyerAr: p.buyerAr || fakeBuyersAr[i % fakeBuyersAr.length],
  buyerEn: p.buyerEn || fakeBuyersEn[i % fakeBuyersEn.length]
}));

export function CurrentPropertiesSection() {
  const { t, isRtl } = useLocale();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    direction: isRtl ? "rtl" : "ltr",
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Ensure embla updates direction on language toggle
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit({ direction: isRtl ? "rtl" : "ltr" });
    }
  }, [emblaApi, isRtl]);

  return (
    <section className="relative z-30 w-full bg-white px-6 py-24 md:px-12 lg:px-20">
      <div className="mx-auto max-w-[1400px]">
        
        {/* Section Header */}
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

        {/* Carousel Wrapper */}
        <div className="relative w-full group">
          {/* Navigation Arrows (Appear on Hover of the carousel wrapper) */}
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

          {/* Carousel Viewport */}
          <div className="overflow-hidden" ref={emblaRef} dir={isRtl ? "rtl" : "ltr"}>
          {/* Carousel Container */}
          <div className="flex backface-hidden touch-pan-y -ml-4 rtl:-ml-0 rtl:-mr-4">
            {featuredProjects.map((project) => (
              <div key={project.id} className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4 rtl:pl-0 rtl:pr-4 py-2">
                <Link href={`/properties/${project.id}`} className="group/link flex h-full cursor-pointer select-none flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                  
                  {/* Image Section */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover/link:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover/link:opacity-0" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    
                    {/* Top Badge */}
                    <div className="absolute top-4 start-4 z-10 flex flex-row-reverse items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-sm font-bold text-[#3E1854] shadow-sm backdrop-blur-md">
                      <Layers className="h-4 w-4" />
                      <span>{isRtl ? project.typeAr : project.type}</span>
                    </div>

                    {/* Text on Image (Bottom) */}
                    <div className="absolute bottom-5 start-5 z-10 flex flex-col items-start text-start text-white">
                      <h3 className="text-3xl font-bold tracking-tight">
                        {isRtl ? project.titleAr : project.title}
                      </h3>
                      <p className="mt-1 text-base font-medium text-white/90">
                        {isRtl ? `${project.addressAr.split('،')[0]} | الرياض` : `${project.address.split(',')[0]} | Riyadh`}
                      </p>
                    </div>
                  </div>

                  {/* Card Body Section */}
                  <div className="flex flex-col p-5">
                    {/* First Row: Title/Location and Badges */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col items-start gap-1">
                        <h4 className="text-xl font-bold text-[#0a0f1d]">
                          {isRtl ? project.titleAr : project.title}
                        </h4>
                        <p className="text-sm font-medium text-[#8c8c8c]">
                          {isRtl ? `${project.addressAr.split('،')[0]}، الرياض` : `${project.address.split(',')[0]}, Riyadh`}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                          {isRtl ? "بدأ البيع" : "Now Selling"}
                        </div>
                        <div className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-bold text-gray-600">
                          {isRtl ? project.addressAr.split('，')[0] : project.address.split(',')[0]}
                        </div>
                      </div>
                    </div>

                    <hr className="my-5 border-gray-100" />

                    {/* Second Row: Stats and Price */}
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-6 text-sm font-bold text-[#0a0f1d]">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#8c8c8c]">{isRtl ? "الوحدات:" : "Units:"}</span>
                          <span>30</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#8c8c8c]">{isRtl ? "مباع:" : "Sold:"}</span>
                          <span>53%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm font-bold text-[#0a0f1d]">
                        <span className="text-[#8c8c8c]">{isRtl ? "السعر:" : "Price:"}</span>
                        <span>{project.price.replace('$', '')} {isRtl ? "ريال" : "SAR"}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
