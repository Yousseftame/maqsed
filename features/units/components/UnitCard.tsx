"use client";

import Link from "next/link";
import { Building2, ArrowUpRight } from "lucide-react";
import type { UnitListing } from "@/features/units/data/units";
import { MostViewedBadge } from "@/features/analytics/MostViewedBadge";
import { isMostViewed } from "@/features/analytics/most-viewed";
import { UnitDiscountBadge } from "@/features/units/UnitDiscountBadge";
import { getActiveUnitDiscount } from "@/features/units/unit-discount";
import { useNow } from "@/features/units/useNow";
import { OptimizedCoverImage } from "@/components/media/OptimizedCoverImage";

function formatArea(value: number, isRtl: boolean) {
  const amount = value.toLocaleString(undefined, { maximumFractionDigits: 1 });
  return isRtl ? `${amount} م²` : `${amount} sqm`;
}

function affiliationText(unit: UnitListing, isRtl: boolean) {
  if (isRtl) return unit.affiliationAr || "";
  return unit.affiliationEn || "";
}

function unitHref(unit: UnitListing) {
  if (unit.slug) return `/units/${encodeURIComponent(unit.slug)}`;
  return `/units/${unit.pathId || unit.id}`;
}

function UnitCover({ src, alt }: { src: string; alt: string }) {
  return (
    <OptimizedCoverImage
      src={src}
      alt={alt}
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="transition-transform duration-700 group-hover:scale-105"
    />
  );
}

interface UnitCardProps {
  unit: UnitListing;
  isRtl: boolean;
  projectName?: string;
  variant?: "default" | "compact";
}

