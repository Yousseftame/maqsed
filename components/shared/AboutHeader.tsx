"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAboutContent } from "@/features/about/useAboutContent";
import { BRAND_ASSETS } from "@/lib/brand-assets";

export function AboutHeader() {
  const { t } = useLocale();
  const { headerTitle } = useAboutContent();

  return (
    <PageHeader
      title={headerTitle}
      backgroundImage={BRAND_ASSETS.pagePattern}
      isPattern={true}
      breadcrumbPaths={[
        { name: t("nav.home"), url: "/" },
        { name: headerTitle }
      ]}
    />
  );
}
