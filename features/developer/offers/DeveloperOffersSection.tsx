"use client";

import { useMemo, useState } from "react";
import { Banknote, CircleCheck, Clock, FileSignature, RefreshCw, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { DataTable, TableAction, type Column } from "@/features/admin/ui/DataTable";
import { StatCard, StatGrid } from "@/features/admin/ui/StatCard";
import { StatusBadge, type StatusTone } from "@/features/admin/ui/StatusBadge";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useAuth } from "@/features/auth/AuthProvider";
import { offerFinancials, offersService, type OfferData } from "@/features/admin/offers/offers.service";
import { OfferDetailModal } from "@/features/admin/offers/OfferDetailModal";
import { developerOwnerUid } from "@/features/developer/dashboard-owner";

const moneyValueClass = "[&_p]:whitespace-nowrap [&_p]:tabular-nums [&_p]:text-[1.65rem] sm:[&_p]:text-[1.9rem]";

function formatSar(value: number) {
  return `${(Math.round(value * 100) / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })} ر.س`;
}

function offerStatus(row: OfferData, isRtl: boolean): { tone: StatusTone; label: string } {
  if (row.status === "accepted") {
    return { tone: "success", label: isRtl ? "مقبول" : "Accepted" };
  }
  if (row.status === "rejected") {
    return { tone: "danger", label: isRtl ? "مرفوض" : "Rejected" };
  }
  if (row.status === "viewed") {
    return { tone: "warning", label: isRtl ? "تمت المشاهدة" : "Viewed" };
  }
  return { tone: "muted", label: isRtl ? "قيد الانتظار" : "Pending" };
}

export function DeveloperOffersSection() {
  const { t, isRtl } = useLocale();
  const { user, userData } = useAuth();
  const ownerUid = developerOwnerUid(user, userData);
  const [queryStr, setQueryStr] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<OfferData | null>(null);

  const { data: offers = [], refetch, isRefetching, isError } = useQuery({
    queryKey: ["offers", "developer", ownerUid],
    queryFn: () => offersService.getOffersByDeveloper(ownerUid),
    enabled: Boolean(ownerUid),
  });

  const filtered = useMemo(() => {
    const q = queryStr.trim().toLowerCase();
    if (!q) return offers;
    return offers.filter(
      (row) =>
        (row.offerNumber || "").toLowerCase().includes(q) ||
        (row.title || "").toLowerCase().includes(q) ||
        (row.description || "").toLowerCase().includes(q) ||
        (row.developerName || "").toLowerCase().includes(q)
    );
  }, [offers, queryStr]);

  const stats = useMemo(() => {
    return offers.reduce(
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
  }, [offers]);

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
        <div className="flex min-w-0 flex-col">
          <span className="font-semibold text-[#0a0f1d]">{row.title || "—"}</span>
          {(row.description || "").trim() ? (
            <span className="truncate text-xs text-[#6B7280]">{row.description}</span>
          ) : null}
        </div>
      ),
    },
    {
      id: "status",
      header: isRtl ? "الحالة" : "Status",
      cell: (row) => {
        const status = offerStatus(row, isRtl);
        return <StatusBadge tone={status.tone}>{status.label}</StatusBadge>;
      },
    },
    {
      id: "total",
      header: isRtl ? "الإجمالي" : "Total",
      cell: (row) => (
        <span className="font-bold tabular-nums text-[#0a0f1d]">{formatSar(offerFinancials(row).total)}</span>
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
        <StatCard icon={FileSignature} label={isRtl ? "عدد العروض" : "Offers"} value={stats.count} />
        <StatCard icon={Banknote} label={isRtl ? "إجمالي العروض" : "Offers total"} value={formatSar(stats.total)} className={moneyValueClass} />
        <StatCard icon={CircleCheck} label={isRtl ? "عدد المدفوع" : "Paid offers"} value={stats.paidCount} />
        <StatCard icon={Clock} label={isRtl ? "عدد غير المدفوع" : "Unpaid offers"} value={stats.unpaidCount} />
      </StatGrid>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(row) => row.id}
        empty={
          isError
            ? (isRtl ? "تعذر تحميل العروض." : "Could not load offers.")
            : (isRtl ? "لا توجد عروض بعد. ستظهر هنا بعد إضافة العرض للوحة." : "No offers yet. They appear after an offer is added to the dashboard.")
        }
        toolbar={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c]" />
              <input
                type="search"
                value={queryStr}
                onChange={(event) => setQueryStr(event.target.value)}
                placeholder={isRtl ? "البحث في العروض..." : "Search offers..."}
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

      <OfferDetailModal offer={selectedOffer} onClose={() => setSelectedOffer(null)} />
    </div>
  );
}
