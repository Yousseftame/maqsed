"use client";

import React, { useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Layers, MapPin, ChevronRight, ChevronLeft } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { allProperties } from "@/features/properties/data/listings";
import useEmblaCarousel from "embla-carousel-react";

// Display more properties to allow scrolling
const featuredProjects = allProperties.slice(0, 8);

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
              <div key={project.id} className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4 rtl:pl-0 rtl:pr-4">
                <div className="flex flex-col bg-white h-full select-none">
                  
                  {/* Image Container */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-5 group/card cursor-grab active:cursor-grabbing">
                    <div className="absolute inset-0 bg-gray-200">
                      {/* Primary Image */}
                      <Image 
                        src={project.image} 
                        alt={project.title} 
                        fill 
                        draggable={false}
                        className="object-cover transition-transform duration-700 group-hover/card:scale-105" 
                      />
                      {/* Secondary Image (Fades in on hover) */}
                      <Image 
                        src={project.gallery[1] || project.image} 
                        alt={`${project.title} secondary view`} 
                        fill 
                        draggable={false}
                        className="object-cover opacity-0 transition-all duration-700 group-hover/card:opacity-100 group-hover/card:scale-105" 
                      />
                    </div>
                    
                    {/* Badges Container */}
                    <div className="absolute top-4 start-4 flex items-center gap-2 z-10 pointer-events-none">
                      {/* Property Type Badge */}
                      <div className="bg-[#17C3B3] text-white px-3 py-1.5 rounded-[10px] font-bold text-sm shadow-md">
                        {project.type === "Luxury Apartment" ? (isRtl ? "شقق" : "Apartments") :
                         project.type === "Modern Vila" || project.type === "Modern Villa" ? (isRtl ? "فلل" : "Villas") :
                         project.type === "Family House" ? (isRtl ? "أدوار" : "Floors") :
                         project.type}
                      </div>
                      
                      {/* Property Tier Badge */}
                      <div className="bg-white/95 backdrop-blur-md text-[#6A2B92] px-3 py-1.5 rounded-[10px] font-bold text-sm shadow-md">
                        {project.id % 3 === 0 
                          ? (isRtl ? "فاخرة" : "Luxury")
                          : project.id % 3 === 1 
                            ? (isRtl ? "اقتصادية" : "Economy") 
                            : (isRtl ? "متوسطة" : "Standard")}
                      </div>
                    </div>
                  </div>

                  {/* Features Row */}
                  <div className="flex items-center justify-between text-gray-500 text-sm font-medium px-1 mb-5">
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5 stroke-[1.5] text-[#17C3B3]" />
                      <span>{project.beds} {t("properties.bed")}</span>
                    </div>
                    <div className="w-[1px] h-4 bg-gray-200" />
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5 stroke-[1.5] text-[#17C3B3]" />
                      <span>{project.baths} {t("properties.bath")}</span>
                    </div>
                    <div className="w-[1px] h-4 bg-gray-200" />
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 stroke-[1.5] text-[#17C3B3]" />
                      <span>{project.sqft} {t("properties.sqft")}</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <hr className="border-gray-200 mb-6" />

                  {/* Bottom details */}
                  <div className="flex items-end justify-between gap-4 px-1 pb-4">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-bold text-[#0a0f1d]">{project.title}</h3>
                      <div className="flex items-start gap-1.5 text-gray-500 text-sm">
                        <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="whitespace-pre-line leading-relaxed">{project.address}</span>
                      </div>
                    </div>
                    
                    <Link 
                      href={`/properties/${project.id}`}
                      className="bg-[#17C3B3] text-white text-sm font-bold px-6 py-2.5 rounded-[18px] whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white hover:text-[#17C3B3] hover:ring-1 hover:ring-[#17C3B3]/15 active:scale-[0.98]"
                      draggable={false}
                    >
                      {t("properties.view")} {t("properties.details")}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
