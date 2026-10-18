"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import {
  MapPin,
  Check,
  Car,
  Home,
  ArrowUpRight,
  ArrowUpLeft,
  FileText,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Lightbox } from "@/components/ui/Lightbox";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ShareButton } from "@/components/shared/ShareButton";
import { propertiesService, propertyPublicPath, type Property } from "@/features/admin/projects/properties.service";
import { citiesService } from "@/features/admin/cities/cities.service";
import { unitsService, unitPublicPath, type Unit } from "@/features/admin/units/units.service";
import { asStringArray } from "@/features/admin/menus/menu-options.service";
import { useMenuOptions } from "@/features/admin/menus/useMenuOptions";
import type { City } from "@/features/admin/cities/data";
import type { Locale } from "@/lib/i18n/types";
import { formatProjectPriceRange, projectPriceRangeFromUnits } from "@/features/properties/project-price";
import { useRecordPublicView } from "@/features/analytics/useRecordPublicView";
import { AdvertisementInfoCard } from "@/features/admin/shared/AdvertisementInfoView";
import { MostViewedBadge } from "@/features/analytics/MostViewedBadge";
import { getActiveUnitDiscount } from "@/features/units/unit-discount";
import { UnitDiscountBadge } from "@/features/units/UnitDiscountBadge";
import { useNow } from "@/features/units/useNow";

type PropertyDetailProps = {
  propertyId: string;
};

type UnitFilter = "All" | "Available" | "Sold";

const CATEGORY_LABELS: Record<string, { ar: string; en: string }> = {
  luxury: { ar: "فاخرة", en: "Luxury" },
  medium: { ar: "متوسطة", en: "Medium" },
  economic: { ar: "اقتصادية", en: "Economic" },
  فاخرة: { ar: "فاخرة", en: "Luxury" },
  متوسطة: { ar: "متوسطة", en: "Medium" },
  اقتصادية: { ar: "اقتصادية", en: "Economic" },
};

function named(city: City | undefined, locale: Locale) {
  if (!city) return "";
  return locale === "ar" ? city.name.ar || city.name.en : city.name.en || city.name.ar;
}

function neighborhoodLabel(city: City | undefined, neighborhoodId: string | undefined, locale: Locale) {
  if (!city || !neighborhoodId) return "";
  const neighborhood = city.neighborhoods?.find((item) => item.id === neighborhoodId);
  if (!neighborhood) return "";
  return locale === "ar" ? neighborhood.name.ar || neighborhood.name.en : neighborhood.name.en || neighborhood.name.ar;
}

function categoryLabel(category: string | undefined, isRtl: boolean) {
  if (!category) return "";
  const mapped = CATEGORY_LABELS[category];
  if (mapped) return isRtl ? mapped.ar : mapped.en;
  return category;
}

function mediaUrl(value: unknown) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed && !trimmed.startsWith("blob:") ? trimmed : "";
  }
  if (value && typeof value === "object") {
    const record = value as { url?: string; preview?: string; src?: string };
    return mediaUrl(record.url || record.preview || record.src || "");
  }
  return "";
}

function galleryFrom(property: Property | null) {
  if (!property?.images || !Array.isArray(property.images)) return [];
  return property.images.map((item) => mediaUrl(item)).filter(Boolean);
}

function unitPublicStatus(status: string | undefined): "Available" | "Sold" {
  return status === "available" ? "Available" : "Sold";
}

function formatMoney(value: number, isRtl: boolean) {
  const amount = value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  return isRtl ? `${amount} ريال` : `${amount} SAR`;
}

function formatArea(value: number, isRtl: boolean) {
  const amount = value.toLocaleString(undefined, { maximumFractionDigits: 1 });
  return isRtl ? `${amount} م²` : `${amount} m²`;
}

function displayUnitNumber(unit: Unit, property: Property | null, isRtl: boolean) {
  const local = String(unit.unitNumber || "").trim();
  if (!local) return isRtl ? "بدون رقم" : "No number";
  const building = property?.buildings?.find((item) => item.id === unit.buildingId);
  const code = String(building?.code || "").trim();
  if (!code) return local;
  if (local.toUpperCase().startsWith(code.toUpperCase())) return local;
  return `${code}${local}`;
}

function unitAreas(unit: Unit, property: Property | null) {
  const model = unit.modelId ? property?.models?.find((item) => item.id === unit.modelId) : undefined;
  const internal = Number(unit.internalArea ?? model?.internalArea) || 0;
  const external = Number(unit.externalArea ?? model?.externalArea) || 0;
  const total = Number(unit.totalArea) || Number(model?.totalArea) || (internal + external) || 0;
  return { total, internal, external };
}

