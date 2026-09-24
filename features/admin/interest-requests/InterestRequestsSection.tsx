"use client";

import { useMemo, useState } from "react";
import { CircleCheck, Globe, HeartHandshake, RefreshCw, Search, Users } from "lucide-react";
import { DataTable, TableAction, type Column } from "@/features/admin/ui/DataTable";
import { StatCard, StatGrid } from "@/features/admin/ui/StatCard";
import { StatusBadge } from "@/features/admin/ui/StatusBadge";
import { useConfirm } from "@/features/admin/components/ConfirmModal";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  requestsService,
  type InterestRequest,
  type RequestStatus,
} from "@/features/admin/customers/requests.service";
import { ViewInterestModal } from "./ViewInterestModal";
import { ProcessInterestModal } from "./ProcessInterestModal";
import toast from "react-hot-toast";
import { usePermissions } from "@/features/admin/permissions/usePermissions";

const REQUEST_STATUS_TONE: Record<
  RequestStatus,
  "default" | "success" | "warning" | "danger" | "muted" | "navy"
> = {
  new: "warning",
  sent: "navy",
  contacted: "navy",
  completed: "success",
  cancelled: "danger",
};

export function InterestRequestsSection() {
  const { locale, t } = useLocale();
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const { can } = usePermissions();
  const canEdit = can("customers", "edit");
  const canDelete = can("customers", "delete");

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  const [viewRequest, setViewRequest] = useState<InterestRequest | null>(null);
  const [processState, setProcessState] = useState<{
    id: string;
    status: RequestStatus;
  } | null>(null);

  const { data: interestRequests = [], isFetching } = useQuery({
    queryKey: ["interestRequests"],
    queryFn: () => requestsService.getInterestRequests(),
    refetchInterval: 30000,
  });

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["interestRequests"] });
  };

  const formatDate = (ts: unknown) => {
    if (!ts) return "";
    const date =
      typeof ts === "object" && ts !== null && "toDate" in ts
        ? (ts as { toDate: () => Date }).toDate()
        : new Date(ts as string | number | Date);
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return interestRequests.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (
        q &&
        !row.fullName.toLowerCase().includes(q) &&
        !row.phone.includes(q) &&
        !(row.email || "").toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [interestRequests, query, statusFilter]);

  const newCount = interestRequests.filter((r) => r.status === "new").length;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => requestsService.deleteInterestRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interestRequests"] });
      toast.success(t("admin.ui.success") || "Deleted");
    },
    onError: () => {
      toast.error(t("admin.ui.error") || "Error");
    },
  });

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: t("admin.customers.deleteTitle") || "Delete Request",
      description:
        t("admin.customers.deleteDescription") ||
        "Are you sure you want to delete this request?",
    });
    if (!ok) return;
    deleteMutation.mutate(id);
  };

  const columns: Column<InterestRequest>[] = [
    {
      key: "customer",
      header: t("admin.customers.customer") || "Customer",
      cell: (row) => (
        <span className="font-bold text-[#0a0f1d]">{row.fullName}</span>
      ),
    },
    {
      key: "phone",
      header: t("contactPage.form.phone") || "Phone",
      cell: (row) => (
        <span className="text-sm font-medium text-[#0a0f1d]" dir="ltr">
          {row.phone || "—"}
        </span>
      ),
    },
    {
      key: "email",
      header: t("contactPage.form.email") || "Email",
      cell: (row) => (
        <span className="text-sm font-medium text-[#0a0f1d]" dir="ltr">
          {row.email || "—"}
        </span>
      ),
    },
    {
      key: "message",
      header: t("contactPage.form.message") || "Message",
      cell: (row) => (
        <span className="line-clamp-2 max-w-[220px] text-sm font-medium text-[#6B7280]">
          {row.message || "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: t("admin.customers.status") || "Status",
      cell: (row) => (
        <StatusBadge tone={REQUEST_STATUS_TONE[row.status] || "default"}>
          {t(`admin.customers.statuses.${row.status}`) || row.status}
        </StatusBadge>
      ),
    },
    {
      key: "date",
      header: t("admin.customers.date") || "Date",
      cell: (row) => (
        <span className="text-sm font-medium text-[#8c8c8c]">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3 rounded-[20px] border border-[#17C3B3]/25 bg-[#17C3B3]/10 px-4 py-3.5 sm:items-center sm:px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#17C3B3] shadow-sm">
          <Globe className="h-5 w-5" />
        </div>
        <div className="min-w-0 text-start">
          <p className="text-sm font-bold text-[#0a0f1d]">
            {t("admin.interestRequests.sourceBadge") || "Sub website"}
          </p>
          <p className="mt-0.5 text-xs font-medium leading-relaxed text-[#6B7280] sm:text-sm">
            {t("admin.interestRequests.sourceHint") ||
              "These leads come from the Maqsed sub website, not the main site contact forms."}
          </p>
        </div>
      </div>

      <StatGrid className="sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          icon={Users}
          label={t("admin.interestRequests.total") || "Total interest"}
          value={interestRequests.length}
        />
        <StatCard
          icon={CircleCheck}
          label={t("admin.customers.newRequests") || "New Requests"}
          value={newCount}
        />
        <StatCard
          icon={HeartHandshake}
          label={t("admin.interestRequests.title") || "Interest list"}
          value={filtered.length}
        />
      </StatGrid>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">
              {t("admin.customers.status") || "Status"}:
            </span>
            <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {(
                ["all", "new", "contacted", "completed", "cancelled"] as const
              ).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    statusFilter === status
                      ? "bg-[#17C3B3] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {status === "all"
                    ? t("admin.customers.filterAll") || "All"
                    : t(`admin.customers.statuses.${status}`) || status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={filtered}
          rowKey={(row) => row.id}
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
                  placeholder={
                    t("admin.interestRequests.search") || "Search..."
                  }
                  className="h-12 w-full rounded-full bg-[#F4F4F4] pe-4 ps-11 text-sm font-medium text-[#0a0f1d] outline-none placeholder:text-[#8c8c8c]"
                />
              </label>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isFetching}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4F4F4] text-[#0a0f1d] transition-colors hover:bg-gray-200 disabled:opacity-50"
                title={t("admin.ui.refresh") || "Refresh"}
              >
                <RefreshCw
                  className={`h-[18px] w-[18px] ${isFetching ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          }
          actions={(row) => (
            <>
              {canEdit ? (
                <TableAction
                  label={t("admin.customers.actions.process") || "Process"}
                  onClick={() =>
                    setProcessState({ id: row.id, status: row.status })
                  }
                />
              ) : null}
              <TableAction
                label={t("admin.ui.view") || "View"}
                onClick={() => setViewRequest(row)}
              />
              {canDelete ? (
                <TableAction
                  label={t("admin.ui.delete") || "Delete"}
                  tone="danger"
                  onClick={() => handleDelete(row.id)}
                />
              ) : null}
            </>
          )}
        />
      </div>

      {viewRequest && (
        <ViewInterestModal
          request={viewRequest}
          onClose={() => setViewRequest(null)}
        />
      )}

      {processState && (
        <ProcessInterestModal
          id={processState.id}
          currentStatus={processState.status}
          onClose={() => setProcessState(null)}
          onSuccess={() => {
            setProcessState(null);
            queryClient.invalidateQueries({ queryKey: ["interestRequests"] });
          }}
        />
      )}
    </div>
  );
}
