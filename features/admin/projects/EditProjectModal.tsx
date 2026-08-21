"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "react-hook-form";
import { UploadCloud, X, Loader2, Image as ImageIcon, Trash2, ChevronDown } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { citiesService } from "@/features/admin/cities/cities.service";
import { propertiesService, type Property } from "@/features/admin/projects/properties.service";
import toast from "react-hot-toast";
import { useLocale } from "@/components/providers/LocaleProvider";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property | null;
}

export function EditProjectModal({ isOpen, onClose, property }: EditProjectModalProps) {
  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      name: "",
      cityId: "",
      neighborhoodId: "",
      mapsLink: "",
      projectType: "",
      commissionOption: "",
      category: "متوسطة",
      buildingsCount: 1,
      modelsCount: 1,
      features: [] as string[],
      services: [] as string[],
      guarantees: [] as string[],
      offers: [] as string[],
      locations: [] as string[],
    },
  });

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

  const queryClient = useQueryClient();
  const { locale, t } = useLocale();
  const [images, setImages] = useState<Array<{ file: File | null; preview: string }>>([]);

  useEffect(() => {
    if (isOpen && property) {
      reset({
        name: property.name,
        cityId: property.cityId,
        neighborhoodId: property.neighborhoodId,
        mapsLink: property.mapsLink || "",
        projectType: property.projectType || "",
        commissionOption: property.commissionOption || "",
        category: property.category || "متوسطة",
        buildingsCount: property.buildingsCount || 1,
        modelsCount: property.modelsCount || 1,
        features: property.features || [],
        services: property.services || [],
        guarantees: property.guarantees || [],
        offers: property.offers || [],
        locations: property.locations || [],
      });
      setImages((property.images || []).map(url => ({ file: null, preview: url })));
    } else if (!isOpen) {
      reset();
      setImages([]);
    }
  }, [isOpen, property, reset]);

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

  const selectedCityId = watch("cityId");
  const selectedCity = cities.find((c) => c.id === selectedCityId);
  const neighborhoods = selectedCity?.neighborhoods || [];

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!property) return;
      
      const newFiles = images.filter(img => img.file !== null);
      const existingUrls = images.filter(img => img.file === null).map(img => img.preview);
      const originalUrls = property.images || [];
      const deletedUrls = originalUrls.filter(url => !existingUrls.includes(url));

      if (deletedUrls.length > 0) {
        await Promise.all(deletedUrls.map(url => propertiesService.deleteImage(url)));
      }
      
      const uploadedUrls = await Promise.all(
        newFiles.map((img) => propertiesService.uploadImage(img.file as File, `properties/${property.id}`))
      );

      const allImages = [...existingUrls, ...uploadedUrls];

      await propertiesService.updateProperty(property.id, {
        name: data.name,
        cityId: data.cityId,
        neighborhoodId: data.neighborhoodId,
        mapsLink: data.mapsLink,
        projectType: data.projectType,
        commissionOption: data.commissionOption,
        category: data.category,
        buildingsCount: parseInt(data.buildingsCount, 10),
        modelsCount: parseInt(data.modelsCount, 10),
        features: data.features,
        services: data.services,
        guarantees: data.guarantees,
        offers: data.offers,
        locations: data.locations,
        images: allImages,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success(t("admin.ui.success") || "تم تحديث المشروع بنجاح");
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("admin.ui.error") || "حدث خطأ أثناء التحديث");
    },
  });

  const onSubmit = (data: any) => {
    updateMutation.mutate(data);
  };

  const formSectionClass = "mb-8";
  const sectionTitleClass = "mb-5 text-lg font-bold tracking-tight text-[#0a0f1d]";
  const labelClass = "mb-2.5 block text-sm font-bold text-[#0a0f1d]";
  const inputClass = "h-12 w-full rounded-[16px] bg-[#F4F4F4] px-4 text-sm font-medium text-[#0a0f1d] outline-none transition-colors focus:bg-[#EAEAEA] placeholder:text-[#8c8c8c] disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed";

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
                تعديل المشروع: {property?.name}
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
              <form id="edit-project-form" onSubmit={handleSubmit(onSubmit)}>
                
                {/* البيانات الأساسية */}
                <div className={formSectionClass}>
                  <h3 className={sectionTitleClass}>البيانات الأساسية</h3>
                  
                  <div className="mb-5">
                    <label className={labelClass}>اسم المشروع</label>
                    <input {...register("name")} className={inputClass} />
                  </div>

                  <div className="mb-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>المدينة</label>
                      <div className="relative">
                        <select {...register("cityId")} className={`${inputClass} appearance-none pr-4 pl-10`} disabled={isLoadingCities}>
                          <option value="">اختر المدينة...</option>
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
                          <option value="">اختر الحي...</option>
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

                  <div className="mb-5 grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>رابط الموقع (Google Maps)</label>
                      <input {...register("mapsLink")} placeholder="https://maps.google.com/..." className={inputClass} dir="ltr" />
                    </div>
                  </div>

                  <div className="mb-6 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>نوع المشروع</label>
                      <input {...register("projectType")} placeholder="شقق سكنية" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>خيار السعي</label>
                      <input {...register("commissionOption")} placeholder="بدون سعي" className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>فئة المشروع</label>
                    <div className="flex flex-wrap gap-3">
                      {["فاخرة", "متوسطة", "اقتصادية"].map((cat) => (
                        <label key={cat} className="flex cursor-pointer items-center gap-2.5 rounded-[16px] bg-[#F4F4F4] px-5 py-3 transition-colors hover:bg-[#EAEAEA]">
                          <input type="radio" value={cat} {...register("category")} className="h-4 w-4 accent-[#0a0f1d]" />
                          <span className="text-sm font-bold text-[#0a0f1d]">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <hr className="my-8 border-[#0a0f1d]/10" />

                {/* الأرقام والتوليد */}
                <div className={formSectionClass}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>عدد المباني</label>
                      <input type="number" min="1" {...register("buildingsCount")} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>عدد النماذج</label>
                      <input type="number" min="1" {...register("modelsCount")} className={inputClass} />
                    </div>
                  </div>
                </div>

                <hr className="my-8 border-[#0a0f1d]/10" />

                {/* المميزات والخدمات */}
                <div className={formSectionClass}>
                  <div className="mb-8">
                    <h4 className="mb-4 text-base font-bold text-[#0a0f1d]">مميزات المشروع</h4>
                    <div className="flex flex-wrap gap-3">
                      <label className="flex cursor-pointer items-center gap-3 rounded-[16px] bg-[#F4F4F4] px-5 py-3 transition-colors hover:bg-[#EAEAEA]">
                        <input type="checkbox" value="compound" {...register("features")} className="h-4 w-4 rounded-[4px] accent-[#0a0f1d]" />
                        <span className="text-sm font-bold text-[#0a0f1d]">كمباوند</span>
                      </label>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="mb-4 text-base font-bold text-[#0a0f1d]">خدمات ما بعد البيع</h4>
                    <div className="flex flex-wrap gap-3">
                      <label className="flex cursor-pointer items-center gap-3 rounded-[16px] bg-[#F4F4F4] px-5 py-3 transition-colors hover:bg-[#EAEAEA]">
                        <input type="checkbox" value="cleaning" {...register("services")} className="h-4 w-4 rounded-[4px] accent-[#0a0f1d]" />
                        <span className="text-sm font-bold text-[#0a0f1d]">نظافة</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-3 rounded-[16px] bg-[#F4F4F4] px-5 py-3 transition-colors hover:bg-[#EAEAEA]">
                        <input type="checkbox" value="cameras" {...register("services")} className="h-4 w-4 rounded-[4px] accent-[#0a0f1d]" />
                        <span className="text-sm font-bold text-[#0a0f1d]">كاميرات مراقبة</span>
                      </label>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="mb-4 text-base font-bold text-[#0a0f1d]">الضمانات</h4>
                    <div className="flex flex-wrap gap-3">
                      <label className="flex cursor-pointer items-center gap-3 rounded-[16px] bg-[#F4F4F4] px-5 py-3 transition-colors hover:bg-[#EAEAEA]">
                        <input type="checkbox" value="structure" {...register("guarantees")} className="h-4 w-4 rounded-[4px] accent-[#0a0f1d]" />
                        <span className="text-sm font-bold text-[#0a0f1d]">الهيكل 10 سنوات</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-3 rounded-[16px] bg-[#F4F4F4] px-5 py-3 transition-colors hover:bg-[#EAEAEA]">
                        <input type="checkbox" value="electric" {...register("guarantees")} className="h-4 w-4 rounded-[4px] accent-[#0a0f1d]" />
                        <span className="text-sm font-bold text-[#0a0f1d]">الكهرباء 10 سنوات</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-3 rounded-[16px] bg-[#F4F4F4] px-5 py-3 transition-colors hover:bg-[#EAEAEA]">
                        <input type="checkbox" value="plumbing" {...register("guarantees")} className="h-4 w-4 rounded-[4px] accent-[#0a0f1d]" />
                        <span className="text-sm font-bold text-[#0a0f1d]">السباكة</span>
                      </label>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="mb-4 text-base font-bold text-[#0a0f1d]">العروض الخاصة</h4>
                    <div className="flex flex-wrap gap-3">
                      <label className="flex cursor-pointer items-center gap-3 rounded-[16px] bg-[#F4F4F4] px-5 py-3 transition-colors hover:bg-[#EAEAEA]">
                        <input type="checkbox" value="ac" {...register("offers")} className="h-4 w-4 rounded-[4px] accent-[#0a0f1d]" />
                        <span className="text-sm font-bold text-[#0a0f1d]">مكيفات مجانية</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-4 text-base font-bold text-[#0a0f1d]">المواقع القريبة</h4>
                    <div className="flex flex-wrap gap-3">
                      {["مدرسة", "مستشفى", "مسجد", "مول تجاري", "محطة مترو", "بقالة"].map((loc) => (
                        <label key={loc} className="flex cursor-pointer items-center gap-3 rounded-[16px] bg-[#F4F4F4] px-5 py-3 transition-colors hover:bg-[#EAEAEA]">
                          <input type="checkbox" value={loc} {...register("locations")} className="h-4 w-4 rounded-[4px] accent-[#0a0f1d]" />
                          <span className="text-sm font-bold text-[#0a0f1d]">{loc}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <hr className="my-8 border-[#0a0f1d]/10" />

                {/* الصور والوسائط */}
                <div className={formSectionClass}>
                  <h3 className={sectionTitleClass}>الصور والوسائط</h3>
                  
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-[#0a0f1d]/20 bg-[#F4F4F4] py-14 transition-colors hover:border-[#0a0f1d]/40 hover:bg-[#EAEAEA]">
                    <UploadCloud className="mb-4 h-10 w-10 text-[#8c8c8c]" />
                    <p className="mb-1 text-base font-bold text-[#0a0f1d]">اضغط هنا لرفع الصور</p>
                    <p className="text-sm font-medium text-[#8c8c8c]">المقاس: 1200x800 بكسل (نسبة 3:2) | الحد الأقصى: 700KB</p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                      disabled={updateMutation.isPending}
                    />
                  </label>

                  {images.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {images.map((img, index) => (
                        <div key={index} className="group relative aspect-[3/2] overflow-hidden rounded-[16px] bg-[#F4F4F4]">
                          <img src={img.preview} alt="" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 opacity-0 shadow backdrop-blur transition-opacity hover:bg-white group-hover:opacity-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-8 flex items-center justify-end gap-3 border-t border-[#0a0f1d]/10 pt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-bold text-[#0a0f1d] transition-colors hover:bg-[#F4F4F4]"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    form="edit-project-form"
                    disabled={updateMutation.isPending}
                    className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#0a0f1d] px-8 text-sm font-bold text-white transition-colors hover:bg-[#161c2d] disabled:opacity-70"
                  >
                    {updateMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    حفظ التعديلات
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
