"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Mail, Phone, Building2, Calendar, FolderClosed, Home, Activity, LogIn, LogOut, Users } from "lucide-react";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "@/components/providers/LocaleProvider";
import { usersService } from "@/features/auth/users.service";
import { AccountPermissionsSection } from "@/features/admin/permissions/ModulePermissionsView";
import { TableAction } from "@/features/admin/ui/DataTable";
import { useConfirm } from "@/features/admin/components/ConfirmModal";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getApp } from "firebase/app";
import toast from "react-hot-toast";
import type { UserData } from "@/types/user";

type ViewDeveloperModalProps = {
  isOpen: boolean;
  onClose: () => void;
  developer: UserData | null;
};

export function ViewDeveloperModal({ isOpen, onClose, developer }: ViewDeveloperModalProps) {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const { data: auditLogs = [], isLoading: isLoadingLogs } = useQuery({
    queryKey: ["auditLogs", developer?.uid],
    queryFn: () => usersService.getUserAuditLogs(developer!.uid),
    enabled: isOpen && !!developer?.uid,
  });

  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery({
    queryKey: ["employees", developer?.uid],
    queryFn: () => usersService.getEmployeesByDeveloper(developer!.uid),
    enabled: isOpen && !!developer?.uid && developer.role === "developer",
  });

  const { data: freshUser } = useQuery({
    queryKey: ["userProfile", developer?.uid],
    queryFn: () => usersService.getUserProfile(developer!.uid),
    enabled: isOpen && !!developer?.uid && (developer.role === "admin" || developer.role === "superAdmin"),
    refetchOnMount: "always",
  });

  const handleDeleteEmployee = async (employee: UserData) => {
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
        queryClient.invalidateQueries({ queryKey: ["employees", developer?.uid] });
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toast.success(t("admin.ui.success") || "Account deleted successfully!", { id: toastId });
      }
    } catch (error: unknown) {
      console.error("Failed to delete employee:", error);
      const message = error instanceof Error ? error.message : (t("admin.ui.error") || "Failed to delete account");
      toast.error(message, { id: toastId });
    }
  };

  const handleToggleEmployeeStatus = async (employee: UserData) => {
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
        queryClient.invalidateQueries({ queryKey: ["employees", developer?.uid] });
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toast.success(t("admin.ui.success") || "Account status updated!", { id: toastId });
      }
    } catch (error: unknown) {
      console.error("Failed to toggle employee status:", error);
      const message = error instanceof Error ? error.message : (t("admin.ui.error") || "Failed to update account");
      toast.error(message, { id: toastId });
    }
  };

  if (!developer) return null;

  const account = freshUser || developer;

  let joinDate = "-";
  if (developer.createdAt) {
    const dateObj = typeof developer.createdAt === "object" && (developer.createdAt as any).toDate 
      ? (developer.createdAt as any).toDate() 
      : new Date(developer.createdAt);
      
    if (!isNaN(dateObj.getTime())) {
      joinDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(dateObj);
    }
  }

  const getInitials = (first: string = "", last: string = "") => {
    if (!first && !last) return developer.email?.charAt(0).toUpperCase() || "-";
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  const fullName = `${developer.displayName || ''} ${developer.lastName || ''}`.trim() || developer.email.split('@')[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[#0a0f1d]/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex w-full max-h-[90vh] max-w-4xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute end-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/50 text-[#0a0f1d] backdrop-blur-md transition-colors hover:bg-white/80"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Scrollable Area */}
            <div className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto no-scrollbar w-full">
              {/* Header Background */}
              <div className="h-32 w-full bg-gradient-to-r from-[#0a0f1d] to-[#1f2937]" />

              <div className="min-w-0 px-6 pb-8 sm:px-10">
              <div className="flex min-w-0 flex-col gap-8 sm:flex-row">
                
                {/* Left/Start Column (Profile & Stats) */}
                <div className="flex w-full flex-col items-center sm:w-[35%] sm:items-start">
                  {/* Avatar */}
                  <div className="relative -mt-16 mb-4 flex justify-center">
                    <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#F4F4F4] text-4xl font-bold text-[#0a0f1d] shadow-lg">
                      {developer.photoURL ? (
                        <Image src={developer.photoURL} alt={fullName} fill className="object-cover" />
                      ) : (
                        getInitials(developer.displayName, developer.lastName)
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="mb-6 text-center sm:text-start">
                    <h2 className="text-3xl font-bold tracking-tight text-[#0a0f1d]">{fullName}</h2>
                    <span className="mt-2 inline-block rounded-full bg-[#0a0f1d]/5 px-3 py-1 text-sm font-semibold capitalize text-[#6b7280]">
                      {developer.role}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid w-full grid-cols-2 gap-3 sm:flex sm:flex-col">
                    <div className="flex flex-col items-center justify-center gap-2 rounded-[20px] bg-[#F4F4F4] p-4 text-center sm:flex-row sm:justify-start sm:text-start transition-colors hover:bg-[#EAEAEA]">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                        <FolderClosed className="h-5 w-5 text-[#0a0f1d]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-[#0a0f1d] leading-none">{developer.developerStats?.projectsCount ?? 0}</span>
                        <span className="mt-1 text-xs sm:text-sm font-medium text-[#8c8c8c]">{t("admin.analytics.projects") || "Total Projects"}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-2 rounded-[20px] bg-[#F4F4F4] p-4 text-center sm:flex-row sm:justify-start sm:text-start transition-colors hover:bg-[#EAEAEA]">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                        <Home className="h-5 w-5 text-[#0a0f1d]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-[#0a0f1d] leading-none">{developer.developerStats?.unitsCount ?? 0}</span>
                        <span className="mt-1 text-xs sm:text-sm font-medium text-[#8c8c8c]">{t("admin.analytics.units") || "Total Units"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right/End Column (Personal Info) */}
                <div className="flex min-w-0 w-full flex-1 flex-col pt-2 sm:pt-6">
                  <h3 className="mb-4 sm:mb-6 text-xl font-bold tracking-tight text-[#0a0f1d] text-center sm:text-start">
                    {t("admin.developers.createForm.personalInfo") || "Personal Information"}
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="flex flex-col justify-center gap-1 rounded-[16px] border border-[#0a0f1d]/5 bg-white p-5 transition-colors hover:bg-[#F4F4F4]">
                      <div className="mb-2 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[#8c8c8c]" />
                        <span className="text-xs font-bold text-[#8c8c8c]">{t("admin.developers.createForm.email") || "Email"}</span>
                      </div>
                      <span className="text-base font-semibold text-[#0a0f1d] text-start">{developer.email}</span>
                    </div>

                    <div className="flex flex-col justify-center gap-1 rounded-[16px] border border-[#0a0f1d]/5 bg-white p-5 transition-colors hover:bg-[#F4F4F4]">
                      <div className="mb-2 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-[#8c8c8c]" />
                        <span className="text-xs font-bold text-[#8c8c8c]">{t("admin.developers.phone") || "Phone Number"}</span>
                    </div>
                      <span className="text-base font-semibold text-[#0a0f1d] text-start">{developer.phoneNumber || "—"}</span>
                    </div>

                    {developer.role === "developer" && (
                      <div className="flex flex-col justify-center gap-1 rounded-[16px] border border-[#0a0f1d]/5 bg-white p-5 transition-colors hover:bg-[#F4F4F4]">
                        <div className="mb-2 flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-[#8c8c8c]" />
                          <span className="text-xs font-bold text-[#8c8c8c]">{t("admin.developers.company") || "Company Name"}</span>
                        </div>
                        <span className="text-base font-semibold text-[#0a0f1d] text-start">{developer.companyName || "—"}</span>
                      </div>
                    )}

                    <div className="flex flex-col justify-center gap-1 rounded-[16px] border border-[#0a0f1d]/5 bg-white p-5 transition-colors hover:bg-[#F4F4F4]">
                      <div className="mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#8c8c8c]" />
                        <span className="text-xs font-bold text-[#8c8c8c]">{t("admin.developers.joined") || "Joined Date"}</span>
                      </div>
                      <span className="text-base font-semibold text-[#0a0f1d] text-start">{joinDate}</span>
                    </div>

                    {developer.role === "developer" && (
                      <div className="flex flex-col justify-center gap-1 rounded-[16px] border border-[#0a0f1d]/5 bg-white p-5 transition-colors hover:bg-[#F4F4F4]">
                        <div className="mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4 text-[#8c8c8c]" />
                          <span className="text-xs font-bold text-[#8c8c8c]">{t("admin.developers.createForm.usersPerDeveloper")}</span>
                        </div>
                        <span className="text-base font-semibold text-[#0a0f1d] text-start">{developer.usersPerDeveloper ?? "—"}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

                  {developer.role === "developer" && (
                  <div className="mt-8 pt-8 border-t border-[#0a0f1d]/10">
                    <h3 className="mb-4 sm:mb-6 text-xl font-bold tracking-tight text-[#0a0f1d] text-center sm:text-start flex items-center gap-2 justify-center sm:justify-start">
                      <Users className="h-5 w-5 text-[#8c8c8c]" />
                      {t("admin.developers.employees.title") || "Employee Accounts"}
                      <span className="text-sm font-semibold text-[#8c8c8c]">
                        ({employees.length}{developer.usersPerDeveloper != null ? ` / ${developer.usersPerDeveloper}` : ""})
                      </span>
                    </h3>

                    <div className="overflow-hidden rounded-[16px] border border-[#0a0f1d]/5 bg-white">
                      {isLoadingEmployees ? (
                        <div className="flex h-32 items-center justify-center text-[#8c8c8c]">
                          <span className="animate-pulse">{t("admin.ui.loading") || "Loading..."}</span>
                        </div>
                      ) : employees.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-[#8c8c8c]">
                          <Users className="mb-2 h-8 w-8 opacity-20" />
                          <p>{t("admin.developers.employees.empty") || "No employee accounts for this developer"}</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-start text-sm">
                            <thead className="bg-[#f8f9fa] text-[#8c8c8c]">
                              <tr>
                                <th className="px-5 py-4 font-bold">{t("admin.developers.employees.name") || "Name"}</th>
                                <th className="px-5 py-4 font-bold">{t("admin.developers.employees.email") || "Email"}</th>
                                <th className="px-5 py-4 font-bold">{t("admin.developers.employees.phone") || "Phone"}</th>
                                <th className="px-5 py-4 font-bold">{t("admin.developers.employees.status") || "Status"}</th>
                                <th className="px-5 py-4 font-bold text-end">{t("admin.ui.actions") || "Actions"}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#0a0f1d]/5">
                              {employees.map((employee) => {
                                const employeeName = `${employee.displayName || ""} ${employee.lastName || ""}`.trim() || employee.email?.split("@")[0] || "—";
                                const isDisabled = employee.status === "disabled";
                                return (
                                  <tr key={employee.uid} className="transition-colors hover:bg-[#F4F4F4]/50">
                                    <td className="px-5 py-4 font-semibold text-[#0a0f1d] whitespace-nowrap">{employeeName}</td>
                                    <td className="px-5 py-4 font-medium text-[#6b7280]" dir="ltr">
                                      <div className="max-w-[180px] truncate text-end sm:text-start">{employee.email || "—"}</div>
                                    </td>
                                    <td className="px-5 py-4 font-medium text-[#6b7280] whitespace-nowrap" dir="ltr">
                                      <div className="text-end sm:text-start">{employee.phoneNumber || "—"}</div>
                                    </td>
                                    <td className="px-5 py-4">
                                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${isDisabled ? "bg-[#FFE8E4] text-[#FF6A55]" : "bg-[#E8F8EF] text-[#83BF6E]"}`}>
                                        {isDisabled
                                          ? (t("admin.developers.employees.disabled") || "Disabled")
                                          : (t("admin.developers.employees.active") || "Active")}
                                      </span>
                                    </td>
                                    <td className="px-5 py-4">
                                      <div className="flex items-center justify-end">
                                        <div className="inline-flex items-center rounded-full bg-[#F4F4F4] p-1">
                                          <TableAction
                                            label={t(isDisabled ? "admin.developers.enable" : "admin.developers.disable") || (isDisabled ? "Enable" : "Disable")}
                                            onClick={() => handleToggleEmployeeStatus(employee)}
                                            tone={isDisabled ? "default" : "danger"}
                                          />
                                          <TableAction
                                            label={t("admin.ui.delete") || "Delete"}
                                            onClick={() => handleDeleteEmployee(employee)}
                                            tone="danger"
                                          />
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                  )}

                  {/* Audit Logs Section */}
                  <div className="mt-8 pt-8 border-t border-[#0a0f1d]/10">
                    <h3 className="mb-4 sm:mb-6 text-xl font-bold tracking-tight text-[#0a0f1d] text-center sm:text-start flex items-center gap-2 justify-center sm:justify-start">
                      <Activity className="h-5 w-5 text-[#8c8c8c]" />
                      {t("admin.developers.auditLogs.title") || "Audit Logs History"}
                    </h3>

                    <div className="overflow-hidden rounded-[16px] border border-[#0a0f1d]/5 bg-white">
                      {isLoadingLogs ? (
                        <div className="flex h-32 items-center justify-center text-[#8c8c8c]">
                          <span className="animate-pulse">{t("admin.ui.loading") || "Loading..."}</span>
                        </div>
                      ) : auditLogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-[#8c8c8c]">
                          <Activity className="mb-2 h-8 w-8 opacity-20" />
                          <p>{t("admin.developers.auditLogs.empty") || "No audit logs available for this user"}</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-start text-sm">
                            <thead className="bg-[#f8f9fa] text-[#8c8c8c]">
                              <tr>
                                <th className="px-6 py-4 font-bold">{t("admin.developers.auditLogs.action") || "Action"}</th>
                                <th className="px-6 py-4 font-bold">{t("admin.developers.auditLogs.date") || "Date & Time"}</th>
                                <th className="px-6 py-4 font-bold">{t("admin.developers.auditLogs.ip") || "IP Address"}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#0a0f1d]/5">
                              {auditLogs.map((log) => {
                                const logDate = new Intl.DateTimeFormat("en-US", {
                                  month: "short", day: "2-digit", year: "numeric",
                                  hour: "2-digit", minute: "2-digit"
                                }).format(new Date(log.timestamp));
                                
                                return (
                                  <tr key={log.id} className="transition-colors hover:bg-[#F4F4F4]/50">
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-2">
                                        {log.action === "login" ? (
                                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                                            <LogIn className="h-4 w-4" />
                                          </div>
                                        ) : (
                                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/10 text-rose-600">
                                            <LogOut className="h-4 w-4" />
                                          </div>
                                        )}
                                        <span className="font-semibold text-[#0a0f1d] capitalize">
                                          {t(`admin.developers.auditLogs.${log.action}`) || log.action}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-[#6b7280]">{logDate}</td>
                                    <td className="px-6 py-4 font-medium text-[#0a0f1d]" dir="ltr">
                                      <div className="text-end sm:text-start">{log.ip === "::1" ? "127.0.0.1 (Localhost)" : log.ip}</div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>

                  {(account.role === "admin" || account.role === "superAdmin") && (
                    <AccountPermissionsSection user={account} />
                  )}

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
