"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ImagePlus, Loader2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Panel } from "@/features/admin/ui/Panel";
import { AdminButton, fieldClass } from "@/features/admin/ui/AdminButton";
import { Field } from "@/features/admin/ui/Field";
import { COMPANY_DEFAULTS, DEFAULT_COMPANY_LOGO } from "@/features/admin/company/data";
import { companyService } from "@/features/company/company.service";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

export function CompanySection() {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [logo, setLogo] = useState(DEFAULT_COMPANY_LOGO);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [locationAr, setLocationAr] = useState("");
  const [locationEn, setLocationEn] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [ownerAr, setOwnerAr] = useState("");
  const [ownerEn, setOwnerEn] = useState("");
  const [commercial, setCommercial] = useState("");
  const [fal, setFal] = useState("");
  const [complaints, setComplaints] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { data, isFetched } = useQuery({
    queryKey: ["company"],
    queryFn: () => companyService.getCompany(),
  });

  useEffect(() => {
    if (!isFetched) return;
    setLogo((current) => {
      if (current.startsWith("blob:")) URL.revokeObjectURL(current);
      return data?.logo?.trim() || DEFAULT_COMPANY_LOGO;
    });
    setLogoFile(null);
    setPhone(data?.phone?.trim() || COMPANY_DEFAULTS.phone);
    setEmail(data?.email?.trim() || COMPANY_DEFAULTS.email);
    setLocationAr(data?.locationAr?.trim() || COMPANY_DEFAULTS.locationAr);
    setLocationEn(data?.locationEn?.trim() || COMPANY_DEFAULTS.locationEn);
    setFacebook(data?.facebook?.trim() || "");
    setInstagram(data?.instagram?.trim() || "");
    setTwitter(data?.twitter?.trim() || "");
    setLinkedin(data?.linkedin?.trim() || "");
    setOwnerAr(data?.ownerAr?.trim() || COMPANY_DEFAULTS.ownerAr);
    setOwnerEn(data?.ownerEn?.trim() || COMPANY_DEFAULTS.ownerEn);
    setCommercial(data?.commercial?.trim() || COMPANY_DEFAULTS.commercial);
    setFal(data?.fal?.trim() || COMPANY_DEFAULTS.fal);
    setComplaints(data?.complaints?.trim() || COMPANY_DEFAULTS.complaints);
  }, [data, isFetched]);

  function onLogoChange(file: File | undefined) {
    if (!file) return;
    if (logo.startsWith("blob:")) URL.revokeObjectURL(logo);
    setLogoFile(file);
    setLogo(URL.createObjectURL(file));
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    try {
      const nextLogo = logoFile ? await companyService.uploadLogo(logoFile) : logo;
      await companyService.saveCompany({
        logo: nextLogo,
        phone: phone.trim(),
        email: email.trim(),
        locationAr: locationAr.trim(),
        locationEn: locationEn.trim(),
        facebook: facebook.trim(),
        instagram: instagram.trim(),
        twitter: twitter.trim(),
        linkedin: linkedin.trim(),
        ownerAr: ownerAr.trim(),
        ownerEn: ownerEn.trim(),
        commercial: commercial.trim(),
        fal: fal.trim(),
        complaints: complaints.trim(),
      });
      if (logo.startsWith("blob:")) URL.revokeObjectURL(logo);
      setLogo(nextLogo);
      setLogoFile(null);
      await queryClient.invalidateQueries({ queryKey: ["company"] });
      toast.success(t("admin.ui.saved"));
    } catch (error) {
      console.error("Error saving company:", error);
      toast.error(t("admin.ui.error") || "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="flex min-w-0 flex-col gap-6 pt-4 sm:pt-6 pb-20" onSubmit={handleSave}>
      <Panel title={t("admin.company.logo")}>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="group relative flex aspect-square w-full max-w-[240px] items-center justify-center overflow-hidden rounded-[24px] bg-[#F4F4F4]"
          >
            {logo ? (
              <img src={logo} alt="" className="h-full w-full object-contain p-8" />
            ) : (
              <ImagePlus className="h-8 w-8 text-[#8c8c8c]" strokeWidth={1.6} />
            )}
            <span className="absolute inset-x-4 bottom-4 rounded-full bg-[#0a0f1d] px-3 py-2 text-center text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
              {t("admin.company.changeLogo")}
            </span>
          </button>
          <p className="text-xs font-medium text-[#8c8c8c]">{t("admin.company.logoHint")}</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => onLogoChange(event.target.files?.[0])}
          />
        </div>
      </Panel>

      <Panel title={t("admin.company.contacts")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t("admin.company.phone")}>
            <input
              type="tel"
              dir="ltr"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder={COMPANY_DEFAULTS.phone}
              className={cn(fieldClass, "text-start")}
            />
          </Field>
          <Field label={t("admin.company.email")}>
            <input
              type="email"
              dir="ltr"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={COMPANY_DEFAULTS.email}
              className={cn(fieldClass, "text-start")}
            />
          </Field>
          <Field label={t("admin.company.locationAr")}>
            <input
              dir="rtl"
              value={locationAr}
              onChange={(event) => setLocationAr(event.target.value)}
              placeholder={COMPANY_DEFAULTS.locationAr}
              className={fieldClass}
            />
          </Field>
          <Field label={t("admin.company.locationEn")}>
            <input
              dir="ltr"
              value={locationEn}
              onChange={(event) => setLocationEn(event.target.value)}
              placeholder={COMPANY_DEFAULTS.locationEn}
              className={cn(fieldClass, "text-start")}
            />
          </Field>
        </div>
      </Panel>

      <Panel title={t("admin.company.socials")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t("admin.company.linkedin")}>
            <input
              type="url"
              dir="ltr"
              value={linkedin}
              onChange={(event) => setLinkedin(event.target.value)}
              placeholder="https://"
              className={cn(fieldClass, "text-start")}
            />
          </Field>
          <Field label={t("admin.company.facebook")}>
            <input
              type="url"
              dir="ltr"
              value={facebook}
              onChange={(event) => setFacebook(event.target.value)}
              placeholder="https://"
              className={cn(fieldClass, "text-start")}
            />
          </Field>
          <Field label={t("admin.company.instagram")}>
            <input
              type="url"
              dir="ltr"
              value={instagram}
              onChange={(event) => setInstagram(event.target.value)}
              placeholder="https://"
              className={cn(fieldClass, "text-start")}
            />
          </Field>
          <Field label={t("admin.company.twitter")}>
            <input
              type="url"
              dir="ltr"
              value={twitter}
              onChange={(event) => setTwitter(event.target.value)}
              placeholder="https://"
              className={cn(fieldClass, "text-start")}
            />
          </Field>
        </div>
      </Panel>

      <Panel title={t("admin.company.legal")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Field label={t("admin.company.ownerAr")}>
            <input
              dir="rtl"
              value={ownerAr}
              onChange={(event) => setOwnerAr(event.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label={t("admin.company.ownerEn")}>
            <input
              dir="ltr"
              value={ownerEn}
              onChange={(event) => setOwnerEn(event.target.value)}
              className={cn(fieldClass, "text-start")}
            />
          </Field>
          <Field label={t("admin.company.commercial")}>
            <input
              dir="ltr"
              value={commercial}
              onChange={(event) => setCommercial(event.target.value)}
              className={cn(fieldClass, "text-start")}
            />
          </Field>
          <Field label={t("admin.company.fal")}>
            <input
              dir="ltr"
              value={fal}
              onChange={(event) => setFal(event.target.value)}
              className={cn(fieldClass, "text-start")}
            />
          </Field>
          <Field label={t("admin.company.complaints")}>
            <input
              dir="ltr"
              value={complaints}
              onChange={(event) => setComplaints(event.target.value)}
              className={cn(fieldClass, "text-start")}
            />
          </Field>
        </div>
      </Panel>

      <div className="flex justify-end">
        <AdminButton type="submit" disabled={isSaving} className="w-full sm:w-auto px-10">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {t("admin.ui.save")}
        </AdminButton>
      </div>
    </form>
  );
}
