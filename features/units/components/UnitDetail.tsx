"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import { useQueries } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import {
  Bed,
  Bath,
  CheckCircle2,
  Home,
  Building2,
  ArrowUpRight,
  ArrowUpLeft,
  ChevronLeft,
  ChevronRight,
  Car,
  Sofa,
  Coffee,
  Maximize,
  User,
  Headset,
  LayoutGrid,
} from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Lightbox } from "@/components/ui/Lightbox";
import { cn } from "@/lib/utils";
import { OptimizedCoverImage } from "@/components/media/OptimizedCoverImage";
import { SalesContactModal } from "./SalesContactModal";
import { ShareButton } from "@/components/shared/ShareButton";
import { propertiesService, propertyPublicPath, type Property } from "@/features/admin/projects/properties.service";
import { citiesService } from "@/features/admin/cities/cities.service";
import { unitsService, unitPublicPath, type Unit } from "@/features/admin/units/units.service";
import { useMenuOptions } from "@/features/admin/menus/useMenuOptions";
import { useRecordPublicView } from "@/features/analytics/useRecordPublicView";
import { MostViewedBadge } from "@/features/analytics/MostViewedBadge";
import { getActiveUnitDiscount } from "@/features/units/unit-discount";
import { UnitDiscountBadge } from "@/features/units/UnitDiscountBadge";
import { useNow } from "@/features/units/useNow";
import { AdvertisementInfoCard } from "@/features/admin/shared/AdvertisementInfoView";
import type { City } from "@/features/admin/cities/data";
import type { Locale } from "@/lib/i18n/types";

