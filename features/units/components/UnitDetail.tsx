"use client";

import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, LayoutGrid, CheckCircle2, Home, Share2, Printer, Building2 } from "lucide-react";
import type { UnitListing } from "@/features/units/data/units";
import { getPropertyById } from "@/features/properties/data/listings";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useState } from "react";
import { Lightbox } from "@/components/ui/Lightbox";

type UnitDetailProps = {
  unit: UnitListing;
};

export function UnitDetail({ unit }: UnitDetailProps) {
  const { isRtl } = useLocale();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mainImage, topImage, bottomImage] = unit.gallery;
  const property = unit.propertyId ? getPropertyById(unit.propertyId) : undefined;

  return (
    <div className="w-full bg-white">
      {lightboxIndex !== null && (
        <Lightbox 
          images={unit.gallery} 
          initialIndex={lightboxIndex} 
          onClose={() => setLightboxIndex(null)} 
        />
      )}

      {/* Breadcrumbs */}
      <div className="w-full px-6 pt-8 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <nav className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Link href="/" className="transition-colors hover:text-[#6A2B92]">{isRtl ? "الرئيسية" : "Home"}</Link>
            <span className="text-gray-300">/</span>
            <Link href="/#properties" className="transition-colors hover:text-[#6A2B92]">{isRtl ? "العقارات" : "Properties"}</Link>
            <span className="text-gray-300">/</span>
            <span className="font-bold text-[#0a0f1d]">{isRtl ? "الوحدات" : "Units"}</span>
            <span className="text-gray-300">/</span>
            <span className="font-bold text-[#0a0f1d]">{isRtl ? "وحدة رقم" : "Unit"} {unit.id}</span>
          </nav>
        </div>
      </div>

      {/* Gallery */}
      <section className="w-full px-6 pt-6 pb-12 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
          <div 
            className="relative min-h-[320px] overflow-hidden rounded-3xl md:col-span-8 md:min-h-[520px] lg:min-h-[560px] cursor-pointer group"
            onClick={() => setLightboxIndex(0)}
          >
            <Image
              src={mainImage}
              alt={unit.id}
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 65vw"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
          </div>

          <div className="flex flex-col gap-4 md:col-span-4 md:gap-5">
            <div 
              className="relative min-h-[200px] flex-1 overflow-hidden rounded-3xl md:min-h-0 cursor-pointer group"
              onClick={() => setLightboxIndex(1)}
            >
              <Image
                src={topImage}
                alt={`${unit.id} interior`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 35vw"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
            </div>
            <div 
              className="relative min-h-[200px] flex-1 overflow-hidden rounded-3xl md:min-h-0 cursor-pointer group"
              onClick={() => setLightboxIndex(2)}
            >
              <Image
                src={bottomImage}
                alt={`${unit.id} living space`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 35vw"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="w-full px-6 pb-20 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left Column */}
          <div className="lg:col-span-7">
            {/* Top Chips Row */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold tracking-wide ${
                unit.statusEn === "Available" ? "bg-green-100/80 text-green-800" :
                unit.statusEn === "Sold" ? "bg-red-100/80 text-red-800" : "bg-amber-100/80 text-amber-800"
              }`}>
                {isRtl ? unit.statusAr : unit.statusEn}
              </span>
              <span className="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-sm font-bold tracking-wide text-[#6A2B92]">
                <Home className="h-4 w-4" />
                {isRtl ? unit.typeAr : unit.typeEn}
              </span>
              
              <div className="flex-1" />
              
              <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold tracking-wide text-[#6A2B92] transition-colors hover:bg-gray-50">
                <Share2 className="h-4 w-4" />
                {isRtl ? "مشاركة" : "Share"}
              </button>
              
              <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold tracking-wide text-[#6A2B92] transition-colors hover:bg-gray-50">
                <Printer className="h-4 w-4" />
                {isRtl ? "طباعة" : "Print"}
              </button>
            </div>

            {property && (
              <Link href={`/properties/${property.id}`} className="mt-4 inline-flex group/link items-center justify-between gap-3 rounded-xl bg-[#6A2B92]/10 border border-[#6A2B92]/20 px-4 py-3 transition-colors hover:bg-[#6A2B92]/20 w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-[#6A2B92]" />
                  <span className="text-sm font-bold text-[#6A2B92]">
                    {isRtl ? `جزء من مشروع: ${property.titleAr}` : `Part of Project: ${property.title}`}
                  </span>
                </div>
              </Link>
            )}

            <div className="mb-6 flex flex-col items-start gap-3">
              <h1 className="text-4xl font-bold tracking-tight whitespace-normal text-[#0a0f1d] sm:text-5xl md:whitespace-nowrap lg:text-[3.75rem] lg:leading-[1.15]">
                {isRtl ? "وحدة رقم" : "Unit"} {unit.id}
              </h1>
              {unit.statusEn === "Sold" && (unit.buyerEn || unit.buyerAr) && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-2">
                  <span className="text-lg font-bold text-red-600">
                    {isRtl ? `تم البيع للمالك: ${unit.buyerAr}` : `Sold to: ${unit.buyerEn}`}
                  </span>
                </div>
              )}
            </div>

            <div className="mb-12 max-w-2xl text-base leading-[1.75] font-medium text-[#8c8c8c] sm:text-lg sm:leading-[1.8]">
              <p>{isRtl ? unit.descriptionAr : unit.descriptionEn}</p>
            </div>

            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-[#6A2B92]">
                {isRtl ? "نظرة عامة" : "Unit Overview"}
              </h2>
              <div className="mb-8 flex flex-wrap items-center gap-x-10 gap-y-4 text-[#0a0f1d]">
                <div className="flex items-center gap-3">
                  <Bed className="h-6 w-6 stroke-[1.75] text-[#17C3B3]" />
                  <span className="text-base font-semibold sm:text-lg">
                    {unit.beds} {isRtl ? "غرف نوم" : "Bedrooms"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Bath className="h-6 w-6 stroke-[1.75] text-[#17C3B3]" />
                  <span className="text-base font-semibold sm:text-lg">
                    {unit.baths} {isRtl ? "حمامات" : "Bathrooms"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <LayoutGrid className="h-6 w-6 stroke-[1.75] text-[#17C3B3]" />
                  <span className="text-base font-semibold sm:text-lg">
                    {unit.sqft} {isRtl ? "متر مربع" : "sq ft"}
                  </span>
                </div>
              </div>

              {/* Unit Features */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { ar: "نظام منزل ذكي", en: "Smart Home System" },
                  { ar: "شرفة خاصة", en: "Private Balcony" },
                  { ar: "مطبخ مجهز بالكامل", en: "Fully Equipped Kitchen" },
                  { ar: "خزائن حائط", en: "Built-in Wardrobes" },
                  { ar: "إطلالة مميزة", en: "Premium View" },
                  { ar: "عزل صوتي", en: "Sound Insulation" },
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#17C3B3] stroke-[2]" />
                    <span className="text-base font-medium text-[#8c8c8c]">{isRtl ? feature.ar : feature.en}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floor Plan (Mock) */}
            <div>
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-[#6A2B92]">
                {isRtl ? "المخطط الهندسي" : "Floor Plan"}
              </h2>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center">
                 <div className="text-center text-gray-400">
                    <LayoutGrid className="mx-auto h-16 w-16 mb-4 opacity-50" />
                    <p className="font-medium">{isRtl ? "المخطط الهندسي غير متوفر حالياً" : "Floor plan not currently available"}</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="lg:col-span-5">
            <div className="flex flex-col gap-5 lg:sticky lg:top-24">
              <div className="rounded-3xl border border-gray-200 p-6 sm:p-8">
                <p className="mb-2 text-base font-medium text-[#8c8c8c] sm:text-lg">
                  {isRtl ? "السعر" : "Price"}
                </p>
                <p className="mb-6 text-4xl font-bold tracking-tight text-[#0a0f1d] sm:text-5xl lg:text-[3.5rem]">
                  {unit.price} <span className="text-lg font-bold text-gray-400">{isRtl ? "ر.س" : "SAR"}</span>
                </p>
                <button
                  type="button"
                  className="w-full rounded-xl bg-[#17C3B3] px-6 py-4 text-base font-semibold tracking-wide text-white transition-colors duration-200 hover:opacity-90"
                >
                  {isRtl ? "تقديم عرض" : "Submit an Offer"}
                </button>
              </div>

              <div className="rounded-3xl border border-gray-200 p-6 sm:p-8">
                <h3 className="mb-5 text-xl font-bold tracking-tight text-[#6A2B92] sm:text-2xl">
                  {isRtl ? "هل تفكر في الشراء؟" : "Thinking of buying?"}
                </h3>



                <button
                  type="button"
                  className="mb-6 w-full rounded-xl border-2 border-[#17C3B3]/35 bg-white px-4 py-3.5 text-base font-semibold text-[#17C3B3] transition-colors duration-200 hover:border-[#17C3B3] hover:bg-gray-50"
                >
                  {isRtl ? "حدد موعد للزيارة" : "Schedule a Visit"}
                </button>

                <div className="mb-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-gray-300" />
                  <span className="text-sm font-semibold tracking-wide text-[#8c8c8c] sm:text-base">
                    {isRtl ? "أو أكمل" : "or continue"}
                  </span>
                  <div className="h-px flex-1 bg-gray-300" />
                </div>

                <button
                  type="button"
                  className="w-full rounded-xl bg-[#6A2B92] px-4 py-3.5 text-base font-semibold text-white transition-colors duration-200 hover:opacity-90"
                >
                  {isRtl ? "احصل على البرشور" : "Get the Brochure"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
