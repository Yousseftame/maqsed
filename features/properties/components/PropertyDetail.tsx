"use client";

import Image from "next/image";
import { Bed, Bath, LayoutGrid, MapPin, CheckCircle2, Car, Clock, Handshake, Share2, Home, ArrowUpRight, ArrowUpLeft } from "lucide-react";
import type { PropertyListing } from "@/features/properties/data/listings";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useState } from "react";
import { Lightbox } from "@/components/ui/Lightbox";
import Link from "next/link";
import { getUnitsByPropertyId } from "@/features/units/data/units";
import { UnitCard } from "@/features/units/components/UnitCard";

type PropertyDetailProps = {
  property: PropertyListing;
};

export function PropertyDetail({ property }: PropertyDetailProps) {
  const { isRtl } = useLocale();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mainImage, topImage, bottomImage] = property.gallery;
  const addressLines = (isRtl ? property.addressAr : property.address).split("\n");

  return (
    <div className="w-full bg-white">
      {lightboxIndex !== null && (
        <Lightbox 
          images={property.gallery} 
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
            <Link href="/properties" className="transition-colors hover:text-[#6A2B92]">{isRtl ? "المشاريع" : "Projects"}</Link>
            <span className="text-gray-300">/</span>
            <span className="font-bold text-[#6A2B92]">{isRtl ? property.titleAr : property.title}</span>
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
              alt={property.title}
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
                alt={`${property.title} interior 1`}
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
                alt={`${property.title} interior 2`}
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
          {/* Left — still the larger column */}
          <div className="lg:col-span-7">
            {/* Top Chips Row */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 rounded-full bg-green-100/80 px-4 py-2 text-sm font-bold tracking-wide text-green-800">
                {isRtl ? "بدأ البيع" : "Started Selling"}
              </span>
              <span className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold tracking-wide text-gray-600">
                {isRtl ? "مميز" : "Featured"}
              </span>
              <span className="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-sm font-bold tracking-wide text-[#6A2B92]">
                <Home className="h-4 w-4" />
                {isRtl ? property.typeAr : property.type}
              </span>
              
              <div className="flex-1" /> {/* Spacer */}
              
              <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold tracking-wide text-[#6A2B92] transition-colors hover:bg-gray-50">
                <Share2 className="h-4 w-4" />
                {isRtl ? "مشاركة" : "Share"}
              </button>
              
              <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold tracking-wide text-[#6A2B92] transition-colors hover:bg-gray-50">
                {isRtl ? "عرض الوحدات" : "View Units"}
                {isRtl ? <ArrowUpLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
              </button>
            </div>

            <div className="mb-6 flex flex-col items-start gap-3">
              <h1 className="text-4xl font-bold tracking-tight whitespace-normal text-[#0a0f1d] sm:text-5xl md:whitespace-nowrap lg:text-[3.75rem] lg:leading-[1.15]">
                {isRtl ? property.titleAr : property.title}
              </h1>
              {property.tag === "SOLD OUT" && (property.buyerEn || property.buyerAr) && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-2">
                  <span className="text-lg font-bold text-red-600">
                    {isRtl ? `تم البيع للمالك: ${property.buyerAr}` : `Sold to: ${property.buyerEn}`}
                  </span>
                </div>
              )}
            </div>

            <div className="mb-12 max-w-2xl text-base leading-[1.75] font-medium text-[#8c8c8c] sm:text-lg sm:leading-[1.8]">
              <p>{isRtl ? property.descriptionAr : property.description}</p>
              <br />
              <p>{isRtl ? property.descriptionSecondaryAr : property.descriptionSecondary}</p>
            </div>

            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-[#6A2B92]">
                {isRtl ? "نظرة عامة" : "Property Overview"}
              </h2>
              <div className="mb-8 flex flex-wrap items-center gap-x-10 gap-y-4 text-[#0a0f1d]">
                <div className="flex items-center gap-3">
                  <Bed className="h-6 w-6 stroke-[1.75] text-[#17C3B3]" />
                  <span className="text-base font-semibold sm:text-lg">
                    {property.beds} {isRtl ? "غرف نوم" : "Bedrooms"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Bath className="h-6 w-6 stroke-[1.75] text-[#17C3B3]" />
                  <span className="text-base font-semibold sm:text-lg">
                    {property.baths} {isRtl ? "حمامات" : "Bathrooms"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <LayoutGrid className="h-6 w-6 stroke-[1.75] text-[#17C3B3]" />
                  <span className="text-base font-semibold sm:text-lg">
                    {property.sqft} {isRtl ? "متر مربع" : "sq ft"}
                  </span>
                </div>
              </div>

              {/* Property Features */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(isRtl ? property.featuresAr : property.features).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#17C3B3] stroke-[2]" />
                    <span className="text-base font-medium text-[#8c8c8c]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Units */}
            <div className="mb-16">
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-[#6A2B92]">
                {isRtl ? "الوحدات" : "Units"}
              </h2>
              <p className="mb-8 text-base font-medium text-[#8c8c8c]">
                {isRtl ? "وحدات المشروع" : "Project Units"}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {getUnitsByPropertyId(property.id).length > 0 ? (
                  getUnitsByPropertyId(property.id).map((unit) => (
                    <UnitCard key={unit.id} unit={unit} isRtl={isRtl} variant="compact" />
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center text-gray-500">
                    {isRtl ? "لا توجد وحدات متاحة حالياً." : "No units currently available."}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-[#6A2B92]">
                {isRtl ? "الموقع" : "Location"}
              </h2>
              <div className="mb-6 flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-red-500" />
                <p className="max-w-sm text-base leading-relaxed font-medium whitespace-pre-line text-[#8c8c8c]">
                  {addressLines.join(",\n")}
                </p>
              </div>
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
                <Image
                  src="/properites/map.avif"
                  alt={`Map location for ${property.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </div>
            </div>

            {/* Nearby Places */}
            <div className="mb-16">
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-[#6A2B92]">
                {isRtl ? "الأماكن القريبة" : "Nearby Places"}
              </h2>
              <p className="mb-6 text-base font-medium text-[#8c8c8c]">
                {isRtl ? "على بُعد دقائق" : "Just minutes away"}
              </p>
              
              <div className="ms-2.5 mt-6 border-s-2 border-gray-100 py-2 space-y-6">
                {[
                  { nameAr: "المطار", nameEn: "Airport", time: "10" },
                  { nameAr: "النخيل مول", nameEn: "Al Nakheel Mall", time: "13" },
                  { nameAr: "جامعة الإمام", nameEn: "Imam University", time: "13" },
                  { nameAr: "المركز المالي", nameEn: "Financial District", time: "7" },
                  { nameAr: "مستشفى الحمادي", nameEn: "Al Hammadi Hospital", time: "5" },
                ].map((place, idx) => (
                  <div key={idx} className="relative flex items-center group">
                    {/* Timeline Dot */}
                    <div className="absolute -start-[9px] top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-[3.5px] border-white bg-gray-200 transition-colors duration-300 group-hover:bg-[#17C3B3] group-hover:scale-125" />
                    
                    {/* Content Card */}
                    <div className="ms-8 flex flex-1 items-center justify-between rounded-2xl bg-white p-4 sm:p-5 shadow-[0_2px_15px_-5px_rgba(0,0,0,0.05)] border border-gray-50 transition-all duration-300 hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.12)] hover:-translate-y-1">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-[#17C3B3] transition-colors group-hover:bg-[#17C3B3] group-hover:text-white">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <span className="text-base font-bold text-[#6A2B92] sm:text-lg">
                          {isRtl ? place.nameAr : place.nameEn}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-gray-500 transition-colors group-hover:bg-gray-100">
                        <Car className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-sm font-bold sm:text-base">
                          {place.time} {isRtl ? "دقائق" : "mins"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Partners */}
            <div>
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#17C3B3]">
                  <Handshake className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-[#6A2B92]">
                    {isRtl ? "شركاء النجاح" : "Success Partners"}
                  </h2>
                  <p className="text-sm font-medium text-[#8c8c8c]">
                    {isRtl ? "شركاؤنا في هذا المشروع" : "Our partners in this project"}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-8 md:gap-12 rounded-3xl border border-gray-200 p-8 sm:p-10">
                <Image src="/masakn.svg" alt="Partner" width={140} height={60} className="h-10 w-auto opacity-70 transition-opacity hover:opacity-100" />
                <Image src="/lbab.svg" alt="Partner" width={140} height={60} className="h-10 w-auto opacity-70 transition-opacity hover:opacity-100" />
                <Image src="/1779208393076_P25.svg" alt="Partner" width={140} height={60} className="h-10 w-auto opacity-70 transition-opacity hover:opacity-100" />
              </div>
            </div>
          </div>

          {/* Right sidebar — wider than 1/3, still smaller than left */}
          <aside className="lg:col-span-5">
            <div className="flex flex-col gap-5 lg:sticky lg:top-24">
              <div className="rounded-3xl border border-gray-200 p-6 sm:p-8">
                <p className="mb-2 text-base font-medium text-[#8c8c8c] sm:text-lg">
                  {isRtl ? "السعر" : "Price"}
                </p>
                <p className="mb-6 text-4xl font-bold tracking-tight text-[#0a0f1d] sm:text-5xl lg:text-[3.5rem]">
                  {property.price}
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
