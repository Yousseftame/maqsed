"use client";

import { useEffect, useRef, useState } from "react";
import { CloudUpload, Loader2, Plus, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Panel } from "@/features/admin/ui/Panel";
import { Field, textareaClass } from "@/features/admin/ui/Field";
import { AdminButton, fieldClass } from "@/features/admin/ui/AdminButton";
import { useLocale } from "@/components/providers/LocaleProvider";
import { heroService, withArabicHeroTitleBreak } from "@/features/home/hero.service";
import { usePermissions } from "@/features/admin/permissions/usePermissions";
import { ar } from "@/lib/i18n/dictionaries/ar";
import { en } from "@/lib/i18n/dictionaries/en";
import toast from "react-hot-toast";

import { BRAND_ASSETS } from "@/lib/brand-assets";

const DEFAULT_HERO_IMAGE = BRAND_ASSETS.defaultHero;

type HeroGalleryImage = {
  id: string;
  file: File | null;
  preview: string;
};

function galleryFromHero(hero: { backgroundImages?: string[]; backgroundImage?: string } | null | undefined): HeroGalleryImage[] {
  const urls = (hero?.backgroundImages || []).map((url) => url.trim()).filter(Boolean);
  if (urls.length > 0) {
    return urls.map((url) => ({ id: url, file: null, preview: url }));
  }
  const single = (hero?.backgroundImage || "").trim();
  if (single) return [{ id: single, file: null, preview: single }];
  return [];
}

