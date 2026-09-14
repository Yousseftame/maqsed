export type OfferServiceKind = "amount" | "percent" | "free";

export interface OfferServiceItem {
  description: string;
  price: number;
  kind?: OfferServiceKind;
  percent?: number;
}

export const OFFER_SERVICE_KIND_OPTIONS: { id: OfferServiceKind; labelAr: string; labelEn: string }[] = [
  { id: "amount", labelAr: "مبلغ", labelEn: "Amount" },
  { id: "percent", labelAr: "نسبة %", labelEn: "Percent %" },
  { id: "free", labelAr: "بدون تكلفة", labelEn: "No cost" },
];

export function emptyOfferService(): OfferServiceItem {
  return { description: "", kind: "amount", price: 0, percent: 0 };
}

export function serviceKind(item: Pick<OfferServiceItem, "kind"> | undefined | null): OfferServiceKind {
  if (item?.kind === "percent" || item?.kind === "free") return item.kind;
  return "amount";
}

export function normalizeOfferService(item: OfferServiceItem): OfferServiceItem {
  const description = String(item.description || "").trim();
  const kind = serviceKind(item);

  if (kind === "percent") {
    return {
      description,
      kind,
      percent: Number(item.percent) || 0,
      price: 0,
    };
  }

  if (kind === "free") {
    return { description, kind, percent: 0, price: 0 };
  }

  return {
    description,
    kind: "amount",
    percent: 0,
    price: Number(item.price) || 0,
  };
}

export function applyOfferServicePatch(
  current: OfferServiceItem,
  patch: Partial<OfferServiceItem>
): OfferServiceItem {
  const next: OfferServiceItem = { ...current, ...patch };
  const kind = serviceKind(next);

  if (kind === "percent") {
    return {
      ...next,
      kind,
      percent: Number(next.percent) || 0,
      price: 0,
    };
  }

  if (kind === "free") {
    return { ...next, kind, percent: 0, price: 0 };
  }

  return {
    ...next,
    kind: "amount",
    percent: 0,
    price: Number(next.price) || 0,
  };
}

export function billableServicesTotal(services?: OfferServiceItem[]): number {
  return (services || []).reduce((sum, item) => {
    if (serviceKind(item) !== "amount") return sum;
    return sum + (Number(item.price) || 0);
  }, 0);
}

export function offerServiceTotals(services?: OfferServiceItem[]) {
  const subtotal = billableServicesTotal(services);
  const vat = Math.round(subtotal * 0.15 * 100) / 100;
  const total = Math.round((subtotal + vat) * 100) / 100;
  return { subtotal, vat, total };
}

export function formatServiceValue(item: OfferServiceItem, isRtl = true): string {
  const kind = serviceKind(item);

  if (kind === "percent") {
    return `${Number(item.percent) || 0}%`;
  }

  if (kind === "free") {
    return isRtl ? "بدون تكلفة" : "No cost";
  }

  const amount = Number(item.price) || 0;
  return isRtl ? `${amount.toLocaleString()} ريال` : `${amount.toLocaleString()} SAR`;
}

export function formatServiceLine(item: OfferServiceItem, isRtl = true): string {
  const description = (item.description || "").trim() || "—";
  return `${description} — ${formatServiceValue(item, isRtl)}`;
}
