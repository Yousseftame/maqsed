"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { type Property } from "@/features/admin/projects/properties.service";
import { type City } from "@/features/admin/cities/data";
import { useLocale } from "@/components/providers/LocaleProvider";

type ViewProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  cities: City[];
  unitsCount?: number;
};

export function ViewProjectModal({ isOpen, onClose, property, cities, unitsCount }: ViewProjectModalProps) {
  const { locale } = useLocale();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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
                  <DetailRow label="المدينة" value={cityName} />
                  <DetailRow label="الحي" value={neighborhoodName} />
                  <DetailRow label="نوع المشروع" value={property.projectType} />
                  <DetailRow label="فئة المشروع" value={property.category} />
                </div>
                {property.mapsLink && (
                  <div className="mt-4">
                    <DetailRow
                      label="رابط الموقع (Google Maps)"
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
                            
                            {((m.features && m.features.length > 0) || (m.additionalComponents && m.additionalComponents.length > 0) || (m.facade && m.facade.length > 0)) && (
                              <div className="mt-3 flex flex-col gap-2 border-t border-[#0a0f1d]/10 pt-3">
                                {m.additionalComponents && m.additionalComponents.length > 0 && (
                                  <div>
                                    <span className="text-[10px] font-bold text-[#8c8c8c] block mb-1">المكونات الإضافية:</span>
                                    <div className="flex flex-wrap gap-1">
                                      {m.additionalComponents.map((f: string) => (
                                        <span key={f} className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#0a0f1d]/10">{f}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {m.features && m.features.length > 0 && (
                                  <div>
                                    <span className="text-[10px] font-bold text-[#8c8c8c] block mb-1">المميزات:</span>
                                    <div className="flex flex-wrap gap-1">
                                      {m.features.map((f: string) => (
                                        <span key={f} className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#0a0f1d]/10">{f}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {m.facade && m.facade.length > 0 && (
                                  <div>
                                    <span className="text-[10px] font-bold text-[#8c8c8c] block mb-1">الواجهة:</span>
                                    <div className="flex flex-wrap gap-1">
                                      {m.facade.map((f: string) => (
                                        <span key={f} className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#0a0f1d]/10">{f}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
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
                    <div className="flex flex-wrap gap-2">
                      {property.features?.map((f) => (
                        <span key={f} className="rounded-full bg-[#F4F4F4] px-4 py-2 text-sm font-bold text-[#0a0f1d]">{f}</span>
                      ))}
                      {(!property.features || property.features.length === 0) && <span className="text-sm font-medium text-[#8c8c8c]">لا يوجد</span>}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-[#8c8c8c]">خدمات ما بعد البيع</h4>
                    <div className="flex flex-wrap gap-2">
                      {property.services?.map((f) => (
                        <span key={f} className="rounded-full bg-[#F4F4F4] px-4 py-2 text-sm font-bold text-[#0a0f1d]">{f}</span>
                      ))}
                      {(!property.services || property.services.length === 0) && <span className="text-sm font-medium text-[#8c8c8c]">لا يوجد</span>}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-[#8c8c8c]">الضمانات</h4>
                    <div className="flex flex-wrap gap-2">
                      {property.guarantees?.map((f) => (
                        <span key={f} className="rounded-full bg-[#F4F4F4] px-4 py-2 text-sm font-bold text-[#0a0f1d]">{f}</span>
                      ))}
                      {(!property.guarantees || property.guarantees.length === 0) && <span className="text-sm font-medium text-[#8c8c8c]">لا يوجد</span>}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-3 text-sm font-bold text-[#8c8c8c]">المواقع القريبة</h4>
                    <div className="flex flex-wrap gap-2">
                      {property.locations?.map((f) => (
                        <span key={f} className="rounded-full bg-[#F4F4F4] px-4 py-2 text-sm font-bold text-[#0a0f1d]">{f}</span>
                      ))}
                      {(!property.locations || property.locations.length === 0) && <span className="text-sm font-medium text-[#8c8c8c]">لا يوجد</span>}
                    </div>
                  </div>
                </div>
              </div>

              {property.images && property.images.length > 0 && (
                <>
                  <hr className="my-8 border-[#0a0f1d]/10" />
                  <div className="mb-8">
                    <h3 className="mb-5 text-lg font-bold tracking-tight text-[#0a0f1d]">الصور والوسائط</h3>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                      {property.images.map((img, i) => (
                        <div key={i} className="aspect-[3/2] overflow-hidden rounded-[16px] bg-[#F4F4F4]">
                          <img src={img} alt={`صورة ${i + 1}`} className="h-full w-full object-cover" />
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