function CoverImage({ src, alt, onClick }: { src: string; alt: string; onClick?: () => void }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) return <div className="h-full w-full bg-gray-200" />;
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      onClick={onClick}
      onError={() => setFailed(true)}
      className={cn("h-full w-full object-cover", onClick ? "cursor-pointer" : "")}
    />
  );
}

function FeatureGrid({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3">
      {items.map((feature, index) => (
        <div
          key={`${feature}-${index}`}
          className="flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-white px-3.5 py-2.5"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#17C3B3]">
            <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
          </span>
          <span className="min-w-0 text-sm font-bold text-gray-700">{feature}</span>
        </div>
      ))}
    </div>
  );
}

function SectionHeading({ kicker, title, compact }: { kicker: string; title: string; compact?: boolean }) {
  return (
    <div className={cn("flex flex-col items-start text-start", compact ? "mb-3" : "mb-6")}>
      <span className="mb-1 text-xs font-bold text-gray-400">{kicker}</span>
      <h2 className={cn("font-black text-[#2e2e2e]", compact ? "text-[28px] leading-tight" : "text-3xl")}>{title}</h2>
    </div>
  );
}

function DeveloperBadge({ name, logo, role }: { name: string; logo?: string; role: string }) {
  const logoSrc = mediaUrl(logo);
  return (
    <div className="flex min-w-0 max-w-sm flex-1 items-center justify-start gap-3">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100">
        {logoSrc ? (
          <img src={logoSrc} alt={name} className="h-full w-full object-contain p-1.5" />
        ) : (
          <span className="text-base font-black text-[#6A2B92]">{name.slice(0, 1)}</span>
        )}
      </span>
      <div className="min-w-0 text-start">
        <p className="text-[11px] font-bold tracking-wide text-gray-400">{role}</p>
        <p className="truncate text-lg font-black text-[#2e2e2e]">{name}</p>
      </div>
    </div>
  );
}

function PropertyDetailSkeleton() {
  return (
    <div className="w-full bg-[#fcfcfc] pb-24">
      <section className="w-full px-6 pt-12 pb-8 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
          <div className="mt-4 h-12 w-2/3 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-3 h-5 w-1/3 animate-pulse rounded bg-gray-100" />
        </div>
      </section>
      <section className="w-full px-6 pb-12 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="aspect-[16/7] w-full animate-pulse rounded-3xl bg-gray-200" />
        </div>
      </section>
    </div>
  );
}

