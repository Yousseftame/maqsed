"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "@/components/providers/LocaleProvider";
import { FAQ_FEATURED_LIMIT, faqService, resolveFaqItem } from "@/features/faq/faq.service";

export function useFaqs() {
  const { locale } = useLocale();
  const { data, isPending, isFetched } = useQuery({
    queryKey: ["faqs"],
    queryFn: () => faqService.getItems(),
  });

  const resolved = (data || [])
    .map((item) => resolveFaqItem(item, locale))
    .filter((item) => item.question || item.answer);

  const featured = resolved.filter((item) => item.featured).slice(0, FAQ_FEATURED_LIMIT);

  return { items: resolved, featured, isPending, isFetched };
}
