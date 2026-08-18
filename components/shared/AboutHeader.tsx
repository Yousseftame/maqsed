"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { PageHeader } from "@/components/shared/PageHeader";

export function AboutHeader() {
  const { t } = useLocale();

  return (
    <PageHeader
      title={t("nav.about")}
      backgroundImage="/about-bg.jpg"
      breadcrumbPaths={[
        { name: t("nav.home"), url: "/" },
        { name: t("nav.about") }
      ]}
    />
  );
}
