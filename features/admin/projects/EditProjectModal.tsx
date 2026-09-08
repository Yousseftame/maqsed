"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "react-hook-form";
import { X, Loader2, ChevronDown } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { citiesService } from "@/features/admin/cities/cities.service";
import { propertiesService, slugify, type Property } from "@/features/admin/projects/properties.service";
import toast from "react-hot-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ProjectImageGallery, revokeGalleryPreviews, type ProjectGalleryImage } from "./ProjectImageGallery";
import { NearbyPlacesEditor, sanitizeNearbyPlaces, type NearbyPlaceInput } from "./NearbyPlacesEditor";
import { PartyLogoField, logoFromUrl, revokeLogoPreview, resolveLogoUpload } from "./PartyLogoField";
import { FeatureCheckboxGroup } from "@/features/admin/menus/FeatureCheckboxGroup";
import { useMenuOptions } from "@/features/admin/menus/useMenuOptions";
import { asStringArray } from "@/features/admin/menus/menu-options.service";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property | null;
}

export function EditProjectModal({ isOpen, onClose, property }: EditProjectModalProps) {
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
  const { of } = useMenuOptions();
  const [images, setImages] = useState<ProjectGalleryImage[]>([]);
  const [partnerLogos, setPartnerLogos] = useState<ProjectGalleryImage[]>([]);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlaceInput[]>([]);
  const [developerLogo, setDeveloperLogo] = useState<ProjectGalleryImage | null>(null);
  const [contractorLogo, setContractorLogo] = useState<ProjectGalleryImage | null>(null);

  useEffect(() => {
    if (isOpen && property) {
      reset({
        name: property.name,
        slug: property.slug || slugify(property.name || ""),
        cityId: property.cityId,
        neighborhoodId: property.neighborhoodId,
        mapsLink: property.mapsLink || "",
        brochureLink: property.brochureLink || "",
        description: property.description || "",
        projectType: property.projectType || "",
        developerName: property.developerName || "",
        contractorName: property.contractorName || "",
        category: property.category || "متوسطة",
        buildingsCount: property.buildingsCount || 1,
        modelsCount: property.modelsCount || 1,
        features: asStringArray(property.features),
        services: asStringArray(property.services),
        guarantees: asStringArray(property.guarantees),
        offers: asStringArray(property.offers),
        locations: asStringArray(property.locations),
      });
      setImages((property.images || []).map((url) => ({ file: null, preview: url })));
      setPartnerLogos((property.partnerLogos || []).map((url) => ({ file: null, preview: url })));
      setNearbyPlaces(
        (property.nearbyPlaces || []).map((place) => ({
          name: place.name || "",
          minutes: place.minutes === undefined || place.minutes === null ? "" : String(place.minutes),
        }))
      );
      setDeveloperLogo(logoFromUrl(property.developerLogo));
      setContractorLogo(logoFromUrl(property.contractorLogo));
    } else if (!isOpen) {
      reset();
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
    }
  }, [isOpen, property, reset]);

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
      
      const originalUrls = property.images || [];
      const keptRemoteUrls = images.filter((img) => !img.file).map((img) => img.preview);
      const deletedUrls = originalUrls.filter((url) => !keptRemoteUrls.includes(url));

      const originalPartnerUrls = property.partnerLogos || [];
      const keptPartnerUrls = partnerLogos.filter((img) => !img.file).map((img) => img.preview);
      const deletedPartnerUrls = originalPartnerUrls.filter((url) => !keptPartnerUrls.includes(url));

      const filesToDelete = [...deletedUrls, ...deletedPartnerUrls];
      if (filesToDelete.length > 0) {
        await Promise.all(filesToDelete.map((url) => propertiesService.deleteImage(url)));
      }

      const allImages = await Promise.all(
        images.map((img) =>
          img.file
            ? propertiesService.uploadImage(img.file, `properties/${property.id}`)
            : Promise.resolve(img.preview)
        )
      );

      const allPartnerLogos = await Promise.all(
        partnerLogos.map((img) =>
          img.file
            ? propertiesService.uploadImage(img.file, `properties/${property.id}/partners`)
            : Promise.resolve(img.preview)
        )
      );

      const developerLogoResult = await resolveLogoUpload(
        developerLogo,
        `properties/${property.id}/developer`,
        property.developerLogo,
        propertiesService.uploadImage
      );
      const contractorLogoResult = await resolveLogoUpload(
        contractorLogo,
        `properties/${property.id}/contractor`,
        property.contractorLogo,
        propertiesService.uploadImage
      );

      const extraDeletes = [...developerLogoResult.toDelete, ...contractorLogoResult.toDelete];
      if (extraDeletes.length > 0) {
        await Promise.all(extraDeletes.map((url) => propertiesService.deleteImage(url)));
      }

      await propertiesService.updateProperty(property.id, {
        name: data.name,
        slug: data.slug,
        cityId: data.cityId,
        neighborhoodId: data.neighborhoodId,
        mapsLink: data.mapsLink || "",
        brochureLink: data.brochureLink || "",
        description: (data.description || "").trim(),
        projectType: data.projectType,
        category: data.category,
        buildingsCount: parseInt(data.buildingsCount, 10),
        modelsCount: parseInt(data.modelsCount, 10),
        features: asStringArray(data.features),
        services: asStringArray(data.services),
        guarantees: asStringArray(data.guarantees),
        offers: asStringArray(data.offers),
        locations: asStringArray(data.locations),
        images: allImages,
        nearbyPlaces: sanitizeNearbyPlaces(nearbyPlaces),
        partnerLogos: allPartnerLogos,
        developerName: (data.developerName || "").trim(),
        developerLogo: developerLogoResult.url,
        contractorName: (data.contractorName || "").trim(),
        contractorLogo: contractorLogoResult.url,
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

  const onSubmit = async (data: any) => {
    const nextSlug = slugify(data.slug || data.name || "");
    if (!nextSlug) {
      toast.error("يرجى إدخال رابط المشروع");
      return;
    }
    if (property && (await propertiesService.isSlugTaken(nextSlug, property.id))) {
      toast.error("هذا الرابط مستخدم بالفعل");
      return;
    }
    updateMutation.mutate({ ...data, slug: nextSlug });
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

                  <div className="mb-5">
                    <label className={labelClass}>رابط المشروع (URL Slug) - لتحسين الـ SEO</label>
                    <input
                      {...register("slug")}
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
                        disabled={updateMutation.isPending}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>اسم المقاول (اختياري)</label>
                      <input {...register("contractorName")} placeholder="اسم المقاول" className={`${inputClass} mb-3`} />
                      <PartyLogoField
                        label="شعار المقاول"
                        logo={contractorLogo}
                        onChange={setContractorLogo}
                        disabled={updateMutation.isPending}
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
                    disabled={updateMutation.isPending}
                  />
                </div>

                <hr className="my-8 border-[#0a0f1d]/10" />

                {/* الصور والوسائط */}
                <div className={formSectionClass}>
                  <h3 className={sectionTitleClass}>الصور والوسائط</h3>
                  <ProjectImageGallery
                    images={images}
                    onChange={setImages}
                    disabled={updateMutation.isPending}
                  />
                </div>

                <hr className="my-8 border-[#0a0f1d]/10" />

                <div className={formSectionClass}>
                  <h3 className={sectionTitleClass}>شركاء النجاح</h3>
                  <ProjectImageGallery
                    images={partnerLogos}
                    onChange={setPartnerLogos}
                    disabled={updateMutation.isPending}
                    variant="logos"
                  />
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
