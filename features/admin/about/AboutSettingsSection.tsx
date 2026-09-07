"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { CloudUpload, FileText, Loader2, Plus, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Panel } from "@/features/admin/ui/Panel";
import { Field, textareaClass } from "@/features/admin/ui/Field";
import { AdminButton, fieldClass } from "@/features/admin/ui/AdminButton";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
  ABOUT_DEFAULTS,
  DEFAULT_ABOUT_FEATURES,
  DEFAULT_ABOUT_IMAGE,
  DEFAULT_ABOUT_PDF,
  DEFAULT_VISION_MISSION_IMAGE,
  aboutService,
  type AboutFeature,
} from "@/features/about/about.service";
import toast from "react-hot-toast";

type FeatureDraft = AboutFeature & { id: string };

function fileNameFromUrl(url: string): string {
  try {
    const path = decodeURIComponent(url.split("?")[0] || "");
    const name = path.split("/").pop() || "";
    return name.replace(/^\d+_[a-z0-9]+_/i, "") || name || "profile.pdf";
  } catch {
    return "profile.pdf";
  }
}

function ImagePicker({
  label,
  hint,
  uploadLabel,
  preview,
  onPick,
  inputRef,
}: {
  label: string;
  hint: string;
  uploadLabel: string;
  preview: string;
  onPick: (file: File) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-[#8c8c8c]">{label}</span>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative flex h-[220px] w-full items-center justify-center overflow-hidden rounded-[24px] bg-[#F4F4F4]"
      >
        <img src={preview} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="relative z-10 flex flex-col items-center gap-3 p-6 text-center transition-transform group-hover:scale-105">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#0a0f1d] shadow-sm">
            <CloudUpload className="h-6 w-6" strokeWidth={2.2} />
          </div>
          <span className="rounded-full bg-white/80 px-3 py-1 font-bold text-[#0a0f1d] drop-shadow-sm">
            {uploadLabel}
          </span>
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[#0a0f1d] drop-shadow-sm">
            {hint}
          </span>
        </div>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPick(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export function AboutSettingsSection() {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const aboutImageRef = useRef<HTMLInputElement>(null);
  const visionImageRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);

  const [headerTitleAr, setHeaderTitleAr] = useState("");
  const [headerTitleEn, setHeaderTitleEn] = useState("");
  const [badgeAr, setBadgeAr] = useState("");
  const [badgeEn, setBadgeEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [subtitleAr, setSubtitleAr] = useState("");
  const [subtitleEn, setSubtitleEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [features, setFeatures] = useState<FeatureDraft[]>([]);
  const [buttonTextAr, setButtonTextAr] = useState("");
  const [buttonTextEn, setButtonTextEn] = useState("");
  const [missionTitleAr, setMissionTitleAr] = useState("");
  const [missionTitleEn, setMissionTitleEn] = useState("");
  const [missionSubtitleAr, setMissionSubtitleAr] = useState("");
  const [missionSubtitleEn, setMissionSubtitleEn] = useState("");
  const [visionTitleAr, setVisionTitleAr] = useState("");
  const [visionTitleEn, setVisionTitleEn] = useState("");
  const [visionSubtitleAr, setVisionSubtitleAr] = useState("");
  const [visionSubtitleEn, setVisionSubtitleEn] = useState("");

  const [aboutImage, setAboutImage] = useState(DEFAULT_ABOUT_IMAGE);
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);
  const [visionImage, setVisionImage] = useState(DEFAULT_VISION_MISSION_IMAGE);
  const [visionImageFile, setVisionImageFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState(DEFAULT_ABOUT_PDF);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { data, isFetched } = useQuery({
    queryKey: ["about"],
    queryFn: () => aboutService.getAbout(),
  });

  useEffect(() => {
    if (!isFetched) return;
    setHeaderTitleAr(data?.headerTitleAr?.trim() || ABOUT_DEFAULTS.headerTitleAr);
    setHeaderTitleEn(data?.headerTitleEn?.trim() || ABOUT_DEFAULTS.headerTitleEn);
    setBadgeAr(data?.badgeAr?.trim() || ABOUT_DEFAULTS.badgeAr);
    setBadgeEn(data?.badgeEn?.trim() || ABOUT_DEFAULTS.badgeEn);
    setTitleAr(data?.titleAr?.trim() || ABOUT_DEFAULTS.titleAr);
    setTitleEn(data?.titleEn?.trim() || ABOUT_DEFAULTS.titleEn);
    setSubtitleAr(data?.subtitleAr?.trim() || ABOUT_DEFAULTS.subtitleAr);
    setSubtitleEn(data?.subtitleEn?.trim() || ABOUT_DEFAULTS.subtitleEn);
    setDescriptionAr(data?.descriptionAr?.trim() || ABOUT_DEFAULTS.descriptionAr);
    setDescriptionEn(data?.descriptionEn?.trim() || ABOUT_DEFAULTS.descriptionEn);
    setButtonTextAr(data?.buttonTextAr?.trim() || ABOUT_DEFAULTS.buttonTextAr);
    setButtonTextEn(data?.buttonTextEn?.trim() || ABOUT_DEFAULTS.buttonTextEn);
    setMissionTitleAr(data?.missionTitleAr?.trim() || ABOUT_DEFAULTS.missionTitleAr);
    setMissionTitleEn(data?.missionTitleEn?.trim() || ABOUT_DEFAULTS.missionTitleEn);
    setMissionSubtitleAr(data?.missionSubtitleAr?.trim() || ABOUT_DEFAULTS.missionSubtitleAr);
    setMissionSubtitleEn(data?.missionSubtitleEn?.trim() || ABOUT_DEFAULTS.missionSubtitleEn);
    setVisionTitleAr(data?.visionTitleAr?.trim() || ABOUT_DEFAULTS.visionTitleAr);
    setVisionTitleEn(data?.visionTitleEn?.trim() || ABOUT_DEFAULTS.visionTitleEn);
    setVisionSubtitleAr(data?.visionSubtitleAr?.trim() || ABOUT_DEFAULTS.visionSubtitleAr);
    setVisionSubtitleEn(data?.visionSubtitleEn?.trim() || ABOUT_DEFAULTS.visionSubtitleEn);
    setAboutImage(data?.aboutImage?.trim() || DEFAULT_ABOUT_IMAGE);
    setVisionImage(data?.visionMissionImage?.trim() || DEFAULT_VISION_MISSION_IMAGE);
    setPdfUrl(data?.profilePdf?.trim() || DEFAULT_ABOUT_PDF);
    setAboutImageFile(null);
    setVisionImageFile(null);
    setPdfFile(null);

    const savedFeatures =
      Array.isArray(data?.features) && data.features.length > 0 ? data.features : DEFAULT_ABOUT_FEATURES;
    setFeatures(
      savedFeatures.map((feature, index) => ({
        id: `${index}-${feature.textAr || feature.textEn || "feature"}`,
        textAr: feature.textAr || "",
        textEn: feature.textEn || "",
      }))
    );
  }, [data, isFetched]);

  function onAboutImagePick(file: File) {
    if (aboutImage.startsWith("blob:")) URL.revokeObjectURL(aboutImage);
    setAboutImageFile(file);
    setAboutImage(URL.createObjectURL(file));
  }

  function onVisionImagePick(file: File) {
    if (visionImage.startsWith("blob:")) URL.revokeObjectURL(visionImage);
    setVisionImageFile(file);
    setVisionImage(URL.createObjectURL(file));
  }

  function onPdfPick(file: File) {
    setPdfFile(file);
    setPdfUrl(file.name);
  }

  function updateFeature(id: string, key: "textAr" | "textEn", value: string) {
    setFeatures((current) => current.map((feature) => (feature.id === id ? { ...feature, [key]: value } : feature)));
  }

  function addFeature() {
    setFeatures((current) => [...current, { id: `${Date.now()}`, textAr: "", textEn: "" }]);
  }

  function removeFeature(id: string) {
    setFeatures((current) => current.filter((feature) => feature.id !== id));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      const nextAboutImage = aboutImageFile ? await aboutService.uploadImage(aboutImageFile) : aboutImage;
      const nextVisionImage = visionImageFile ? await aboutService.uploadImage(visionImageFile) : visionImage;
      const nextPdf = pdfFile ? await aboutService.uploadPdf(pdfFile) : pdfUrl.startsWith("blob:") ? DEFAULT_ABOUT_PDF : pdfUrl;

      await aboutService.saveAbout({
        headerTitleAr: headerTitleAr.trim(),
        headerTitleEn: headerTitleEn.trim(),
        badgeAr: badgeAr.trim(),
        badgeEn: badgeEn.trim(),
        titleAr: titleAr.trim(),
        titleEn: titleEn.trim(),
        subtitleAr: subtitleAr.trim(),
        subtitleEn: subtitleEn.trim(),
        descriptionAr: descriptionAr.trim(),
        descriptionEn: descriptionEn.trim(),
        buttonTextAr: buttonTextAr.trim(),
        buttonTextEn: buttonTextEn.trim(),
        features: features.map(({ textAr: textArValue, textEn: textEnValue }) => ({
          textAr: textArValue.trim(),
          textEn: textEnValue.trim(),
        })),
        aboutImage: nextAboutImage,
        visionMissionImage: nextVisionImage,
        profilePdf: nextPdf,
        missionTitleAr: missionTitleAr.trim(),
        missionTitleEn: missionTitleEn.trim(),
        missionSubtitleAr: missionSubtitleAr.trim(),
        missionSubtitleEn: missionSubtitleEn.trim(),
        visionTitleAr: visionTitleAr.trim(),
        visionTitleEn: visionTitleEn.trim(),
        visionSubtitleAr: visionSubtitleAr.trim(),
        visionSubtitleEn: visionSubtitleEn.trim(),
      });

      if (aboutImage.startsWith("blob:")) URL.revokeObjectURL(aboutImage);
      if (visionImage.startsWith("blob:")) URL.revokeObjectURL(visionImage);
      setAboutImage(nextAboutImage);
      setVisionImage(nextVisionImage);
      setPdfUrl(nextPdf);
      setAboutImageFile(null);
      setVisionImageFile(null);
      setPdfFile(null);

      await queryClient.invalidateQueries({ queryKey: ["about"] });
      toast.success(t("admin.ui.saved"));
    } catch (error) {
      console.error("Error saving about page:", error);
      toast.error(t("admin.ui.error") || "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  }

  const pdfLabel = pdfFile?.name || fileNameFromUrl(pdfUrl);

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6 pt-4 sm:pt-6 pb-20">
      <Panel title={t("admin.about.headerSection")}>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label={t("admin.about.headerTitleAr")}>
            <input
              type="text"
              dir="rtl"
              value={headerTitleAr}
              onChange={(e) => setHeaderTitleAr(e.target.value)}
              placeholder={ABOUT_DEFAULTS.headerTitleAr}
              className={fieldClass}
            />
          </Field>
          <Field label={t("admin.about.headerTitleEn")}>
            <input
              type="text"
              dir="ltr"
              value={headerTitleEn}
              onChange={(e) => setHeaderTitleEn(e.target.value)}
              placeholder={ABOUT_DEFAULTS.headerTitleEn}
              className={`${fieldClass} text-start`}
            />
          </Field>
        </div>
      </Panel>

      <Panel title={t("admin.about.aboutSection")}>
        <div className="flex flex-col gap-6">
          <ImagePicker
            label={t("admin.about.aboutImage")}
            hint={t("admin.about.aboutImageHint")}
            uploadLabel={t("admin.about.aboutImageUpload")}
            preview={aboutImage}
            onPick={onAboutImagePick}
            inputRef={aboutImageRef}
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label={t("admin.about.badgeAr")}>
              <input
                type="text"
                dir="rtl"
                value={badgeAr}
                onChange={(e) => setBadgeAr(e.target.value)}
                placeholder={ABOUT_DEFAULTS.badgeAr}
                className={fieldClass}
              />
            </Field>
            <Field label={t("admin.about.badgeEn")}>
              <input
                type="text"
                dir="ltr"
                value={badgeEn}
                onChange={(e) => setBadgeEn(e.target.value)}
                placeholder={ABOUT_DEFAULTS.badgeEn}
                className={`${fieldClass} text-start`}
              />
            </Field>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label={t("admin.about.titleAr")}>
              <input
                type="text"
                dir="rtl"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder={ABOUT_DEFAULTS.titleAr}
                className={fieldClass}
              />
            </Field>
            <Field label={t("admin.about.titleEn")}>
              <input
                type="text"
                dir="ltr"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder={ABOUT_DEFAULTS.titleEn}
                className={`${fieldClass} text-start`}
              />
            </Field>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label={t("admin.about.subtitleAr")}>
              <input
                type="text"
                dir="rtl"
                value={subtitleAr}
                onChange={(e) => setSubtitleAr(e.target.value)}
                placeholder={ABOUT_DEFAULTS.subtitleAr}
                className={fieldClass}
              />
            </Field>
            <Field label={t("admin.about.subtitleEn")}>
              <input
                type="text"
                dir="ltr"
                value={subtitleEn}
                onChange={(e) => setSubtitleEn(e.target.value)}
                placeholder={ABOUT_DEFAULTS.subtitleEn}
                className={`${fieldClass} text-start`}
              />
            </Field>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label={t("admin.about.descriptionAr")}>
              <textarea
                rows={6}
                dir="rtl"
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
                placeholder={ABOUT_DEFAULTS.descriptionAr}
                className={textareaClass}
              />
            </Field>
            <Field label={t("admin.about.descriptionEn")}>
              <textarea
                rows={6}
                dir="ltr"
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                placeholder={ABOUT_DEFAULTS.descriptionEn}
                className={`${textareaClass} text-start`}
              />
            </Field>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-[#8c8c8c]">{t("admin.about.features")}</span>
              <AdminButton type="button" onClick={addFeature} className="h-10 px-4">
                <Plus className="h-4 w-4" />
                {t("admin.about.addFeature")}
              </AdminButton>
            </div>
            <div className="flex flex-col gap-4">
              {features.map((feature, index) => (
                <div key={feature.id} className="grid gap-4 rounded-[20px] bg-[#F4F4F4] p-4 sm:grid-cols-[1fr_1fr_auto]">
                  <Field label={`${t("admin.about.featureAr")} ${index + 1}`}>
                    <input
                      type="text"
                      dir="rtl"
                      value={feature.textAr || ""}
                      onChange={(e) => updateFeature(feature.id, "textAr", e.target.value)}
                      className={fieldClass}
                    />
                  </Field>
                  <Field label={`${t("admin.about.featureEn")} ${index + 1}`}>
                    <input
                      type="text"
                      dir="ltr"
                      value={feature.textEn || ""}
                      onChange={(e) => updateFeature(feature.id, "textEn", e.target.value)}
                      className={`${fieldClass} text-start`}
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={() => removeFeature(feature.id)}
                    className="mt-7 flex h-12 w-12 items-center justify-center self-start rounded-full bg-white text-red-500 shadow-sm transition-colors hover:text-red-600"
                    aria-label={t("admin.ui.delete")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label={t("admin.about.buttonTextAr")}>
              <input
                type="text"
                dir="rtl"
                value={buttonTextAr}
                onChange={(e) => setButtonTextAr(e.target.value)}
                placeholder={ABOUT_DEFAULTS.buttonTextAr}
                className={fieldClass}
              />
            </Field>
            <Field label={t("admin.about.buttonTextEn")}>
              <input
                type="text"
                dir="ltr"
                value={buttonTextEn}
                onChange={(e) => setButtonTextEn(e.target.value)}
                placeholder={ABOUT_DEFAULTS.buttonTextEn}
                className={`${fieldClass} text-start`}
              />
            </Field>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#8c8c8c]">{t("admin.about.profilePdf")}</span>
            <button
              type="button"
              onClick={() => pdfRef.current?.click()}
              className="flex items-center gap-4 rounded-[24px] bg-[#F4F4F4] px-5 py-4 text-start transition-colors hover:bg-[#EFEFEF]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#6A2B92] shadow-sm">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#0a0f1d]">{pdfLabel}</p>
                <p className="text-xs font-semibold text-[#8c8c8c]">
                  {t("admin.about.profilePdfUpload")} · {t("admin.about.profilePdfHint")}
                </p>
              </div>
            </button>
            <input
              ref={pdfRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onPdfPick(file);
                e.target.value = "";
              }}
            />
          </div>
        </div>
      </Panel>

      <Panel title={t("admin.about.visionMissionSection")}>
        <div className="flex flex-col gap-6">
          <ImagePicker
            label={t("admin.about.visionMissionImage")}
            hint={t("admin.about.aboutImageHint")}
            uploadLabel={t("admin.about.visionMissionImageUpload")}
            preview={visionImage}
            onPick={onVisionImagePick}
            inputRef={visionImageRef}
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label={t("admin.about.missionTitleAr")}>
              <input
                type="text"
                dir="rtl"
                value={missionTitleAr}
                onChange={(e) => setMissionTitleAr(e.target.value)}
                placeholder={ABOUT_DEFAULTS.missionTitleAr}
                className={fieldClass}
              />
            </Field>
            <Field label={t("admin.about.missionTitleEn")}>
              <input
                type="text"
                dir="ltr"
                value={missionTitleEn}
                onChange={(e) => setMissionTitleEn(e.target.value)}
                placeholder={ABOUT_DEFAULTS.missionTitleEn}
                className={`${fieldClass} text-start`}
              />
            </Field>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label={t("admin.about.missionSubtitleAr")}>
              <textarea
                rows={4}
                dir="rtl"
                value={missionSubtitleAr}
                onChange={(e) => setMissionSubtitleAr(e.target.value)}
                placeholder={ABOUT_DEFAULTS.missionSubtitleAr}
                className={textareaClass}
              />
            </Field>
            <Field label={t("admin.about.missionSubtitleEn")}>
              <textarea
                rows={4}
                dir="ltr"
                value={missionSubtitleEn}
                onChange={(e) => setMissionSubtitleEn(e.target.value)}
                placeholder={ABOUT_DEFAULTS.missionSubtitleEn}
                className={`${textareaClass} text-start`}
              />
            </Field>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label={t("admin.about.visionTitleAr")}>
              <input
                type="text"
                dir="rtl"
                value={visionTitleAr}
                onChange={(e) => setVisionTitleAr(e.target.value)}
                placeholder={ABOUT_DEFAULTS.visionTitleAr}
                className={fieldClass}
              />
            </Field>
            <Field label={t("admin.about.visionTitleEn")}>
              <input
                type="text"
                dir="ltr"
                value={visionTitleEn}
                onChange={(e) => setVisionTitleEn(e.target.value)}
                placeholder={ABOUT_DEFAULTS.visionTitleEn}
                className={`${fieldClass} text-start`}
              />
            </Field>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label={t("admin.about.visionSubtitleAr")}>
              <textarea
                rows={4}
                dir="rtl"
                value={visionSubtitleAr}
                onChange={(e) => setVisionSubtitleAr(e.target.value)}
                placeholder={ABOUT_DEFAULTS.visionSubtitleAr}
                className={textareaClass}
              />
            </Field>
            <Field label={t("admin.about.visionSubtitleEn")}>
              <textarea
                rows={4}
                dir="ltr"
                value={visionSubtitleEn}
                onChange={(e) => setVisionSubtitleEn(e.target.value)}
                placeholder={ABOUT_DEFAULTS.visionSubtitleEn}
                className={`${textareaClass} text-start`}
              />
            </Field>
          </div>
        </div>
      </Panel>

      <div className="flex justify-end">
        <AdminButton type="submit" disabled={isSaving} className="w-full px-10 sm:w-auto">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {t("admin.ui.save")}
        </AdminButton>
      </div>
    </form>
  );
}
