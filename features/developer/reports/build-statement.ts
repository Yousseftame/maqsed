import { offerFinancials, type OfferData } from "@/features/admin/offers/offers.service";
import { formatServiceValue, type OfferServiceItem } from "@/features/admin/offers/offer-services";
import { inRange, toMillis, type DateRange } from "./report-dates";

export type StatementService = {
  description: string;
  value: string;
};

export type StatementInvoice = {
  id: string;
  offerNumber: string;
  title: string;
  issuedAt: number;
  paidAt: number | null;
  actualPaidAt: number | null;
  paid: boolean;
  paidInPeriod: boolean;
  paidAfterPeriod: boolean;
  outstandingAtEnd: boolean;
  subtotal: number;
  vat: number;
  total: number;
  services: StatementService[];
};

export type PeriodSnapshot = {
  range: DateRange;
  issued: StatementInvoice[];
  collected: StatementInvoice[];
  priorCollections: StatementInvoice[];
  openingOutstanding: StatementInvoice[];
  closingOutstanding: StatementInvoice[];
  issuedCount: number;
  issuedSubtotal: number;
  issuedVat: number;
  issuedTotal: number;
  issuedPaidCount: number;
  issuedUnpaidCount: number;
  issuedPaidTotal: number;
  issuedUnpaidTotal: number;
  collectedCount: number;
  collectedSubtotal: number;
  collectedVat: number;
  collectedTotal: number;
  priorCollectedCount: number;
  priorCollectedTotal: number;
  openingCount: number;
  openingTotal: number;
  closingCount: number;
  closingTotal: number;
  outstandingChange: number;
  averageInvoice: number;
  collectionRate: number;
  netRevenue: number;
  collectedProfit: number;
  periodLoss: number;
  reconciling: boolean;
};

export type StatementMetricKey =
  | "issuedCount"
  | "issuedSubtotal"
  | "issuedVat"
  | "issuedTotal"
  | "issuedPaidCount"
  | "issuedUnpaidCount"
  | "issuedPaidTotal"
  | "issuedUnpaidTotal"
  | "collectedCount"
  | "collectedTotal"
  | "openingTotal"
  | "closingTotal"
  | "outstandingChange"
  | "averageInvoice"
  | "collectionRate"
  | "netRevenue"
  | "collectedProfit"
  | "periodLoss";

export type ComparedMetric = {
  key: StatementMetricKey;
  current: number;
  previous: number;
  delta: number;
  pct: number | null;
  invert: boolean;
};

export type PeriodStatement = {
  current: PeriodSnapshot;
  previous: PeriodSnapshot;
  undated: StatementInvoice[];
  metrics: ComparedMetric[];
};

function roundMoney(value: number) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function toCents(value: number) {
  return Math.round(roundMoney(value) * 100);
}

function fromCents(cents: number) {
  return cents / 100;
}

function sumCents(invoices: StatementInvoice[], field: "subtotal" | "vat" | "total") {
  return invoices.reduce((sum, item) => sum + toCents(item[field]), 0);
}

