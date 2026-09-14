import { cn } from "@/lib/utils";
import { discountMetaLabel } from "@/features/units/unit-discount";

export function UnitDiscountBadge({
  percent,
  daysLeft,
  isRtl,
  className,
  variant = "default",
}: {
  percent: number;
  daysLeft: number;
  isRtl: boolean;
  className?: string;
  variant?: "default" | "overlay";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold tracking-wide bg-emerald-600 text-white shadow-sm",
        variant === "overlay" ? "backdrop-blur-md" : null,
        className
      )}
    >
      {discountMetaLabel(percent, daysLeft, isRtl)}
    </span>
  );
}
