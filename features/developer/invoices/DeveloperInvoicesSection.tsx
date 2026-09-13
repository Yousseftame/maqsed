"use client";

import { useMemo, useState } from "react";
import { Banknote, CircleCheck, Clock, ReceiptText, RefreshCw, Search, Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { DataTable, TableAction, type Column } from "@/features/admin/ui/DataTable";
import { StatCard, StatGrid } from "@/features/admin/ui/StatCard";
import { StatusBadge } from "@/features/admin/ui/StatusBadge";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useAuth } from "@/features/auth/AuthProvider";
import { offerFinancials, offersService, type OfferData } from "@/features/admin/offers/offers.service";
import { developerOwnerUid } from "@/features/developer/dashboard-owner";
import { DeveloperInvoiceModal } from "./DeveloperInvoiceModal";

function formatSar(value: number) {
  return `${value.toLocaleString()} ر.س`;
}

export function DeveloperInvoicesSection() {
  const { t, isRtl } = useLocale();
  const { user, userData } = useAuth();
  const ownerUid = developerOwnerUid(user, userData);
  const [queryStr, setQueryStr] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<OfferData | null>(null);

  const { data: invoices = [], refetch, isRefetching, isError } = useQuery({
    queryKey: ["offers", "developer", ownerUid],
    queryFn: () => offersService.getOffersByDeveloper(ownerUid),
    enabled: Boolean(ownerUid),
  });

  const filtered = useMemo(() => {
    const q = queryStr.trim().toLowerCase();
    if (!q) return invoices;
    return invoices.filter(
      (row) =>
        (row.offerNumber || "").toLowerCase().includes(q) ||
        (row.title || "").toLowerCase().includes(q) ||
        (row.projectName || "").toLowerCase().includes(q) ||
        (row.unitNumber || "").toLowerCase().includes(q)
    );
  }, [invoices, queryStr]);

  const stats = useMemo(() => {
    return invoices.reduce(
      (acc, offer) => {
        const { subtotal, vat, total } = offerFinancials(offer);
        const paid = offer.paymentStatus === "received";
        acc.count += 1;
        acc.subtotal += subtotal;
        acc.vat += vat;
        acc.total += total;
        if (paid) {
          acc.paidCount += 1;
          acc.paidTotal += total;
        } else {
          acc.unpaidCount += 1;
          acc.unpaidTotal += total;
        }
        return acc;
      },
      { count: 0, subtotal: 0, vat: 0, total: 0, paidCount: 0, unpaidCount: 0, paidTotal: 0, unpaidTotal: 0 }
    );
  }, [invoices]);

  const columns: Column<OfferData>[] = [
    {
      id: "offerNumber",
      header: isRtl ? "رقم العرض" : "Offer number",
      cell: (row) => (
        <span className="font-bold text-[#0a0f1d]">{row.offerNumber ? `#${row.offerNumber}` : "—"}</span>
      ),
    },
    {
      id: "title",
      header: t("admin.offers.title") || (isRtl ? "العنوان" : "Title"),
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-[#0a0f1d]">{row.title || "—"}</span>
          <span className="text-xs text-[#6B7280]">
            {row.projectName || "—"}
            {row.unitNumber ? ` · ${row.unitNumber}` : ""}
          </span>
        </div>
      ),
    },
    {
      id: "subtotal",
      header: isRtl ? "قبل الضريبة" : "Subtotal",
      cell: (row) => (
        <span className="tabular-nums font-semibold text-[#0a0f1d]">
          {formatSar(offerFinancials(row).subtotal)}
        </span>
      ),
    },
    {
      id: "vat",
      header: isRtl ? "الضريبة (15%)" : "VAT (15%)",
      cell: (row) => (
        <span className="tabular-nums text-[#6B7280]">{formatSar(offerFinancials(row).vat)}</span>
      ),
    },
    {
      id: "total",
      header: isRtl ? "الإجمالي" : "Total",
      cell: (row) => (
        <span className="tabular-nums font-bold text-[#0a0f1d]">
          {formatSar(offerFinancials(row).total)}
        </span>
      ),
    },
    {
      id: "payment",
      header: t("admin.offers.payment") || (isRtl ? "الدفع" : "Payment"),
      cell: (row) => (
        <StatusBadge tone={row.paymentStatus === "received" ? "success" : "warning"}>
          {row.paymentStatus === "received"
            ? (isRtl ? "تم الاستلام" : "Received")
            : (isRtl ? "غير مدفوع" : "Unpaid")}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <StatGrid>
        <StatCard icon={ReceiptText} label={isRtl ? "عدد الفواتير" : "Invoices"} value={stats.count} />
        <StatCard icon={Banknote} label={isRtl ? "قبل الضريبة" : "Before tax"} value={formatSar(stats.subtotal)} />
        <StatCard icon={Banknote} label={isRtl ? "الضريبة (15%)" : "VAT (15%)"} value={formatSar(stats.vat)} />
        <StatCard icon={CircleCheck} label={isRtl ? "الإجمالي" : "Total"} value={formatSar(stats.total)} />
      </StatGrid>
      <StatGrid>
        <StatCard icon={CircleCheck} label={isRtl ? "الفواتير المدفوعة" : "Paid invoices"} value={stats.paidCount} />
        <StatCard icon={Wallet} label={isRtl ? "إجمالي المدفوع" : "Paid amount"} value={formatSar(stats.paidTotal)} />
        <StatCard icon={Clock} label={isRtl ? "الفواتير غير المدفوعة" : "Unpaid invoices"} value={stats.unpaidCount} />
        <StatCard icon={Banknote} label={isRtl ? "إجمالي غير المدفوع" : "Unpaid amount"} value={formatSar(stats.unpaidTotal)} />
      </StatGrid>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(row) => row.id}
        empty={
          isError
            ? (isRtl ? "تعذر تحميل الفواتير." : "Could not load invoices.")
            : (isRtl ? "لا توجد فواتير بعد. ستظهر هنا بعد إضافة العرض للوحة." : "No invoices yet. They appear after an offer is added to the dashboard.")
        }
        toolbar={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c]" />
              <input
                type="search"
                value={queryStr}
                onChange={(event) => setQueryStr(event.target.value)}
                placeholder={isRtl ? "البحث في الفواتير..." : "Search invoices..."}
                className="h-12 w-full rounded-full bg-[#F4F4F4] pe-4 ps-11 text-sm font-medium text-[#0a0f1d] outline-none placeholder:text-[#8c8c8c]"
              />
            </label>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isRefetching || !ownerUid}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4F4F4] text-[#0a0f1d] transition-colors hover:bg-[#E5E5E5] disabled:opacity-50"
              title={isRtl ? "تحديث" : "Refresh"}
            >
              <RefreshCw className={`h-5 w-5 ${isRefetching ? "animate-spin" : ""}`} />
            </button>
          </div>
        }
        actions={(row) => (
          <TableAction
            label={t("admin.ui.view") || (isRtl ? "عرض" : "View")}
            onClick={() => setSelectedOffer(row)}
          />
        )}
      />

      <DeveloperInvoiceModal offer={selectedOffer} onClose={() => setSelectedOffer(null)} />
    </div>
  );
}
