"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "react-hook-form";
import { UploadCloud, X, Loader2, Image as ImageIcon, Trash2, ChevronDown } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { citiesService } from "@/features/admin/cities/cities.service";
import { propertiesService } from "@/features/admin/projects/properties.service";
import { unitsService } from "@/features/admin/units/units.service";
import toast from "react-hot-toast";
import { useLocale } from "@/components/providers/LocaleProvider";

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  copyUnit?: any | null;
}

export function AddUnitModal({ isOpen, onClose, copyUnit }: AddUnitModalProps) {
  const { register, handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: {
      projectId: "independent",
      cityId: "",
      neighborhoodId: "",
      modelId: "",
      buildingId: "",
      floor: "",
      
      status: "available",
      unitNumber: "",
      unitType: "شقة سكنية",
      operationType: "للبيع",
      price: "",
      roomsCount: "",
      bathroomsCount: "",
      totalArea: "",

      discountActive: false,
      discountPercentage: "",
      discountDays: "",

      additionalComponents: [] as string[],
      features: [] as string[],
      facade: [] as string[],

      condition: "جديدة",
      age: "",
    },
  });

  const queryClient = useQueryClient();
  const { locale, t } = useLocale();
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);

  useEffect(() => {
    if (!isOpen) {
      reset();
      setImages([]);
    } else if (copyUnit) {
      // Pre-fill from copied unit (exclude unitNumber so user sets a new one)
      reset({
        projectId: copyUnit.projectId || "independent",
        cityId: copyUnit.cityId || "",
        neighborhoodId: copyUnit.neighborhoodId || "",
        modelId: copyUnit.modelId || "",
        buildingId: copyUnit.buildingId || "",
        floor: copyUnit.floor?.toString() || "",
        status: copyUnit.status || "available",
        unitNumber: "", // intentionally blank - user must set a new number
        unitType: copyUnit.unitType || "شقة سكنية",
        operationType: "للبيع",
        price: copyUnit.price?.toString() || "",
        roomsCount: copyUnit.roomsCount?.toString() || "",
        bathroomsCount: copyUnit.bathroomsCount?.toString() || "",
        totalArea: copyUnit.totalArea?.toString() || "",
        discountActive: false,
        discountPercentage: "",
        discountDays: "",
        additionalComponents: copyUnit.additionalComponents || [],
        features: copyUnit.features || [],
        facade: copyUnit.facade || [],
        condition: copyUnit.condition || "جديدة",
        age: copyUnit.age?.toString() || "",
      });
      setImages([]);
    }
  }, [isOpen, copyUnit, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter((f) => {
        if (f.size > 700 * 1024) {
          toast.error(`حجم الصورة ${f.name} يتجاوز 700 كيلوبايت`);
          return false;
        }
        return true;
      });

      const newImages = validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const { data: cities = [], isLoading: isLoadingCities } = useQuery({
    queryKey: ["cities"],
    queryFn: () => citiesService.getCities(),
  });

  const { data: properties = [], isLoading: isLoadingProperties } = useQuery({
    queryKey: ["properties"],
    queryFn: () => propertiesService.getProperties(),
  });

  const selectedProjectId = watch("projectId");
  const isIndependent = selectedProjectId === "independent";
  
  const selectedCityId = watch("cityId");
  const selectedCity = cities.find((c) => c.id === selectedCityId);
  const neighborhoods = selectedCity?.neighborhoods || [];

  const selectedProject = properties.find((p) => p.id === selectedProjectId);
  const projectModels = selectedProject?.models || [];
  const projectBuildings = selectedProject?.buildings || [];

  const selectedModelId = watch("modelId");
  const isModelSelected = !isIndependent && !!selectedModelId;
  const selectedModel = isModelSelected ? selectedProject?.models.find((m: any) => m.id === selectedModelId) : null;
  
  useEffect(() => {
    // Auto-fill logic when a model is selected
    if (isModelSelected && selectedProject) {
      const model = selectedProject.models.find(m => m.id === selectedModelId);
      if (model) {
        setValue("roomsCount", model.roomsCount.toString());
        setValue("bathroomsCount", model.bathroomsCount.toString());
        setValue("price", model.defaultPrice.toString());
        setValue("unitType", model.propertyType || "");
        setValue("totalArea", (model.totalArea || 0).toString());
        setValue("additionalComponents", model.additionalComponents || []);
        setValue("features", model.features || []);
        setValue("facade", model.facade || []);
      }
    }
  }, [selectedModelId, selectedProject, setValue]);

  const discountActive = watch("discountActive");
  const statusValue = watch("status");

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      const id = unitsService.generateId();
      
      const uploadedUrls = await Promise.all(
        images.map((img) => unitsService.uploadImage(img.file, `units/${id}`))
      );

      const finalUnitNumber = data.unitNumber;

      const model = selectedModelId && selectedProject ? selectedProject.models.find((m: any) => m.id === selectedModelId) : null;

      const unitData: any = {
        id,
        projectId: data.projectId,
        status: data.status,
        unitNumber: finalUnitNumber,
        unitType: data.unitType,
        operationType: "للبيع",
        price: Number(data.price) || 0,
        roomsCount: Number(data.roomsCount) || 0,
        bathroomsCount: Number(data.bathroomsCount) || 0,
        totalArea: model ? (Number(model.totalArea) || 0) : (Number(data.totalArea) || 0),
        discountActive: data.discountActive,
        additionalComponents: model ? (model.additionalComponents || []) : (data.additionalComponents || []),
        features: model ? (model.features || []) : (data.features || []),
        facade: model ? (model.facade || []) : (data.facade || []),
        views: 0,
        images: uploadedUrls,
      };

      if (isIndependent) {
        if (data.cityId) unitData.cityId = data.cityId;
        if (data.neighborhoodId) unitData.neighborhoodId = data.neighborhoodId;
        if (data.condition) unitData.condition = data.condition;
        unitData.age = Number(data.age) || 0;
      } else {
        if (data.modelId) unitData.modelId = data.modelId;
        if (data.buildingId) unitData.buildingId = data.buildingId;
        if (data.floor) unitData.floor = data.floor;
      }

      if (data.discountActive) {
        unitData.discountPercentage = Number(data.discountPercentage) || 0;
        unitData.discountDays = Number(data.discountDays) || 0;
      }

      await unitsService.addUnit(unitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      toast.success(t("admin.ui.success") || "تمت إضافة الوحدة بنجاح");
      reset();
      setImages([]);
      onClose();
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err?.message || t("admin.ui.error") || "حدث خطأ أثناء الإضافة");
    },
  });

  const onSubmit = (data: any) => {
    addMutation.mutate(data);
  };

  const formSectionClass = "mb-8";
  const sectionTitleClass = "mb-6 text-xl font-bold text-[#0a0f1d] pb-2 border-b border-[#0a0f1d]/10";
  const labelClass = "mb-2 block text-sm font-bold text-[#0a0f1d]";
  const inputClass = "h-12 w-full rounded-[16px] bg-[#F4F4F4] px-4 text-sm font-medium text-[#0a0f1d] outline-none transition-colors focus:bg-[#EAEAEA] placeholder:text-[#8c8c8c] disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed border border-transparent focus:border-[#0a0f1d]/10";

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
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#0a0f1d]">
                  {copyUnit ? "نسخ وحدة" : "إضافة وحدة جديدة"}
                </h2>
                {copyUnit && (
                  <p className="mt-1 text-xs text-[#8c8c8c] font-medium">
                    تم نسخ بيانات الوحدة — أدخل رقم وحدة جديد قبل الحفظ
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-[#8c8c8c] transition-colors hover:bg-[#F4F4F4] hover:text-[#0a0f1d]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar sm:px-8">
              <form id="add-unit-form" onSubmit={handleSubmit(onSubmit)}>
                
                {/* 1. التبعية والموقع */}
                <div className={formSectionClass}>
                  <h3 className={sectionTitleClass}>1. التبعية والموقع</h3>
                  <div className="mb-5">
                    <label className={labelClass}>المشروع التابع</label>
                    <div className="relative">
                      <select {...register("projectId")} className={`${inputClass} appearance-none pr-4 pl-10`} disabled={isLoadingProperties}>
                        <option value="independent">-- وحدة مستقلة --</option>
                        {properties.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c] pointer-events-none" />
                    </div>
                  </div>

                  {isIndependent ? (
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>المدينة</label>
                        <div className="relative">
                          <select {...register("cityId")} className={`${inputClass} appearance-none pr-4 pl-10`} disabled={isLoadingCities}>
                            <option value="">اختر المدينة</option>
                            {cities.map((city) => (
                              <option key={city.id} value={city.id}>
                                {city.name[locale]}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c] pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>الحي</label>
                        <div className="relative">
                          <select {...register("neighborhoodId")} className={`${inputClass} appearance-none pr-4 pl-10`} disabled={!selectedCityId}>
                            <option value="">اختر الحي</option>
                            {neighborhoods.map((n) => (
                              <option key={n.id} value={n.id}>
                                {n.name[locale]}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c] pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-5 sm:grid-cols-3">
                      <div>
                        <label className={labelClass}>استيراد بيانات النموذج (تلقائي)</label>
                        <div className="relative">
                          <select {...register("modelId")} className={`${inputClass} appearance-none pr-4 pl-10`}>
                            <option value="">-- اختر النموذج --</option>
                            {projectModels.map(m => (
                              <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c] pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>المبنى</label>
                        <div className="relative">
                          <select {...register("buildingId")} className={`${inputClass} appearance-none pr-4 pl-10`}>
                            <option value="">اختر</option>
                            {projectBuildings.map(b => (
                              <option key={b.id} value={b.id}>مبنى {b.code}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c] pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>الدور</label>
                        <div className="relative">
                          <select {...register("floor")} className={`${inputClass} appearance-none pr-4 pl-10`}>
                            <option value="">اختر الدور...</option>
                            {Array.from({ length: 51 }, (_, i) => i).map((num) => (
                              <option key={num} value={num.toString()}>
                                {num}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c] pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. البيانات الأساسية */}
                <div className={formSectionClass}>
                  <h3 className={sectionTitleClass}>2. البيانات الأساسية</h3>
                  
                  <div className="mb-5">
                    <label className={labelClass}>حالة الوحدة والتوافر</label>
                    <div className="relative">
                      <select 
                        {...register("status")} 
                        className={`${inputClass} appearance-none pr-4 pl-10 transition-colors ${
                          statusValue === "available" 
                            ? "text-green-700 bg-green-50 focus:bg-green-100 border-green-200" 
                            : "text-[#8c8c8c] bg-[#F4F4F4] focus:bg-[#EAEAEA] border-transparent"
                        }`}
                      >
                        <option value="available">متاحة</option>
                        <option value="unavailable">غير متاحة (مباعة/مؤجرة)</option>
                      </select>
                      <ChevronDown className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none ${
                        statusValue === "available" ? "text-green-700" : "text-[#8c8c8c]"
                      }`} />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-4 mb-5">
                    <div>
                      <label className={labelClass}>رقم الوحدة (المحلي)</label>
                      <input {...register("unitNumber")} placeholder="مثال: 15" className={inputClass} />
                      {watch("unitNumber") && (
                        <p className="mt-1 text-xs text-[#8c8c8c] font-medium" dir="ltr" style={{ textAlign: "right" }}>
                          ستظهر كالتالي: {isIndependent ? watch("unitNumber") : `${projectBuildings.find(b => b.id === watch("buildingId"))?.code || ""}${watch("unitNumber")}`}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass}>نوع الوحدة</label>
                      <div className="relative">
                        <select {...register("unitType")} className={`${inputClass} appearance-none pr-4 pl-10`}>
                          <option value="">اختر نوع الوحدة...</option>
                          <option value="شقة سكنية">شقة سكنية</option>
                          <option value="فيلا">فيلا</option>
                          <option value="عمارة">عمارة</option>
                          <option value="دوبلكس">دوبلكس</option>
                        </select>
                        <ChevronDown className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c] pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>النوع (العملية)</label>
                      <div className="relative">
                        <select value="للبيع" disabled className={`${inputClass} appearance-none opacity-70`}>
                          <option value="للبيع">للبيع</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>السعر (ر.س)</label>
                      <input type="number" {...register("price")} className={inputClass} />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-3">
                    <div>
                      <label className={labelClass}>الغرف</label>
                      <input type="number" {...register("roomsCount")} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>دورات المياه</label>
                      <input type="number" {...register("bathroomsCount")} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>المساحة الإجمالية (م²)</label>
                      <input type="number" {...register("totalArea")} disabled={isModelSelected} className={`${inputClass} ${isModelSelected ? 'cursor-not-allowed opacity-70' : ''}`} />
                      {selectedModel && (selectedModel.internalArea || selectedModel.externalArea) && (
                        <p className="mt-2 text-[11px] text-[#8c8c8c] font-medium leading-relaxed">
                          تفاصيل مساحة النموذج:
                          <br />
                          الداخلية {selectedModel.internalArea || 0} م² | الخارجية {selectedModel.externalArea || 0} م²
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. العروض والخصومات المؤقتة */}
                <div className={`${formSectionClass} rounded-[16px] bg-[#F4F4F4] border border-[#0a0f1d]/5 p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-[#0a0f1d]">3. العروض والخصومات المؤقتة</h3>
                    <label className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm cursor-pointer">
                      <span className="text-sm font-bold text-green-700">تفعيل الخصم لهذه الوحدة</span>
                      <input type="checkbox" {...register("discountActive")} className="w-5 h-5 accent-green-600 rounded" />
                    </label>
                  </div>
                  
                  {discountActive && (
                    <div className="grid gap-5 sm:grid-cols-2 bg-white p-5 rounded-[16px]">
                      <div>
                        <label className={labelClass}>نسبة الخصم (%)</label>
                        <input type="number" {...register("discountPercentage")} placeholder="مثال: 10" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>عدد أيام العرض (إلغاء تلقائي)</label>
                        <input type="number" {...register("discountDays")} placeholder="مثال: 15" className={inputClass} />
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. التفاصيل الفنية */}
                <div className={formSectionClass}>
                  <h3 className={sectionTitleClass}>4. التفاصيل الفنية</h3>
                  
                  <div className="mb-6">
                    <h4 className="mb-4 text-sm font-bold text-[#8c8c8c]">المكونات الإضافية</h4>
                    <div className="flex flex-wrap gap-4">
                      {["مطبخ", "مجلس", "صالة واسعة", "مستودع", "غرفة غسيل", "غرفة سائق"].map((item) => {
                        const isSelected = (watch("additionalComponents") || []).includes(item);
                        return (
                        <label key={item} className={`flex ${isModelSelected ? 'cursor-not-allowed' : 'cursor-pointer'} items-center justify-between gap-3 min-w-[140px] rounded-[12px] border px-4 py-3 transition-colors ${
                          isSelected 
                            ? 'bg-[#0a0f1d]/5 border-[#0a0f1d]/30' 
                            : isModelSelected 
                              ? 'bg-gray-50 opacity-40 border-[#0a0f1d]/5'
                              : 'bg-white border-[#0a0f1d]/10 hover:bg-[#F4F4F4]'
                        }`}>
                          <span className={`text-sm ${isSelected ? 'font-bold text-[#0a0f1d]' : 'font-medium text-[#8c8c8c]'}`}>{item}</span>
                          <input type="checkbox" value={item} {...register("additionalComponents")} disabled={isModelSelected} className={`h-4 w-4 rounded-[4px] accent-[#0a0f1d] ${isModelSelected ? 'cursor-not-allowed' : ''}`} />
                        </label>
                      )})}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="mb-4 text-sm font-bold text-[#8c8c8c]">مميزات الوحدة</h4>
                    <div className="flex flex-wrap gap-4">
                      {["بلكونة", "تكييف مركزي", "مكيف راكب", "دخول ذكي", "موقف خاص"].map((item) => {
                        const isSelected = (watch("features") || []).includes(item);
                        return (
                        <label key={item} className={`flex ${isModelSelected ? 'cursor-not-allowed' : 'cursor-pointer'} items-center justify-between gap-3 min-w-[140px] rounded-[12px] border px-4 py-3 transition-colors ${
                          isSelected 
                            ? 'bg-[#0a0f1d]/5 border-[#0a0f1d]/30' 
                            : isModelSelected 
                              ? 'bg-gray-50 opacity-40 border-[#0a0f1d]/5'
                              : 'bg-white border-[#0a0f1d]/10 hover:bg-[#F4F4F4]'
                        }`}>
                          <span className={`text-sm ${isSelected ? 'font-bold text-[#0a0f1d]' : 'font-medium text-[#8c8c8c]'}`}>{item}</span>
                          <input type="checkbox" value={item} {...register("features")} disabled={isModelSelected} className={`h-4 w-4 rounded-[4px] accent-[#0a0f1d] ${isModelSelected ? 'cursor-not-allowed' : ''}`} />
                        </label>
                      )})}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-4 text-sm font-bold text-[#8c8c8c]">واجهة الوحدة</h4>
                    <div className="flex flex-wrap gap-4">
                      {["أمامية", "جانبية", "خلفية"].map((item) => {
                        const isSelected = (watch("facade") || []).includes(item);
                        return (
                        <label key={item} className={`flex ${isModelSelected ? 'cursor-not-allowed' : 'cursor-pointer'} items-center justify-between gap-3 min-w-[120px] rounded-[12px] border px-4 py-3 transition-colors ${
                          isSelected 
                            ? 'bg-[#0a0f1d]/5 border-[#0a0f1d]/30' 
                            : isModelSelected 
                              ? 'bg-gray-50 opacity-40 border-[#0a0f1d]/5'
                              : 'bg-white border-[#0a0f1d]/10 hover:bg-[#F4F4F4]'
                        }`}>
                          <span className={`text-sm ${isSelected ? 'font-bold text-[#0a0f1d]' : 'font-medium text-[#8c8c8c]'}`}>{item}</span>
                          <input type="checkbox" value={item} {...register("facade")} disabled={isModelSelected} className={`h-4 w-4 rounded-[4px] accent-[#0a0f1d] ${isModelSelected ? 'cursor-not-allowed' : ''}`} />
                        </label>
                      )})}
                    </div>
                  </div>
                </div>

                {/* 5. بيانات الوحدة المستقلة (if independent) */}
                {isIndependent && (
                  <div className={formSectionClass}>
                    <h3 className={sectionTitleClass}>5. بيانات الوحدة المستقلة</h3>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>أهلية الوحدة / حالتها</label>
                        <div className="flex flex-wrap gap-4">
                          {["جديدة", "مجددة"].map((item) => (
                            <label key={item} className="flex cursor-pointer items-center gap-2 rounded-[16px] bg-[#F4F4F4] px-5 py-3 transition-colors hover:bg-[#EAEAEA]">
                              <input type="radio" value={item} {...register("condition")} className="h-4 w-4 accent-[#0a0f1d]" />
                              <span className="text-sm font-bold text-[#0a0f1d]">{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>عمر الوحدة (بالسنوات)</label>
                        <input type="number" {...register("age")} placeholder="اكتب 0 إذا كانت جديدة تماماً" className={inputClass} />
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. صور العقار */}
                <div className={formSectionClass}>
                  <h3 className={sectionTitleClass}>{isIndependent ? "6. صور العقار (اختياري)" : "5. صور العقار (اختياري)"}</h3>
                  
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-[#0a0f1d]/20 bg-white py-14 transition-colors hover:border-[#0a0f1d]/40 hover:bg-[#F4F4F4]">
                    <UploadCloud className="mb-4 h-10 w-10 text-[#8c8c8c]" />
                    <span className="text-sm font-bold text-[#0a0f1d]">اضغط لرفع صور إضافية للوحدة</span>
                    <span className="mt-2 text-xs font-medium text-[#8c8c8c]">المقاس: 1200x800 بكسل (أفقي) | الحد الأقصى: 700KB</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                      disabled={addMutation.isPending}
                    />
                  </label>

                  {images.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {images.map((img, idx) => (
                        <div key={idx} className="group relative aspect-video overflow-hidden rounded-[16px] border border-[#0a0f1d]/10 bg-white">
                          <img src={img.preview} alt="" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 opacity-0 shadow-sm backdrop-blur transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="mt-8 flex items-center justify-end gap-3 border-t border-[#0a0f1d]/10 pt-6 pb-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-bold text-[#0a0f1d] transition-colors hover:bg-[#F4F4F4]"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    form="add-unit-form"
                    disabled={addMutation.isPending}
                    className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#0a0f1d] px-8 text-sm font-bold text-white transition-colors hover:bg-[#161c2d] disabled:opacity-70"
                  >
                    {addMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    حفظ وإضافة
                  </button>
                </div>

              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
