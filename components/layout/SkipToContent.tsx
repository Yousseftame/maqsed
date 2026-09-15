"use client";

import { useLocale } from "@/components/providers/LocaleProvider";

export function SkipToContent() {
  const { t } = useLocale();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-[#6A2B92] focus:shadow-lg"
    >
      {t("nav.skipToContent")}
    </a>
  );
}
