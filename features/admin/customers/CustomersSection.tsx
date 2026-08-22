"use client";

import { useMemo, useState } from "react";
import { CircleCheck, FileText, MessageSquare, Search, Users, RefreshCw, Loader2 } from "lucide-react";
import { DataTable, TableAction, type Column } from "@/features/admin/ui/DataTable";
import { StatCard, StatGrid } from "@/features/admin/ui/StatCard";
import { StatusBadge } from "@/features/admin/ui/StatusBadge";
import { useConfirm } from "@/features/admin/components/ConfirmModal";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { requestsService, type ContactRequest, type SellRequest, type RequestStatus } from "./requests.service";
import { ViewRequestModal } from "./ViewRequestModal";
import { ProcessRequestModal } from "./ProcessRequestModal";
import toast from "react-hot-toast";

const REQUEST_STATUS_TONE: Record<RequestStatus, "default" | "success" | "warning" | "danger" | "muted" | "navy"> = {
  new: "warning",
  contacted: "navy",
  completed: "success",
  cancelled: "danger",
};

export function CustomersSection() {
  const { locale, t } = useLocale();
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"contact" | "sell">("contact");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  const [viewRequest, setViewRequest] = useState<ContactRequest | SellRequest | null>(null);
  const [processState, setProcessState] = useState<{ id: string; type: "contact" | "sell"; status: RequestStatus } | null>(null);

  const { data: contactRequests = [], isFetching: isFetchingContact } = useQuery({
    queryKey: ["contactRequests"],
    queryFn: () => requestsService.getContactRequests(),
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  const { data: sellRequests = [], isFetching: isFetchingSell } = useQuery({
    queryKey: ["sellRequests"],
    queryFn: () => requestsService.getSellRequests(),
    refetchInterval: 30000,
  });

  const isRefreshing = isFetchingContact || isFetchingSell;

  const handleRefresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["contactRequests"] }),
      queryClient.invalidateQueries({ queryKey: ["sellRequests"] })
    ]);
  };

  const formatDate = (ts: any) => {
    if (!ts) return "";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const filteredContact = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contactRequests.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (q && !row.fullName.toLowerCase().includes(q) && !row.phone.includes(q)) return false;
      return true;
    });
  }, [contactRequests, query, statusFilter]);

  const filteredSell = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sellRequests.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (q && !row.fullNameAlt.toLowerCase().includes(q) && !row.mobileNumber.includes(q) && !row.city.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [sellRequests, query, statusFilter]);

  const totalRequests = contactRequests.length + sellRequests.length;
  const newRequestsCount = contactRequests.filter(r => r.status === "new").length + sellRequests.filter(r => r.status === "new").length;

  const deleteContactMutation = useMutation({
    mutationFn: (id: string) => requestsService.deleteContactRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactRequests"] });
      toast.success(t("admin.ui.success") || "Deleted successfully");
    },
  });

  const deleteSellMutation = useMutation({
    mutationFn: (id: string) => requestsService.deleteSellRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellRequests"] });
      toast.success(t("admin.ui.success") || "Deleted successfully");
    },
  });

  async function handleDelete(id: string) {
    const ok = await confirm({
      title: t("admin.customers.deleteTitle") || "Delete Request",
      description: t("admin.customers.deleteDescription") || "Are you sure you want to delete this request?",
      confirmLabel: t("admin.ui.delete") || "Delete",
      cancelLabel: t("admin.cancel") || "Cancel",
      tone: "danger",
    });
    if (!ok) return;

    if (activeTab === "contact") {
      deleteContactMutation.mutate(id);
    } else {
      deleteSellMutation.mutate(id);
    }
  }

  const localizeOption = (val: string) => {
    if (val === "Property Owner" || val === "مالك العقار") return locale === "ar" ? "مالك العقار" : "Property Owner";
    if (val === "Agent" || val === "وكيل") return locale === "ar" ? "وكيل" : "Agent";
    if (val === "Independent (Villa/Building...)" || val === "مستقل (فيلا / عمارة...)") return locale === "ar" ? "مستقل (فيلا / عمارة...)" : "Independent (Villa/Building...)";
    if (val === "Within a building" || val === "ضمن مبنى") return locale === "ar" ? "ضمن مبنى" : "Within a building";
    return val;
  };

  const contactColumns: Column<ContactRequest>[] = [
    {
      id: "customer",
      header: t("admin.customers.customer") || "Customer",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#0a0f1d]">{row.fullName}</span>
          <span className="text-sm text-[#6B7280]">{row.email}</span>
        </div>
      ),
    },
    {
      id: "phone",
      header: t("contactPage.form.phone") || "Phone",
      cell: (row) => <span className="font-semibold" dir="ltr">{row.phone}</span>,
    },
    {
      id: "subject",
      header: t("contactPage.form.subject") || "Subject",
      cell: (row) => (
        <span className="text-[#6B7280]">{t(`contactPage.subjects.${row.subject}`) || row.subject}</span>
      ),
    },
    {
      id: "status",
      header: t("admin.customers.status") || "Status",
      cell: (row) => (
        <StatusBadge tone={REQUEST_STATUS_TONE[row.status] || "default"}>
          {t(`admin.customers.statuses.${row.status}`) || row.status}
        </StatusBadge>
      ),
    },
    {
      id: "date",
      header: t("admin.customers.date") || "Date",
      cell: (row) => <span className="text-[#6B7280]">{formatDate(row.createdAt)}</span>,
    },
  ];

  const sellColumns: Column<SellRequest>[] = [
    {
      id: "customer",
      header: t("admin.customers.customer") || "Customer",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#0a0f1d]">{row.fullNameAlt}</span>
          <span className="text-sm text-[#6B7280]" dir="ltr">{row.mobileNumber}</span>
        </div>
      ),
    },
    {
      id: "location",
      header: t("sellPage.form.city") || "Location",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#0a0f1d]">{row.city}</span>
          <span className="text-sm text-[#6B7280]">{row.neighborhood}</span>
        </div>
      ),
    },
    {
      id: "type",
      header: t("admin.units.numberType") || "Type",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold">{localizeOption(row.unitLocation)}</span>
          <span className="text-xs text-[#6B7280]">{localizeOption(row.role)}</span>
        </div>
      ),
    },
    {
      id: "status",
      header: t("admin.customers.status") || "Status",
      cell: (row) => (
        <StatusBadge tone={REQUEST_STATUS_TONE[row.status] || "default"}>
          {t(`admin.customers.statuses.${row.status}`) || row.status}
        </StatusBadge>
      ),
    },
    {
      id: "date",
      header: t("admin.customers.date") || "Date",
      cell: (row) => <span className="text-[#6B7280]">{formatDate(row.createdAt)}</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <StatGrid>
        <StatCard
          icon={Users}
          label={t("admin.customers.total") || "Total Requests"}
          value={totalRequests}
        />
        <StatCard
          icon={CircleCheck}
          label={t("admin.customers.newRequests") || "New Requests"}
          value={newRequestsCount}
        />
        <StatCard
          icon={MessageSquare}
          label={t("contactPage.form.title") || "Contact"}
          value={contactRequests.length}
        />
        <StatCard
          icon={FileText}
          label={t("sellPage.form.title") || "Sell Units"}
          value={sellRequests.length}
        />
      </StatGrid>

      <div className="flex flex-col gap-4">
        {/* Type Tabs */}
        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 gap-2 sm:gap-4 items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button 
            onClick={() => setActiveTab("contact")}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-colors ${activeTab === "contact" ? "bg-[#0a0f1d] text-white" : "bg-white text-[#6B7280] hover:bg-gray-50"}`}
          >
            {t("contactPage.form.title") || "Contact"}
            <span className={`flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-[11px] font-black ${activeTab === "contact" ? "bg-white/20" : "bg-gray-100"}`}>{contactRequests.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab("sell")}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-colors ${activeTab === "sell" ? "bg-[#0a0f1d] text-white" : "bg-white text-[#6B7280] hover:bg-gray-50"}`}
          >
            {t("sellPage.form.title") || "Sell Units"}
            <span className={`flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-[11px] font-black ${activeTab === "sell" ? "bg-white/20" : "bg-gray-100"}`}>{sellRequests.length}</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">{t("admin.customers.status") || "Status"}:</span>
            <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {(["all", "new", "contacted", "completed", "cancelled"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    statusFilter === status 
                      ? "bg-[#17C3B3] text-white" 
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {status === "all" ? (t("admin.customers.filterAll") || "All") : (t(`admin.customers.statuses.${status}`) || status)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DataTable
          columns={activeTab === "contact" ? contactColumns as any : sellColumns as any}
          rows={(activeTab === "contact" ? filteredContact : filteredSell) as any}
          rowKey={(row: any) => row.id}
          empty={t("admin.ui.empty") || "No data"}
          actionsHeader={t("admin.ui.actions") || "Actions"}
          toolbar={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c]" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t("admin.customers.search") || "Search..."}
                  className="h-12 w-full rounded-full bg-[#F4F4F4] pe-4 ps-11 text-sm font-medium text-[#0a0f1d] outline-none placeholder:text-[#8c8c8c]"
                />
              </label>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4F4F4] text-[#0a0f1d] transition-colors hover:bg-gray-200 disabled:opacity-50"
                title={t("admin.ui.refresh") || "Refresh"}
              >
                <RefreshCw className={`h-[18px] w-[18px] ${isRefreshing ? "animate-spin" : ""}`} />
              </button>
            </div>
          }
          actions={(row: any) => (
            <>
              <TableAction 
                label={t("admin.customers.actions.process") || "Process"} 
                onClick={() => setProcessState({ id: row.id, type: activeTab, status: row.status })}
              />
              <TableAction 
                label={t("admin.ui.view") || "View"} 
                onClick={() => setViewRequest(row)}
              />
              <TableAction
                label={t("admin.ui.delete") || "Delete"}
                tone="danger"
                onClick={() => handleDelete(row.id)}
              />
            </>
          )}
        />
      </div>

      {viewRequest && (
        <ViewRequestModal 
          request={viewRequest} 
          onClose={() => setViewRequest(null)} 
        />
      )}

      {processState && (
        <ProcessRequestModal
          id={processState.id}
          type={processState.type}
          currentStatus={processState.status}
          onClose={() => setProcessState(null)}
          onSuccess={() => {
            setProcessState(null);
            if (processState.type === "contact") {
              queryClient.invalidateQueries({ queryKey: ["contactRequests"] });
            } else {
              queryClient.invalidateQueries({ queryKey: ["sellRequests"] });
            }
          }}
        />
      )}
    </div>
  );
}
