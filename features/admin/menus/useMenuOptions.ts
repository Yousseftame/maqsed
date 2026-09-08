"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { MenuCategoryKey, MenuScope } from "./data";
import { menuOptionsService, findMenuOption, normalizeMenuValues, resolveMenuLabel } from "./menu-options.service";

export function useMenuOptions() {
  const { locale } = useLocale();
  const { data, isPending, isFetched } = useQuery({
    queryKey: ["menuOptions"],
    queryFn: () => menuOptionsService.getItems(),
  });

  const items = data || [];

  function of(scope: MenuScope, category: MenuCategoryKey) {
    return items.filter((item) => item.scope === scope && item.category === category);
  }

  function label(value: string) {
    return resolveMenuLabel(value, locale, items);
  }

  function labels(values: unknown) {
    return normalizeMenuValues(values, items)
      .map((value) => resolveMenuLabel(value, locale, items))
      .filter(Boolean);
  }

  function matchedLabels(values: unknown) {
    return normalizeMenuValues(values, items)
      .filter((value) => Boolean(findMenuOption(value, items)))
      .map((value) => resolveMenuLabel(value, locale, items))
      .filter(Boolean);
  }

  return { items, of, label, labels, matchedLabels, locale, isPending, isFetched };
}