function offerNumberLabel(offer: OfferData) {
  const number = String(offer.offerNumber || "").replace(/^#/, "").trim();
  return number ? `#${number}` : "";
}

export function invoiceIssuedAt(offer: OfferData) {
  return toMillis(offer.dashboardAssignedAt) ?? toMillis(offer.respondedAt) ?? toMillis(offer.createdAt);
}

function invoiceActualPaidAt(offer: OfferData) {
  if (offer.paymentStatus !== "received") return null;
  return toMillis(offer.paymentReceivedAt);
}

function mapInvoice(offer: OfferData, range: DateRange, isRtl: boolean): StatementInvoice | null {
  const issuedAt = invoiceIssuedAt(offer);
  if (issuedAt == null) return null;
  const { subtotal, vat, total } = offerFinancials(offer);
  const actualPaidAt = invoiceActualPaidAt(offer);
  const paidAt = actualPaidAt == null ? null : Math.max(actualPaidAt, issuedAt);
  const paid = paidAt != null;
  const paidInPeriod = paidAt != null && inRange(paidAt, range);
  const paidAfterPeriod = paidAt != null && paidAt >= range.end;
  const outstandingAtEnd = issuedAt < range.end && (paidAt == null || paidAt >= range.end);

  return {
    id: offer.id,
    offerNumber: offerNumberLabel(offer) || offer.title?.trim() || offer.id.slice(0, 8),
    title: String(offer.title || "").trim(),
    issuedAt,
    paidAt,
    actualPaidAt,
    paid,
    paidInPeriod,
    paidAfterPeriod,
    outstandingAtEnd,
    subtotal: roundMoney(subtotal),
    vat: roundMoney(vat),
    total: roundMoney(total),
    services: (offer.services || []).map((item: OfferServiceItem) => ({
      description: String(item.description || "").trim() || "—",
      value: formatServiceValue(item, isRtl),
    })),
  };
}

function sortInvoices(rows: StatementInvoice[]) {
  return [...rows].sort((a, b) => {
    if (b.issuedAt !== a.issuedAt) return b.issuedAt - a.issuedAt;
    return a.offerNumber.localeCompare(b.offerNumber, "en");
  });
}

function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

function snapshotFromInvoices(range: DateRange, invoices: StatementInvoice[]): PeriodSnapshot {
  const issued = sortInvoices(invoices.filter((item) => inRange(item.issuedAt, range)));
  const collected = sortInvoices(
    invoices.filter((item) => item.paidAt != null && inRange(item.paidAt, range) && item.issuedAt < range.end)
  );
  const priorCollections = collected.filter((item) => item.issuedAt < range.start);
  const openingOutstanding = sortInvoices(
    invoices.filter((item) => item.issuedAt < range.start && (item.paidAt == null || item.paidAt >= range.start))
  );
  const closingOutstanding = sortInvoices(
    invoices.filter((item) => item.issuedAt < range.end && (item.paidAt == null || item.paidAt >= range.end))
  );
  const issuedPaid = issued.filter((item) => item.paidAt != null && item.paidAt < range.end);
  const issuedUnpaid = issued.filter((item) => item.paidAt == null || item.paidAt >= range.end);

  const issuedCount = issued.length;
  const issuedSubtotalCents = sumCents(issued, "subtotal");
  const issuedVatCents = sumCents(issued, "vat");
  const issuedTotalCents = sumCents(issued, "total");
  const issuedPaidTotalCents = sumCents(issuedPaid, "total");
  const issuedUnpaidTotalCents = sumCents(issuedUnpaid, "total");
  const collectedSubtotalCents = sumCents(collected, "subtotal");
  const collectedVatCents = sumCents(collected, "vat");
  const collectedTotalCents = sumCents(collected, "total");
  const priorCollectedTotalCents = sumCents(priorCollections, "total");
  const openingTotalCents = sumCents(openingOutstanding, "total");
  const closingTotalCents = sumCents(closingOutstanding, "total");
  const outstandingChangeCents = closingTotalCents - openingTotalCents;
  const issuedSubtotal = fromCents(issuedSubtotalCents);
  const issuedVat = fromCents(issuedVatCents);
  const issuedTotal = fromCents(issuedTotalCents);
  const issuedPaidTotal = fromCents(issuedPaidTotalCents);
  const issuedUnpaidTotal = fromCents(issuedUnpaidTotalCents);
  const collectedSubtotal = fromCents(collectedSubtotalCents);
  const collectedVat = fromCents(collectedVatCents);
  const collectedTotal = fromCents(collectedTotalCents);
  const averageInvoice = issuedCount > 0 ? fromCents(Math.round(issuedTotalCents / issuedCount)) : 0;
  const collectionRate = issuedTotalCents > 0 ? (issuedPaidTotalCents / issuedTotalCents) * 100 : 0;
  const reconciling =
    openingTotalCents + issuedTotalCents - collectedTotalCents - closingTotalCents !== 0;

  return {
    range,
    issued,
    collected,
    priorCollections,
    openingOutstanding,
    closingOutstanding,
    issuedCount,
    issuedSubtotal,
    issuedVat,
    issuedTotal,
    issuedPaidCount: issuedPaid.length,
    issuedUnpaidCount: issuedUnpaid.length,
    issuedPaidTotal,
    issuedUnpaidTotal,
    collectedCount: collected.length,
    collectedSubtotal,
    collectedVat,
    collectedTotal,
    priorCollectedCount: priorCollections.length,
    priorCollectedTotal: fromCents(priorCollectedTotalCents),
    openingCount: openingOutstanding.length,
    openingTotal: fromCents(openingTotalCents),
    closingCount: closingOutstanding.length,
    closingTotal: fromCents(closingTotalCents),
    outstandingChange: fromCents(outstandingChangeCents),
    averageInvoice,
    collectionRate,
    netRevenue: issuedSubtotal,
    collectedProfit: collectedSubtotal,
    periodLoss: issuedUnpaidTotal,
    reconciling,
  };
}

function metric(
  key: StatementMetricKey,
  current: number,
  previous: number,
  invert = false
): ComparedMetric {
  return {
    key,
    current,
    previous,
    delta: fromCents(toCents(current) - toCents(previous)),
    pct: pctChange(current, previous),
    invert,
  };
}

export function buildPeriodStatement(
  offers: OfferData[],
  currentRange: DateRange,
  previousRange: DateRange,
  isRtl: boolean
): PeriodStatement {
  const dated: StatementInvoice[] = [];
  const undated: StatementInvoice[] = [];

  for (const offer of offers) {
    const currentRow = mapInvoice(offer, currentRange, isRtl);
    if (!currentRow) {
      const { subtotal, vat, total } = offerFinancials(offer);
      undated.push({
        id: offer.id,
        offerNumber: offerNumberLabel(offer) || offer.title?.trim() || offer.id.slice(0, 8),
        title: String(offer.title || "").trim(),
        issuedAt: 0,
        paidAt: invoiceActualPaidAt(offer),
        actualPaidAt: invoiceActualPaidAt(offer),
        paid: offer.paymentStatus === "received",
        paidInPeriod: false,
        paidAfterPeriod: false,
        outstandingAtEnd: offer.paymentStatus !== "received",
        subtotal: roundMoney(subtotal),
        vat: roundMoney(vat),
        total: roundMoney(total),
        services: (offer.services || []).map((item) => ({
          description: String(item.description || "").trim() || "—",
          value: formatServiceValue(item, isRtl),
        })),
      });
      continue;
    }
    dated.push(currentRow);
  }

  const previousDated = offers
    .map((offer) => mapInvoice(offer, previousRange, isRtl))
    .filter((item): item is StatementInvoice => item != null);

  const current = snapshotFromInvoices(currentRange, dated);
  const previous = snapshotFromInvoices(previousRange, previousDated);

  const metrics: ComparedMetric[] = [
    metric("issuedCount", current.issuedCount, previous.issuedCount),
    metric("issuedSubtotal", current.issuedSubtotal, previous.issuedSubtotal),
    metric("issuedVat", current.issuedVat, previous.issuedVat),
    metric("issuedTotal", current.issuedTotal, previous.issuedTotal),
    metric("netRevenue", current.netRevenue, previous.netRevenue),
    metric("issuedPaidCount", current.issuedPaidCount, previous.issuedPaidCount),
    metric("issuedPaidTotal", current.issuedPaidTotal, previous.issuedPaidTotal),
    metric("issuedUnpaidCount", current.issuedUnpaidCount, previous.issuedUnpaidCount, true),
    metric("issuedUnpaidTotal", current.issuedUnpaidTotal, previous.issuedUnpaidTotal, true),
    metric("periodLoss", current.periodLoss, previous.periodLoss, true),
    metric("collectedCount", current.collectedCount, previous.collectedCount),
    metric("collectedTotal", current.collectedTotal, previous.collectedTotal),
    metric("collectedProfit", current.collectedProfit, previous.collectedProfit),
    metric("collectionRate", current.collectionRate, previous.collectionRate),
    metric("averageInvoice", current.averageInvoice, previous.averageInvoice),
    metric("openingTotal", current.openingTotal, previous.openingTotal, true),
    metric("closingTotal", current.closingTotal, previous.closingTotal, true),
    metric("outstandingChange", current.outstandingChange, previous.outstandingChange, true),
  ];

  return { current, previous, undated, metrics };
}
