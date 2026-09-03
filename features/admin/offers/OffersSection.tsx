"use client";

import { useMemo, useState } from "react";
import { FileSignature, Search, Plus, FileText, CheckCircle, Clock, XCircle, RefreshCw, Eye, Download, Pencil } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { DataTable, type Column } from "@/features/admin/ui/DataTable";
import { StatCard, StatGrid } from "@/features/admin/ui/StatCard";
import { useLocale } from "@/components/providers/LocaleProvider";
import { offersService, type OfferData } from "./offers.service";
import { OfferDetailModal } from "./OfferDetailModal";
import { EditOfferModal } from "./EditOfferModal";
import { downloadOfferPDF } from "./offer-pdf";

export function OffersSection() {
  const { t, isRtl } = useLocale();
  const router = useRouter();
  const [queryStr, setQueryStr] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<OfferData | null>(null);
  const [editingOffer, setEditingOffer] = useState<OfferData | null>(null);

  const { data: offers = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["offers"],
    queryFn: () => offersService.getOffers(),
  });

  const filtered = useMemo(() => {
    const q = queryStr.trim().toLowerCase();
    if (!q) return offers;
    return offers.filter(
      (row) =>
        (row.title || "").toLowerCase().includes(q) ||
        (row.projectName || "").toLowerCase().includes(q) ||
        (row.developerName || "").toLowerCase().includes(q) ||
        (row.offerNumber || "").toLowerCase().includes(q)
    );
  }, [offers, queryStr]);

  const stats = useMemo(() => {
    return {
      total: offers.length,
      accepted: offers.filter(o => o.status === "accepted").length,
      pending: offers.filter(o => o.status === "pending" || o.status === "creating" || o.status === "viewed").length,
      rejected: offers.filter(o => o.status === "rejected").length,
    };
  }, [offers]);

  const columns: Column<OfferData>[] = [
    {
      id: "offerNumber",
      header: isRtl ? "رقم العرض" : "Offer Number",
      cell: (row) => (
        <span className="font-bold text-[#0a0f1d]">{row.offerNumber ? `#${row.offerNumber}` : "-"}</span>
      ),
    },
    {
      id: "title",
      header: t("admin.offers.title") || "Offer Title",
      cell: (row) => (
        <span className="font-semibold text-[#0a0f1d]">{row.title || "-"}</span>
      ),
    },
    {
      id: "projectName",
      header: isRtl ? "المشروع" : "Project",
      cell: (row) => (
        <span className="text-[#0a0f1d] font-medium">{row.projectName || "-"}</span>
      ),
    },
    {
      id: "developer",
      header: t("admin.offers.developer") || "Developer",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-[#0a0f1d] font-medium">{row.developerName || "-"}</span>
          <span className="text-xs text-[#6B7280]">{row.developerEmail || "-"}</span>
        </div>
      ),
    },
    {
      id: "amount",
      header: t("admin.offers.amount") || "Amount (incl. VAT)",
      cell: (row) => (
        <span className="text-[#0a0f1d] font-semibold tabular-nums">
          SAR {Number(row.total || row.financialAmount || 0).toLocaleString()}
        </span>
      ),
    },
    {
      id: "secretCode",
      header: t("admin.offers.secretCode") || "Secret Code",
      cell: (row) => (
        <span className="text-[#0a0f1d] font-mono font-bold tracking-widest bg-[#F4F4F4] px-2 py-1 rounded-md text-sm border border-[#E5E5E5]">
          {row.secretCode || "—"}
        </span>
      ),
    },
    {
      id: "status",
      header: t("admin.offers.status") || "Status",
      cell: (row) => {
        if (row.status === "accepted") {
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
              <CheckCircle className="h-3.5 w-3.5" />
              Accepted
            </span>
          );
        }
        if (row.status === "rejected") {
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
              <XCircle className="h-3.5 w-3.5" />
              Rejected
            </span>
          );
        }
        if (row.status === "viewed") {
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
              <CheckCircle className="h-3.5 w-3.5" />
              Viewed & Pending
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
            <Clock className="h-3.5 w-3.5" />
            Not Viewed
          </span>
        );
      },
    },
    {
      id: "date",
      header: t("admin.offers.date") || "Date",
      cell: (row) => {
        let dateStr = "-";
        if (row.createdAt) {
          const dateObj = row.createdAt.toDate ? row.createdAt.toDate() : new Date(row.createdAt);
          dateStr = new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric", hour: '2-digit', minute: '2-digit' }).format(dateObj);
        }
        
        let viewedStr = null;
        if (row.viewedAt) {
          const viewedObj = row.viewedAt.toDate ? row.viewedAt.toDate() : new Date(row.viewedAt);
          viewedStr = new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric", hour: '2-digit', minute: '2-digit' }).format(viewedObj);
        }

        return (
          <div className="flex flex-col">
            <span className="text-[#0a0f1d] text-xs">Sent: {dateStr}</span>
            {viewedStr ? (
              <span className="text-blue-600 text-[11px] font-medium mt-0.5">Viewed: {viewedStr}</span>
            ) : (
              <span className="text-[#8c8c8c] text-[11px] mt-0.5">Unread</span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <StatGrid className="xl:grid-cols-4 lg:grid-cols-2">
        <StatCard icon={FileSignature} label={t("admin.offers.totalOffers") || "Total Offers"} value={stats.total} />
        <StatCard icon={CheckCircle} label={t("admin.offers.accepted") || "Accepted"} value={stats.accepted} />
        <StatCard icon={Clock} label={t("admin.offers.pending") || "Pending"} value={stats.pending} />
        <StatCard icon={XCircle} label={t("admin.offers.rejected") || "Rejected"} value={stats.rejected} />
      </StatGrid>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(row) => row.id}
        empty={t("admin.ui.empty") || "No offers found"}
        actionsHeader={t("admin.ui.actions") || "Actions"}
        toolbar={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c]" />
              <input
                type="search"
                value={queryStr}
                onChange={(event) => setQueryStr(event.target.value)}
                placeholder={t("admin.offers.search") || "Search offers..."}
                className="h-12 w-full rounded-full bg-[#F4F4F4] pe-4 ps-11 text-sm font-medium text-[#0a0f1d] outline-none placeholder:text-[#8c8c8c]"
              />
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => refetch()}
                disabled={isRefetching}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4F4F4] text-[#0a0f1d] hover:bg-[#E5E5E5] transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`h-5 w-5 ${isRefetching ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={() => router.push("/admin/offers/create")}
                className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#0a0f1d] px-6 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                {t("admin.offers.create") || "Create Offer"}
              </button>
            </div>
          </div>
        }
        actions={(row) => {
          const canEdit = row.status !== "accepted" && row.status !== "rejected";
          return (
            <div className="flex justify-end gap-2">
              {/* Edit */}
              <button
                onClick={() => canEdit && setEditingOffer(row)}
                title={canEdit ? (isRtl ? "تعديل العرض" : "Edit Offer") : (isRtl ? "لا يمكن التعديل بعد القبول أو الرفض" : "Cannot edit after acceptance/rejection")}
                disabled={!canEdit}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  canEdit
                    ? "text-[#8c8c8c] hover:bg-[#F4F4F4] hover:text-[#0a0f1d]"
                    : "text-[#cccccc] cursor-not-allowed"
                }`}
              >
                <Pencil className="h-4 w-4" />
              </button>
              {/* Details */}
              <button
                onClick={() => setSelectedOffer(row)}
                title={isRtl ? "عرض التفاصيل" : "View Details"}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8c8c8c] hover:bg-[#F4F4F4] hover:text-[#0a0f1d] transition-colors"
              >
                <Eye className="h-4 w-4" />
              </button>
              {/* PDF */}
              <button
                onClick={() => downloadOfferPDF(row)}
                title={isRtl ? "تحميل PDF" : "Download PDF"}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8c8c8c] hover:bg-[#F4F4F4] hover:text-[#0a0f1d] transition-colors"
              >
                <Download className="h-4 w-4" />
              </button>
              {/* Public link */}
              <button
                onClick={() => window.open(`/offer/${row.id}`, "_blank")}
                title={t("admin.offers.viewLink") || "View Public Link"}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8c8c8c] hover:bg-[#F4F4F4] hover:text-[#0a0f1d] transition-colors"
              >
                <FileText className="h-4 w-4" />
              </button>
            </div>
          );
        }}
      />

      <OfferDetailModal offer={selectedOffer} onClose={() => setSelectedOffer(null)} />
      <EditOfferModal offer={editingOffer} onClose={() => setEditingOffer(null)} />
    </div>
  );
}
