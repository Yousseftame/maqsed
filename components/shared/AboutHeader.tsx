"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { PageHeader } from "@/components/shared/PageHeader";

export function AboutHeader() {
  const { t } = useLocale();

  return (
    <PageHeader
      title={t("nav.about")}
      backgroundImage="/Gemini_Generated_Image_kax3jnkax3jnkax3.jpg"
      isPattern={true}
      breadcrumbPaths={[
        { name: t("nav.home"), url: "/" },
        { name: t("nav.about") }
      ]}
    />
  );
}
