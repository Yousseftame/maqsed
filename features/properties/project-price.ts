import type { Unit } from "@/features/admin/units/units.service";

export type ProjectPriceRange = {
  min: number;
  max: number;
};

function sellingPrice(unit: Unit) {
  const price = Number(unit.price);
  if (!Number.isFinite(price) || price <= 0) return 0;
  if (!unit.discountActive) return price;
  const percent = Number(unit.discountPercentage) || 0;
  if (percent <= 0 || percent >= 100) return price;
  return Math.round(price * (1 - percent / 100));
}

export function projectPriceRangeFromUnits(propertyId: string, units: Unit[]): ProjectPriceRange | null {
  const prices = units
    .filter((unit) => unit.projectId === propertyId && unit.status === "available")
    .map(sellingPrice)
    .filter((price) => price > 0);

  if (!prices.length) return null;
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

function formatAmount(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export function formatProjectPriceRange(range: ProjectPriceRange | null | undefined, isRtl: boolean) {
  if (!range || range.min <= 0) return "";
  const min = formatAmount(range.min);
  const max = formatAmount(range.max);
  if (range.min === range.max) {
    return isRtl ? `تبدأ الأسعار من ${min} ريال` : `Prices start from ${min} SAR`;
  }
  return isRtl
    ? `تبدأ الأسعار من ${min} إلى ${max} ريال`
    : `Prices start from ${min} to ${max} SAR`;
}
