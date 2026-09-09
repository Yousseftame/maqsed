const DAY_MS = 24 * 60 * 60 * 1000;

export type UnitDiscountInput = {
  price?: number | string | null;
  discountActive?: boolean;
  discountPercentage?: number | string | null;
  discountDays?: number | string | null;
  discountStartedAt?: unknown;
};

export type ActiveUnitDiscount = {
  originalPrice: number;
  salePrice: number;
  percent: number;
  days: number;
  daysLeft: number;
  endsAt: Date;
};

function toDate(value: unknown): Date | null {
  if (value == null || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "object") {
    const record = value as { toDate?: () => Date; seconds?: number; _seconds?: number };
    if (typeof record.toDate === "function") {
      try {
        const date = record.toDate();
        return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null;
      } catch {
        return null;
      }
    }
    const seconds = Number(record.seconds ?? record._seconds);
    if (Number.isFinite(seconds) && seconds > 0) return new Date(seconds * 1000);
  }
  return null;
}

export function getActiveUnitDiscount(unit: UnitDiscountInput | null | undefined, now = Date.now()): ActiveUnitDiscount | null {
  if (!unit?.discountActive) return null;

  const originalPrice = Number(unit.price) || 0;
  const percent = Number(unit.discountPercentage) || 0;
  const days = Math.floor(Number(unit.discountDays) || 0);
  if (originalPrice <= 0 || percent <= 0 || percent >= 100 || days <= 0) return null;

  const startedAt = toDate(unit.discountStartedAt);
  if (startedAt) {
    const endsAt = new Date(startedAt.getTime() + days * DAY_MS);
    const daysLeft = Math.ceil((endsAt.getTime() - now) / DAY_MS);
    if (daysLeft <= 0) return null;
    return {
      originalPrice,
      salePrice: Math.round(originalPrice * (1 - percent / 100)),
      percent,
      days,
      daysLeft,
      endsAt,
    };
  }

  return {
    originalPrice,
    salePrice: Math.round(originalPrice * (1 - percent / 100)),
    percent,
    days,
    daysLeft: days,
    endsAt: new Date(now + days * DAY_MS),
  };
}

export function unitSellingPrice(unit: UnitDiscountInput | null | undefined, now = Date.now()) {
  const originalPrice = Number(unit?.price) || 0;
  const discount = getActiveUnitDiscount(unit, now);
  return discount ? discount.salePrice : originalPrice;
}

export function discountMetaLabel(percent: number, daysLeft: number, isRtl: boolean) {
  if (isRtl) return `خصم ${percent}% · متبقي ${daysLeft} يوم`;
  const dayWord = daysLeft === 1 ? "day" : "days";
  return `${percent}% off · ${daysLeft} ${dayWord} left`;
}