export function PropertyDetail({ propertyId }: PropertyDetailProps) {
  const { isRtl, locale } = useLocale();
  const { label } = useMenuOptions();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [galleryDirection, setGalleryDirection] = useState(1);
  const [unitFilter, setUnitFilter] = useState<UnitFilter>("All");
  const now = useNow();

  useEffect(() => {
    setCurrentImageIdx(0);
    setLightboxIndex(null);
    setUnitFilter("All");
  }, [propertyId]);

  const results = useQueries({
    queries: [
      { queryKey: ["properties"], queryFn: () => propertiesService.getProperties() },
      { queryKey: ["cities"], queryFn: () => citiesService.getCities() },
      { queryKey: ["units"], queryFn: () => unitsService.getUnits() },
    ],
  });

  const properties = (results[0].data || []) as Property[];
  const cities = (results[1].data || []) as City[];
  const units = (results[2].data || []) as Unit[];
  const isPending = results.some((item) => item.isPending);
  const lookupKey = decodeURIComponent(propertyId);
  const property =
    properties.find((item) => item.slug === lookupKey || item.id === lookupKey) || null;
  const notFound = !isPending && (!property || property.status === "draft");
  useRecordPublicView("property", property?.id, !isPending && !notFound);

  const gallery = useMemo(() => galleryFrom(property), [property]);
  const currentImage = gallery[currentImageIdx] || gallery[0] || "";

  const city = cities.find((item) => item.id === property?.cityId);
  const cityName = named(city, locale);
  const areaName = neighborhoodLabel(city, property?.neighborhoodId, locale);
  const locationText = [areaName, cityName].filter(Boolean).join(isRtl ? "، " : ", ");

  const projectUnits = useMemo(
    () => (property ? units.filter((unit) => unit.projectId === property.id) : []),
    [units, property]
  );

  const priceLabel =
    property?.status === "active"
      ? formatProjectPriceRange(projectPriceRangeFromUnits(property.id, projectUnits), isRtl)
      : "";

  const mappedUnits = useMemo(
    () =>
      projectUnits.map((unit) => {
        const status = unitPublicStatus(unit.status);
        const areas = unitAreas(unit, property);
        const discount = getActiveUnitDiscount(unit, now);
        return {
          id: unit.id,
          slug: unit.slug,
          number: displayUnitNumber(unit, property, isRtl),
          area: areas.total,
          internalArea: areas.internal,
          externalArea: areas.external,
          price: Number(unit.price) || 0,
          salePrice: discount ? discount.salePrice : Number(unit.price) || 0,
          discount,
          status,
          statusLabel: status === "Available" ? (isRtl ? "متاحة" : "Available") : isRtl ? "مباعة" : "Sold",
          views: Number(unit.views) || 0,
        };
      }),
    [projectUnits, property, isRtl, now]
  );

  const filteredUnits = mappedUnits.filter((unit) => {
    if (unitFilter === "All") return true;
    return unit.status === unitFilter;
  });

  const availableCount = mappedUnits.filter((unit) => unit.status === "Available").length;
  const soldCount = mappedUnits.filter((unit) => unit.status === "Sold").length;

  const features = asStringArray(property?.features).map((value) => label(value)).filter(Boolean);
  const services = asStringArray(property?.services).map((value) => label(value)).filter(Boolean);
  const guarantees = asStringArray(property?.guarantees).map((value) => label(value)).filter(Boolean);
  const offers = asStringArray(property?.offers).map((value) => label(value)).filter(Boolean);
  const nearby = property?.nearbyPlaces?.filter((place) => place?.name?.trim()) || [];
  const adInfo = (property?.adInfo || []).map((item) => item.trim()).filter(Boolean);
  const nearbyLocations = asStringArray(property?.locations).map((value) => label(value)).filter(Boolean);
  const partners = (property?.partnerLogos || []).map((url) => mediaUrl(url)).filter(Boolean);

  const nextImage = () => {
    if (gallery.length < 2) return;
    setGalleryDirection(1);
    setCurrentImageIdx((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    if (gallery.length < 2) return;
    setGalleryDirection(-1);
    setCurrentImageIdx((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  if (isPending) return <PropertyDetailSkeleton />;

  if (notFound || !property) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 bg-[#fcfcfc] px-6 text-center">
        <p className="text-xl font-bold text-[#2e2e2e]">{isRtl ? "المشروع غير موجود" : "Project not found"}</p>
        <Link href="/properties" className="text-sm font-bold text-[#6A2B92] hover:underline">
          {isRtl ? "العودة إلى المشاريع" : "Back to projects"}
        </Link>
      </div>
    );
  }

  const title = property.name?.trim() || (isRtl ? "مشروع" : "Project");
  const typeLabel = property.projectType?.trim() || "";
  const category = categoryLabel(property.category, isRtl);
  const sellingBadge =
    property.status === "soon"
      ? { label: isRtl ? "قريباً" : "Soon", className: "bg-gray-900/80 text-white" }
      : property.status === "active"
        ? { label: isRtl ? "متاح" : "Available", className: "bg-[#17C3B3] text-white" }
        : { label: isRtl ? "بدأ البيع" : "Started Selling", className: "bg-green-100/60 text-green-700" };

  return (
    <div className="w-full bg-[#fcfcfc] pb-24">
      {lightboxIndex !== null && gallery.length > 0 && (
        <Lightbox images={gallery} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}

      <section className="w-full px-6 pt-12 pb-8 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex flex-col items-start text-start">
            <nav className="mb-2 flex items-center gap-1 text-xs font-semibold text-gray-400">
              <Link href="/" className="hover:text-[#6A2B92]">{isRtl ? "الرئيسية" : "Home"}</Link>
              <span>/</span>
              <Link href="/properties" className="hover:text-[#6A2B92]">{isRtl ? "المشاريع" : "Projects"}</Link>
              <span>/</span>
              <span className="text-gray-600">{title}</span>
            </nav>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#2e2e2e] tracking-tight mb-2">
              {title}
            </h1>
            {locationText ? (
              <p className="text-lg font-medium text-gray-500 mb-2">{locationText}</p>
            ) : null}
            {priceLabel ? (
              <p className="mt-1 text-xl sm:text-2xl font-black leading-tight text-[#6A2B92]">
                {priceLabel}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col items-start lg:items-end gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {typeLabel ? (
                <span className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700">
                  <Home className="h-3.5 w-3.5" />
                  {typeLabel}
                </span>
              ) : null}
              <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${sellingBadge.className}`}>
                {sellingBadge.label}
              </span>
              <MostViewedBadge views={property.views} />
              {category ? (
                <span className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600">
                  {category}
                </span>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => document.getElementById("units-section")?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#6A2B92]"
              >
                {isRtl ? "عرض الوحدات" : "View Units"}
                {isRtl ? <ArrowUpLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
              </button>
              <ShareButton title={title} variant="property" url={propertyPublicPath(property)} />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-6 pb-12 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="relative aspect-[16/7] w-full overflow-hidden rounded-3xl bg-gray-200 group select-none">
            <AnimatePresence initial={false} custom={galleryDirection}>
              <motion.div
                key={`${propertyId}-${currentImageIdx}`}
                custom={galleryDirection}
                variants={{
                  enter: (direction: number) => ({
                    x: direction > 0 ? "18%" : "-18%",
                    opacity: 0.35,
                    scale: 1.02,
                  }),
                  center: { x: 0, opacity: 1, scale: 1 },
                  exit: (direction: number) => ({
                    x: direction > 0 ? "-18%" : "18%",
                    opacity: 0,
                    scale: 0.995,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                drag={gallery.length > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -70) nextImage();
                  else if (info.offset.x > 70) prevImage();
                }}
                className="absolute inset-0"
              >
                <CoverImage
                  src={currentImage}
                  alt={title}
                  onClick={gallery.length ? () => setLightboxIndex(currentImageIdx) : undefined}
                />
              </motion.div>
            </AnimatePresence>
            <MostViewedBadge views={property.views} className="pointer-events-none absolute top-5 start-5 z-20" />
            {gallery.length > 1 ? (
              <>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    prevImage();
                  }}
                  className="absolute start-6 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:scale-105 opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-800 rtl:rotate-180" />
                </button>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    nextImage();
                  }}
                  className="absolute end-6 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:scale-105 opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="h-6 w-6 text-gray-800 rtl:rotate-180" />
                </button>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <section className="w-full px-6 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-10 lg:flex-row lg:gap-16">
          <div className="flex-1 flex flex-col gap-16">
            {(property.developerName || property.developerLogo || property.contractorName || property.contractorLogo || property.description?.trim() || adInfo.length > 0) ? (
              <div className="flex flex-col gap-8">
                {(property.developerName || property.developerLogo || property.contractorName || property.contractorLogo) ? (
                  <div className="flex flex-wrap items-center justify-start gap-x-10 gap-y-5">
                    {(property.developerName || property.developerLogo) ? (
                      <DeveloperBadge
                        name={property.developerName || (isRtl ? "المطور" : "Developer")}
                        logo={property.developerLogo}
                        role={isRtl ? "اسم المطور" : "Developer"}
                      />
                    ) : null}
                    {(property.contractorName || property.contractorLogo) ? (
                      <DeveloperBadge
                        name={property.contractorName || (isRtl ? "المقاول" : "Contractor")}
                        logo={property.contractorLogo}
                        role={isRtl ? "اسم المقاول" : "Contractor"}
                      />
                    ) : null}
                  </div>
                ) : null}

                {property.description?.trim() ? (
                  <div>
                    <div className="mb-4 flex flex-col items-start text-start">
                      <span className="mb-1 text-xs font-bold text-gray-400">{isRtl ? "عن المشروع" : "About the project"}</span>
                      <h2 className="text-3xl font-black text-[#2e2e2e]">
                        {isRtl ? "حكاية المكان" : "Story of the Place"}
                      </h2>
                    </div>
                    <p className="whitespace-pre-wrap text-base font-semibold leading-loose text-gray-500 text-start">
                      {property.description}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}

            {(features.length > 0 || services.length > 0 || guarantees.length > 0 || offers.length > 0 || nearbyLocations.length > 0) ? (
              <div className="flex flex-col gap-8">
                {features.length > 0 ? (
                  <div>
                    <SectionHeading compact kicker={isRtl ? "المميزات" : "Features"} title={isRtl ? "مميزات المشروع" : "Project Features"} />
                    <FeatureGrid items={features} />
                  </div>
                ) : null}

                {services.length > 0 ? (
                  <div>
                    <SectionHeading compact kicker={isRtl ? "الخدمات" : "Services"} title={isRtl ? "خدمات ما بعد البيع" : "After-sale services"} />
                    <FeatureGrid items={services} />
                  </div>
                ) : null}

                {guarantees.length > 0 ? (
                  <div>
                    <SectionHeading compact kicker={isRtl ? "الضمانات" : "Guarantees"} title={isRtl ? "الضمانات" : "Guarantees"} />
                    <FeatureGrid items={guarantees} />
                  </div>
                ) : null}

                {offers.length > 0 ? (
                  <div>
                    <SectionHeading compact kicker={isRtl ? "العروض" : "Offers"} title={isRtl ? "العروض الخاصة" : "Special offers"} />
                    <FeatureGrid items={offers} />
                  </div>
                ) : null}

                {nearbyLocations.length > 0 ? (
                  <div>
                    <SectionHeading compact kicker={isRtl ? "المواقع القريبة" : "Nearby locations"} title={isRtl ? "قريب من كل شيء" : "Close to everything"} />
                    <FeatureGrid items={nearbyLocations} />
                  </div>
                ) : null}
              </div>
            ) : null}

            {property.mapsLink ? (
              <div>
                <SectionHeading kicker={isRtl ? "الموقع" : "Location"} title={isRtl ? "موقع المشروع" : "Project Location"} />
                <div className="relative aspect-[16/7] w-full overflow-hidden rounded-3xl border border-gray-200 bg-gray-100">
                  <iframe
                    title={isRtl ? `خريطة ${title}` : `Map of ${title}`}
                    src={`/api/maps-embed?url=${encodeURIComponent(property.mapsLink)}&hl=${locale}`}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                  <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
                    <a
                      href={property.mapsLink}
                      target="_blank"
                      rel="noreferrer"
                      className="pointer-events-auto flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-gray-700 shadow-lg hover:text-[#17C3B3] transition-colors"
                    >
                      <MapPin className="h-4 w-4" />
                      {isRtl ? "افتح الموقع" : "Open Location"}
                    </a>
                  </div>
                </div>
              </div>
            ) : null}

            {nearby.length > 0 ? (
              <div>
                <SectionHeading kicker={isRtl ? "الأماكن القريبة" : "Nearby places"} title={isRtl ? "على بُعد دقائق" : "Minutes Away"} />
                <div className="flex flex-col">
                  {nearby.map((place, index) => (
                    <div key={`${place.name}-${index}`} className="flex items-center justify-between border-b border-gray-100 py-4 last:border-0">
                      <div className="flex items-center gap-2 text-base font-bold text-gray-700">
                        <Car className="h-4 w-4 text-[#17C3B3]" />
                        {place.name}
                      </div>
                      <span className="text-sm font-medium text-gray-400">
                        {Number(place.minutes) > 0
                          ? `${place.minutes} ${isRtl ? "دقائق" : "mins"}`
                          : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {partners.length > 0 ? (
              <div>
                <SectionHeading
                  kicker={isRtl ? "شركاؤنا في هذا المشروع" : "Our partners in this project"}
                  title={isRtl ? "شركاء النجاح" : "Partners of Success"}
                />
                <div className="flex flex-wrap items-center justify-start gap-4">
                  {partners.map((logo, index) => (
                    <div
                      key={`${logo}-${index}`}
                      className="flex h-36 w-36 items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <img src={logo} alt={isRtl ? `شريك ${index + 1}` : `Partner ${index + 1}`} className="max-h-full max-w-full object-contain" />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div id="units-section">
              <SectionHeading kicker={isRtl ? "الوحدات" : "Units"} title={isRtl ? "وحدات المشروع" : "Project Units"} />

              <div className="mb-6 flex flex-wrap items-center justify-start gap-2">
                <button
                  onClick={() => setUnitFilter("All")}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-bold transition-colors",
                    unitFilter === "All" ? "bg-[#2e2e2e] text-white" : "bg-[#f7f7f7] text-gray-500 hover:bg-gray-200"
                  )}
                >
                  {isRtl ? "الكل" : "All"} {mappedUnits.length}
                </button>
                <button
                  onClick={() => setUnitFilter("Available")}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-bold transition-colors",
                    unitFilter === "Available" ? "bg-[#2e2e2e] text-white" : "bg-[#f7f7f7] text-gray-500 hover:bg-gray-200"
                  )}
                >
                  {isRtl ? "متاحة" : "Available"} {availableCount}
                </button>
                <button
                  onClick={() => setUnitFilter("Sold")}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-bold transition-colors",
                    unitFilter === "Sold" ? "bg-[#2e2e2e] text-white" : "bg-[#f7f7f7] text-gray-500 hover:bg-gray-200"
                  )}
                >
                  {isRtl ? "مباعة" : "Sold"} {soldCount}
                </button>
              </div>

              <div className="w-full overflow-x-auto rounded-2xl border border-gray-100 bg-white" dir={isRtl ? "rtl" : "ltr"}>
                <table className="w-full text-start text-sm font-bold text-gray-700">
                  <thead className="bg-gray-50 text-xs font-semibold text-gray-400">
                    <tr>
                      <th className="py-4 px-4 text-start">{isRtl ? "رقم الوحدة" : "Unit Number"}</th>
                      <th className="py-4 px-4 text-start">{isRtl ? "الحالة" : "Status"}</th>
                      <th className="py-4 px-4 text-start">{isRtl ? "السعر" : "Price"}</th>
                      <th className="py-4 px-4 text-start">{isRtl ? "المساحة" : "Area"}</th>
                      <th className="py-4 px-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUnits.map((unit) => (
                      <tr key={unit.id} className="transition-colors hover:bg-gray-50">
                        <td className="py-4 px-4 whitespace-nowrap text-start">
                          <div className="flex flex-wrap items-center gap-2">
                            <span dir="ltr" className="tabular-nums font-black tracking-wide text-[#2e2e2e]">
                              {unit.number}
                            </span>
                            <MostViewedBadge views={unit.views} size="sm" />
                          </div>
                        </td>
                        <td className="py-4 px-4 text-start">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border",
                              unit.status === "Available"
                                ? "bg-green-100/60 text-green-700 border-green-200"
                                : "bg-red-50 text-red-500 border-red-100"
                            )}
                          >
                            {unit.statusLabel}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-start">
                          {unit.price > 0 ? (
                            unit.discount ? (
                              <div className="flex flex-col items-start gap-1">
                                <span className="text-xs font-semibold text-gray-400 line-through decoration-gray-400">
                                  {formatMoney(unit.price, isRtl)}
                                </span>
                                <span>{formatMoney(unit.salePrice, isRtl)}</span>
                                <UnitDiscountBadge
                                  percent={unit.discount.percent}
                                  daysLeft={unit.discount.daysLeft}
                                  isRtl={isRtl}
                                />
                              </div>
                            ) : (
                              formatMoney(unit.price, isRtl)
                            )
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-4 px-4 text-start">
                          {unit.area > 0 ? (
                            <div className="flex flex-col items-start gap-0.5">
                              <span dir="ltr" className="whitespace-nowrap tabular-nums">
                                {formatArea(unit.area, isRtl)}
                              </span>
                              {unit.internalArea > 0 || unit.externalArea > 0 ? (
                                <span className="whitespace-nowrap text-[11px] font-medium text-gray-400">
                                  {isRtl ? "داخلية" : "Internal"}{" "}
                                  <span dir="ltr">{formatArea(unit.internalArea, isRtl)}</span>
                                  <span className="mx-1">|</span>
                                  {isRtl ? "خارجية" : "External"}{" "}
                                  <span dir="ltr">{formatArea(unit.externalArea, isRtl)}</span>
                                </span>
                              ) : null}
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-4 px-4 text-end">
                          <Link
                            href={unitPublicPath(unit)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#6A2B92] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#522070]"
                          >
                            {isRtl ? <ArrowUpLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                            {isRtl ? "تفاصيل الوحدة" : "Unit Details"}
                          </Link>
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

            {adInfo.length > 0 ? (
              <AdvertisementInfoCard items={adInfo} title={isRtl ? "معلومات الاعلان" : "Advertisement info"} />
            ) : null}
          </div>

          {property.brochureLink ? (
            <aside className="w-full lg:w-[350px] shrink-0">
              <div className="sticky top-24">
                <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <a
                    href={property.brochureLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-4 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <FileText className="h-5 w-5" />
                    {isRtl ? "احصل على البروشور" : "Get the Brochure"}
                  </a>
                  <p className="mt-4 text-xs font-medium text-gray-400 text-center">
                    {isRtl ? "احصل على كافة تفاصيل المشروع" : "Get all project details"}
                  </p>
                </div>
              </div>
            </aside>
          ) : null}
        </div>
      </section>
    </div>
  );
}
