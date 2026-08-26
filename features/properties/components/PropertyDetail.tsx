"use client";

import Image from "next/image";
import { Bed, Bath, LayoutGrid, MapPin, CheckCircle2, Car, Clock, Handshake, Share2, Home, ArrowUpRight, ArrowUpLeft, Heart, FileText, Calendar, ChevronRight, ChevronLeft, Building2 } from "lucide-react";
import type { PropertyListing } from "@/features/properties/data/listings";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useState } from "react";
import { Lightbox } from "@/components/ui/Lightbox";
import Link from "next/link";
import { getUnitsByPropertyId } from "@/features/units/data/units";
import { cn } from "@/lib/utils";

type PropertyDetailProps = {
  property: PropertyListing;
};

export function PropertyDetail({ property }: PropertyDetailProps) {
  const { t, isRtl } = useLocale();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [unitFilter, setUnitFilter] = useState<"All" | "Available" | "Reserved" | "Sold">("All");
  
  const addressLines = (isRtl ? property.addressAr : property.address).split("\n");
  const allUnits = getUnitsByPropertyId(property.id);
  
  const filteredUnits = allUnits.filter(unit => {
    if (unitFilter === "All") return true;
    return unit.statusEn === unitFilter;
  });

  const nextImage = () => {
    setCurrentImageIdx((prev) => (prev + 1) % property.gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIdx((prev) => (prev - 1 + property.gallery.length) % property.gallery.length);
  };

  return (
    <div className="w-full bg-[#fcfcfc] pb-24">
      {lightboxIndex !== null && (
        <Lightbox 
          images={property.gallery} 
          initialIndex={lightboxIndex} 
          onClose={() => setLightboxIndex(null)} 
        />
      )}

      {/* Top Header Section */}
      <section className="w-full px-6 pt-12 pb-8 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          
          {/* Right Side (Title & Subtitle) - First in DOM appears on right in RTL */}
          <div className="flex flex-col items-start text-start">
            <nav className="mb-2 flex items-center gap-1 text-xs font-semibold text-gray-400">
              <Link href="/" className="hover:text-[#6A2B92]">{isRtl ? "الرئيسية" : "Home"}</Link>
              <span>/</span>
              <Link href="/properties" className="hover:text-[#6A2B92]">{isRtl ? "المشاريع" : "Projects"}</Link>
              <span>/</span>
              <span className="text-gray-600">{isRtl ? property.titleAr : property.title}</span>
            </nav>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#2e2e2e] tracking-tight mb-2">
              {isRtl ? property.titleAr : property.title}
            </h1>
            <p className="text-lg font-medium text-gray-500 mb-2">
              {isRtl ? `${addressLines[0]}، - الرياض` : `${addressLines[0]}, - Riyadh`}
            </p>
            <p className="text-lg font-bold text-gray-700">
              {isRtl ? "تبدأ الأسعار من " : "Prices start from "} 
              <span className="text-[#6A2B92] font-black" dir="ltr">{property.price}</span>
            </p>
          </div>

          {/* Left Side (Badges & Buttons) - Second in DOM appears on left in RTL */}
          <div className="flex flex-col items-start lg:items-end gap-4">
            <div className="flex flex-wrap items-center gap-2 flex-row-reverse">
              <span className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700">
                <Home className="h-3.5 w-3.5" />
                {isRtl ? property.typeAr : property.type}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-green-100/60 px-3 py-1.5 text-xs font-bold text-green-700">
                {isRtl ? "بدأ البيع" : "Started Selling"}
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600">
                {isRtl ? "مميز" : "Featured"}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => document.getElementById('units-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#6A2B92]"
              >
                {isRtl ? "عرض الوحدات" : "View Units"}
                {isRtl ? <ArrowUpLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
              </button>
              <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#6A2B92]">
                <Share2 className="h-4 w-4" />
                {isRtl ? "مشاركة" : "Share"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="w-full px-6 pb-12 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="relative aspect-[16/7] w-full overflow-hidden rounded-3xl bg-gray-200 group">
            <Image
              src={property.gallery[currentImageIdx]}
              alt={property.title}
              fill
              priority
              className="object-cover"
              onClick={() => setLightboxIndex(currentImageIdx)}
            />
            {/* Gallery Navigation Arrows */}
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
                <button className="flex w-full items-center justify-center gap-2 rounded-full bg-[#f7f7f7] px-6 py-4 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-100">
                  <Heart className="h-5 w-5" />
                  {isRtl ? "سجل اهتمامك في المشروع" : "Register your interest"}
                </button>
                <p className="mt-4 text-xs font-medium text-gray-400 text-center">
                  {isRtl ? "سجل اهتمامك وسيتواصل معك فريقنا" : "Register and our team will contact you"}
                </p>
              </div>

              {/* Card 2: Brochure */}
              <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <button className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-4 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50">
                  <FileText className="h-5 w-5" />
                  {isRtl ? "احصل على البروشور" : "Get the Brochure"}
                </button>
                <p className="mt-4 text-xs font-medium text-gray-400 text-center">
                  {isRtl ? "احصل على كافة تفاصيل المشروع" : "Get all project details"}
                </p>
              </div>

              {/* Card 3: Schedule Visit */}
              <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <button className="flex w-full items-center justify-center gap-2 rounded-full bg-[#6A2B92] px-6 py-4 text-sm font-bold text-white transition-all hover:bg-[#522070] shadow-md">
                  <Calendar className="h-5 w-5" />
                  {isRtl ? "حدد موعد للزيارة" : "Schedule a Visit"}
                </button>
                <p className="mt-4 text-xs leading-relaxed font-medium text-gray-400 text-center">
                  {isRtl ? "الزيارة متاحة من الساعة 10 صباحًا وحتى 10 مساءً. حدد موعد للزيارة لتضمن وجود موظف المبيعات برفقتك." : "Visits available from 10 AM to 10 PM. Schedule a visit to ensure a sales representative is with you."}
                </p>
              </div>
              
            </div>
          </aside>

          {/* Right Main Content (70%) */}
          <div className="flex-1 flex flex-col gap-16">
            
            {/* Story of the place */}
            <div>
              <div className="flex flex-col mb-4 items-end text-end">
                <span className="text-xs font-bold text-gray-400 mb-1">{isRtl ? "عن المشروع" : "About the project"}</span>
                <h2 className="text-3xl font-black text-[#2e2e2e]">
                  {isRtl ? "حكاية المكان" : "Story of the Place"}
                </h2>
              </div>
              <p className="text-base font-semibold leading-loose text-gray-500 text-end">
                {isRtl ? property.descriptionAr : property.description}
                <br /><br />
                {isRtl ? property.descriptionSecondaryAr : property.descriptionSecondary}
              </p>
            </div>

            {/* Features */}
            <div>
              <div className="flex flex-col mb-6 items-end text-end">
                <span className="text-xs font-bold text-gray-400 mb-1">{isRtl ? "المميزات" : "Features"}</span>
                <h2 className="text-3xl font-black text-[#2e2e2e]">
                  {isRtl ? "مميزات المشروع" : "Project Features"}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {(isRtl ? property.featuresAr : property.features).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-colors hover:border-[#17C3B3]">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[#17C3B3]" />
                    <span className="text-sm font-bold text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <div className="flex flex-col mb-6 items-end text-end">
                <span className="text-xs font-bold text-gray-400 mb-1">{isRtl ? "الموقع" : "Location"}</span>
                <h2 className="text-3xl font-black text-[#2e2e2e]">
                  {isRtl ? "موقع المشروع" : "Project Location"}
                </h2>
              </div>
              <div className="relative aspect-[16/7] w-full overflow-hidden rounded-3xl border border-gray-200">
                <Image
                  src="/properites/map.avif"
                  alt={`Map location for ${property.title}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                  <button className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-gray-700 shadow-lg hover:text-[#17C3B3] transition-colors">
                    <MapPin className="h-4 w-4" />
                    {isRtl ? "افتح الموقع" : "Open Location"}
                  </button>
                </div>
              </div>
            </div>

            {/* Nearby Places */}
            <div>
              <div className="flex flex-col mb-6 items-end text-end">
                <span className="text-xs font-bold text-gray-400 mb-1">{isRtl ? "الأماكن القريبة" : "Nearby places"}</span>
                <h2 className="text-3xl font-black text-[#2e2e2e]">
                  {isRtl ? "على بُعد دقائق" : "Minutes Away"}
                </h2>
              </div>
              <div className="flex flex-col">
                {[
                  { nameAr: "المطار", nameEn: "Airport", time: "10" },
                  { nameAr: "النخيل مول", nameEn: "Al Nakheel Mall", time: "13" },
                  { nameAr: "جامعة الإمام", nameEn: "Imam University", time: "13" },
                  { nameAr: "محطة المترو", nameEn: "Metro Station", time: "4" },
                ].map((place, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-gray-100 py-4 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-400">{place.time} {isRtl ? "دقائق" : "mins"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-base font-bold text-gray-700 flex-row-reverse">
                      <Car className="h-4 w-4 text-[#17C3B3]" />
                      {isRtl ? place.nameAr : place.nameEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Partners of Success */}
            <div>
              <div className="flex flex-col mb-6 items-end text-end">
                <span className="text-xs font-bold text-gray-400 mb-1">{isRtl ? "شركاؤنا في هذا المشروع" : "Our partners in this project"}</span>
                <h2 className="text-3xl font-black text-[#2e2e2e]">
                  {isRtl ? "شركاء النجاح" : "Partners of Success"}
                </h2>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-4">
                <div className="flex items-center justify-center w-36 h-36 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow p-6">
                  <Image src="/1779208393076_P25.svg" alt="Partner 1" width={100} height={100} className="object-contain" />
                </div>
                <div className="flex items-center justify-center w-36 h-36 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow p-6">
                  <Image src="/masakn.svg" alt="Masakn" width={100} height={100} className="object-contain" />
                </div>
                <div className="flex items-center justify-center w-36 h-36 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow p-6">
                  <Image src="/lbab.svg" alt="Lbab" width={100} height={100} className="object-contain" />
                </div>
              </div>
            </div>

            {/* Units */}
            <div id="units-section">
              <div className="flex flex-col mb-6 items-end text-end">
                <span className="text-xs font-bold text-gray-400 mb-1">{isRtl ? "الوحدات" : "Units"}</span>
                <h2 className="text-3xl font-black text-[#2e2e2e]">
                  {isRtl ? "وحدات المشروع" : "Project Units"}
                </h2>
              </div>
              
              <div className="mb-6 flex flex-wrap items-center justify-end gap-2 text-end">
                <button 
                  onClick={() => setUnitFilter("Sold")}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-bold transition-colors",
                    unitFilter === "Sold" ? "bg-[#2e2e2e] text-white" : "bg-[#f7f7f7] text-gray-500 hover:bg-gray-200"
                  )}
                >
                  {isRtl ? "مباعة" : "Sold"} {allUnits.filter(u => u.statusEn === 'Sold').length}
                </button>
                <button 
                  onClick={() => setUnitFilter("Reserved")}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-bold transition-colors",
                    unitFilter === "Reserved" ? "bg-[#2e2e2e] text-white" : "bg-[#f7f7f7] text-gray-500 hover:bg-gray-200"
                  )}
                >
                  {isRtl ? "محجوزة" : "Reserved"} {allUnits.filter(u => u.statusEn === 'Reserved').length}
                </button>
                <button 
                  onClick={() => setUnitFilter("Available")}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-bold transition-colors",
                    unitFilter === "Available" ? "bg-[#2e2e2e] text-white" : "bg-[#f7f7f7] text-gray-500 hover:bg-gray-200"
                  )}
                >
                  {isRtl ? "متاحة" : "Available"} {allUnits.filter(u => u.statusEn === 'Available').length}
                </button>
                <button 
                  onClick={() => setUnitFilter("All")}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-bold transition-colors",
                    unitFilter === "All" ? "bg-[#2e2e2e] text-white" : "bg-[#f7f7f7] text-gray-500 hover:bg-gray-200"
                  )}
                >
                  {isRtl ? "الكل" : "All"} {allUnits.length}
                </button>
              </div>

              <div className="w-full overflow-x-auto rounded-2xl border border-gray-100 bg-white">
                <table className="w-full text-center text-sm font-bold text-gray-700">
                  <thead className="bg-gray-50 text-xs font-semibold text-gray-400">
                    <tr>
                      <th className="py-4 px-4"></th>
                      <th className="py-4 px-4">{isRtl ? "المساحة" : "Area"}</th>
                      <th className="py-4 px-4">{isRtl ? "السعر" : "Price"}</th>
                      <th className="py-4 px-4">{isRtl ? "الحالة" : "Status"}</th>
                      <th className="py-4 px-4">{isRtl ? "اسم الوحدة" : "Unit Name"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUnits.map((unit) => (
                      <tr key={unit.id} className="transition-colors hover:bg-gray-50">
                        <td className="py-4 px-4 text-start">
                          <Link href={`/units/${unit.id}`} className="inline-flex items-center gap-1.5 rounded-full bg-[#6A2B92] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#522070]">
                            {isRtl ? <ArrowUpLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                            {isRtl ? "تفاصيل الوحدة" : "Unit Details"}
                          </Link>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap" dir="ltr">
                          {unit.sqft} m²
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          {unit.statusEn === "Available" ? unit.price : "—"}
                        </td>
                        <td className="py-4 px-4">
                          <span className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border",
                            unit.statusEn === "Available" ? "bg-green-100/60 text-green-700 border-green-200" :
                            unit.statusEn === "Reserved" ? "bg-yellow-100/60 text-yellow-700 border-yellow-200" :
                            "bg-red-50 text-red-500 border-red-100"
                          )}>
                            {isRtl ? unit.statusAr : unit.statusEn}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-end">
                          {isRtl ? property.titleAr : property.title} - {unit.id}
                        </td>
                      </tr>
                    ))}
                    {filteredUnits.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center font-medium text-gray-500">
                          {isRtl ? "لا توجد وحدات" : "No units found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
