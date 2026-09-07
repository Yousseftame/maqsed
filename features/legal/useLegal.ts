"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "@/components/providers/LocaleProvider";
import { legalService, resolveLegalItem, type LegalPageId } from "@/features/legal/legal.service";

export function useLegalItems(page: LegalPageId) {
  const { locale } = useLocale();
  const { data, isPending, isFetched } = useQuery({
    queryKey: ["legal", page],
    queryFn: () => legalService.getItems(page),
  });

  const items = (data || [])
    .map((item) => resolveLegalItem(item, locale))
    .filter((item) => item.question || item.answer);

  return { items, isPending, isFetched };
}
