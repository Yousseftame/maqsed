"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Mail, Phone, Building2, Calendar, FolderClosed, Home } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { UserData } from "@/types/user";

type ViewDeveloperModalProps = {
  isOpen: boolean;
  onClose: () => void;
  developer: UserData | null;
};

export function ViewDeveloperModal({ isOpen, onClose, developer }: ViewDeveloperModalProps) {
  const { t } = useLocale();

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

  if (!developer) return null;

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
            <div className="flex-1 overflow-y-auto no-scrollbar w-full">
              {/* Header Background */}
              <div className="h-32 w-full bg-gradient-to-r from-[#0a0f1d] to-[#1f2937]" />

              <div className="flex flex-col sm:flex-row gap-8 px-6 pb-8 sm:px-10">
                
                {/* Left/Start Column (Profile & Stats) */}
                <div className="flex w-full flex-col items-center sm:w-[35%] sm:items-start">
                  {/* Avatar */}
                  <div className="relative -mt-16 mb-4 flex justify-center">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-[#F4F4F4] text-4xl font-bold text-[#0a0f1d] shadow-lg">
                      {getInitials(developer.displayName, developer.lastName)}
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
                <div className="flex w-full flex-1 flex-col pt-2 sm:pt-6">
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

                    <div className="flex flex-col justify-center gap-1 rounded-[16px] border border-[#0a0f1d]/5 bg-white p-5 transition-colors hover:bg-[#F4F4F4]">
                      <div className="mb-2 flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-[#8c8c8c]" />
                        <span className="text-xs font-bold text-[#8c8c8c]">{t("admin.developers.company") || "Company Name"}</span>
                      </div>
                      <span className="text-base font-semibold text-[#0a0f1d] text-start">{developer.companyName || "—"}</span>
                    </div>

                    <div className="flex flex-col justify-center gap-1 rounded-[16px] border border-[#0a0f1d]/5 bg-white p-5 transition-colors hover:bg-[#F4F4F4]">
                      <div className="mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#8c8c8c]" />
                        <span className="text-xs font-bold text-[#8c8c8c]">{t("admin.developers.joined") || "Joined Date"}</span>
                      </div>
                      <span className="text-base font-semibold text-[#0a0f1d] text-start">{joinDate}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
