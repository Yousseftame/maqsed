"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Map, ChevronDown, Filter, X, Clock, Building2, ArrowUpRight } from "lucide-react";
import { allProperties } from "@/features/properties/data/listings";
import { useLocale } from "@/components/providers/LocaleProvider";

const FilterDropdown = ({ label, value, options, onChange }: any) => {
  return (
    <div className="flex min-w-[150px] flex-1 flex-col border-b-2 pb-3 border-[#8c8c8c]">
      <label className="mb-6 text-base font-medium tracking-wide whitespace-nowrap text-gray-500">
        {label}
      </label>
      <div className="relative w-full">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none bg-transparent ps-3 pe-10 text-lg font-semibold focus:outline-none sm:text-xl text-[#6A2B92]"
        >
          {options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute top-1/2 end-3 h-4 w-4 flex-shrink-0 -translate-y-1/2 text-[#6A2B92]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

export function PropertiesListing() {
  const { t, isRtl } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number>(0);

  // Filters State
  const [saleStatus, setSaleStatus] = useState("All");
  const [unitType, setUnitType] = useState("All");
  const [city, setCity] = useState("All");
  const [neighborhood, setNeighborhood] = useState("All");

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

  const filteredProperties = allProperties.filter((prop) => {
    if (saleStatus !== "All" && prop.tag !== saleStatus) return false;
    
    if (unitType !== "All") {
      if (unitType === "Apartments" && prop.type !== "Luxury Apartment") return false;
      if (unitType === "Villas" && prop.type !== "Modern Vila" && prop.type !== "Family House") return false;
    }
    
    if (city !== "All" && !prop.address.includes(city)) return false;
    if (neighborhood !== "All" && !prop.address.includes(neighborhood)) return false;
    
    return true;
  });

  const clearFilters = () => {
    setSaleStatus("All");
    setUnitType("All");
    setCity("All");
    setNeighborhood("All");
  };

  const getTagLabel = (prop: any) => {
    return isRtl ? prop.tagAr : prop.tag;
  };

  return (
    <section
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
        
        {/* Filter Bar */}
        <div className="mb-14 flex flex-col gap-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#6A2B92]">
              <Filter className="h-5 w-5" />
              <h2 className="text-2xl font-bold tracking-tight">
                {isRtl ? "تصفية العقارات" : "Filter Properties"}
              </h2>
            </div>
            
            {(saleStatus !== "All" || unitType !== "All" || city !== "All" || neighborhood !== "All") && (
              <button 
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
                {isRtl ? "مسح الفلاتر" : "Clear Filters"}
              </button>
            )}
          </div>
          
          <div className="flex w-full flex-col items-stretch gap-8 sm:flex-row sm:items-end sm:gap-6">
            <FilterDropdown 
              label={isRtl ? "حالة البيع" : "Sales Status"}
              value={saleStatus}
              onChange={setSaleStatus}
              options={[
                { value: "All", label: isRtl ? "الكل" : "All" },
                { value: "FOR SALE", label: isRtl ? "للبيع" : "For Sale" },
                { value: "COMING SOON", label: isRtl ? "قريباً" : "Coming Soon" },
                { value: "SOLD OUT", label: isRtl ? "نفدت الوحدات" : "Sold Out" },
              ]}
            />
            
            <FilterDropdown 
              label={isRtl ? "نوع الوحدة" : "Unit Type"}
              value={unitType}
              onChange={setUnitType}
              options={[
                { value: "All", label: isRtl ? "الكل" : "All" },
                { value: "Apartments", label: isRtl ? "شقق" : "Apartments" },
                { value: "Villas", label: isRtl ? "فلل" : "Villas" },
              ]}
            />

            <FilterDropdown 
              label={isRtl ? "المدينة" : "City"}
              value={city}
              onChange={setCity}
              options={[
                { value: "All", label: isRtl ? "الكل" : "All" },
                { value: "Riyadh", label: isRtl ? "الرياض" : "Riyadh" },
              ]}
            />

            <FilterDropdown 
              label={isRtl ? "الحي" : "Neighborhood"}
              value={neighborhood}
              onChange={setNeighborhood}
              options={[
                { value: "All", label: isRtl ? "الكل" : "All" },
                { value: "Al Qirawan", label: isRtl ? "القيروان" : "Al Qirawan" },
                { value: "Al Malqa", label: isRtl ? "الملقا" : "Al Malqa" },
                { value: "An Narjis", label: isRtl ? "النرجس" : "An Narjis" },
                { value: "Al Yasmin", label: isRtl ? "الياسمين" : "Al Yasmin" },
                { value: "Hittin", label: isRtl ? "حطين" : "Hittin" },
              ]}
            />
          </div>
        </div>

        {/* Results Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((prop) => (
              <Link
                key={prop.id}
                href={`/properties/${prop.id}`}
                className="group flex cursor-pointer flex-col"
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
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-200">
                  <Image
                    src={prop.image}
                    alt={prop.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                  
                  {/* Top Badge */}
                  <div className={`absolute top-4 start-4 z-10 flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-1.5 text-sm font-medium text-white shadow-sm backdrop-blur-md ${prop.tag === "SOLD OUT" ? "bg-red-500/80" : "bg-black/40"}`}>
                    {prop.tag !== "SOLD OUT" && <Clock className="h-4 w-4" />}
                    <span>{getTagLabel(prop)}</span>
                  </div>
                </div>

                <div className="flex flex-col p-5 text-start">
                  {/* Type Badge */}
                  <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-[#8c8c8c]">
                    <Building2 className="h-4 w-4" />
                    <span>{isRtl ? prop.typeAr : prop.type}</span>
                  </div>

                  <div className="mb-3 flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-2xl font-bold text-[#0a0f1d]">
                        {isRtl ? prop.titleAr : prop.title}
                      </h3>
                      <span className="text-lg font-bold text-[#6A2B92]">{prop.price}</span>
                    </div>
                    <p className="text-sm font-medium text-[#8c8c8c]">
                      {isRtl ? `${prop.addressAr.split('،')[0]} - الرياض` : `${prop.address.split(',')[0]} - Riyadh`}
                    </p>
                  </div>

                  <p className="text-sm leading-relaxed text-[#8c8c8c] line-clamp-2">
                    {isRtl 
                      ? "مشروع جديد قيد الإعداد - سجل اهتمامك لتكون أول من يعرف عند الإطلاق." 
                      : "New project in preparation - register your interest to be the first to know upon launch."}
                  </p>

                  <hr className="my-5 border-gray-100" />

                  <div className="flex items-center justify-between text-sm font-bold">
                    <div className="text-[#8c8c8c]">
                      {isRtl ? "يتاح للحجز قريباً" : "Available for booking soon"}
                    </div>
                    <div className="flex items-center gap-1.5 text-[#0a0f1d] transition-colors group-hover:text-[#6A2B92]">
                      {!isRtl && <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
                      <span>{isRtl ? "اكتشف المزيد" : "Discover More"}</span>
                      {isRtl && <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Filter className="h-16 w-16 text-gray-200 mb-4" />
            <h3 className="text-2xl font-bold text-[#6A2B92] mb-2">
              {isRtl ? "لا توجد عقارات مطابقة" : "No properties found"}
            </h3>
            <p className="text-gray-500">
              {isRtl ? "حاول تغيير إعدادات الفلتر للبحث عن عقارات أخرى" : "Try adjusting your filters to see more properties."}
            </p>
            <button
              onClick={clearFilters}
              className="mt-6 rounded-full bg-[#17C3B3] px-8 py-3 font-bold text-white transition-all hover:opacity-90 hover:scale-105"
            >
              {isRtl ? "مسح الفلاتر" : "Clear Filters"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
