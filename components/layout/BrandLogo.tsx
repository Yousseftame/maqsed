"use client";

import { useCompanyContent } from "@/features/company/useCompanyContent";

export function BrandLogo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  const { logo } = useCompanyContent();

  return (
    <img
      src={logo}
      alt="MAQSED Logo"
      className={className}
      fetchPriority={priority ? "high" : "auto"}
      draggable={false}
    />
  );
}
