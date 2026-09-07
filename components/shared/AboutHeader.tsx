"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAboutContent } from "@/features/about/useAboutContent";

export function AboutHeader() {
  const { t } = useLocale();
  const { headerTitle } = useAboutContent();

  return (
    <PageHeader
      title={headerTitle}
      backgroundImage="/Gemini_Generated_Image_kax3jnkax3jnkax3.jpg"
      isPattern={true}
      breadcrumbPaths={[
        { name: t("nav.home"), url: "/" },
        { name: headerTitle }
      ]}
    />
  );
}
