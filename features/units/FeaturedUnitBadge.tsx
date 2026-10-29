"use client";

import { Star } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

type FeaturedUnitBadgeProps = {
  featured?: boolean;
  className?: string;
  size?: "sm" | "md";
};

export function FeaturedUnitBadge({ featured, className, size = "md" }: FeaturedUnitBadgeProps) {
  const { t } = useLocale();
  if (!featured) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-[#6A2B92] font-bold tracking-wide text-white shadow-sm",
        size === "sm" ? "px-2.5 py-1 text-[10px]" : "px-3 py-1.5 text-xs sm:text-sm",
        className
      )}
    >
      <Star
        className={size === "sm" ? "h-3 w-3 fill-white text-white" : "h-3.5 w-3.5 fill-white text-white"}
        strokeWidth={2}
      />
      {t("properties.featuredUnit")}
    </span>
  );
}
