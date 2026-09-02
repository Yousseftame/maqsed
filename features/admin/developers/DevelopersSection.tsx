"use client";

import { useMemo, useState } from "react";
import { Users, Search, Terminal, Plus, FileText, RefreshCw } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { DataTable, TableAction, type Column } from "@/features/admin/ui/DataTable";
import { StatCard, StatGrid } from "@/features/admin/ui/StatCard";
import { useLocale } from "@/components/providers/LocaleProvider";
import { usersService } from "@/features/auth/users.service";
import type { UserData } from "@/types/user";
import { AddDeveloperModal } from "./AddDeveloperModal";
import { ViewDeveloperModal } from "./ViewDeveloperModal";
import { useConfirm } from "@/features/admin/components/ConfirmModal";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getApp } from "firebase/app";
import toast from "react-hot-toast";

export function DevelopersSection() {
  const { locale, t } = useLocale();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const [queryStr, setQueryStr] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState<UserData | null>(null);

  const handleDelete = async (developer: UserData) => {
    const ok = await confirm({
      title: t("admin.developers.deleteTitle") || "Delete Account",
      description: t("admin.developers.deleteDesc") || `Are you sure you want to delete ${developer.displayName || developer.email}? This will permanently remove them from the system and Authentication.`,
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
      
      const result = await deleteDeveloperAccount({ uid: developer.uid });
      
      if ((result.data as any).success) {
        queryClient.invalidateQueries({ queryKey: ["developers"] });
        toast.success(t("admin.ui.success") || "Account deleted successfully!", { id: toastId });
      }
    } catch (error: any) {
      console.error("Failed to delete developer:", error);
      toast.error(error.message || t("admin.ui.error") || "Failed to delete account", { id: toastId });
    }
  };

  const handleToggleStatus = async (developer: UserData) => {
    const isCurrentlyDisabled = developer.status === "disabled";
    const newStatus = isCurrentlyDisabled ? "active" : "disabled";

    const titleKey = isCurrentlyDisabled ? "admin.developers.enableTitle" : "admin.developers.disableTitle";
    const descKey = isCurrentlyDisabled ? "admin.developers.enableDesc" : "admin.developers.disableDesc";
    const confirmLabelKey = isCurrentlyDisabled ? "admin.developers.enable" : "admin.developers.disable";
    const defaultTitle = isCurrentlyDisabled ? "Enable Account" : "Disable Account";
    const defaultDesc = isCurrentlyDisabled 
      ? "Are you sure you want to enable this account? They will regain access to log in to the system."
      : "Are you sure you want to disable this account? They will no longer be able to log in to the system.";

    const ok = await confirm({
      title: t(titleKey) || defaultTitle,
      description: t(descKey) || defaultDesc,
      confirmLabel: t(confirmLabelKey) || (isCurrentlyDisabled ? "Enable" : "Disable"),
      cancelLabel: t("admin.cancel") || "Cancel",
      tone: isCurrentlyDisabled ? "default" : "danger",
    });

    if (!ok) return;

    const toastId = toast.loading(t("admin.ui.save") || "Saving...");
    try {
      const functions = getFunctions(getApp());
      const toggleDeveloperStatus = httpsCallable(functions, "toggleDeveloperStatus");
      
      const result = await toggleDeveloperStatus({ targetUid: developer.uid, status: newStatus });
      
      if ((result.data as any).success) {
        queryClient.invalidateQueries({ queryKey: ["developers"] });
        toast.success(t("admin.ui.success") || "Account status updated!", { id: toastId });
      }
    } catch (error: any) {
      console.error("Failed to toggle developer status:", error);
      toast.error(error.message || t("admin.ui.error") || "Failed to update account", { id: toastId });
    }
  };

  const { data: developers = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["developers"],
    queryFn: () => usersService.getUsersByRole("developer"),
  });

  const filtered = useMemo(() => {
    const q = queryStr.trim().toLowerCase();
    if (!q) return developers;
    return developers.filter(
      (row) =>
        (row.displayName || "").toLowerCase().includes(q) ||
        (row.email || "").toLowerCase().includes(q) ||
        (row.companyName || "").toLowerCase().includes(q) ||
        (row.phoneNumber || "").toLowerCase().includes(q)
    );
  }, [developers, queryStr]);

  const activeCount = useMemo(() => {
    return developers.filter((dev) => dev.status !== "disabled").length;
  }, [developers]);

  const columns: Column<UserData>[] = [
    {
      id: "developer",
      header: t("admin.developers.name") || "Developer",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#0a0f1d] text-sm font-bold text-white">
            {row.displayName ? row.displayName.charAt(0).toUpperCase() : (row.email ? row.email.charAt(0).toUpperCase() : "-")}
          </span>
          <div className="flex flex-col">
            <span className="font-semibold text-[#0a0f1d]">{row.displayName || "No Name"}</span>
            <span className="text-xs text-[#6B7280]">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      id: "company",
      header: t("admin.developers.company") || "Company",
      cell: (row) => <span className="text-[#0a0f1d] font-medium">{row.companyName || "-"}</span>,
    },
    {
      id: "phone",
      header: t("admin.developers.phone") || "Phone",
      cell: (row) => <span className="text-[#6B7280] tabular-nums">{row.phoneNumber || "-"}</span>,
    },
    {
      id: "joined",
      header: t("admin.developers.joined") || "Joined Date",
      cell: (row) => {
        let dateObj = null;
        if (row.createdAt) {
          dateObj = (row.createdAt as any)?.toDate 
            ? (row.createdAt as any).toDate() 
            : new Date(row.createdAt);
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
      <div className="flex flex-col gap-3">
        <StatGrid className="xl:grid-cols-2">
        <StatCard icon={Terminal} label={t("admin.developers.total") || "Total Developers"} value={developers.length} />
        <StatCard icon={Users} label={t("admin.developers.active") || "Active Accounts"} value={activeCount} />
      </StatGrid>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(row) => row.uid}
        empty={t("admin.ui.empty") || "No developers found"}
        actionsHeader={t("admin.ui.actions") || "Actions"}
        toolbar={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c]" />
              <input
                type="search"
                value={queryStr}
                onChange={(event) => setQueryStr(event.target.value)}
                placeholder={t("admin.developers.search") || "Search developers..."}
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
                onClick={() => setIsAddModalOpen(true)}
                className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#0a0f1d] px-6 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                {t("admin.developers.create") || "Create Account"}
              </button>
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
                  setSelectedDeveloper(row);
                  setIsViewModalOpen(true);
                }}
              />
              <TableAction
                label={t(isCurrentlyDisabled ? "admin.developers.enable" : "admin.developers.disable") || (isCurrentlyDisabled ? "Enable Account" : "Disable Account")}
                onClick={() => handleToggleStatus(row)}
                tone={isCurrentlyDisabled ? "default" : "danger"}
              />
              <TableAction
                label={t("admin.ui.delete") || "Delete"}
                onClick={() => handleDelete(row)}
                tone="danger"
              />
            </>
          );
        }}
      />
    </div>

    <AddDeveloperModal 
      isOpen={isAddModalOpen} 
      onClose={() => setIsAddModalOpen(false)} 
    />

    <ViewDeveloperModal
      isOpen={isViewModalOpen}
      onClose={() => {
        setIsViewModalOpen(false);
        setTimeout(() => setSelectedDeveloper(null), 200);
      }}
      developer={selectedDeveloper}
    />
  </>
  );
}