export function UnitCard({ unit, isRtl, projectName, variant = "default" }: UnitCardProps) {
  const now = useNow();
  const discount = getActiveUnitDiscount(
    {
      price: unit.priceValue ?? (Number(String(unit.price || "").replace(/,/g, "")) || 0),
      discountActive: unit.discountActive,
      discountPercentage: unit.discountPercentage,
      discountDays: unit.discountDays,
      discountStartedAt: unit.discountStartedAt,
    },
    now
  );
  const currency = isRtl ? "ر.س" : "SAR";
  const saleLabel = discount
    ? discount.salePrice.toLocaleString("en-US", { maximumFractionDigits: 0 })
    : unit.price;
  const originalLabel = discount
    ? discount.originalPrice.toLocaleString("en-US", { maximumFractionDigits: 0 })
    : "";
  const showMostViewed = isMostViewed(unit.views);

  if (variant === "compact") {
    return (
      <Link
        href={unitHref(unit)}
        className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:border-[#17C3B3] hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1 block h-full overflow-hidden"
      >
        <div className="relative h-32 w-full sm:h-40">
          <UnitCover src={unit.gallery[0] || ""} alt={`Unit ${unit.id}`} />
          <div className="absolute inset-0 bg-black/5 transition-colors duration-300 group-hover:bg-black/0" />
          {(discount || showMostViewed) ? (
            <div className="absolute top-3 end-3 z-10 flex flex-col items-end gap-1.5">
              {discount ? (
                <UnitDiscountBadge
                  percent={discount.percent}
                  daysLeft={discount.daysLeft}
                  isRtl={isRtl}
                  variant="overlay"
                  className="px-2.5 py-1 text-[10px]"
                />
              ) : null}
              {showMostViewed ? <MostViewedBadge views={unit.views} size="sm" /> : null}
            </div>
          ) : null}
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
          
          {affiliationText(unit, isRtl) ? (
            <p className="mb-2 text-xs font-bold tracking-wide text-[#6A2B92]">
              {affiliationText(unit, isRtl)}
            </p>
          ) : projectName ? (
            <p className="mb-2 text-xs font-bold tracking-wide text-[#17C3B3] bg-[#17C3B3]/10 inline-block px-2 py-1 rounded-md">
              {isRtl ? `مشروع: ${projectName}` : `Project: ${projectName}`}
            </p>
          ) : null}

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

          <div className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-gray-500">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#17C3B3]" />
              <span>
                {isRtl ? "المساحة:" : "Area:"} {formatArea(unit.sqft, isRtl)}
              </span>
            </div>
            {unit.internalArea || unit.externalArea ? (
              <span className="text-[11px] font-medium text-gray-400">
                {isRtl ? "داخلية" : "Internal"} {formatArea(unit.internalArea || 0, isRtl)}
                <span className="mx-1">|</span>
                {isRtl ? "خارجية" : "External"} {formatArea(unit.externalArea || 0, isRtl)}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center justify-between border-t-2 border-gray-100 pt-5 transition-colors group-hover:border-gray-200">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-400 mb-0.5">
              {isRtl ? "السعر" : "Price"}
            </span>
            {discount ? (
              <div className="flex flex-col items-start">
                <span className="text-[11px] font-semibold text-gray-400 line-through decoration-gray-400">
                  {originalLabel} {currency}
                </span>
                <span className="text-lg font-black text-[#6A2B92]">
                  {saleLabel} <span className="text-xs font-bold text-gray-400">{currency}</span>
                </span>
              </div>
            ) : (
              <span className="text-lg font-black text-[#6A2B92]">
                {unit.price} <span className="text-xs font-bold text-gray-400">{currency}</span>
              </span>
            )}
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
      href={unitHref(unit)}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-200">
        <UnitCover src={unit.gallery[0] || ""} alt={`Unit ${unit.id}`} />
        
        {/* Top Badges */}
        <div className="absolute top-4 start-4 z-10">
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-sm backdrop-blur-md ${unit.statusEn === "Sold" ? "bg-red-500/90" : "bg-[#17C3B3]/90"}`}>
            <span>{isRtl ? unit.statusAr : unit.statusEn}</span>
          </div>
        </div>
        {(discount || showMostViewed) ? (
          <div className="absolute top-4 end-4 z-10 flex flex-col items-end gap-2">
            {discount ? (
              <UnitDiscountBadge
                percent={discount.percent}
                daysLeft={discount.daysLeft}
                isRtl={isRtl}
                variant="overlay"
              />
            ) : null}
            {showMostViewed ? <MostViewedBadge views={unit.views} /> : null}
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 text-start">
        {/* Type and Owner */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm font-medium text-[#8c8c8c]">
            <Building2 className="h-4 w-4" />
            <span>{isRtl ? unit.typeAr : unit.typeEn}</span>
          </div>
          {unit.statusEn === "Sold" && (unit.buyerEn || unit.buyerAr) && (
            <span className="text-xs font-bold tracking-wide text-red-600">
              {isRtl ? `المالك: ${unit.buyerAr}` : `Owned by: ${unit.buyerEn}`}
            </span>
          )}
        </div>

        {/* Title and Location */}
        <div className="mb-4 flex flex-col">
          <h3 className="mb-1 text-2xl font-bold text-[#0a0f1d]">
            {isRtl ? "وحدة رقم" : "Unit"} {unit.id}
          </h3>
          <p className="text-sm font-medium text-[#8c8c8c]">
            {isRtl ? unit.locationAr : unit.locationEn}
          </p>
          {affiliationText(unit, isRtl) ? (
            <p className="mt-1.5 text-xs font-bold text-[#6A2B92]">
              {affiliationText(unit, isRtl)}
            </p>
          ) : null}
        </div>

        <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-gray-500">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#17C3B3]" />
            <span>
              {isRtl ? "المساحة:" : "Area:"} {formatArea(unit.sqft, isRtl)}
            </span>
          </div>
          {unit.internalArea || unit.externalArea ? (
            <span className="text-[11px] font-medium text-gray-400">
              {isRtl ? "داخلية" : "Internal"} {formatArea(unit.internalArea || 0, isRtl)}
              <span className="mx-1">|</span>
              {isRtl ? "خارجية" : "External"} {formatArea(unit.externalArea || 0, isRtl)}
            </span>
          ) : null}
        </div>

        <div className="mt-auto pt-5">
        <hr className="mb-5 border-gray-100" />

        {/* Price and Action */}
        <div className="flex items-center justify-between gap-3 text-sm font-bold">
          <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[#0a0f1d]">
            <span className="text-[#8c8c8c]">{isRtl ? "السعر:" : "Price:"}</span>
            {discount ? (
              <>
                <span className="text-xs font-semibold text-gray-400 line-through decoration-gray-400">
                  {originalLabel}
                </span>
                <span className="whitespace-nowrap">
                  {saleLabel} {isRtl ? "ريال" : "SAR"}
                </span>
              </>
            ) : (
              <span className="whitespace-nowrap">
                {unit.price} {isRtl ? "ريال" : "SAR"}
              </span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1.5 text-[#0a0f1d] transition-colors group-hover:text-[#6A2B92]">
            {!isRtl && <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
            <span>{isRtl ? "التفاصيل" : "Details"}</span>
            {isRtl && <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />}
          </div>
        </div>
        </div>
      </div>
    </Link>
  );
}
