import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, LayoutGrid, MapPin } from "lucide-react";
import type { UnitListing } from "@/features/units/data/units";

interface UnitCardProps {
  unit: UnitListing;
  isRtl: boolean;
  projectName?: string;
  variant?: "default" | "compact";
}

export function UnitCard({ unit, isRtl, projectName, variant = "default" }: UnitCardProps) {
  if (variant === "compact") {
    return (
      <Link
        href={`/units/${unit.id}`}
        className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:border-[#17C3B3] hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1 block h-full overflow-hidden"
      >
        <div className="relative h-32 w-full sm:h-40">
          <Image
            src={unit.gallery[0]}
            alt={`Unit ${unit.id}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-black/5 transition-colors duration-300 group-hover:bg-black/0" />
        </div>

        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xl font-black tracking-tight text-[#6A2B92]">{unit.id}</span>
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-bold tracking-wide ${
                unit.statusEn === "Available"
                  ? "bg-green-100 text-green-700"
                  : unit.statusEn === "Sold"
                  ? "bg-red-500 text-white"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {isRtl ? unit.statusAr : unit.statusEn}
            </span>
          </div>
          
          {projectName && (
            <p className="mb-2 text-xs font-bold tracking-wide text-[#17C3B3] bg-[#17C3B3]/10 inline-block px-2 py-1 rounded-md">
              {isRtl ? `مشروع: ${projectName}` : `Project: ${projectName}`}
            </p>
          )}

          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-500">
              {isRtl ? unit.typeAr : unit.typeEn}
            </p>
            {unit.statusEn === "Sold" && (unit.buyerEn || unit.buyerAr) && (
              <p className="text-xs font-bold tracking-wide text-red-600">
                {isRtl ? `المالك: ${unit.buyerAr}` : `Owned by: ${unit.buyerEn}`}
              </p>
            )}
          </div>

          <div className="mb-6 flex flex-wrap gap-4 text-sm font-semibold text-[#6A2B92]">
            <div className="flex items-center gap-1.5">
              <Bed className="h-4 w-4 text-gray-400 stroke-[2]" /> {unit.beds}
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-gray-400 stroke-[2]" /> {unit.baths}
            </div>
            <div className="flex items-center gap-1.5">
              <LayoutGrid className="h-4 w-4 text-gray-400 stroke-[2]" /> {unit.sqft} {isRtl ? "م²" : "sqm"}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t-2 border-gray-100 pt-5 transition-colors group-hover:border-gray-200">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-400 mb-0.5">
              {isRtl ? "السعر" : "Price"}
            </span>
            <span className="text-lg font-black text-[#6A2B92]">
              {unit.price} <span className="text-xs font-bold text-gray-400">{isRtl ? "ر.س" : "SAR"}</span>
            </span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-[#17C3B3] transition-colors group-hover:bg-[#17C3B3] group-hover:text-white">
            <svg
              className={`h-5 w-5 ${isRtl ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/units/${unit.id}`}
      className="group flex cursor-pointer flex-col h-full"
    >
      <div className="relative mb-6 aspect-[4/5] w-full overflow-hidden rounded-2xl">
        <Image
          src={unit.gallery[0]}
          alt={`Unit ${unit.id}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
        <div className="absolute top-4 start-4 end-4 z-10 flex flex-wrap gap-2 items-start pointer-events-none">
          {projectName && (
            <div className="flex items-center justify-center rounded-full bg-[#6A2B92] px-4 py-2.5 text-[14px] leading-none font-bold tracking-tight text-white shadow-md max-w-full">
              <span className="truncate">{projectName}</span>
            </div>
          )}
          <div className={`flex items-center justify-center rounded-full px-4 py-2.5 text-[14px] leading-none font-bold tracking-tight text-white shadow-md whitespace-nowrap ${unit.statusEn === "Sold" ? "bg-red-500" : "bg-[#17C3B3]"}`}>
            {isRtl ? unit.statusAr : unit.statusEn}
          </div>
        </div>
      </div>

      <div className="mb-2 flex flex-col items-start gap-1">
        <h4 className="text-2xl font-bold text-[#0a0f1d]">
          {isRtl ? "وحدة رقم" : "Unit"} {unit.id}
        </h4>
      </div>

      <div className="mb-5 flex items-center justify-between w-full">
        <p className="text-base font-medium text-[#8c8c8c]">
          {isRtl ? unit.typeAr : unit.typeEn}
        </p>
        {unit.statusEn === "Sold" && (unit.buyerEn || unit.buyerAr) && (
          <p className="text-sm font-bold tracking-wide text-red-600">
            {isRtl ? `المالك: ${unit.buyerAr}` : `Owned by: ${unit.buyerEn}`}
          </p>
        )}
      </div>

      <div className="mb-8 flex flex-col gap-4">
        <div className="flex items-center gap-3 text-[#0a0f1d]">
          <MapPin className="h-6 w-6 stroke-[2.5] text-[#17C3B3]" />
          <span className="text-base font-semibold">
            {isRtl ? unit.locationAr : unit.locationEn}
          </span>
        </div>
        
        <div className="flex items-center gap-5 text-[#0a0f1d] mt-2">
          <div className="flex items-center gap-2">
            <Bed className="h-5 w-5 stroke-[2.5] text-[#17C3B3]" />
            <span className="text-base font-semibold">{unit.beds}</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="h-5 w-5 stroke-[2.5] text-[#17C3B3]" />
            <span className="text-base font-semibold">{unit.baths}</span>
          </div>
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 stroke-[2.5] text-[#17C3B3]" />
            <span className="text-base font-semibold">{unit.sqft} {isRtl ? "م²" : "sqm"}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 flex flex-col gap-4">
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-sm font-semibold text-gray-500">{isRtl ? "السعر" : "Price"}</span>
          <span className="text-2xl font-black text-[#0a0f1d]">
            {unit.price} <span className="text-sm font-bold text-gray-500 ms-1">{isRtl ? "ر.س" : "SAR"}</span>
          </span>
        </div>
        <button
          type="button"
          className="w-full rounded-xl border border-gray-300 py-4 text-lg font-extrabold text-[#6A2B92] transition-colors duration-300 group-hover:border-[#17C3B3] group-hover:bg-[#17C3B3] group-hover:text-white"
        >
          {isRtl ? "عرض التفاصيل" : "View Details"}
        </button>
      </div>
    </Link>
  );
}
