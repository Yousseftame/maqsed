"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "@/components/providers/LocaleProvider";
import { companyService, resolveCompanyContent } from "@/features/company/company.service";

export function useCompanyContent() {
  const { locale } = useLocale();
  const { data } = useQuery({
    queryKey: ["company"],
    queryFn: () => companyService.getCompany(),
  });
  return resolveCompanyContent(data, locale);
}
