"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ImagePlus } from "lucide-react";
import { Panel } from "@/features/admin/ui/Panel";
import { AdminButton, fieldClass } from "@/features/admin/ui/AdminButton";
import { Field, textareaClass } from "@/features/admin/ui/Field";
import { COMPANY_INFO } from "@/features/admin/company/data";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

export function CompanySection() {
  const { locale, t } = useLocale();
  const fileRef = useRef<HTMLInputElement>(null);
  const [logo, setLogo] = useState(COMPANY_INFO.logo);
  const [about, setAbout] = useState(COMPANY_INFO.about[locale]);
  const [phones, setPhones] = useState(COMPANY_INFO.phones);
  const [owner, setOwner] = useState(COMPANY_INFO.owner[locale]);
  const [commercial, setCommercial] = useState(COMPANY_INFO.commercial);
  const [fal, setFal] = useState(COMPANY_INFO.fal);
  const [complaints, setComplaints] = useState(COMPANY_INFO.complaints);

  useEffect(() => {
    setAbout(COMPANY_INFO.about[locale]);
    setOwner(COMPANY_INFO.owner[locale]);
  }, [locale]);

  function onLogoChange(file: File | undefined) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogo(url);
  }

  function updatePhone(index: number, value: string) {
    setPhones((current) => current.map((phone, i) => (i === index ? value : phone)));
  }

  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    toast.success(t("admin.ui.saved"), { id: "company-saved" });
  }

  return (
    <form className="flex min-w-0 flex-col gap-3" onSubmit={handleSave}>
      <Panel>
        <div className="grid gap-6 lg:grid-cols-[240px_1fr] lg:items-start">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#8c8c8c]">
              {t("admin.company.logo")}
            </span>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="group relative flex aspect-square w-full max-w-[240px] items-center justify-center overflow-hidden rounded-[24px] bg-[#F4F4F4]"
            >
              {logo ? (
                <img
                  src={logo}
                  alt=""
                  className="h-full w-full object-contain p-8"
                />
              ) : (
                <ImagePlus className="h-8 w-8 text-[#8c8c8c]" strokeWidth={1.6} />
              )}
              <span className="absolute inset-x-4 bottom-4 rounded-full bg-[#0a0f1d] px-3 py-2 text-center text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                {t("admin.company.changeLogo")}
              </span>
            </button>
            <p className="text-xs font-medium text-[#8c8c8c]">
              {t("admin.company.logoHint")}
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => onLogoChange(event.target.files?.[0])}
            />
          </div>

          <Field label={t("admin.company.about")}>
            <textarea
              value={about}
              onChange={(event) => setAbout(event.target.value)}
              placeholder={t("admin.company.aboutPlaceholder")}
              className={textareaClass}
            />
          </Field>
        </div>
      </Panel>

      <Panel title={t("admin.company.contacts")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {phones.map((phone, index) => (
            <Field key={index} label={`${t("admin.company.number")} ${index + 1}`}>
              <input
                type="tel"
                dir="ltr"
                value={phone}
                onChange={(event) => updatePhone(index, event.target.value)}
                className={cn(fieldClass, "text-start")}
              />
            </Field>
          ))}
        </div>
      </Panel>

      <Panel title={t("admin.company.legal")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Field label={t("admin.company.owner")}>
            <input
              value={owner}
              onChange={(event) => setOwner(event.target.value)}
              className={fieldClass}
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
        <AdminButton type="submit" className="w-full sm:w-auto">
          {t("admin.ui.save")}
        </AdminButton>
      </div>
    </form>
  );
}