export function InterfaceSettingsSection() {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const { can } = usePermissions();
  const canEdit = can("interface", "edit");
  const fileRef = useRef<HTMLInputElement>(null);
  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [subtitleAr, setSubtitleAr] = useState("");
  const [subtitleEn, setSubtitleEn] = useState("");
  const [images, setImages] = useState<HeroGalleryImage[]>([]);
  const imagesRef = useRef<HeroGalleryImage[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  imagesRef.current = images;

  const { data: hero, isFetched } = useQuery({
    queryKey: ["herosection"],
    queryFn: () => heroService.getHero(),
  });

  useEffect(() => {
    if (!isFetched) return;
    setTitleAr(withArabicHeroTitleBreak((hero?.titleAr || hero?.title || "").trim() || ar.hero.title));
    setTitleEn((hero?.titleEn || "").trim() || en.hero.title);
    setSubtitleAr((hero?.subtitleAr || hero?.subtitle || "").trim() || ar.hero.subtitle3);
    setSubtitleEn((hero?.subtitleEn || "").trim() || en.hero.subtitle3);
    setImages((prev) => {
      prev.forEach((img) => {
        if (img.preview.startsWith("blob:")) URL.revokeObjectURL(img.preview);
      });
      return galleryFromHero(hero);
    });
  }, [hero, isFetched]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => {
        if (img.preview.startsWith("blob:")) URL.revokeObjectURL(img.preview);
      });
    };
  }, []);

  function onImagesSelected(fileList: FileList | null) {
    if (!fileList?.length) return;
    const next = Array.from(fileList).map((file) => ({
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...next]);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeImage(id: string) {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target?.preview.startsWith("blob:")) URL.revokeObjectURL(target.preview);
      return prev.filter((img) => img.id !== id);
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!canEdit) return;
    setIsSaving(true);
    try {
      const backgroundImages: string[] = [];
      for (const image of images) {
        if (image.file) {
          backgroundImages.push(await heroService.uploadBackground(image.file));
        } else {
          backgroundImages.push(image.preview);
        }
      }

      await heroService.saveHero({
        titleAr: titleAr.trim(),
        titleEn: titleEn.trim(),
        subtitleAr: subtitleAr.trim(),
        subtitleEn: subtitleEn.trim(),
        title: titleAr.trim(),
        subtitle: subtitleAr.trim(),
        backgroundImages,
        backgroundImage: backgroundImages[0] || "",
      });

      setImages(backgroundImages.map((url) => ({ id: url, file: null, preview: url })));
      await queryClient.invalidateQueries({ queryKey: ["herosection"] });
      toast.success(t("admin.ui.saved"));
    } catch (error) {
      console.error("Error saving hero section:", error);
      toast.error(t("admin.ui.error") || "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  }

  const coverImage = images[0]?.preview || DEFAULT_HERO_IMAGE;

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6 pt-4 sm:pt-6 pb-20">
      <fieldset disabled={!canEdit} className="m-0 flex min-w-0 flex-col gap-6 border-0 p-0 disabled:opacity-90">
      {/* Hero Settings Panel */}
      <Panel>
        <div className="flex flex-col gap-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label={t("admin.interface.heroTitleAr")}>
              <textarea
                rows={2}
                dir="rtl"
                placeholder={ar.hero.title}
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                className="min-h-[88px] w-full resize-y rounded-[20px] bg-[#F4F4F4] px-5 py-4 text-sm font-medium leading-relaxed text-[#0a0f1d] outline-none transition-colors placeholder:text-[#8c8c8c] focus:bg-[#EFEFEF]"
              />
            </Field>
            <Field label={t("admin.interface.heroTitleEn")}>
              <input
                type="text"
                dir="ltr"
                placeholder={en.hero.title}
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className={`${fieldClass} text-start`}
              />
            </Field>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label={t("admin.interface.heroSubtitleAr")}>
              <textarea
                rows={3}
                dir="rtl"
                placeholder={ar.hero.subtitle3}
                value={subtitleAr}
                onChange={(e) => setSubtitleAr(e.target.value)}
                className={textareaClass}
              />
            </Field>
            <Field label={t("admin.interface.heroSubtitleEn")}>
              <textarea
                rows={3}
                dir="ltr"
                placeholder={en.hero.subtitle3}
                value={subtitleEn}
                onChange={(e) => setSubtitleEn(e.target.value)}
                className={`${textareaClass} text-start`}
              />
            </Field>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <span className="text-sm font-semibold text-[#8c8c8c]">
              {t("admin.interface.bgImage")}
            </span>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="group relative flex h-[240px] w-full items-center justify-center overflow-hidden rounded-[24px] bg-[#F4F4F4]"
            >
              <img
                src={coverImage}
                alt="Background preview"
                className="absolute inset-0 h-full w-full object-cover"
              />
              
              <div className="relative z-10 flex flex-col items-center gap-3 text-center p-6 transition-transform group-hover:scale-105">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm text-[#0a0f1d]">
                  <CloudUpload className="h-6 w-6" strokeWidth={2.2} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-[#0a0f1d] drop-shadow-sm bg-white/80 px-3 py-1 rounded-full">
                    {t("admin.interface.bgImageUpload")}
                  </span>
                  <span className="text-xs font-bold text-[#0a0f1d] drop-shadow-sm bg-white/80 px-3 py-1 rounded-full mt-1">
                    {t("admin.interface.bgImageHint")}
                  </span>
                </div>
              </div>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => onImagesSelected(e.target.files)}
            />

            {images.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mt-3">
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    className="group relative overflow-hidden rounded-[16px] bg-[#F4F4F4] aspect-[3/2] ring-1 ring-[#0a0f1d]/10"
                  >
                    <img src={img.preview} alt="" className="h-full w-full object-cover" />
                    {index === 0 ? (
                      <span className="absolute bottom-2 start-2 rounded-full bg-[#0a0f1d] px-2.5 py-1 text-[10px] font-bold text-white">
                        {t("admin.interface.bgImage")}
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute end-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-red-500 shadow backdrop-blur transition-colors hover:bg-white hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex aspect-[3/2] cursor-pointer flex-col items-center justify-center rounded-[16px] border border-dashed border-[#0a0f1d]/20 bg-[#F4F4F4] text-[#8c8c8c] transition-colors hover:border-[#0a0f1d]/40 hover:bg-[#EAEAEA] hover:text-[#0a0f1d]"
                >
                  <Plus className="mb-1 h-6 w-6" />
                  <span className="text-xs font-bold">{t("admin.interface.bgImageUpload")}</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </Panel>

      {canEdit ? (
        <div className="flex justify-end">
          <AdminButton type="submit" disabled={isSaving} className="w-full sm:w-auto px-10">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {t("admin.ui.save")}
          </AdminButton>
        </div>
      ) : null}
      </fieldset>
    </form>
  );
}
