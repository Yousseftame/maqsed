"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "react-hook-form";
import { X, Loader2, ChevronDown } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { citiesService } from "@/features/admin/cities/cities.service";
import { propertiesService, slugify } from "@/features/admin/projects/properties.service";
import toast from "react-hot-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ProjectImageGallery, revokeGalleryPreviews, type ProjectGalleryImage } from "./ProjectImageGallery";
import { NearbyPlacesEditor, sanitizeNearbyPlaces, type NearbyPlaceInput } from "./NearbyPlacesEditor";
import { PartyLogoField, revokeLogoPreview, resolveLogoUpload } from "./PartyLogoField";
import { FeatureCheckboxGroup } from "@/features/admin/menus/FeatureCheckboxGroup";
import { useMenuOptions } from "@/features/admin/menus/useMenuOptions";
import { asStringArray } from "@/features/admin/menus/menu-options.service";

type AddProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AddProjectModal({ isOpen, onClose }: AddProjectModalProps) {
  const { register, handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      cityId: "",
      neighborhoodId: "",
      mapsLink: "",
      brochureLink: "",
      description: "",
      projectType: "",
      developerName: "",
      contractorName: "",
      category: "luxury",
      buildingsCount: 1,
      totalUnits: 1,
      floorsCount: 1,
      modelsCount: 1,
      features: [] as string[],
      services: [] as string[],
      guarantees: [] as string[],
      offers: [] as string[],
      locations: [] as string[],
    },
  });

  const queryClient = useQueryClient();
  const { locale, t } = useLocale();
  const { of } = useMenuOptions();
  const [images, setImages] = useState<ProjectGalleryImage[]>([]);
  const [partnerLogos, setPartnerLogos] = useState<ProjectGalleryImage[]>([]);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlaceInput[]>([]);
  const [developerLogo, setDeveloperLogo] = useState<ProjectGalleryImage | null>(null);
  const [contractorLogo, setContractorLogo] = useState<ProjectGalleryImage | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const projectName = watch("name");

  useEffect(() => {
    if (slugTouched) return;
    setValue("slug", slugify(projectName || ""));
  }, [projectName, slugTouched, setValue]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setImages((prev) => {
        revokeGalleryPreviews(prev);
        return [];
      });
      setPartnerLogos((prev) => {
        revokeGalleryPreviews(prev);
        return [];
      });
      setNearbyPlaces([]);
      setDeveloperLogo((prev) => {
        revokeLogoPreview(prev);
        return null;
      });
      setContractorLogo((prev) => {
        revokeLogoPreview(prev);
        return null;
      });
      setSlugTouched(false);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const { data: cities = [], isLoading: isLoadingCities } = useQuery({
    queryKey: ["cities"],
    queryFn: () => citiesService.getCities(),
  });

  const selectedCityId = watch("cityId");
  const selectedCity = cities.find((c) => c.id === selectedCityId);
  const neighborhoods = selectedCity?.neighborhoods || [];

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      const id = propertiesService.generateId();
      
      const uploadedUrls = await Promise.all(
        images.map((img) => propertiesService.uploadImage(img.file as File, `properties/${id}`))
      );
      const uploadedPartnerLogos = await Promise.all(
        partnerLogos.map((img) => propertiesService.uploadImage(img.file as File, `properties/${id}/partners`))
      );
      const developerLogoResult = await resolveLogoUpload(
        developerLogo,
        `properties/${id}/developer`,
        undefined,
        propertiesService.uploadImage
      );
      const contractorLogoResult = await resolveLogoUpload(
        contractorLogo,
        `properties/${id}/contractor`,
        undefined,
        propertiesService.uploadImage
      );

      await propertiesService.addProperty({
        id,
        name: data.name,
        slug: data.slug,
        cityId: data.cityId,
        neighborhoodId: data.neighborhoodId,
        mapsLink: data.mapsLink || "",
        brochureLink: data.brochureLink || "",
        description: (data.description || "").trim(),
        projectType: data.projectType,
        category: data.category,
        status: "active",
        buildingsCount: Number(data.buildingsCount) || 1,
        modelsCount: Number(data.modelsCount) || 1,
        buildings: [],
        models: [],
        features: asStringArray(data.features),
        services: asStringArray(data.services),
        guarantees: asStringArray(data.guarantees),
        offers: asStringArray(data.offers),
        locations: asStringArray(data.locations),
        images: uploadedUrls,
        nearbyPlaces: sanitizeNearbyPlaces(nearbyPlaces),
        partnerLogos: uploadedPartnerLogos,
        developerName: (data.developerName || "").trim(),
        developerLogo: developerLogoResult.url,
        contractorName: (data.contractorName || "").trim(),
        contractorLogo: contractorLogoResult.url,
        views: 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success(t("admin.ui.success") || "Project created successfully");
      reset();
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.message || t("admin.ui.error") || "An error occurred");
    },
  });

  const onSubmit = async (data: any) => {
    const nextSlug = slugify(data.slug || data.name || "");
    if (!nextSlug) {
      toast.error("يرجى إدخال رابط المشروع");
      return;
    }
    if (await propertiesService.isSlugTaken(nextSlug)) {
      toast.error("هذا الرابط مستخدم بالفعل");
      return;
    }
    addMutation.mutate({ ...data, slug: nextSlug });
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
                إضافة مشروع جديد
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
              <form id="add-project-form" onSubmit={handleSubmit(onSubmit)}>
                
                {/* البيانات الأساسية */}
                <div className={formSectionClass}>
                  <h3 className={sectionTitleClass}>البيانات الأساسية</h3>
                  
                  <div className="mb-5">
                    <label className={labelClass}>اسم المشروع</label>
                    <input {...register("name")} className={inputClass} />
                  </div>

                  <div className="mb-5">
                    <label className={labelClass}>رابط المشروع (URL Slug) - لتحسين الـ SEO</label>
                    <input
                      {...register("slug", {
                        onChange: () => setSlugTouched(true),
                      })}
                      dir="ltr"
                      placeholder="al-qirawan"
                      className={`${inputClass} text-start font-mono`}
                    />
                    <span className="mt-2 block text-xs font-semibold text-[#8c8c8c]">
                      يظهر في رابط المشروع مثل /properties/al-qirawan
                    </span>
                  </div>

                  <div className="mb-5">
                    <label className={labelClass}>وصف المشروع (اختياري)</label>
                    <textarea
                      {...register("description")}
                      rows={4}
                      placeholder="أضف وصفاً مختصراً عن المشروع..."
                      className="w-full resize-none rounded-[16px] bg-[#F4F4F4] px-4 py-3 text-sm font-medium text-[#0a0f1d] outline-none transition-colors placeholder:text-[#8c8c8c] focus:bg-[#EAEAEA]"
                    />
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
                      <label className={labelClass}>رابط خرائط جوجل (اختياري)</label>
                      <input {...register("mapsLink")} placeholder="https://maps.google.com/..." className={inputClass} dir="ltr" />
                    </div>
                  </div>

                  <div className="mb-5 grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>رابط البروشور (Brochure Link)</label>
                      <input {...register("brochureLink")} placeholder="https://..." className={inputClass} dir="ltr" />
                    </div>
                  </div>

                  <div className="mb-6 grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>نوع المشروع</label>
                      <div className="relative">
                        <select {...register("projectType")} className={`${inputClass} appearance-none pr-4 pl-10`}>
                          <option value="">اختر نوع المشروع...</option>
                          <option value="شقق سكنية">شقق سكنية</option>
                          <option value="فلل">فلل</option>
                          <option value="عمائر">عمائر</option>
                          <option value="ارض">ارض</option>
                          <option value="منزل متعدد الطوابق TownHouse">منزل متعدد الطوابق TownHouse</option>
                        </select>
                        <ChevronDown className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c] pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>اسم المطور (اختياري)</label>
                      <input {...register("developerName")} placeholder="اسم المطور" className={`${inputClass} mb-3`} />
                      <PartyLogoField
                        label="شعار المطور"
                        logo={developerLogo}
                        onChange={setDeveloperLogo}
                        disabled={addMutation.isPending}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>اسم المقاول (اختياري)</label>
                      <input {...register("contractorName")} placeholder="اسم المقاول" className={`${inputClass} mb-3`} />
                      <PartyLogoField
                        label="شعار المقاول"
                        logo={contractorLogo}
                        onChange={setContractorLogo}
                        disabled={addMutation.isPending}
                      />
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
                  <div className="grid gap-5 sm:grid-cols-3">
                    <div>
                      <label className={labelClass}>عدد المباني (للتوليد)</label>
                      <input type="number" min="1" {...register("buildingsCount")} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>عدد النماذج (للتوليد)</label>
                      <input type="number" min="1" {...register("modelsCount")} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>عدد الوحدات الإجمالي</label>
                      <input type="text" value="0" className={inputClass} disabled title="سيتم حسابه تلقائياً من الوحدات المضافة" />
                      <p className="mt-2 text-[11px] font-medium leading-relaxed text-[#8c8c8c]">
                        {locale === "en"
                          ? "Calculated automatically once units are assigned to this project."
                          : "يُحسب هذا الحقل تلقائياً عند ربط وحدات بالمشروع."}
                      </p>
                    </div>
                  </div>
                </div>

                <hr className="my-8 border-[#0a0f1d]/10" />

                {/* المميزات والخدمات */}
                <div className={formSectionClass}>
                  <div className="mb-8">
                    <h4 className="mb-4 text-base font-bold text-[#0a0f1d]">مميزات المشروع</h4>
                    <FeatureCheckboxGroup
                      items={of("project", "projectFeatures")}
                      values={watch("features")}
                      onChange={(next) => setValue("features", next, { shouldDirty: true })}
                    />
                  </div>

                  <div className="mb-8">
                    <h4 className="mb-4 text-base font-bold text-[#0a0f1d]">خدمات ما بعد البيع</h4>
                    <FeatureCheckboxGroup
                      items={of("project", "services")}
                      values={watch("services")}
                      onChange={(next) => setValue("services", next, { shouldDirty: true })}
                    />
                  </div>

                  <div className="mb-8">
                    <h4 className="mb-4 text-base font-bold text-[#0a0f1d]">الضمانات</h4>
                    <FeatureCheckboxGroup
                      items={of("project", "guarantees")}
                      values={watch("guarantees")}
                      onChange={(next) => setValue("guarantees", next, { shouldDirty: true })}
                    />
                  </div>

                  <div className="mb-8">
                    <h4 className="mb-4 text-base font-bold text-[#0a0f1d]">العروض الخاصة</h4>
                    <FeatureCheckboxGroup
                      items={of("project", "specialOffers")}
                      values={watch("offers")}
                      onChange={(next) => setValue("offers", next, { shouldDirty: true })}
                    />
                  </div>

                  <div>
                    <h4 className="mb-4 text-base font-bold text-[#0a0f1d]">المواقع القريبة</h4>
                    <FeatureCheckboxGroup
                      items={of("project", "nearbyLocations")}
                      values={watch("locations")}
                      onChange={(next) => setValue("locations", next, { shouldDirty: true })}
                    />
                  </div>
                </div>

                <hr className="my-8 border-[#0a0f1d]/10" />

                <div className={formSectionClass}>
                  <NearbyPlacesEditor
                    places={nearbyPlaces}
                    onChange={setNearbyPlaces}
                    disabled={addMutation.isPending}
                  />
                </div>

                <hr className="my-8 border-[#0a0f1d]/10" />

                {/* الصور والوسائط */}
                <div className={formSectionClass}>
                  <h3 className={sectionTitleClass}>الصور والوسائط</h3>
                  <ProjectImageGallery
                    images={images}
                    onChange={setImages}
                    disabled={addMutation.isPending}
                  />
                </div>

                <hr className="my-8 border-[#0a0f1d]/10" />

                <div className={formSectionClass}>
                  <h3 className={sectionTitleClass}>شركاء النجاح</h3>
                  <ProjectImageGallery
                    images={partnerLogos}
                    onChange={setPartnerLogos}
                    disabled={addMutation.isPending}
                    variant="logos"
                  />
                </div>

              </form>
            </div>

            {/* Footer */}
            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#0a0f1d]/10 bg-white px-6 py-5 sm:px-8">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#F4F4F4] px-6 text-sm font-bold text-[#0a0f1d] hover:bg-[#EAEAEA]"
              >
                إلغاء
              </button>
              <button
                form="add-project-form"
                type="submit"
                disabled={addMutation.isPending}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0a0f1d] px-8 text-sm font-bold text-white transition-colors hover:bg-[#161c2d] disabled:opacity-70"
              >
                {addMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                إنشاء المشروع والتوليد
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
