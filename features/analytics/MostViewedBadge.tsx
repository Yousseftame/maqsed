"use client";

import { Eye } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";
import { isMostViewed } from "@/features/analytics/most-viewed";

type MostViewedBadgeProps = {
  views?: number | null;
  className?: string;
  size?: "sm" | "md";
};

export function MostViewedBadge({ views, className, size = "md" }: MostViewedBadgeProps) {
  const { t } = useLocale();
  if (!isMostViewed(views)) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-[#6A2B92] font-bold tracking-wide text-white shadow-sm",
        size === "sm" ? "px-2.5 py-1 text-[10px]" : "px-3 py-1.5 text-xs sm:text-sm",
        className
      )}
    >
      <Eye className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} strokeWidth={2.5} />
      {t("properties.mostViewed")}
    </span>
  );
}
