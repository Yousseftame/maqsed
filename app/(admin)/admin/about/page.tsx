"use client";

import { useLocale } from "@/components/providers/LocaleProvider";

export default function AdminAboutPage() {
  const { t } = useLocale();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-[#0a0f1d]">
          {t("admin.nav.about")}
        </h1>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(10,15,29,0.04)]">
        {/* Content will go here */}
      </div>
    </div>
  );
}
