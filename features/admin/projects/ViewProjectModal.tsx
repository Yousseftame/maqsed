"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Car, X } from "lucide-react";
import { type Property } from "@/features/admin/projects/properties.service";
import { type City } from "@/features/admin/cities/data";
import { useLocale } from "@/components/providers/LocaleProvider";
import { MenuValuePills } from "@/features/admin/menus/MenuValuePills";
import { asStringArray } from "@/features/admin/menus/menu-options.service";
import { AdvertisementInfoAdminBlock } from "@/features/admin/shared/AdvertisementInfoView";

type ViewProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  cities: City[];
  unitsCount?: number;
};

export function ViewProjectModal({ isOpen, onClose, property, cities, unitsCount }: ViewProjectModalProps) {
  const { locale } = useLocale();
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setActiveImage(0);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, property?.id]);

  if (!property) return null;

  const city = cities.find((c) => c.id === property.cityId);
  const neighborhood = city?.neighborhoods.find((n: any) => n.id === property.neighborhoodId);

  const cityName = city?.name[locale] || property.cityId;
  const neighborhoodName = neighborhood?.name[locale] || property.neighborhoodId;

  const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex flex-col gap-1 rounded-[16px] bg-[#F4F4F4] p-4">
      <span className="text-sm font-bold text-[#8c8c8c]">{label}</span>
      <span className="text-base font-bold text-[#0a0f1d]">{value || "—"}</span>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[#0a0f1d]/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#0a0f1d]/10 px-6 py-5 sm:px-8">
              <h2 className="text-2xl font-bold tracking-tight text-[#0a0f1d]">
                تفاصيل المشروع: {property.name}
              </h2>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a0f1d]/5 text-[#0a0f1d] transition-colors hover:bg-[#0a0f1d]/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar sm:px-8">
              
              {/* البيانات الأساسية */}
              <div className="mb-8">
                <h3 className="mb-5 text-lg font-bold tracking-tight text-[#0a0f1d]">البيانات الأساسية</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <DetailRow label="اسم المشروع" value={property.name} />
                  {property.slug ? <DetailRow label="رابط المشروع" value={`/properties/${property.slug}`} /> : null}
                  <DetailRow label="المدينة" value={cityName} />
                  <DetailRow label="الحي" value={neighborhoodName} />
                  <DetailRow label="نوع المشروع" value={property.projectType} />
                  <DetailRow label="فئة المشروع" value={property.category} />
                </div>
                {(property.developerName || property.developerLogo || property.contractorName || property.contractorLogo) && (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {(property.developerName || property.developerLogo) && (
                      <div className="flex items-center gap-4 rounded-[16px] bg-[#F4F4F4] p-4">
                        {property.developerLogo ? (
                          <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-1.5">
                            <img src={property.developerLogo} alt={property.developerName || "المطور"} className="max-h-full max-w-full object-contain" />
                          </span>
                        ) : null}
                        <div className="min-w-0">
                          <span className="text-sm font-bold text-[#8c8c8c]">المطور</span>
                          <div className="truncate text-base font-bold text-[#0a0f1d]">{property.developerName || "—"}</div>
                        </div>
                      </div>
                    )}
                    {(property.contractorName || property.contractorLogo) && (
                      <div className="flex items-center gap-4 rounded-[16px] bg-[#F4F4F4] p-4">
                        {property.contractorLogo ? (
                          <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-1.5">
                            <img src={property.contractorLogo} alt={property.contractorName || "المقاول"} className="max-h-full max-w-full object-contain" />
                          </span>
                        ) : null}
                        <div className="min-w-0">
                          <span className="text-sm font-bold text-[#8c8c8c]">المقاول</span>
                          <div className="truncate text-base font-bold text-[#0a0f1d]">{property.contractorName || "—"}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {property.description && property.description.trim() && (
                  <div className="mt-4">
                    <DetailRow label="وصف المشروع" value={<span className="whitespace-pre-wrap font-medium leading-7">{property.description}</span>} />
                  </div>
                )}
                {property.mapsLink && (
                  <div className="mt-4">
                    <DetailRow
                      label="رابط موقع المشروع"
                      value={
                        <a href={property.mapsLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                          {property.mapsLink}
                        </a>
                      }
                    />
                  </div>
                )}
                {property.brochureLink && (
                  <div className="mt-4">
                    <DetailRow
                      label="رابط البروشور (Brochure)"
                      value={
                        <a href={property.brochureLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                          {property.brochureLink}
                        </a>
                      }
                    />
                  </div>
                )}
              </div>

              <hr className="my-8 border-[#0a0f1d]/10" />

              {/* الأرقام والتوليد */}
              <div className="mb-8">
                <h3 className="mb-5 text-lg font-bold tracking-tight text-[#0a0f1d]">بيانات التوليد والأرقام المسموحة</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <DetailRow label="الحد الأقصى للمباني" value={property.buildingsCount} />
                  <DetailRow label="الحد الأقصى للنماذج" value={property.modelsCount} />
                  <DetailRow label="إجمالي الوحدات المضافة" value={unitsCount !== undefined ? unitsCount : "0"} />
                </div>
              </div>

              {/* قائمة المباني */}
              {property.buildings && property.buildings.length > 0 && (
                <>
                  <hr className="my-8 border-[#0a0f1d]/10" />
                  <div className="mb-8">
                    <h3 className="mb-5 text-lg font-bold tracking-tight text-[#0a0f1d]">المباني المضافة ({property.buildings.length})</h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {property.buildings.map((b) => (
                        <div key={b.id} className="rounded-[16px] border border-[#0a0f1d]/10 bg-[#F4F4F4] p-4">
                          <h4 className="mb-2 text-base font-bold text-[#0a0f1d]">مبنى {b.code}</h4>
                          <div className="flex justify-between text-sm font-bold text-[#8c8c8c]">
                            <span>{b.floorsCount} دور</span>
                            <span>{b.expectedUnitsCount} وحدة</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* قائمة النماذج */}
              {property.models && property.models.length > 0 && (
                <>
                  <hr className="my-8 border-[#0a0f1d]/10" />
                  <div className="mb-8">
                    <h3 className="mb-5 text-lg font-bold tracking-tight text-[#0a0f1d]">النماذج المضافة ({property.models.length})</h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {property.models.map((m) => (
                        <div key={m.id} className="flex flex-col overflow-hidden rounded-[16px] border border-[#0a0f1d]/10 bg-[#F4F4F4]">
                          {m.blueprintImage && (
                            <div className="h-32 w-full bg-white">
                              <img src={m.blueprintImage} alt={m.name} className="h-full w-full object-cover" />
                            </div>
                          )}
                          <div className="p-4">
                            <h4 className="mb-1 text-base font-bold text-[#0a0f1d]">{m.name}</h4>
                            <p className="mb-3 text-xs font-bold text-[#8c8c8c]">{m.propertyType}</p>
                            <div className="flex justify-between text-sm font-bold text-[#0a0f1d] mb-1">
                              <span>{m.roomsCount} غرف • {m.bathroomsCount} حمام</span>
                              <span>{m.defaultPrice ? `${m.defaultPrice.toLocaleString()} ر.س` : ""}</span>
                            </div>
                            {(m.totalArea || 0) > 0 && (
                              <div className="text-xs font-bold text-[#8c8c8c] mb-2">
                                المساحة: {m.totalArea} م² 
                                {m.internalArea || m.externalArea ? ` (داخلية: ${m.internalArea || 0} م² • خارجية: ${m.externalArea || 0} م²)` : ""}
                              </div>
                            )}
                            
                            {(() => {
                              const extraComponents = asStringArray(m.additionalComponents);
                              const extraFeatures = asStringArray(m.features);
                              const extraFacade = asStringArray(m.facade);
                              if (extraComponents.length + extraFeatures.length + extraFacade.length === 0) return null;
                              return (
                              <div className="mt-3 flex flex-col gap-2 border-t border-[#0a0f1d]/10 pt-3">
                                {extraComponents.length > 0 && (
                                  <div>
                                    <span className="text-[10px] font-bold text-[#8c8c8c] block mb-1">المكونات الإضافية:</span>
                                    <MenuValuePills values={extraComponents} size="sm" />
                                  </div>
                                )}
                                {extraFeatures.length > 0 && (
                                  <div>
                                    <span className="text-[10px] font-bold text-[#8c8c8c] block mb-1">المميزات:</span>
                                    <MenuValuePills values={extraFeatures} size="sm" />
                                  </div>
                                )}
                                {extraFacade.length > 0 && (
                                  <div>
                                    <span className="text-[10px] font-bold text-[#8c8c8c] block mb-1">الواجهة:</span>
                                    <MenuValuePills values={extraFacade} size="sm" />
                                  </div>
                                )}
                              </div>
                              );
                            })()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <hr className="my-8 border-[#0a0f1d]/10" />

              {/* مميزات وخدمات */}
              <div className="mb-8">
                <h3 className="mb-5 text-lg font-bold tracking-tight text-[#0a0f1d]">المميزات والمرافق</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-[#8c8c8c]">مميزات المشروع</h4>
                    <MenuValuePills values={property.features} />
                  </div>
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-[#8c8c8c]">خدمات ما بعد البيع</h4>
                    <MenuValuePills values={property.services} />
                  </div>
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-[#8c8c8c]">الضمانات</h4>
                    <MenuValuePills values={property.guarantees} />
                  </div>
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-[#8c8c8c]">العروض الخاصة</h4>
                    <MenuValuePills values={property.offers} />
                  </div>
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-[#8c8c8c]">المواقع القريبة</h4>
                    <MenuValuePills values={property.locations} />
                  </div>
                </div>
              </div>

              {property.nearbyPlaces && property.nearbyPlaces.length > 0 && (
                <>
                  <hr className="my-8 border-[#0a0f1d]/10" />
                  <div className="mb-8">
                    <p className="mb-1 text-sm font-medium text-[#8c8c8c]">الأماكن القريبة</p>
                    <h3 className="mb-5 text-2xl font-bold tracking-tight text-[#0a0f1d]">على بُعد دقائق</h3>
                    <div className="divide-y divide-[#0a0f1d]/10 border-y border-[#0a0f1d]/10">
                      {property.nearbyPlaces.map((place, index) => (
                        <div key={`${place.name}-${index}`} className="flex items-center justify-between gap-4 py-4">
                          <div className="flex items-center gap-3">
                            <Car className="h-5 w-5 shrink-0 text-[#17C3B3]" strokeWidth={2.2} />
                            <span className="text-base font-bold text-[#0a0f1d]">{place.name}</span>
                          </div>
                          <span className="text-sm font-medium text-[#8c8c8c] tabular-nums">
                            {place.minutes} دقائق
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {property.adInfo && property.adInfo.length > 0 && (
                <>
                  <hr className="my-8 border-[#0a0f1d]/10" />
                  <AdvertisementInfoAdminBlock items={property.adInfo} />
                </>
              )}
              {property.images && property.images.length > 0 && (
                <>
                  <hr className="my-8 border-[#0a0f1d]/10" />
                  <div className="mb-8">
                    <h3 className="mb-5 text-lg font-bold tracking-tight text-[#0a0f1d]">الصور والوسائط</h3>
                    <div className="relative overflow-hidden rounded-[20px] bg-[#F4F4F4]">
                      <div className="aspect-[16/8] w-full">
                        <img
                          src={property.images[activeImage] || property.images[0]}
                          alt={property.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      {activeImage === 0 && (
                        <span className="absolute bottom-4 start-4 rounded-full bg-[#0a0f1d] px-3 py-1 text-xs font-bold text-white">
                          الغلاف
                        </span>
                      )}
                    </div>
                    {property.images.length > 1 && (
                      <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
                        {property.images.map((img, i) => (
                          <button
                            key={`${img}-${i}`}
                            type="button"
                            onClick={() => setActiveImage(i)}
                            className={`relative aspect-[3/2] overflow-hidden rounded-[12px] bg-[#F4F4F4] ring-2 transition-all ${
                              activeImage === i ? "ring-[#0a0f1d]" : "ring-transparent hover:ring-[#0a0f1d]/20"
                            }`}
                          >
                            <img src={img} alt={`صورة ${i + 1}`} className="h-full w-full object-cover" />
                            {i === 0 && (
                              <span className="absolute bottom-1 start-1 rounded-full bg-[#0a0f1d]/90 px-1.5 py-0.5 text-[9px] font-bold text-white">
                                غلاف
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {property.partnerLogos && property.partnerLogos.length > 0 && (
                <>
                  <hr className="my-8 border-[#0a0f1d]/10" />
                  <div className="mb-8">
                    <h3 className="mb-5 text-lg font-bold tracking-tight text-[#0a0f1d]">شركاء النجاح</h3>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
                      {property.partnerLogos.map((logo, i) => (
                        <div key={`${logo}-${i}`} className="flex aspect-square items-center justify-center overflow-hidden rounded-[16px] border border-[#0a0f1d]/10 bg-white p-4">
                          <img src={logo} alt={`شريك ${i + 1}`} className="max-h-full max-w-full object-contain" />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

            </div>

            {/* Footer */}
            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#0a0f1d]/10 bg-white px-6 py-5 sm:px-8">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#F4F4F4] px-8 text-sm font-bold text-[#0a0f1d] hover:bg-[#EAEAEA]"
              >
                إغلاق
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
