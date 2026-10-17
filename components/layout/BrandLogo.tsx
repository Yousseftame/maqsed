"use client";

import { useCompanyContent } from "@/features/company/useCompanyContent";
import { useLocale } from "@/components/providers/LocaleProvider";
import { BRAND_ASSETS } from "@/lib/brand-assets";

export function BrandLogo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  const { logo } = useCompanyContent();
  const { locale } = useLocale();
  const src = !logo || logo.startsWith("/") ? BRAND_ASSETS.logoSvg : logo;

  return (
    <img
      src={src}
      alt={locale === "ar" ? "شعار مقصد" : "MAQSED logo"}
      className={className}
      fetchPriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
      draggable={false}
    />
  );
}
