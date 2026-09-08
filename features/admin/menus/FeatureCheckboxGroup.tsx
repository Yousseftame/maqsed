"use client";

import { Loader2 } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { MenuOption } from "./data";
import { isMenuValueSelected, resolveMenuLabel, toggleMenuValue } from "./menu-options.service";
import { useMenuOptions } from "./useMenuOptions";
import { cn } from "@/lib/utils";

export function FeatureCheckboxGroup({
  items,
  values,
  onChange,
  variant = "project",
  disabled,
}: {
  items: MenuOption[];
  values: unknown;
  onChange: (next: string[]) => void;
  variant?: "project" | "unit";
  disabled?: boolean;
}) {
  const { locale, t } = useLocale();
  const { isPending } = useMenuOptions();

  function toggle(item: MenuOption) {
    if (disabled) return;
    onChange(toggleMenuValue(item, values, items));
  }

  if (items.length === 0) {
    if (isPending) {
      return <Loader2 className="h-4 w-4 animate-spin text-[#8c8c8c]" />;
    }
    return (
      <p className="text-sm font-medium text-[#8c8c8c]">{t("admin.menus.emptyCategory")}</p>
    );
  }

  return (
    <div className={cn("flex flex-wrap", variant === "project" ? "gap-3" : "gap-4")}>
      {items.map((item) => {
        const label = resolveMenuLabel(item.value, locale, [item]);
        const isSelected = isMenuValueSelected(item, values);

        if (variant === "project") {
          return (
            <label
              key={item.id}
              className="flex cursor-pointer items-center gap-3 rounded-[16px] bg-[#F4F4F4] px-5 py-3 transition-colors hover:bg-[#EAEAEA]"
            >
              <input
                type="checkbox"
                value={item.value}
                checked={isSelected}
                disabled={disabled}
                onChange={() => toggle(item)}
                className="h-4 w-4 rounded-[4px] accent-[#0a0f1d]"
              />
              <span className="text-sm font-bold text-[#0a0f1d]">{label}</span>
            </label>
          );
        }

        return (
          <label
            key={item.id}
            className={cn(
              "flex min-w-[140px] cursor-pointer items-center justify-between gap-3 rounded-[12px] border px-4 py-3 transition-colors",
              isSelected
                ? "border-[#0a0f1d]/30 bg-[#0a0f1d]/5"
                : "border-[#0a0f1d]/10 bg-white hover:bg-[#F4F4F4]"
            )}
          >
            <span
              className={cn(
                "text-sm",
                isSelected ? "font-bold text-[#0a0f1d]" : "font-medium text-[#8c8c8c]"
              )}
            >
              {label}
            </span>
            <input
              type="checkbox"
              value={item.value}
              checked={isSelected}
              disabled={disabled}
              onChange={() => toggle(item)}
              className="h-4 w-4 rounded-[4px] accent-[#0a0f1d]"
            />
          </label>
        );
      })}
    </div>
  );
}
