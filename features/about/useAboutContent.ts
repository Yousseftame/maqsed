"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "@/components/providers/LocaleProvider";
import { aboutService, resolveAboutContent } from "@/features/about/about.service";

export function useAboutContent() {
  const { locale } = useLocale();
  const { data } = useQuery({
    queryKey: ["about"],
    queryFn: () => aboutService.getAbout(),
  });
  return resolveAboutContent(data, locale);
}
