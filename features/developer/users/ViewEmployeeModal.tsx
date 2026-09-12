"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Mail, Phone, Calendar, Activity, LogIn, LogOut } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useAuth } from "@/features/auth/AuthProvider";
import { usersService } from "@/features/auth/users.service";
import type { UserData } from "@/types/user";

type ViewEmployeeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  employee: UserData | null;
};

export function ViewEmployeeModal({ isOpen, onClose, employee }: ViewEmployeeModalProps) {
  const { t } = useLocale();
  const { user, userData } = useAuth();
  const canReadLogs = userData?.role === "developer" || user?.uid === employee?.uid;

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
    queryKey: ["auditLogs", employee?.uid],
    queryFn: () => usersService.getUserAuditLogs(employee!.uid),
    enabled: isOpen && !!employee?.uid && canReadLogs,
  });

  if (!employee) return null;

  let joinDate = "-";
  if (employee.createdAt) {
    const dateObj = typeof employee.createdAt === "object" && (employee.createdAt as { toDate?: () => Date }).toDate
      ? (employee.createdAt as { toDate: () => Date }).toDate()
      : new Date(employee.createdAt);

    if (!isNaN(dateObj.getTime())) {
      joinDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(dateObj);
    }
  }

  const getInitials = (first: string = "", last: string = "") => {
    if (!first && !last) return employee.email?.charAt(0).toUpperCase() || "-";
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  const fullName = `${employee.displayName || ""} ${employee.lastName || ""}`.trim() || employee.email.split("@")[0];

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
            <button
              onClick={onClose}
              className="absolute end-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/50 text-[#0a0f1d] backdrop-blur-md transition-colors hover:bg-white/80"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex-1 overflow-y-auto no-scrollbar w-full">
              <div className="h-32 w-full bg-gradient-to-r from-[#0a0f1d] to-[#1f2937]" />

              <div className="flex flex-col sm:flex-row gap-8 px-6 pb-8 sm:px-10">
                <div className="flex w-full flex-col items-center sm:w-[35%] sm:items-start">
                  <div className="relative -mt-16 mb-4 flex justify-center">
                    <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#F4F4F4] text-4xl font-bold text-[#0a0f1d] shadow-lg">
                      {employee.photoURL ? (
                        <Image src={employee.photoURL} alt={fullName} fill className="object-cover" />
                      ) : (
                        getInitials(employee.displayName, employee.lastName)
                      )}
                    </div>
                  </div>

                  <div className="mb-6 text-center sm:text-start">
                    <h2 className="text-3xl font-bold tracking-tight text-[#0a0f1d]">{fullName}</h2>
                    <span className="mt-2 inline-block rounded-full bg-[#0a0f1d]/5 px-3 py-1 text-sm font-semibold text-[#6b7280]">
                      {t("admin.ui.employee") || "Employee"}
                    </span>
                  </div>
                </div>

                <div className="flex w-full flex-1 flex-col pt-2 sm:pt-6">
                  <h3 className="mb-4 sm:mb-6 text-xl font-bold tracking-tight text-[#0a0f1d] text-center sm:text-start">
                    {t("developer.users.createForm.personalInfo") || "Personal Information"}
                  </h3>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="flex flex-col justify-center gap-1 rounded-[16px] border border-[#0a0f1d]/5 bg-white p-5 transition-colors hover:bg-[#F4F4F4]">
                      <div className="mb-2 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[#8c8c8c]" />
                        <span className="text-xs font-bold text-[#8c8c8c]">{t("developer.users.createForm.email") || "Email"}</span>
                      </div>
                      <span className="text-base font-semibold text-[#0a0f1d] text-start">{employee.email}</span>
                    </div>

                    <div className="flex flex-col justify-center gap-1 rounded-[16px] border border-[#0a0f1d]/5 bg-white p-5 transition-colors hover:bg-[#F4F4F4]">
                      <div className="mb-2 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-[#8c8c8c]" />
                        <span className="text-xs font-bold text-[#8c8c8c]">{t("developer.users.phone") || "Phone Number"}</span>
                      </div>
                      <span className="text-base font-semibold text-[#0a0f1d] text-start">{employee.phoneNumber || "—"}</span>
                    </div>

                    <div className="flex flex-col justify-center gap-1 rounded-[16px] border border-[#0a0f1d]/5 bg-white p-5 transition-colors hover:bg-[#F4F4F4]">
                      <div className="mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#8c8c8c]" />
                        <span className="text-xs font-bold text-[#8c8c8c]">{t("developer.users.joined") || "Joined Date"}</span>
                      </div>
                      <span className="text-base font-semibold text-[#0a0f1d] text-start">{joinDate}</span>
                    </div>
                  </div>

                  {canReadLogs ? (
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
                                  hour: "2-digit", minute: "2-digit",
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
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
