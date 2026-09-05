"use client";

import { AnimatePresence, motion } from "motion/react";
import { X, MapPin, Building2, Bed, Bath, Expand, Tag, Info, Eye } from "lucide-react";
import type { Unit } from "@/features/admin/units/units.service";
import { useLocale } from "@/components/providers/LocaleProvider";
import { StatusBadge } from "@/features/admin/ui/StatusBadge";

interface ViewUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit?: any | null;
}

export function ViewUnitModal({ isOpen, onClose, unit }: ViewUnitModalProps) {
  if (!unit) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0a0f1d]/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#0a0f1d]/10 px-6 py-5 sm:px-8">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold tracking-tight text-[#0a0f1d]">
                  تفاصيل الوحدة: {unit.displayUnitNumber || unit.unitNumber}
                </h2>
                <StatusBadge tone={unit.status === "available" ? "success" : "default"}>
                  {unit.status === "available" ? "متاحة" : "مباعة/مؤجرة"}
                </StatusBadge>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-[#8c8c8c] transition-colors hover:bg-[#F4F4F4] hover:text-[#0a0f1d]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar sm:px-8 bg-[#FAF9F6] space-y-8">
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-[16px] bg-white p-4 shadow-sm border border-[#0a0f1d]/5">
                  <div className="flex items-center gap-2 text-[#8c8c8c] mb-2">
                    <Tag className="w-4 h-4" />
                    <span className="text-sm font-medium">السعر</span>
                  </div>
                  <div className="text-xl font-bold text-[#0a0f1d]">{unit.price.toLocaleString()} ر.س</div>
                </div>
                <div className="rounded-[16px] bg-white p-4 shadow-sm border border-[#0a0f1d]/5">
                  <div className="flex items-center gap-2 text-[#8c8c8c] mb-2">
                    <Expand className="w-4 h-4" />
                    <span className="text-sm font-medium">المساحة</span>
                  </div>
                  <div className="text-xl font-bold text-[#0a0f1d]">{unit.totalArea} م²</div>
                  {(unit.modelInternalArea || unit.modelExternalArea) && (
                    <div className="mt-1.5 text-[10px] text-[#8c8c8c] leading-relaxed">
                      <span>داخلية {unit.modelInternalArea || 0} م²</span>
                      <span className="mx-1">|</span>
                      <span>خارجية {unit.modelExternalArea || 0} م²</span>
                    </div>
                  )}
                </div>
                <div className="rounded-[16px] bg-white p-4 shadow-sm border border-[#0a0f1d]/5">
                  <div className="flex items-center gap-2 text-[#8c8c8c] mb-2">
                    <Bed className="w-4 h-4" />
                    <span className="text-sm font-medium">الغرف</span>
                  </div>
                  <div className="text-xl font-bold text-[#0a0f1d]">{unit.roomsCount}</div>
                </div>
                <div className="rounded-[16px] bg-white p-4 shadow-sm border border-[#0a0f1d]/5">
                  <div className="flex items-center gap-2 text-[#8c8c8c] mb-2">
                    <Bath className="w-4 h-4" />
                    <span className="text-sm font-medium">دورات المياه</span>
                  </div>
                  <div className="text-xl font-bold text-[#0a0f1d]">{unit.bathroomsCount}</div>
                </div>
                {unit.views !== undefined && (
                  <div className="rounded-[16px] bg-white p-4 shadow-sm border border-[#0a0f1d]/5">
                    <div className="flex items-center gap-2 text-[#8c8c8c] mb-2">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">المشاهدات</span>
                    </div>
                    <div className="text-xl font-bold text-[#0a0f1d]">{unit.views?.toLocaleString()}</div>
                  </div>
                )}
              </div>

              {/* Data Grid */}
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="text-lg font-bold text-[#0a0f1d] mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-[#8c8c8c]" />
                    البيانات الأساسية
                  </h3>
                  <div className="bg-white rounded-[16px] border border-[#0a0f1d]/5 overflow-hidden">
                    <div className="flex justify-between py-3 px-4 border-b border-[#0a0f1d]/5">
                      <span className="text-sm text-[#8c8c8c]">نوع الوحدة</span>
                      <span className="text-sm font-semibold">{unit.unitType}</span>
                    </div>
                    <div className="flex justify-between py-3 px-4 border-b border-[#0a0f1d]/5">
                      <span className="text-sm text-[#8c8c8c]">العملية</span>
                      <span className="text-sm font-semibold">{unit.operationType}</span>
                    </div>
                    {unit.discountActive && (
                      <div className="flex justify-between py-3 px-4 bg-green-50">
                        <span className="text-sm text-green-700 font-bold">نسبة الخصم</span>
                        <span className="text-sm font-bold text-green-700">
                          {unit.discountPercentage}% 
                          {unit.discountDays ? ` (لمدة ${unit.discountDays} يوم)` : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#0a0f1d] mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#8c8c8c]" />
                    الموقع والتبعية
                  </h3>
                  <div className="bg-white rounded-[16px] border border-[#0a0f1d]/5 overflow-hidden">
                    <div className="flex justify-between py-3 px-4 border-b border-[#0a0f1d]/5">
                      <span className="text-sm text-[#8c8c8c]">المشروع / التبعية</span>
                      <span className="text-sm font-semibold">{unit.projectLabel || (unit.projectId === "independent" ? "وحدة مستقلة" : "مشروع")}</span>
                    </div>
                    <div className="flex justify-between py-3 px-4 border-b border-[#0a0f1d]/5">
                      <span className="text-sm text-[#8c8c8c]">الموقع / المبنى</span>
                      <span className="text-sm font-semibold">{unit.locationLabel || "-"}</span>
                    </div>
                    {unit.floor && (
                      <div className="flex justify-between py-3 px-4">
                        <span className="text-sm text-[#8c8c8c]">الدور</span>
                        <span className="text-sm font-semibold">{unit.floor}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags Section */}
              <div>
                <h3 className="text-lg font-bold text-[#0a0f1d] mb-4">التفاصيل الفنية</h3>
                
                {unit.features?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm text-[#8c8c8c] mb-2">مميزات الوحدة</h4>
                    <div className="flex flex-wrap gap-2">
                      {unit.features.map((f: string) => (
                        <span key={f} className="bg-[#F4F4F4] text-[#0a0f1d] px-3 py-1 rounded-full text-sm font-medium">{f}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {unit.additionalComponents?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm text-[#8c8c8c] mb-2">المكونات الإضافية</h4>
                    <div className="flex flex-wrap gap-2">
                      {unit.additionalComponents.map((f: string) => (
                        <span key={f} className="bg-[#F4F4F4] text-[#0a0f1d] px-3 py-1 rounded-full text-sm font-medium">{f}</span>
                      ))}
                    </div>
                  </div>
                )}

                {unit.facade?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm text-[#8c8c8c] mb-2">الواجهة</h4>
                    <div className="flex flex-wrap gap-2">
                      {unit.facade.map((f: string) => (
                        <span key={f} className="bg-[#F4F4F4] text-[#0a0f1d] px-3 py-1 rounded-full text-sm font-medium">{f}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Independent Unit Data */}
              {unit.projectId === "independent" && (
                <div>
                  <h3 className="text-lg font-bold text-[#0a0f1d] mb-4">بيانات الوحدة المستقلة</h3>
                  <div className="bg-white rounded-[16px] border border-[#0a0f1d]/5 overflow-hidden sm:w-1/2">
                    {unit.condition && (
                      <div className="flex justify-between py-3 px-4 border-b border-[#0a0f1d]/5">
                        <span className="text-sm text-[#8c8c8c]">حالة الوحدة</span>
                        <span className="text-sm font-semibold">{unit.condition}</span>
                      </div>
                    )}
                    {unit.age !== undefined && (
                      <div className="flex justify-between py-3 px-4 border-b border-[#0a0f1d]/5">
                        <span className="text-sm text-[#8c8c8c]">العمر الزمني</span>
                        <span className="text-sm font-semibold">{unit.age === 0 ? "جديدة تماماً" : `${unit.age} سنوات`}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Images */}
              {unit.images && unit.images.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-[#0a0f1d] mb-4">صور الوحدة</h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {unit.images.map((url: string, idx: number) => (
                      <div key={idx} className="aspect-video overflow-hidden rounded-[16px] border border-[#0a0f1d]/10 bg-white">
                        <img src={url} alt="" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
            
            {/* Footer */}
            <div className="flex shrink-0 items-center justify-end border-t border-[#0a0f1d]/10 px-6 py-4 sm:px-8 bg-white">
              <button
                onClick={onClose}
                className="flex h-12 items-center justify-center rounded-full bg-[#0a0f1d] px-8 text-sm font-bold text-white transition-colors hover:bg-[#161c2d]"
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
