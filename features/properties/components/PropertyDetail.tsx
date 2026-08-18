"use client";

import Image from "next/image";
import { Bed, Bath, LayoutGrid, MapPin, CheckCircle2, Car, Clock, Handshake, Share2, Home, ArrowUpRight, ArrowUpLeft } from "lucide-react";
import type { PropertyListing } from "@/features/properties/data/listings";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useState } from "react";
import { Lightbox } from "@/components/ui/Lightbox";
import Link from "next/link";

type PropertyDetailProps = {
  property: PropertyListing;
};

export function PropertyDetail({ property }: PropertyDetailProps) {
  const { isRtl } = useLocale();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mainImage, topImage, bottomImage] = property.gallery;
  const addressLines = property.address.split("\n");

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
            <Link href="/" className="transition-colors hover:text-[#0a0f1d]">{isRtl ? "الرئيسية" : "Home"}</Link>
            <span className="text-gray-300">/</span>
            <Link href="/#properties" className="transition-colors hover:text-[#0a0f1d]">{isRtl ? "العقارات" : "Properties"}</Link>
            <span className="text-gray-300">/</span>
            <span className="font-bold text-[#0a0f1d]">{property.title}</span>
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
              <span className="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-sm font-bold tracking-wide text-[#0a0f1d]">
                <Home className="h-4 w-4" />
                {isRtl ? "أدوار" : "Floors"}
              </span>
              
              <div className="flex-1" /> {/* Spacer */}
              
              <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold tracking-wide text-[#0a0f1d] transition-colors hover:bg-gray-50">
                <Share2 className="h-4 w-4" />
                {isRtl ? "مشاركة" : "Share"}
              </button>
              
              <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold tracking-wide text-[#0a0f1d] transition-colors hover:bg-gray-50">
                {isRtl ? "عرض الوحدات" : "View Units"}
                {isRtl ? <ArrowUpLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
              </button>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight whitespace-normal text-[#0a0f1d] sm:text-5xl md:whitespace-nowrap lg:text-[3.75rem] lg:leading-[1.15]">
              {property.title}
            </h1>

            <div className="mb-12 max-w-2xl text-base leading-[1.75] font-medium text-[#8c8c8c] sm:text-lg sm:leading-[1.8]">
              <p>{property.description}</p>
            </div>

            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-[#0a0f1d]">
                {isRtl ? "نظرة عامة" : "Property Overview"}
              </h2>
              <div className="mb-8 flex flex-wrap items-center gap-x-10 gap-y-4 text-[#0a0f1d]">
                <div className="flex items-center gap-3">
                  <Bed className="h-6 w-6 stroke-[1.75]" />
                  <span className="text-base font-semibold sm:text-lg">
                    {property.beds} {isRtl ? "غرف نوم" : "Bedrooms"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Bath className="h-6 w-6 stroke-[1.75]" />
                  <span className="text-base font-semibold sm:text-lg">
                    {property.baths} {isRtl ? "حمامات" : "Bathrooms"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <LayoutGrid className="h-6 w-6 stroke-[1.75]" />
                  <span className="text-base font-semibold sm:text-lg">
                    {property.sqft} {isRtl ? "متر مربع" : "sq ft"}
                  </span>
                </div>
              </div>

              {/* Added Features */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { ar: "واجهات حجرية", en: "Stone Facades" },
                  { ar: "ممرات رخامية", en: "Marble Corridors" },
                  { ar: "تكسيات خشبية", en: "Wood Cladding" },
                  { ar: "كاميرات مراقبة", en: "Security Cameras" },
                  { ar: "مواقف خاصة", en: "Private Parking" },
                  { ar: "مصاعد", en: "Elevators" },
                  { ar: "تشجير خارجي", en: "Outdoor Landscaping" },
                  { ar: "دخول آمن", en: "Secure Access" },
                  { ar: "غرفة خادمة", en: "Maid Room" },
                  { ar: "تكييف مخفي", en: "Concealed AC" },
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#0a0f1d] stroke-[2]" />
                    <span className="text-base font-medium text-[#8c8c8c]">{isRtl ? feature.ar : feature.en}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-[#0a0f1d]">
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
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-[#0a0f1d]">
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
                    <div className="absolute -start-[9px] top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-[3.5px] border-white bg-gray-200 transition-colors duration-300 group-hover:bg-[#0a0f1d] group-hover:scale-125" />
                    
                    {/* Content Card */}
                    <div className="ms-8 flex flex-1 items-center justify-between rounded-2xl bg-white p-4 sm:p-5 shadow-[0_2px_15px_-5px_rgba(0,0,0,0.05)] border border-gray-50 transition-all duration-300 hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.12)] hover:-translate-y-1">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-[#0a0f1d] transition-colors group-hover:bg-[#0a0f1d] group-hover:text-white">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <span className="text-base font-bold text-[#0a0f1d] sm:text-lg">
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

            {/* Project Units */}
            <div className="mb-16">
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-[#0a0f1d]">
                {isRtl ? "الوحدات" : "Units"}
              </h2>
              <p className="mb-8 text-base font-medium text-[#8c8c8c]">
                {isRtl ? "وحدات المشروع" : "Project Units"}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { id: "A-101", typeAr: "شقة فاخرة", typeEn: "Luxury Apartment", beds: 3, baths: 3, sqft: 180, price: "1,200,000", statusAr: "متاح", statusEn: "Available" },
                  { id: "A-102", typeAr: "شقة", typeEn: "Apartment", beds: 2, baths: 2, sqft: 140, price: "950,000", statusAr: "مباع", statusEn: "Sold" },
                  { id: "B-201", typeAr: "بنتهاوس", typeEn: "Penthouse", beds: 4, baths: 5, sqft: 320, price: "2,800,000", statusAr: "متاح", statusEn: "Available" },
                  { id: "B-202", typeAr: "شقة", typeEn: "Apartment", beds: 3, baths: 4, sqft: 195, price: "1,450,000", statusAr: "محجوز", statusEn: "Reserved" },
                ].map((unit, idx) => (
                  <Link href={`/units/${unit.id}`} key={idx} className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 transition-all duration-300 hover:border-[#0a0f1d] hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1 block">
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-xl font-black tracking-tight text-[#0a0f1d]">{unit.id}</span>
                        <span className={`rounded-full px-3 py-1.5 text-xs font-bold tracking-wide ${
                          unit.statusEn === "Available" ? "bg-green-100 text-green-700" :
                          unit.statusEn === "Sold" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {isRtl ? unit.statusAr : unit.statusEn}
                        </span>
                      </div>
                      <p className="mb-6 text-sm font-semibold text-gray-500">{isRtl ? unit.typeAr : unit.typeEn}</p>
                      
                      <div className="mb-6 flex flex-wrap gap-4 text-sm font-semibold text-[#0a0f1d]">
                        <div className="flex items-center gap-1.5"><Bed className="h-4 w-4 text-gray-400 stroke-[2]"/> {unit.beds}</div>
                        <div className="flex items-center gap-1.5"><Bath className="h-4 w-4 text-gray-400 stroke-[2]"/> {unit.baths}</div>
                        <div className="flex items-center gap-1.5"><LayoutGrid className="h-4 w-4 text-gray-400 stroke-[2]"/> {unit.sqft} {isRtl ? "م²" : "sqm"}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border-t-2 border-gray-100 pt-5 transition-colors group-hover:border-gray-200">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-400 mb-0.5">{isRtl ? "السعر" : "Price"}</span>
                        <span className="text-lg font-black text-[#0a0f1d]">{unit.price} <span className="text-xs font-bold text-gray-400">{isRtl ? "ر.س" : "SAR"}</span></span>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-[#0a0f1d] transition-colors group-hover:bg-[#0a0f1d] group-hover:text-white">
                        <svg className={`h-5 w-5 ${isRtl ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Partners */}
            <div>
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0a0f1d]">
                  <Handshake className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-[#0a0f1d]">
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
                  className="w-full rounded-xl bg-[#0a0f1d] px-6 py-4 text-base font-semibold tracking-wide text-white transition-colors duration-200 hover:bg-[#161c2d]"
                >
                  {isRtl ? "تقديم عرض" : "Submit an Offer"}
                </button>
              </div>

              <div className="rounded-3xl border border-gray-200 p-6 sm:p-8">
                <h3 className="mb-5 text-xl font-bold tracking-tight text-[#0a0f1d] sm:text-2xl">
                  {isRtl ? "هل تفكر في الشراء؟" : "Thinking of buying?"}
                </h3>

                <div className="mb-3 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="rounded-xl bg-[#0a0f1d] px-4 py-3.5 text-base font-semibold text-white transition-colors duration-200 hover:bg-[#161c2d]"
                  >
                    {isRtl ? "جولة حضورية" : "Tour in Person"}
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-base font-semibold text-[#0a0f1d] transition-colors duration-200 hover:border-[#0a0f1d]"
                  >
                    {isRtl ? "جولة افتراضية" : "Virtual Tour"}
                  </button>
                </div>

                <button
                  type="button"
                  className="mb-6 w-full rounded-xl border-2 border-[#0a0f1d]/35 bg-white px-4 py-3.5 text-base font-semibold text-[#0a0f1d] transition-colors duration-200 hover:border-[#0a0f1d] hover:bg-gray-50"
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
                  className="w-full rounded-xl bg-[#0a0f1d] px-4 py-3.5 text-base font-semibold text-white transition-colors duration-200 hover:bg-[#161c2d]"
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
