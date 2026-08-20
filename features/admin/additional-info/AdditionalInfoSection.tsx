"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Panel } from "@/features/admin/ui/Panel";
import { Field, textareaClass } from "@/features/admin/ui/Field";
import { AdminButton, fieldClass } from "@/features/admin/ui/AdminButton";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

export function AdditionalInfoSection() {
  const { t } = useLocale();

  // Mock State
  const [privacyPolicy, setPrivacyPolicy] = useState(
    "نسخ كود المنصة، أو سحب البيانات تلقائياً للإعلانات والعقارات لاستخدامها في منصات منافسة.\nنشر أي محتوى مخالف للآداب العامة أو الأنظمة الرسمية."
  );
  const [terms, setTerms] = useState(
    "1. مقدمة وتمهيد\nتُعد هذه الشروط والأحكام بمثابة اتفاقية قانونية ملزمة بين منصة [اسم المنصة] وبين أي شخص يقوم بالدخول إلى المنصة..."
  );

  const [instagram, setInstagram] = useState("https://www.instagram.com/c_brandsa");
  const [twitter, setTwitter] = useState("https://www.instagram.com/c_brandsa"); // As per image placeholder
  const [snapchat, setSnapchat] = useState("https://www.instagram.com/c_brandsa");
  const [linkedin, setLinkedin] = useState("https://www.instagram.com/c_brandsa");
  const [tiktok, setTiktok] = useState("https://tiktok.com/@username");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    toast.success(t("admin.ui.saved"));
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6 pt-4 sm:pt-6 pb-20">
      
      {/* Legal Pages and Policies Panel */}
      <Panel title={t("admin.additionalInfo.legalTitle")}>
        <div className="flex flex-col gap-6">
          <Field label={t("admin.additionalInfo.privacyPolicy")}>
            <textarea
              value={privacyPolicy}
              onChange={(e) => setPrivacyPolicy(e.target.value)}
              placeholder={t("admin.additionalInfo.privacyPolicyPlaceholder")}
              className={textareaClass}
            />
          </Field>

          <Field label={t("admin.additionalInfo.terms")}>
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder={t("admin.additionalInfo.termsPlaceholder")}
              className={textareaClass}
            />
          </Field>
        </div>
      </Panel>

      {/* Social Media Platforms Panel */}
      <Panel title={t("admin.additionalInfo.socialTitle")}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Field label={t("admin.additionalInfo.instagram")}>
            <input
              type="url"
              dir="ltr"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className={cn(fieldClass, "text-start")}
            />
          </Field>

          <Field label={t("admin.additionalInfo.twitter")}>
            <input
              type="url"
              dir="ltr"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              className={cn(fieldClass, "text-start")}
            />
          </Field>

          <Field label={t("admin.additionalInfo.snapchat")}>
            <input
              type="url"
              dir="ltr"
              value={snapchat}
              onChange={(e) => setSnapchat(e.target.value)}
              className={cn(fieldClass, "text-start")}
            />
          </Field>

          <Field label={t("admin.additionalInfo.linkedin")}>
            <input
              type="url"
              dir="ltr"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className={cn(fieldClass, "text-start")}
            />
          </Field>

          <Field label={t("admin.additionalInfo.tiktok")} className="sm:col-span-2">
            <input
              type="url"
              dir="ltr"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              className={cn(fieldClass, "text-start")}
            />
          </Field>
        </div>
      </Panel>

      <div className="flex justify-end">
        <AdminButton type="submit" className="w-full sm:w-auto px-10">
          {t("admin.ui.save")}
        </AdminButton>
      </div>

    </form>
  );
}
