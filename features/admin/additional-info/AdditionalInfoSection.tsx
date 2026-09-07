"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { LegalItemsPanel } from "@/features/admin/additional-info/LegalItemsPanel";

export function AdditionalInfoSection() {
  const { t } = useLocale();

  return (
    <div className="flex flex-col gap-6 pt-4 sm:pt-6 pb-20">
      <LegalItemsPanel page="privacy" title={t("admin.additionalInfo.privacyPolicy")} />
      <LegalItemsPanel page="terms" title={t("admin.additionalInfo.terms")} />
    </div>
  );
}
