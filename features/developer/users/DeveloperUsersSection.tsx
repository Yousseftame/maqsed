"use client";

import { useEffect, useMemo, useState } from "react";
import { Users, Search, Plus, RefreshCw, UserCheck, Activity, LogIn, LogOut } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { DataTable, TableAction, type Column } from "@/features/admin/ui/DataTable";
import { StatCard, StatGrid } from "@/features/admin/ui/StatCard";
import { useLocale } from "@/components/providers/LocaleProvider";
import { usersService } from "@/features/auth/users.service";
import type { UserData } from "@/types/user";
import { AddEmployeeModal } from "./AddEmployeeModal";
import { ViewEmployeeModal } from "./ViewEmployeeModal";
import { useAuth } from "@/features/auth/AuthProvider";
import { useConfirm } from "@/features/admin/components/ConfirmModal";
import { useRouter } from "next/navigation";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getApp } from "firebase/app";
import toast from "react-hot-toast";

function EmployeeAuditLogs({ uid }: { uid: string }) {
  const { t } = useLocale();
  const { data: auditLogs = [], isLoading } = useQuery({
    queryKey: ["auditLogs", uid],
    queryFn: () => usersService.getUserAuditLogs(uid),
  });

  if (isLoading) {
    return (
      <div className="flex h-20 items-center justify-center text-[#8c8c8c]">
        <span className="animate-pulse">{t("admin.ui.loading") || "Loading..."}</span>
      </div>
    );
  }

  if (auditLogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center text-[#8c8c8c]">
        <Activity className="mb-2 h-6 w-6 opacity-20" />
        <p className="text-sm">{t("admin.developers.auditLogs.empty") || "No audit logs available for this user"}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0a0f1d]">
        <Activity className="h-4 w-4 text-[#8c8c8c]" />
        {t("admin.developers.auditLogs.title") || "Audit Logs History"}
      </h4>
      <table className="w-full text-start text-sm bg-white rounded-lg overflow-hidden border border-[#0a0f1d]/5">
        <thead className="bg-[#f8f9fa] text-[#8c8c8c]">
          <tr>
            <th className="px-4 py-3 font-semibold text-start">{t("admin.developers.auditLogs.action") || "Action"}</th>
            <th className="px-4 py-3 font-semibold text-start">{t("admin.developers.auditLogs.date") || "Date & Time"}</th>
            <th className="px-4 py-3 font-semibold text-start">{t("admin.developers.auditLogs.ip") || "IP Address"}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#0a0f1d]/5">
          {auditLogs.map((log) => {
            const logDate = new Intl.DateTimeFormat("en-US", {
              month: "short", day: "2-digit", year: "numeric",
              hour: "2-digit", minute: "2-digit",
            }).format(new Date(log.timestamp));

            return (
              <tr key={log.id} className="transition-colors hover:bg-[#F4F4F4]/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {log.action === "login" ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                        <LogIn className="h-3 w-3" />
                      </div>
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/10 text-rose-600">
                        <LogOut className="h-3 w-3" />
                      </div>
                    )}
                    <span className="font-semibold text-[#0a0f1d] capitalize">
                      {t(`admin.developers.auditLogs.${log.action}`) || log.action}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-[#6b7280] text-start">{logDate}</td>
                <td className="px-4 py-3 font-medium text-[#0a0f1d] text-start">
                  <span dir="ltr">{log.ip === "::1" ? "127.0.0.1 (Localhost)" : log.ip}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function DeveloperUsersSection() {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const router = useRouter();
  const { user, userData } = useAuth();

  const [queryStr, setQueryStr] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<UserData | null>(null);

  const isDeveloper = userData?.role === "developer";
  const ownerUid = isDeveloper ? user?.uid : undefined;
  const maxEmployees = Number(userData?.usersPerDeveloper) || 0;

  useEffect(() => {
    if (userData?.role === "employee") {
      router.replace("/developer/dashboard");
    }
  }, [router, userData?.role]);

  const { data: usersData = [], isRefetching, refetch } = useQuery({
    queryKey: ["employees", ownerUid],
    queryFn: () => usersService.getEmployeesByDeveloper(ownerUid!),
    enabled: Boolean(ownerUid),
  });

  const handleDelete = async (employee: UserData) => {
    if (!isDeveloper) return;
    const ok = await confirm({
      title: t("developer.users.deleteTitle") || "Delete Account",
      description: t("developer.users.deleteDesc") || `Are you sure you want to delete ${employee.displayName || employee.email}? This will permanently remove them from the system and Authentication.`,
      confirmLabel: t("admin.ui.delete") || "Delete",
      cancelLabel: t("admin.cancel") || "Cancel",
      tone: "danger",
      requireInput: "DELETE",
    });

    if (!ok) return;

    const toastId = toast.loading(t("admin.ui.deleting") || "Deleting...");
    try {
      const functions = getFunctions(getApp());
      const deleteDeveloperAccount = httpsCallable(functions, "deleteDeveloperAccount");
      const result = await deleteDeveloperAccount({ uid: employee.uid });

      if ((result.data as { success?: boolean }).success) {
        queryClient.invalidateQueries({ queryKey: ["employees"] });
        toast.success(t("admin.ui.success") || "Account deleted successfully!", { id: toastId });
      }
    } catch (error: any) {
      console.error("Failed to delete employee:", error);
      toast.error(error.message || t("admin.ui.error") || "Failed to delete account", { id: toastId });
    }
  };

  const handleToggleStatus = async (employee: UserData) => {
    if (!isDeveloper) return;
    const isCurrentlyDisabled = employee.status === "disabled";
    const newStatus = isCurrentlyDisabled ? "active" : "disabled";

    const ok = await confirm({
      title: t(isCurrentlyDisabled ? "developer.users.enableTitle" : "developer.users.disableTitle") || (isCurrentlyDisabled ? "Enable Account" : "Disable Account"),
      description: t(isCurrentlyDisabled ? "developer.users.enableDesc" : "developer.users.disableDesc") || (
        isCurrentlyDisabled
          ? "Are you sure you want to enable this account? They will regain access to log in to the system."
          : "Are you sure you want to disable this account? They will no longer be able to log in to the system."
      ),
      confirmLabel: t(isCurrentlyDisabled ? "developer.users.enable" : "developer.users.disable") || (isCurrentlyDisabled ? "Enable" : "Disable"),
      cancelLabel: t("admin.cancel") || "Cancel",
      tone: isCurrentlyDisabled ? "default" : "danger",
    });

    if (!ok) return;

    const toastId = toast.loading(t("admin.ui.save") || "Saving...");
    try {
      const functions = getFunctions(getApp());
      const toggleDeveloperStatus = httpsCallable(functions, "toggleDeveloperStatus");
      const result = await toggleDeveloperStatus({ targetUid: employee.uid, status: newStatus });

      if ((result.data as { success?: boolean }).success) {
        queryClient.invalidateQueries({ queryKey: ["employees"] });
        toast.success(t("admin.ui.success") || "Account status updated!", { id: toastId });
      }
    } catch (error: any) {
      console.error("Failed to toggle employee status:", error);
      toast.error(error.message || t("admin.ui.error") || "Failed to update account", { id: toastId });
    }
  };

  const filtered = useMemo(() => {
    const createdAtMs = (value: unknown) => {
      if (!value) return 0;
      if (typeof value === "number") return value;
      if (typeof (value as { toDate?: () => Date })?.toDate === "function") {
        return (value as { toDate: () => Date }).toDate().getTime();
      }
      const parsed = new Date(value as string).getTime();
      return Number.isNaN(parsed) ? 0 : parsed;
    };

    const sorted = [...usersData].sort((a, b) => createdAtMs(b.createdAt) - createdAtMs(a.createdAt));
    const q = queryStr.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(
      (row) =>
        (row.displayName || "").toLowerCase().includes(q) ||
        (row.email || "").toLowerCase().includes(q) ||
        (row.phoneNumber || "").toLowerCase().includes(q)
    );
  }, [usersData, queryStr]);

  const activeCount = useMemo(() => {
    return usersData.filter((u) => u.status !== "disabled").length;
  }, [usersData]);

  const atLimit = isDeveloper && usersData.length >= maxEmployees;

  const columns: Column<UserData>[] = [
    {
      id: "employee",
      header: t("developer.users.name") || "Employee Name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#0a0f1d] text-sm font-bold text-white">
            {row.photoURL ? (
              <Image src={row.photoURL} alt={row.displayName || ""} fill className="object-cover" />
            ) : (
              row.displayName ? row.displayName.charAt(0).toUpperCase() : (row.email ? row.email.charAt(0).toUpperCase() : "-")
            )}
          </span>
          <div className="flex flex-col">
            <span className="font-semibold text-[#0a0f1d]">{row.displayName || "No Name"}</span>
            <span className="text-xs text-[#6B7280]">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      id: "phone",
      header: t("developer.users.phone") || "Phone",
      cell: (row) => <span className="text-[#6B7280] tabular-nums">{row.phoneNumber || "-"}</span>,
    },
    {
      id: "joined",
      header: t("developer.users.joined") || "Joined Date",
      cell: (row) => {
        const value: unknown = row.createdAt;
        let dateObj: Date | null = null;
        if (value) {
          if (typeof value === "object" && value !== null && typeof (value as { toDate?: () => Date }).toDate === "function") {
            dateObj = (value as { toDate: () => Date }).toDate();
          } else {
            dateObj = new Date(value as string | number);
          }
        }
        return (
          <span className="text-[#6B7280]">
            {dateObj && !isNaN(dateObj.getTime())
              ? new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(dateObj)
              : "-"}
          </span>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-6">
        <StatGrid className="xl:grid-cols-3">
          <StatCard
            icon={Users}
            label={t("developer.users.total") || "Total Employees"}
            value={usersData.length}
          />
          <StatCard
            icon={UserCheck}
            label={t("developer.users.active") || "Active Accounts"}
            value={activeCount}
          />
          {isDeveloper ? (
            <StatCard
              icon={Users}
              label={t("developer.users.seats") || "Used seats"}
              value={`${usersData.length} / ${maxEmployees}`}
            />
          ) : null}
        </StatGrid>

        <DataTable
          columns={columns}
          rows={filtered}
          rowKey={(row) => row.uid}
          empty={t("developer.users.empty") || "No employees found"}
          actionsHeader={t("admin.ui.actions") || "Actions"}
          toolbar={
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c]" />
                <input
                  type="search"
                  value={queryStr}
                  onChange={(event) => setQueryStr(event.target.value)}
                  placeholder={t("developer.users.search") || "Search employees..."}
                  className="h-12 w-full rounded-full bg-[#F4F4F4] pe-4 ps-11 text-sm font-medium text-[#0a0f1d] outline-none placeholder:text-[#8c8c8c]"
                />
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    refetch();
                    queryClient.invalidateQueries({ queryKey: ["auditLogs"] });
                  }}
                  disabled={isRefetching}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4F4F4] text-[#0a0f1d] hover:bg-[#E5E5E5] transition-colors disabled:opacity-50"
                  title="Refresh"
                >
                  <RefreshCw className={`h-5 w-5 ${isRefetching ? "animate-spin" : ""}`} />
                </button>

                {isDeveloper && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    disabled={atLimit}
                    title={atLimit ? (t("developer.users.atLimit") || "Employee limit reached") : undefined}
                    className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#0a0f1d] px-6 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <Plus className="h-4 w-4" />
                    {t("developer.users.create") || "Create Account"}
                  </button>
                )}
              </div>
            </div>
          }
          actions={(row) => {
            const isCurrentlyDisabled = row.status === "disabled";

            return (
              <>
                <TableAction
                  label={t("admin.ui.view") || "View"}
                  onClick={() => {
                    setSelectedEmployee(row);
                    setIsViewModalOpen(true);
                  }}
                />
                {isDeveloper ? (
                  <>
                    <TableAction
                      label={t(isCurrentlyDisabled ? "developer.users.enable" : "developer.users.disable") || (isCurrentlyDisabled ? "Enable Account" : "Disable Account")}
                      onClick={() => handleToggleStatus(row)}
                      tone={isCurrentlyDisabled ? "default" : "danger"}
                    />
                    <TableAction
                      label={t("admin.ui.delete") || "Delete"}
                      onClick={() => handleDelete(row)}
                      tone="danger"
                    />
                  </>
                ) : null}
              </>
            );
          }}
          renderExpandedRow={isDeveloper ? (row) => <EmployeeAuditLogs uid={row.uid} /> : undefined}
        />
      </div>

      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <ViewEmployeeModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setTimeout(() => setSelectedEmployee(null), 200);
        }}
        employee={selectedEmployee}
      />
    </>
  );
}
