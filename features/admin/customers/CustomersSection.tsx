"use client";

import { useMemo, useState } from "react";
import { CircleCheck, FileText, Filter, MessageSquare, Plus, Search, Users } from "lucide-react";
import { DataTable, TableAction, type Column } from "@/features/admin/ui/DataTable";
import { StatCard, StatGrid } from "@/features/admin/ui/StatCard";
import { StatusBadge } from "@/features/admin/ui/StatusBadge";
import { CUSTOMER_REQUESTS, REQUEST_STATUS_TONE, type CustomerRequest, type RequestType, type RequestStatus } from "@/features/admin/customers/data";
import { useConfirm } from "@/features/admin/components/ConfirmModal";
import { useLocale } from "@/components/providers/LocaleProvider";

export function CustomersSection() {
  const { locale, t } = useLocale();
  const confirm = useConfirm();
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState(CUSTOMER_REQUESTS);
  const [activeTab, setActiveTab] = useState<RequestType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");

  const localized = useMemo(
    () =>
      rows.map((row) => ({
        ...row,
        customerNameLabel: row.customerName[locale],
        dateLabel: row.date[locale],
      })),
    [locale, rows]
  );

  const filtered = useMemo(() => {
    let result = localized;
    
    if (activeTab !== "all") {
      result = result.filter(row => row.type === activeTab);
    }
    
    if (statusFilter !== "all") {
      result = result.filter(row => row.status === statusFilter);
    }
    
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (row) =>
          row.customerNameLabel.toLowerCase().includes(q) ||
          row.customerPhone.includes(q) ||
          row.unit.toLowerCase().includes(q)
      );
    }
    
    return result;
  }, [localized, query, activeTab, statusFilter]);

  const totalRequests = rows.length;
  const newRequestsCount = rows.filter((row) => row.status === "new").length;
  
  const purchaseCount = rows.filter(r => r.type === "purchase").length;
  const sellCount = rows.filter(r => r.type === "sell").length;
  const complaintCount = rows.filter(r => r.type === "complaint").length;

  async function handleDelete(row: CustomerRequest) {
    const ok = await confirm({
      title: t("admin.customers.deleteTitle"),
      description: t("admin.customers.deleteDescription"),
      confirmLabel: t("admin.ui.delete"),
      cancelLabel: t("admin.cancel"),
      tone: "danger",
    });
    if (!ok) return;
    setRows((current) => current.filter((item) => item.id !== row.id));
  }

  const columns: Column<(typeof localized)[number]>[] = [
    {
      id: "customer",
      header: t("admin.customers.customer"),
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#0a0f1d]">{row.customerNameLabel}</span>
          <span className="text-sm text-[#6B7280]" dir="ltr">{row.customerPhone}</span>
        </div>
      ),
    },
    {
      id: "unit",
      header: t("admin.customers.unit"),
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold">{row.unit}</span>
        </div>
      ),
    },
    {
      id: "status",
      header: t("admin.customers.status"),
      cell: (row) => (
        <StatusBadge tone={REQUEST_STATUS_TONE[row.status]}>
          {t(`admin.customers.statuses.${row.status}`)}
        </StatusBadge>
      ),
    },
    {
      id: "date",
      header: t("admin.customers.date"),
      cell: (row) => <span className="text-[#6B7280]">{row.dateLabel}</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <StatGrid>
        <StatCard
          icon={Users}
          label={t("admin.customers.total")}
          value={totalRequests}
        />
        <StatCard
          icon={CircleCheck}
          label={t("admin.customers.newRequests")}
          value={newRequestsCount}
        />
        <StatCard
          icon={FileText}
          label={t("admin.customers.purchase")}
          value={purchaseCount}
        />
        <StatCard
          icon={MessageSquare}
          label={t("admin.customers.complaint")}
          value={complaintCount}
        />
      </StatGrid>

      <div className="flex flex-col gap-4">
        {/* Type Tabs */}
        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 gap-2 sm:gap-4 items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button 
            onClick={() => setActiveTab("all")}
            className={`shrink-0 px-4 py-2.5 rounded-full text-sm font-bold transition-colors ${activeTab === "all" ? "bg-[#0a0f1d] text-white" : "bg-white text-[#6B7280] hover:bg-gray-50"}`}
          >
            {t("admin.customers.filterAll")}
          </button>
          <button 
            onClick={() => setActiveTab("purchase")}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-colors ${activeTab === "purchase" ? "bg-[#0a0f1d] text-white" : "bg-white text-[#6B7280] hover:bg-gray-50"}`}
          >
            {t("admin.customers.purchase")}
            <span className={`flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-[11px] font-black ${activeTab === "purchase" ? "bg-white/20" : "bg-gray-100"}`}>{purchaseCount}</span>
          </button>
          <button 
            onClick={() => setActiveTab("sell")}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-colors ${activeTab === "sell" ? "bg-[#0a0f1d] text-white" : "bg-white text-[#6B7280] hover:bg-gray-50"}`}
          >
            {t("admin.customers.sell")}
            <span className={`flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-[11px] font-black ${activeTab === "sell" ? "bg-white/20" : "bg-gray-100"}`}>{sellCount}</span>
          </button>
          <button 
            onClick={() => setActiveTab("complaint")}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-colors ${activeTab === "complaint" ? "bg-[#0a0f1d] text-white" : "bg-white text-[#6B7280] hover:bg-gray-50"}`}
          >
            {t("admin.customers.complaint")}
            <span className={`flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-[11px] font-black ${activeTab === "complaint" ? "bg-white/20" : "bg-gray-100"}`}>{complaintCount}</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">{t("admin.customers.status")}:</span>
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
                  {status === "all" ? t("admin.customers.filterAll") : t(`admin.customers.statuses.${status}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={filtered}
          rowKey={(row) => row.id}
          empty={t("admin.ui.empty")}
          actionsHeader={t("admin.ui.actions")}
          toolbar={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c]" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t("admin.customers.search")}
                  className="h-12 w-full rounded-full bg-[#F4F4F4] pe-4 ps-11 text-sm font-medium text-[#0a0f1d] outline-none placeholder:text-[#8c8c8c]"
                />
              </label>
            </div>
          }
          actions={(row) => (
            <>
              <TableAction label={t("admin.customers.actions.process")} />
              <TableAction label={t("admin.ui.view")} />
              <TableAction
                label={t("admin.ui.delete")}
                tone="danger"
                onClick={() => handleDelete(row)}
              />
            </>
          )}
        />
      </div>
    </div>
  );
}
