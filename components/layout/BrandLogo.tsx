"use client";

import { useCompanyContent } from "@/features/company/useCompanyContent";
import { useLocale } from "@/components/providers/LocaleProvider";

export function BrandLogo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  const { logo } = useCompanyContent();
  const { locale } = useLocale();

  return (
    <img
      src={logo}
      alt={locale === "ar" ? "شعار مقصد" : "MAQSED logo"}
      className={className}
      fetchPriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
      draggable={false}
    />
  );
}