type UnitDetailProps = {
  unitId: string;
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

function galleryFrom(unit: Unit | null) {
  if (!unit?.images || !Array.isArray(unit.images)) return [];
  return unit.images.map((item) => mediaUrl(item)).filter(Boolean);
}

function isPublicProject(status: string | undefined) {
  const value = String(status || "").toLowerCase().replace(/\s+/g, "");
  return value === "active" || value === "soon" || value === "upcoming" || value === "soldout";
}

function displayUnitNumber(unit: Unit, property: Property | null) {
  const local = String(unit.unitNumber || "").trim();
  if (!local) return unit.id;
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

function formatArea(value: number, isRtl: boolean) {
  const amount = value.toLocaleString(undefined, { maximumFractionDigits: 1 });
  return isRtl ? `${amount} م²` : `${amount} m²`;
}

function hasOwnValue(value: unknown) {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim() !== "";
  return true;
}

function floorLabel(floor: string | undefined, isRtl: boolean) {
  const raw = String(floor || "").trim();
  if (!raw) return "";
  if (raw === "0") return isRtl ? "الدور الأرضي" : "Ground Floor";
  const numeric = Number(raw);
  if (!Number.isNaN(numeric)) return isRtl ? `الدور ${numeric}` : `Floor ${numeric}`;
  return raw;
}

function ageLabel(age: unknown, isRtl: boolean) {
  if (!hasOwnValue(age)) return "";
  const years = Number(age);
  if (Number.isNaN(years) || years < 0) return "";
  if (years === 0) return isRtl ? "جديدة تماماً" : "Brand new";
  return isRtl ? `${years} سنوات` : `${years} years`;
}

function conditionLabel(condition: string | undefined) {
  const value = String(condition || "").trim();
  if (!value) return "";
  return value;
}

function featureIcon(label: string): ComponentType<{ className?: string; strokeWidth?: number }> {
  const value = label.toLowerCase();
  if (/نوم|bed/.test(value)) return Bed;
  if (/حمام|bath/.test(value)) return Bath;
  if (/مجلس|majlis/.test(value)) return Sofa;
  if (/موقف|parking|سيارة/.test(value)) return Car;
  if (/صالة|living|مطبخ|kitchen/.test(value)) return Coffee;
  if (/خادم|maid|سائق|driver/.test(value)) return User;
  if (/بلكون|balcony/.test(value)) return Maximize;
  if (/غسيل|laundry|مستودع|storage/.test(value)) return LayoutGrid;
  return CheckCircle2;
}

function CoverImage({ src, alt, onClick, priority = false }: { src: string; alt: string; onClick?: () => void; priority?: boolean }) {
  return (
    <OptimizedCoverImage
      src={src}
      alt={alt}
      sizes="(max-width: 1400px) 100vw, 1400px"
      quality={75}
      priority={priority}
      onClick={onClick}
      className={onClick ? "cursor-pointer" : undefined}
    />
  );
}

function UnitDetailSkeleton() {
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
      <section className="w-full px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px] grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      </section>
    </div>
  );
}

export function UnitDetail({ unitId }: UnitDetailProps) {
  const { isRtl, locale } = useLocale();
  const { label, matchedLabels } = useMenuOptions();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [galleryDirection, setGalleryDirection] = useState(1);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const now = useNow();

  useEffect(() => {
    setCurrentImageIdx(0);
    setLightboxIndex(null);
    setGalleryDirection(1);
    setIsSalesModalOpen(false);
  }, [unitId]);

  const results = useQueries({
    queries: [
      { queryKey: ["units"], queryFn: () => unitsService.getUnits() },
      { queryKey: ["properties"], queryFn: () => propertiesService.getProperties() },
      { queryKey: ["cities"], queryFn: () => citiesService.getCities() },
    ],
  });

  const units = (results[0].data || []) as Unit[];
  const properties = (results[1].data || []) as Property[];
  const cities = (results[2].data || []) as City[];
  const isPending = results.some((item) => item.isPending);
  const lookupKey = decodeURIComponent(unitId);
  const unit =
    units.find((item) => item.slug === lookupKey || item.id === lookupKey) || null;
  const independent = unit?.projectId === "independent";
  const property = !independent && unit ? properties.find((item) => item.id === unit.projectId) || null : null;
  const notFound =
    !isPending && (!unit || (!independent && (!property || !isPublicProject(property.status))));
  useRecordPublicView("unit", unit?.id, !isPending && !notFound);

  const gallery = useMemo(() => galleryFrom(unit), [unit]);
  const currentImage = gallery[currentImageIdx] || gallery[0] || "";
  const model = unit?.modelId ? property?.models?.find((item) => item.id === unit.modelId) : undefined;
  const areas = unit ? unitAreas(unit, property) : { total: 0, internal: 0, external: 0 };
  const displayNumber = unit ? displayUnitNumber(unit, property) : "";
  const city = cities.find((item) => item.id === (independent ? unit?.cityId : property?.cityId));
  const address = [neighborhoodLabel(city, independent ? unit?.neighborhoodId : property?.neighborhoodId, locale), named(city, locale)]
    .filter(Boolean)
    .join(isRtl ? "، " : ", ");
  const typeLabel = label(unit?.unitType || "") || unit?.unitType?.trim() || "";
  const projectName = property?.name?.trim() || "";
  const projectHref = property ? propertyPublicPath(property) : "";
  const floor = floorLabel(unit?.floor, isRtl);
  const buildingCode = property?.buildings?.find((item) => item.id === unit?.buildingId)?.code?.trim() || "";
  const isSold = unit?.status !== "available";
  const statusLabel = isSold ? (isRtl ? "مباع" : "Sold") : isRtl ? "متاح" : "Available";
  const price = Number(unit?.price) || 0;
  const discount = getActiveUnitDiscount(unit, now);
  const hasDiscount = Boolean(discount);
  const discountedPrice = discount ? discount.salePrice : price;
  const condition = independent ? conditionLabel(unit?.condition) : "";
  const age = independent ? ageLabel(unit?.age, isRtl) : "";
  const title = `${typeLabel || (isRtl ? "وحدة" : "Unit")} ${displayNumber}`.trim();
  const affiliationLabel = independent
    ? (isRtl ? "وحدة مستقلة" : "Independent unit")
    : projectName
      ? (isRtl ? `تابعة لمشروع ${projectName}` : `Part of ${projectName}`)
      : "";

  const features = matchedLabels(Array.isArray(unit?.features) ? unit.features : undefined);
  const components = matchedLabels(Array.isArray(unit?.additionalComponents) ? unit.additionalComponents : undefined);
  const facades = matchedLabels(Array.isArray(unit?.facade) ? unit.facade : undefined);
  const rooms = Number(unit?.roomsCount) || Number(model?.roomsCount) || 0;
  const baths = Number(unit?.bathroomsCount) || Number(model?.bathroomsCount) || 0;

  const stats = [
    affiliationLabel ? { label: isRtl ? "التبعية" : "Affiliation", value: independent ? (isRtl ? "وحدة مستقلة" : "Independent") : projectName } : null,
    areas.total ? { label: isRtl ? "المساحة الإجمالية" : "Total Area", value: formatArea(areas.total, isRtl), accent: true } : null,
    areas.internal ? { label: isRtl ? "المساحة الداخلية" : "Internal Area", value: formatArea(areas.internal, isRtl) } : null,
    areas.external ? { label: isRtl ? "المساحة الخارجية" : "External Area", value: formatArea(areas.external, isRtl) } : null,
    rooms ? { label: isRtl ? "غرف النوم" : "Bedrooms", value: String(rooms) } : null,
    baths ? { label: isRtl ? "الحمامات" : "Bathrooms", value: String(baths) } : null,
    floor ? { label: isRtl ? "الدور" : "Floor", value: floor } : null,
    buildingCode ? { label: isRtl ? "المبنى" : "Building", value: buildingCode } : null,
    model?.name?.trim() ? { label: isRtl ? "النموذج" : "Model", value: model.name.trim() } : null,
    typeLabel ? { label: isRtl ? "نوع الوحدة" : "Unit type", value: typeLabel } : null,
    facades.length ? { label: isRtl ? "الواجهة" : "Facing", value: facades.join(isRtl ? "، " : ", ") } : null,
    condition ? { label: isRtl ? "أهلية الوحدة" : "Unit condition", value: label(condition) || condition } : null,
    age ? { label: isRtl ? "عمر الوحدة" : "Unit age", value: age } : null,
    independent && unit?.commissionOption
      ? { label: isRtl ? "السعي" : "Commission", value: label(unit.commissionOption) || unit.commissionOption }
      : null,
  ].filter(Boolean) as { label: string; value: string; accent?: boolean }[];

  const featureTiles = [...components, ...features]
    .filter((item, index, list) => list.indexOf(item) === index)
    .map((item) => ({ label: item, Icon: featureIcon(item) }));

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

  if (isPending) return <UnitDetailSkeleton />;

  if (notFound || !unit) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 bg-[#fcfcfc] px-6 text-center">
        <p className="text-xl font-bold text-[#2e2e2e]">{isRtl ? "الوحدة غير موجودة" : "Unit not found"}</p>
        <Link href="/units" className="text-sm font-bold text-[#6A2B92] hover:underline">
          {isRtl ? "العودة إلى الوحدات" : "Back to units"}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#fcfcfc] pb-24">
      {lightboxIndex !== null && gallery.length > 0 && (
        <Lightbox
          images={gallery}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      <SalesContactModal
        isOpen={isSalesModalOpen}
        onClose={() => setIsSalesModalOpen(false)}
        unitId={displayNumber}
        projectName={projectName || undefined}
      />

      <section className="w-full px-6 pt-12 pb-8 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px] flex flex-col lg:flex-row justify-between items-start gap-6">
          <div className="flex flex-col items-start text-start">
            <nav className="mb-2 flex items-center gap-1 text-xs font-semibold text-gray-400">
              <Link href="/" className="hover:text-[#6A2B92]">{isRtl ? "الرئيسية" : "Home"}</Link>
              <span>/</span>
              <Link href="/units" className="hover:text-[#6A2B92]">{isRtl ? "الوحدات" : "Units"}</Link>
              {property ? (
                <>
                  <span>/</span>
                  <Link href={projectHref} className="hover:text-[#6A2B92]">
                    {projectName}
                  </Link>
                </>
              ) : null}
              <span>/</span>
              <span className="text-gray-600">{displayNumber}</span>
            </nav>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#2e2e2e] tracking-tight mb-2">
              {title}
            </h1>
            {address ? (
              <p className="text-lg font-medium text-gray-500 mb-2">{address}</p>
            ) : null}
            {affiliationLabel ? (
              independent ? (
                <p className="mb-2 text-sm font-bold text-[#6A2B92]">{affiliationLabel}</p>
              ) : (
                <p className="mb-2 text-sm font-bold text-[#6A2B92]">
                  {isRtl ? "تابعة لمشروع " : "Part of "}
                  <Link href={projectHref} className="underline-offset-4 hover:underline">
                    {projectName}
                  </Link>
                </p>
              )
            ) : null}
            {price > 0 ? (
              <div className="mt-8">
                <p className="text-[15px] font-medium text-[#65676B]">{isRtl ? "السعر" : "Price"}</p>
                <div className="mt-1 flex flex-wrap items-end gap-3">
                  <div>
                    {hasDiscount && discount ? (
                      <p className="mb-1 text-sm font-medium text-[#65676B] line-through decoration-[#65676B]">
                        <span dir="ltr" className="tabular-nums">
                          {price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>{" "}
                        {isRtl ? "ر.س" : "SAR"}
                      </p>
                    ) : null}
                    <p className="flex flex-wrap items-baseline gap-x-2 text-[40px] font-semibold leading-none tracking-tight text-[#1C1E21]">
                      <span dir="ltr" className="tabular-nums">
                        {(hasDiscount && discount ? discountedPrice : price).toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                      <span className="text-[17px] font-medium text-[#65676B]">{isRtl ? "ر.س" : "SAR"}</span>
                    </p>
                  </div>
                  {hasDiscount && discount ? (
                    <UnitDiscountBadge
                      percent={discount.percent}
                      daysLeft={discount.daysLeft}
                      isRtl={isRtl}
                      className="mb-1"
                    />
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col items-start lg:items-end gap-4">
            <div className="flex flex-wrap items-center gap-2 flex-row-reverse">
              {independent ? (
                <span className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700">
                  <Home className="h-3.5 w-3.5" />
                  {isRtl ? "وحدة مستقلة" : "Independent"}
                </span>
              ) : projectName ? (
                <Link
                  href={projectHref}
                  className="flex max-w-[240px] items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 hover:border-[#6A2B92]/30 hover:text-[#6A2B92]"
                >
                  <Building2 className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{projectName}</span>
                </Link>
              ) : typeLabel ? (
                <span className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700">
                  <Home className="h-3.5 w-3.5" />
                  {typeLabel}
                </span>
              ) : null}
              {typeLabel && (independent || projectName) ? (
                <span className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600">
                  {typeLabel}
                </span>
              ) : null}
              {floor ? (
                <span className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600">
                  {floor}
                </span>
              ) : null}
              <span className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border",
                isSold ? "bg-red-50 text-red-500 border-red-100" :
                "bg-green-100/60 text-green-700 border-green-200"
              )}>
                {statusLabel}
              </span>
              <MostViewedBadge views={unit.views} />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <ShareButton
                variant="unit"
                title={projectName ? `${projectName} - ${displayNumber}` : title}
                url={unitPublicPath(unit)}
              />
              {property ? (
                <Link href={projectHref} className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#6A2B92]">
                  {isRtl ? <ArrowUpLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  {isRtl ? "العودة للمشروع" : "Back to Project"}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-6 pb-12 md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="relative aspect-[16/7] w-full overflow-hidden rounded-3xl bg-gray-200 group select-none">
            <AnimatePresence initial={false} custom={galleryDirection}>
              <motion.div
                key={`${unitId}-${currentImageIdx}`}
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
                  alt={displayNumber}
                  priority={currentImageIdx === 0}
                  onClick={gallery.length ? () => setLightboxIndex(currentImageIdx) : undefined}
                />
              </motion.div>
            </AnimatePresence>
            <MostViewedBadge views={unit.views} className="pointer-events-none absolute top-5 start-5 z-20" />
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
        <div className="mx-auto flex max-w-[1400px] flex-col-reverse gap-10 lg:flex-row lg:gap-16">
          <aside className="w-full lg:w-[350px] shrink-0">
            <div className="flex flex-col gap-5 sticky top-24">
              <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <button
                  onClick={() => setIsSalesModalOpen(true)}
                  className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-bold transition-colors",
                  isSold ? "bg-[#f7f7f7] text-gray-400 cursor-not-allowed" : "bg-[#f7f7f7] text-gray-700 hover:bg-gray-100"
                )} disabled={isSold}>
                  <Headset className="h-5 w-5" />
                  {isRtl ? "طلب اهتمام" : "Request Interest"}
                </button>
                <p className="mt-4 text-xs font-medium text-gray-400 text-center">
                  {isSold
                    ? (isRtl ? "الوحدة مباعة" : "Unit is sold")
                    : (isRtl ? "سجل اهتمامك وسيتواصل معك فريقنا" : "Register and our team will contact you")
                  }
                </p>
              </div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col gap-16">
            {stats.length > 0 ? (
              <div>
                <div className="flex flex-col mb-6 items-end text-end">
                  <span className="text-xs font-bold text-gray-400 mb-1">{isRtl ? "عن الوحدة" : "About the unit"}</span>
                  <h2 className="text-3xl font-black text-[#2e2e2e]">
                    {isRtl ? "تفاصيل الوحدة" : "Unit Details"}
                  </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 rounded-2xl border p-6 shadow-sm transition-colors",
                        stat.accent
                          ? "border-[#17C3B3]/30 bg-[#17C3B3]/10 hover:bg-[#17C3B3]/15"
                          : "border-gray-100 bg-white hover:border-[#6A2B92]/20 hover:bg-[#6A2B92]/5"
                      )}
                    >
                      <span className={cn("text-xs font-bold", stat.accent ? "text-[#17C3B3]" : "text-gray-400")}>
                        {stat.label}
                      </span>
                      <span className={cn("text-lg font-black text-center", stat.accent ? "text-[#0f766e]" : "text-[#2e2e2e]")}>
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {featureTiles.length > 0 ? (
              <div>
                <div className="flex flex-col mb-10 items-end text-end">
                  <span className="text-xs font-bold text-gray-400 mb-1">{isRtl ? "المميزات" : "Features"}</span>
                  <h2 className="text-3xl font-black text-[#2e2e2e]">
                    {isRtl ? "مميزات الوحدة" : "Unit Features"}
                  </h2>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 sm:gap-4">
                  {featureTiles.map((feat, index) => (
                    <div key={`${feat.label}-${index}`} className="flex flex-col items-center justify-center gap-3">
                      <div className="group flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#17C3B3]/30">
                        <feat.Icon className="h-7 w-7 text-[#17C3B3] transition-colors duration-300 group-hover:text-[#6A2B92]" strokeWidth={1.5} />
                      </div>
                      <span className="text-xs font-bold text-gray-500 text-center">{feat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {(unit.adInfo || []).some((item) => item.trim()) ? (
              <AdvertisementInfoCard
                items={unit.adInfo}
                title={isRtl ? "معلومات الاعلان" : "Advertisement info"}
              />
            ) : null}

          </div>
        </div>
      </section>
    </div>
  );
}
