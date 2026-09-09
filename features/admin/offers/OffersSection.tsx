"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FileSignature, Search, Plus, FileText, CheckCircle, Clock, XCircle, RefreshCw, Eye, Download, Pencil, ChevronDown, Send, Trash2 } from "lucide-react";
import { createPortal } from "react-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { DataTable, type Column } from "@/features/admin/ui/DataTable";
import { StatCard, StatGrid } from "@/features/admin/ui/StatCard";
import { StatusBadge, type StatusTone } from "@/features/admin/ui/StatusBadge";
import { useLocale } from "@/components/providers/LocaleProvider";
import { offersService, type OfferData } from "./offers.service";
import { OfferDetailModal } from "./OfferDetailModal";
import { EditOfferModal } from "./EditOfferModal";
import { OfferShareModal } from "./OfferShareModal";
import { downloadOfferPDF } from "./offer-pdf";
import { usePermissions } from "@/features/admin/permissions/usePermissions";
import { useConfirm } from "@/features/admin/components/ConfirmModal";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export function OffersSection() {
  const { t, isRtl } = useLocale();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { can } = usePermissions();
  const confirm = useConfirm();
  const canCreate = can("offers", "create");
  const canEditOffer = can("offers", "edit");
  const canDeleteOffer = can("offers", "delete");
  const [queryStr, setQueryStr] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<OfferData | null>(null);
  const [editingOffer, setEditingOffer] = useState<OfferData | null>(null);
  const [sharingOffer, setSharingOffer] = useState<OfferData | null>(null);

  const { data: offers = [], refetch, isRefetching } = useQuery({
    queryKey: ["offers"],
    queryFn: () => offersService.getOffers(),
  });

  useEffect(() => {
    setSelectedOffer((current) => {
      if (!current) return current;
      return offers.find((item) => item.id === current.id) ?? current;
    });
  }, [offers]);

  const paymentMutation = useMutation({
    mutationFn: async ({ offer, status }: { offer: OfferData; status: "unpaid" | "received" }) => {
      if (status === "received") await offersService.setPaymentReceived(offer);
      else await offersService.setPaymentUnpaid(offer);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success(t("admin.ui.success"));
    },
    onError: (error) => {
      console.error("Failed to update payment status", error);
      toast.error(t("admin.ui.error"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (row: OfferData) => offersService.deleteOffer(row.id),
    onSuccess: (_data, row) => {
      if (selectedOffer?.id === row.id) setSelectedOffer(null);
      if (editingOffer?.id === row.id) setEditingOffer(null);
      if (sharingOffer?.id === row.id) setSharingOffer(null);
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success(isRtl ? "تم حذف العرض بنجاح" : "Offer deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete offer", error);
      toast.error(t("admin.ui.error") || (isRtl ? "تعذر حذف العرض" : "Failed to delete the offer"));
    },
  });

  async function handleDelete(row: OfferData) {
    const ok = await confirm({
      title: isRtl ? "حذف العرض" : "Delete Offer",
      description: isRtl
        ? `هل أنت متأكد من حذف العرض ${row.offerNumber || ""}؟ سيتم حذف كل بياناته ولا يمكن التراجع.`
        : `Are you sure you want to delete offer ${row.offerNumber || ""}? This cannot be undone.`,
      confirmLabel: t("admin.ui.delete") || (isRtl ? "حذف" : "Delete"),
      cancelLabel: t("admin.cancel") || (isRtl ? "إلغاء" : "Cancel"),
      tone: "danger",
    });
    if (!ok) return;
    deleteMutation.mutate(row);
  }

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
      id: "payment",
      header: t("admin.offers.payment") || (isRtl ? "الدفع" : "Payment"),
      cell: (row) => (
        <PaymentStatusDropdown
          received={row.paymentStatus === "received"}
          enabled={canEditOffer && row.status === "accepted"}
          unpaidLabel={t("admin.offers.paymentUnpaid")}
          receivedLabel={t("admin.offers.paymentReceived")}
          lockedTitle={isRtl ? "يتاح الدفع بعد قبول العرض" : "Payment is available after the offer is accepted"}
          isPending={paymentMutation.isPending}
          isRtl={isRtl}
          onSelect={(status) => {
            const received = row.paymentStatus === "received";
            if (status === row.paymentStatus || (!received && status === "unpaid")) return;
            paymentMutation.mutate({ offer: row, status });
          }}
        />
      ),
    },
    {
      id: "status",
      header: t("admin.offers.status") || "Status",
      cell: (row) => {
        const tone: StatusTone =
          row.status === "accepted"
            ? "success"
            : row.status === "rejected"
              ? "danger"
              : row.status === "viewed"
                ? "navy"
                : "warning";
        const label =
          row.status === "accepted"
            ? t("admin.offers.accepted")
            : row.status === "rejected"
              ? t("admin.offers.rejected")
              : row.status === "viewed"
                ? isRtl
                  ? "تمت المشاهدة"
                  : "Viewed"
                : isRtl
                  ? "لم يُشاهد"
                  : "Not viewed";
        return <StatusBadge tone={tone}>{label}</StatusBadge>;
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
              {canCreate ? (
              <button
                onClick={() => router.push("/admin/offers/create")}
                className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#0a0f1d] px-6 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                {t("admin.offers.create") || "Create Offer"}
              </button>
              ) : null}
            </div>
          </div>
        }
        actions={(row) => {
          const canEdit = canEditOffer && row.status !== "accepted" && row.status !== "rejected";
          return (
            <div className="flex justify-end gap-2">
              {canEditOffer ? (
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
              ) : null}
              <button
                onClick={() => setSharingOffer(row)}
                title={isRtl ? "إرسال واتساب أو ايميل" : "Send WhatsApp or Email"}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8c8c8c] hover:bg-[#F4F4F4] hover:text-[#0a0f1d] transition-colors"
              >
                <Send className={`h-4 w-4 ${isRtl ? "scale-x-[-1]" : ""}`} />
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
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#0d9488] hover:bg-[#f0fdfa] hover:text-[#0f766e] transition-colors"
              >
                <FileText className="h-4 w-4" />
              </button>
              {canDeleteOffer ? (
                <button
                  type="button"
                  onClick={() => handleDelete(row)}
                  disabled={deleteMutation.isPending}
                  title={isRtl ? "حذف العرض" : "Delete Offer"}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8c8c8c] transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          );
        }}
      />

      <OfferDetailModal offer={selectedOffer} onClose={() => setSelectedOffer(null)} />
      <EditOfferModal offer={editingOffer} onClose={() => setEditingOffer(null)} />
      <OfferShareModal offer={sharingOffer} onClose={() => setSharingOffer(null)} />
    </div>
  );
}

function PaymentStatusDropdown({
  received,
  enabled,
  unpaidLabel,
  receivedLabel,
  lockedTitle,
  isPending,
  isRtl,
  onSelect,
}: {
  received: boolean;
  enabled: boolean;
  unpaidLabel: string;
  receivedLabel: string;
  lockedTitle: string;
  isPending: boolean;
  isRtl: boolean;
  onSelect: (status: "unpaid" | "received") => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const current = received ? "received" : "unpaid";
  const options = [
    { id: "unpaid" as const, label: unpaidLabel },
    { id: "received" as const, label: receivedLabel },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setCoords({
          top: rect.bottom + window.scrollY + 8,
          left: isRtl ? rect.left + window.scrollX : rect.right + window.scrollX,
        });
      }
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, isRtl]);

  const label = received ? receivedLabel : unpaidLabel;
  const tone = received ? "bg-[#E8F8EF] text-[#83BF6E]" : "bg-[#F4F4F4] text-[#6B7280]";

  if (!enabled) {
    return (
      <span
        title={lockedTitle}
        className={cn(
          "inline-flex h-8 cursor-not-allowed items-center whitespace-nowrap rounded-full px-3 text-xs font-bold",
          tone
        )}
      >
        {label}
      </span>
    );
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen((open) => !open);
        }}
        disabled={isPending}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-xs font-bold transition-opacity hover:opacity-80 disabled:opacity-50",
          tone
        )}
      >
        <span>{label}</span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 shrink-0 transition-transform", isOpen && "rotate-180")}
          strokeWidth={2.4}
        />
      </button>
      {isOpen && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={dropdownRef}
              style={{
                position: "absolute",
                top: coords.top,
                left: coords.left,
                transform: isRtl ? "none" : "translateX(-100%)",
              }}
              className="z-50 min-w-[11rem] overflow-hidden rounded-[16px] border border-[#0a0f1d]/10 bg-white shadow-xl"
            >
              <div className="flex flex-col py-1">
                {options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      onSelect(option.id);
                      setIsOpen(false);
                    }}
                    className={`px-4 py-2 text-sm font-bold transition-colors hover:bg-[#F4F4F4] ${
                      isRtl ? "text-right" : "text-left"
                    } ${current === option.id ? "bg-[#F4F4F4] text-[#0a0f1d]" : "text-[#8c8c8c]"}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
