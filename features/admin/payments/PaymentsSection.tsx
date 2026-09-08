"use client";

import { useMemo, useState } from "react";
import { DollarSign, Search, RefreshCw, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { DataTable, type Column } from "@/features/admin/ui/DataTable";
import { StatCard, StatGrid } from "@/features/admin/ui/StatCard";
import { StatusBadge } from "@/features/admin/ui/StatusBadge";
import { useLocale } from "@/components/providers/LocaleProvider";
import { offerAmount, offersService, type OfferData } from "@/features/admin/offers/offers.service";
import { OfferDetailModal } from "@/features/admin/offers/OfferDetailModal";

function formatDate(value: unknown, locale: string) {
  if (!value) return "—";
  const date = typeof value === "object" && value !== null && "toDate" in value
    ? (value as { toDate: () => Date }).toDate()
    : new Date(value as string | number);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatMoney(value: number) {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function PaymentsSection() {
  const { t, isRtl, locale } = useLocale();
  const [queryStr, setQueryStr] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<OfferData | null>(null);

  const { data: offers = [], refetch, isRefetching } = useQuery({
    queryKey: ["offers"],
    queryFn: () => offersService.getOffers(),
  });

  const receivedOffers = useMemo(
    () =>
      [...offers]
        .filter((offer) => offer.paymentStatus === "received")
        .sort((a, b) => (Number(b.paymentReceivedAt) || 0) - (Number(a.paymentReceivedAt) || 0)),
    [offers]
  );

  const filtered = useMemo(() => {
    const q = queryStr.trim().toLowerCase();
    if (!q) return receivedOffers;
    return receivedOffers.filter(
      (row) =>
        (row.offerNumber || "").toLowerCase().includes(q) ||
        (row.title || "").toLowerCase().includes(q) ||
        (row.projectName || "").toLowerCase().includes(q) ||
        (row.developerName || "").toLowerCase().includes(q) ||
        (row.developerEmail || "").toLowerCase().includes(q)
    );
  }, [receivedOffers, queryStr]);

  const stats = useMemo(() => {
    const totalAmount = receivedOffers.reduce((sum, offer) => sum + offerAmount(offer), 0);
    return {
      count: receivedOffers.length,
      totalAmount,
    };
  }, [receivedOffers]);

  const columns: Column<OfferData>[] = [
    {
      id: "offerNumber",
      header: t("admin.payments.offerNumber"),
      cell: (row) => (
        <span className="text-[15px] font-bold tracking-tight text-[#0a0f1d]">
          {row.offerNumber ? `#${row.offerNumber}` : "—"}
        </span>
      ),
    },
    {
      id: "title",
      header: t("admin.payments.title"),
      cell: (row) => <span className="font-semibold text-[#0a0f1d]">{row.title || "—"}</span>,
    },
    {
      id: "developer",
      header: t("admin.payments.developer"),
      cell: (row) => (
        <div className="flex min-w-0 flex-col">
          <span className="font-semibold text-[#0a0f1d]">{row.developerName || "—"}</span>
          <span className="text-xs font-medium text-[#8c8c8c]">{row.developerEmail || "—"}</span>
        </div>
      ),
    },
    {
      id: "projectName",
      header: t("admin.payments.project"),
      cell: (row) => <span className="font-medium text-[#0a0f1d]">{row.projectName || "—"}</span>,
    },
    {
      id: "date",
      header: t("admin.payments.date"),
      cell: (row) => (
        <span className="text-xs font-medium text-[#0a0f1d]">
          {formatDate(row.paymentReceivedAt, locale)}
        </span>
      ),
    },
    {
      id: "status",
      header: t("admin.offers.payment"),
      cell: () => (
        <StatusBadge tone="success">{t("admin.offers.paymentReceived")}</StatusBadge>
      ),
    },
    {
      id: "amount",
      header: t("admin.payments.amount"),
      cell: (row) => (
        <span className="text-base font-bold tabular-nums text-[#0a0f1d]">
          {formatMoney(offerAmount(row))}{" "}
          <span className="text-sm font-bold text-[#0a0f1d]/70">
            {t("admin.analytics.inventory.marketValueHint")}
          </span>
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <StatGrid className="xl:grid-cols-2 lg:grid-cols-2">
        <StatCard icon={DollarSign} label={t("admin.payments.total")} value={stats.count} />
        <StatCard
          icon={DollarSign}
          label={t("admin.payments.totalAmount")}
          value={formatMoney(stats.totalAmount)}
          hint={t("admin.analytics.inventory.marketValueHint")}
        />
      </StatGrid>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(row) => row.id}
        empty={t("admin.payments.empty")}
        actionsHeader={t("admin.ui.actions")}
        toolbar={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c]" />
              <input
                type="search"
                value={queryStr}
                onChange={(event) => setQueryStr(event.target.value)}
                placeholder={t("admin.payments.search")}
                className="h-12 w-full rounded-full bg-[#F4F4F4] pe-4 ps-11 text-sm font-medium text-[#0a0f1d] outline-none placeholder:text-[#8c8c8c]"
              />
            </label>
            <button
              onClick={() => refetch()}
              disabled={isRefetching}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4F4F4] text-[#0a0f1d] transition-colors hover:bg-[#E5E5E5] disabled:opacity-50"
              title={t("admin.ui.refresh")}
            >
              <RefreshCw className={`h-5 w-5 ${isRefetching ? "animate-spin" : ""}`} />
            </button>
          </div>
        }
        actions={(row) => (
          <button
            onClick={() => setSelectedOffer(row)}
            title={isRtl ? "عرض التفاصيل" : "View Details"}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8c8c8c] transition-colors hover:bg-white hover:text-[#0a0f1d]"
          >
            <Eye className="h-4 w-4" />
          </button>
        )}
      />

      <OfferDetailModal offer={selectedOffer} onClose={() => setSelectedOffer(null)} />
    </div>
  );
}
