"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Panel } from "@/features/admin/ui/Panel";
import { AdminButton, fieldClass } from "@/features/admin/ui/AdminButton";
import { Field } from "@/features/admin/ui/Field";
import { COMPANY_DEFAULTS, DEFAULT_COMPANY_LOGO } from "@/features/admin/company/data";
import {
  companyService,
  isSocialEnabled,
  normalizeLicenses,
  type CompanyLicense,
  type SocialEnabledMap,
  type SocialNetwork,
} from "@/features/company/company.service";
import { usePermissions } from "@/features/admin/permissions/usePermissions";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

const SOCIAL_NETWORKS: SocialNetwork[] = ["linkedin", "facebook", "instagram", "twitter", "snapchat", "tiktok"];

function SocialToggle({ enabled, onChange }: { enabled: boolean; onChange: (next: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full transition-colors",
        enabled ? "bg-[#17C3B3]" : "bg-[#D1D5DB]"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all",
          enabled ? "start-[1.35rem]" : "start-0.5"
        )}
      />
    </button>
  );
}

export function CompanySection() {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const { can } = usePermissions();
  const canEdit = can("company", "edit");
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
  const [snapchat, setSnapchat] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [socialEnabled, setSocialEnabled] = useState<SocialEnabledMap>({});
  const [ownerAr, setOwnerAr] = useState("");
  const [ownerEn, setOwnerEn] = useState("");
  const [commercial, setCommercial] = useState("");
  const [fal, setFal] = useState("");
  const [complaints, setComplaints] = useState("");
  const [licenses, setLicenses] = useState<CompanyLicense[]>([]);
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
    setSnapchat(data?.snapchat?.trim() || "");
    setTiktok(data?.tiktok?.trim() || "");
    setSocialEnabled(
      Object.fromEntries(SOCIAL_NETWORKS.map((network) => [network, isSocialEnabled(data?.socialEnabled, network)]))
    );
    setOwnerAr(data?.ownerAr?.trim() || COMPANY_DEFAULTS.ownerAr);
    setOwnerEn(data?.ownerEn?.trim() || COMPANY_DEFAULTS.ownerEn);
    setCommercial(data?.commercial?.trim() || COMPANY_DEFAULTS.commercial);
    setFal(data?.fal?.trim() || COMPANY_DEFAULTS.fal);
    setComplaints(data?.complaints?.trim() || COMPANY_DEFAULTS.complaints);
    setLicenses(normalizeLicenses(data?.licenses));
  }, [data, isFetched]);

  function onLogoChange(file: File | undefined) {
    if (!file) return;
    if (logo.startsWith("blob:")) URL.revokeObjectURL(logo);
    setLogoFile(file);
    setLogo(URL.createObjectURL(file));
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!canEdit) return;
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
        snapchat: snapchat.trim(),
        tiktok: tiktok.trim(),
        socialEnabled: {
          linkedin: socialEnabled.linkedin !== false,
          facebook: socialEnabled.facebook !== false,
          instagram: socialEnabled.instagram !== false,
          twitter: socialEnabled.twitter !== false,
          snapchat: socialEnabled.snapchat !== false,
          tiktok: socialEnabled.tiktok !== false,
        },
        ownerAr: ownerAr.trim(),
        ownerEn: ownerEn.trim(),
        commercial: commercial.trim(),
        fal: fal.trim(),
        complaints: complaints.trim(),
        licenses: licenses
          .map((item) => ({
            id: item.id,
            titleAr: item.titleAr.trim(),
            titleEn: item.titleEn.trim(),
            value: item.value?.trim() || "",
          }))
          .filter((item) => item.titleAr || item.titleEn),
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
      <fieldset disabled={!canEdit} className="m-0 flex min-w-0 flex-col gap-6 border-0 p-0 disabled:opacity-90">
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
          {(
            [
              ["linkedin", linkedin, setLinkedin],
              ["facebook", facebook, setFacebook],
              ["instagram", instagram, setInstagram],
              ["twitter", twitter, setTwitter],
              ["snapchat", snapchat, setSnapchat],
              ["tiktok", tiktok, setTiktok],
            ] as const
          ).map(([network, value, setValue]) => {
            const enabled = socialEnabled[network] !== false;
            return (
              <div key={network} className="flex min-w-0 flex-col gap-2">
                <span className="text-sm font-semibold text-[#8c8c8c]">{t(`admin.company.${network}`)}</span>
                <div className="flex items-center gap-3">
                  <input
                    type="url"
                    dir="ltr"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder="https://"
                    className={cn(fieldClass, "min-w-0 flex-1 text-start")}
                  />
                  <SocialToggle
                    enabled={enabled}
                    onChange={(next) => setSocialEnabled((current) => ({ ...current, [network]: next }))}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel title={t("admin.company.licenses")}>
        <p className="mb-5 text-sm font-medium text-[#8c8c8c]">{t("admin.company.licensesHint")}</p>
        {licenses.length === 0 ? (
          <p className="mb-4 text-sm font-medium text-[#8c8c8c]">{t("admin.company.emptyLicenses")}</p>
        ) : (
          <div className="mb-4 flex flex-col gap-3">
            {licenses.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
                <input
                  dir="rtl"
                  value={item.titleAr}
                  onChange={(event) =>
                    setLicenses((current) =>
                      current.map((license, i) => (i === index ? { ...license, titleAr: event.target.value } : license))
                    )
                  }
                  placeholder={t("admin.company.licenseTitleAr")}
                  className={fieldClass}
                />
                <input
                  dir="ltr"
                  value={item.titleEn}
                  onChange={(event) =>
                    setLicenses((current) =>
                      current.map((license, i) => (i === index ? { ...license, titleEn: event.target.value } : license))
                    )
                  }
                  placeholder={t("admin.company.licenseTitleEn")}
                  className={cn(fieldClass, "text-start")}
                />
                <input
                  dir="ltr"
                  value={item.value || ""}
                  onChange={(event) =>
                    setLicenses((current) =>
                      current.map((license, i) => (i === index ? { ...license, value: event.target.value } : license))
                    )
                  }
                  placeholder={t("admin.company.licenseValue")}
                  className={cn(fieldClass, "text-start")}
                />
                <button
                  type="button"
                  onClick={() => setLicenses((current) => current.filter((_, i) => i !== index))}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F4F4] text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() =>
            setLicenses((current) => [
              ...current,
              {
                id: `license-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                titleAr: "",
                titleEn: "",
                value: "",
              },
            ])
          }
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#F4F4F4] px-5 text-sm font-bold text-[#0a0f1d] transition-colors hover:bg-[#EAEAEA]"
        >
          <Plus className="h-4 w-4" />
          {t("admin.company.addLicense")}
        </button>
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
