"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { allUnits } from "@/features/units/data/units";
import { getPropertyById } from "@/features/properties/data/listings";
import { UnitCard } from "./UnitCard";

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

export function UnitsListing() {
  const { isRtl } = useLocale();
  const [relationFilter, setRelationFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");

  const filteredUnits = allUnits.filter((unit) => {
    if (relationFilter !== "All" && unit.relation !== relationFilter) return false;
    if (typeFilter !== "All" && !unit.typeEn.includes(typeFilter)) return false;
    if (locationFilter !== "All" && !unit.locationEn.includes(locationFilter)) return false;
    return true;
  });

  const clearFilters = () => {
    setRelationFilter("All");
    setTypeFilter("All");
    setLocationFilter("All");
  };

  return (
    <section className="relative z-30 w-full bg-white px-6 py-16 md:px-12 lg:px-20 lg:py-20">
      <div className="mx-auto max-w-[1400px]">
        {/* Filter Bar */}
        <div className="mb-14 flex flex-col gap-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#6A2B92]">
              <Filter className="h-5 w-5" />
              <h2 className="text-2xl font-bold tracking-tight">
                {isRtl ? "تصفية الوحدات" : "Filter Units"}
              </h2>
            </div>
            
            { (relationFilter !== "All" || typeFilter !== "All" || locationFilter !== "All") && (
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
              label={isRtl ? "الارتباط بعقار" : "Property Relation"}
              value={relationFilter}
              onChange={setRelationFilter}
              options={[
                { value: "All", label: isRtl ? "الكل" : "All" },
                { value: "Property", label: isRtl ? "مرتبط بعقار" : "Related to Property" },
                { value: "Standalone", label: isRtl ? "مستقل" : "Standalone" },
              ]}
            />

            <FilterDropdown 
              label={isRtl ? "المدينة" : "Location"}
              value={locationFilter}
              onChange={setLocationFilter}
              options={[
                { value: "All", label: isRtl ? "الكل" : "All" },
                { value: "Riyadh", label: isRtl ? "الرياض" : "Riyadh" },
                { value: "Dubai", label: isRtl ? "دبي" : "Dubai" },
                { value: "New York", label: isRtl ? "نيويورك" : "New York" },
                { value: "Los Angeles", label: isRtl ? "لوس أنجلوس" : "Los Angeles" },
              ]}
            />

            <FilterDropdown 
              label={isRtl ? "نوع الوحدة" : "Unit Type"}
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                { value: "All", label: isRtl ? "الكل" : "All" },
                { value: "Apartment", label: isRtl ? "شقق" : "Apartment" },
                { value: "Villa", label: isRtl ? "فلل" : "Villa" },
                { value: "House", label: isRtl ? "منازل" : "House" },
                { value: "Penthouse", label: isRtl ? "بنتهاوس" : "Penthouse" },
              ]}
            />
          </div>
        </div>

        {/* Results Grid */}
        {filteredUnits.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredUnits.map((unit) => {
              const property = unit.propertyId ? getPropertyById(unit.propertyId) : undefined;
              return (
                <UnitCard 
                  key={unit.id} 
                  unit={unit} 
                  isRtl={isRtl} 
                  projectName={property ? (isRtl ? property.titleAr : property.title) : undefined} 
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Filter className="h-16 w-16 text-gray-200 mb-4" />
            <h3 className="text-2xl font-bold text-[#6A2B92] mb-2">
              {isRtl ? "لا توجد وحدات مطابقة" : "No units found"}
            </h3>
            <p className="text-gray-500">
              {isRtl ? "حاول تغيير إعدادات الفلتر للبحث عن وحدات أخرى" : "Try adjusting your filters to see more units."}
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
