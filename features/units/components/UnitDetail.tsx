"use client";

import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, LayoutGrid, CheckCircle2, Home, Share2, Printer, Building2, Heart, Calendar, ArrowUpRight, ArrowUpLeft, ChevronLeft, ChevronRight, Car, Sofa, Coffee, Maximize, User, Headset } from "lucide-react";
import type { UnitListing } from "@/features/units/data/units";
import { getPropertyById } from "@/features/properties/data/listings";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useState } from "react";
import { Lightbox } from "@/components/ui/Lightbox";
import { cn } from "@/lib/utils";
import { SalesContactModal } from "./SalesContactModal";

type UnitDetailProps = {
  unit: UnitListing;
};

export function UnitDetail({ unit }: UnitDetailProps) {
  const { isRtl } = useLocale();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const property = unit.propertyId ? getPropertyById(unit.propertyId) : undefined;

  const nextImage = () => {
    setCurrentImageIdx((prev) => (prev + 1) % unit.gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIdx((prev) => (prev - 1 + unit.gallery.length) % unit.gallery.length);
  };

  const address = property 
    ? (isRtl ? property.addressAr : property.address).split("\n")[0]
    : (isRtl ? unit.locationAr : unit.locationEn);
    
  const isSold = unit.statusEn === "Sold";

  return (
    <div className="w-full bg-[#fcfcfc] pb-24">
      {lightboxIndex !== null && (
        <Lightbox 
          images={unit.gallery} 
          initialIndex={lightboxIndex} 
          onClose={() => setLightboxIndex(null)} 
        />
      )}
      
      <SalesContactModal 
        isOpen={isSalesModalOpen} 
        onClose={() => setIsSalesModalOpen(false)} 
        unitId={unit.id} 
        projectName={property ? (isRtl ? property.titleAr : property.title) : undefined} 
      />

      {/* Top Header Section */}
      <section className="w-full px-6 pt-12 pb-8 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          
          {/* Right Side (Title & Subtitle) - First in DOM appears on right in RTL */}
          <div className="flex flex-col items-start text-start">
            <nav className="mb-2 flex items-center gap-1 text-xs font-semibold text-gray-400">
              <Link href="/" className="hover:text-[#6A2B92]">{isRtl ? "الرئيسية" : "Home"}</Link>
              <span>/</span>
              <Link href="/properties" className="hover:text-[#6A2B92]">{isRtl ? "المشاريع" : "Projects"}</Link>
              {property && (
                <>
                  <span>/</span>
                  <Link href={`/properties/${property.id}`} className="hover:text-[#6A2B92]">
                    {isRtl ? property.titleAr : property.title}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-gray-600">
                 {property ? (isRtl ? property.titleAr : property.title) : ""} - {unit.id}
              </span>
            </nav>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#2e2e2e] tracking-tight mb-2">
              {property ? (isRtl ? property.titleAr : property.title) : (isRtl ? unit.typeAr : unit.typeEn)} - {unit.id}
            </h1>
            <p className="text-lg font-medium text-gray-500 mb-2">
              {address}،
            </p>
          </div>

          {/* Left Side (Badges & Buttons) - Second in DOM appears on left in RTL */}
          <div className="flex flex-col items-start lg:items-end gap-4">
            <div className="flex flex-wrap items-center gap-2 flex-row-reverse">
              <span className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700">
                <Home className="h-3.5 w-3.5" />
                {isRtl ? "دور" : "Floor"}
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600">
                {isRtl ? "الدور الأرضي" : "Ground Floor"}
              </span>
              <span className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border",
                isSold ? "bg-red-50 text-red-500 border-red-100" :
                unit.statusEn === "Available" ? "bg-green-100/60 text-green-700 border-green-200" :
                "bg-yellow-100/60 text-yellow-700 border-yellow-200"
              )}>
                {isRtl ? unit.statusAr : unit.statusEn}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xl font-bold text-gray-700 mt-2">
                {isRtl ? "السعر —" : "Price —"} 
                {!isSold && <span className="text-[#6A2B92] font-black ms-2" dir="ltr">{unit.price}</span>}
              </p>
            </div>

            {property && (
              <Link href={`/properties/${property.id}`} className="mt-2 flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#6A2B92]">
                {isRtl ? <ArrowUpLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                {isRtl ? "العودة للمشروع" : "Back to Project"}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="w-full px-6 pb-12 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="relative aspect-[16/7] w-full overflow-hidden rounded-3xl bg-gray-200 group">
            {unit.gallery.length > 0 && (
              <Image
                src={unit.gallery[currentImageIdx]}
                alt={unit.id}
                fill
                priority
                className="object-cover"
                onClick={() => setLightboxIndex(currentImageIdx)}
              />
            )}
            {/* Gallery Navigation Arrows */}
            {unit.gallery.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute start-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:scale-105 opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-800 rtl:rotate-180" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute end-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:scale-105 opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="h-6 w-6 text-gray-800 rtl:rotate-180" />
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Main Content & Sidebar */}
      <section className="w-full px-6 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-[1400px] flex-col-reverse gap-10 lg:flex-row lg:gap-16">
          
          {/* Left Sidebar (30%) */}
          <aside className="w-full lg:w-[350px] shrink-0">
            <div className="flex flex-col gap-5 sticky top-24">
              
              {/* Card 1: Register Interest */}
              <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <button 
                  onClick={() => setIsSalesModalOpen(true)}
                  className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-bold transition-colors",
                  isSold ? "bg-[#f7f7f7] text-gray-400 cursor-not-allowed" : "bg-[#f7f7f7] text-gray-700 hover:bg-gray-100"
                )} disabled={isSold}>
                  <Headset className="h-5 w-5" />
                  {isRtl ? "تواصل مع المبيعات" : "Contact Sales"}
                </button>
                <p className="mt-4 text-xs font-medium text-gray-400 text-center">
                  {isSold 
                    ? (isRtl ? "الوحدة مباعة" : "Unit is sold") 
                    : (isRtl ? "سجل اهتمامك وسيتواصل معك فريقنا" : "Register and our team will contact you")
                  }
                </p>
              </div>

              {/* Card 2: Schedule Visit */}
              <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <button className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-bold transition-all",
                  isSold ? "bg-[#f7f7f7] text-gray-400 cursor-not-allowed" : "bg-[#6A2B92] text-white hover:bg-[#522070] shadow-md"
                )} disabled={isSold}>
                  <Calendar className="h-5 w-5" />
                  {isRtl ? "حدد موعد للزيارة" : "Schedule a Visit"}
                </button>
                <p className="mt-4 text-xs font-medium text-gray-400 text-center">
                  {isSold 
                    ? (isRtl ? "الوحدة مباعة" : "Unit is sold") 
                    : (isRtl ? "الزيارة متاحة من 10 ص حتى 10 م" : "Visits available from 10 AM to 10 PM")
                  }
                </p>
              </div>
              
            </div>
          </aside>

          {/* Right Main Content (70%) */}
          <div className="flex-1 flex flex-col gap-16">
            
            {/* Technical Documents (Floor Plan) */}
            <div>
              <div className="flex flex-col mb-4 items-end text-end">
                <span className="text-xs font-bold text-gray-400 mb-1">{isRtl ? "الوثائق الفنية" : "Technical Documents"}</span>
                <h2 className="text-3xl font-black text-[#2e2e2e]">
                  {isRtl ? "المخطط الهندسي" : "Floor Plan"}
                </h2>
              </div>
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-gray-100 bg-[#fbfaf8] flex flex-col items-center justify-center p-8">
                {/* Fallback to text if no specific floor plan image available */}
                 <div className="text-center text-gray-400 flex flex-col items-center">
                    <Maximize className="mx-auto h-16 w-16 mb-4 opacity-30 text-[#6A2B92]" />
                    <p className="font-semibold text-lg">{isRtl ? "المخطط الهندسي غير متوفر حالياً" : "Floor plan not currently available"}</p>
                 </div>
              </div>
            </div>

            {/* About the Unit */}
            <div>
              <div className="flex flex-col mb-6 items-end text-end">
                <span className="text-xs font-bold text-gray-400 mb-1">{isRtl ? "عن الوحدة" : "About the unit"}</span>
                <h2 className="text-3xl font-black text-[#2e2e2e]">
                  {isRtl ? "تفاصيل الوحدة" : "Unit Details"}
                </h2>
                <p className="mt-2 text-base font-semibold leading-loose text-gray-500">
                  {isRtl ? "لا يتوفر وصف إضافي لهذه الوحدة حالياً." : "No additional description available for this unit currently."}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: isRtl ? "المساحة الإجمالية" : "Total Area", value: `${unit.sqft} م²` },
                  { label: isRtl ? "غرف النوم" : "Bedrooms", value: unit.beds },
                  { label: isRtl ? "الحمامات" : "Bathrooms", value: unit.baths },
                  { label: isRtl ? "الدور" : "Floor", value: isRtl ? "الأرضي" : "Ground" },
                  { label: isRtl ? "عرض الشارع" : "Street Width", value: isRtl ? "18 م" : "18 m" },
                  { label: isRtl ? "الواجهة" : "Facing", value: isRtl ? "شرقية" : "Eastern" },
                ].map((stat, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-colors hover:bg-[#6A2B92]/5 hover:border-[#6A2B92]/20">
                    <span className="text-xs font-bold text-gray-400">{stat.label}</span>
                    <span className="text-lg font-black text-[#2e2e2e]">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Unit Features */}
            <div>
              <div className="flex flex-col mb-10 items-end text-end">
                <span className="text-xs font-bold text-gray-400 mb-1">{isRtl ? "المميزات" : "Features"}</span>
                <h2 className="text-3xl font-black text-[#2e2e2e]">
                  {isRtl ? "مميزات الوحدة" : "Unit Features"}
                </h2>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 sm:gap-4">
                {[
                  { icon: Bed, label: isRtl ? `${unit.beds} غرف نوم` : `${unit.beds} Bedrooms` },
                  { icon: Bath, label: isRtl ? `${unit.baths} حمامات` : `${unit.baths} Bathrooms` },
                  { icon: Sofa, label: isRtl ? "مجلس" : "Majlis" },
                  { icon: Car, label: isRtl ? "موقف سيارة" : "Parking" },
                  { icon: Coffee, label: isRtl ? "صالة" : "Living Area" },
                  { icon: User, label: isRtl ? "غرفة خادمة" : "Maid Room" },
                ].map((feat, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-center gap-3">
                    <div className="group flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#17C3B3]/30">
                      <feat.icon className="h-7 w-7 text-[#17C3B3] transition-colors duration-300 group-hover:text-[#6A2B92]" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-bold text-gray-500 text-center">{feat.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
