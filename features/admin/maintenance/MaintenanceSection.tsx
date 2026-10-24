"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, TriangleAlert } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Panel } from "@/features/admin/ui/Panel";
import { Field, textareaClass } from "@/features/admin/ui/Field";
import { AdminButton, fieldClass } from "@/features/admin/ui/AdminButton";
import { useLocale } from "@/components/providers/LocaleProvider";
import { maintenanceService } from "@/features/maintenance/maintenance.service";
import { usePermissions } from "@/features/admin/permissions/usePermissions";
import { writeMaintenanceCookie } from "@/lib/auth/constants";
import { cn } from "@/lib/utils";

export function MaintenanceSection() {
  const { t } = useLocale();
  const queryClient = useQueryClient();
  const { can } = usePermissions();
  const canEdit = can("maintenance", "edit");
  const [isEnabled, setIsEnabled] = useState(false);
  const [messageTitleAr, setMessageTitleAr] = useState("");
  const [messageTitleEn, setMessageTitleEn] = useState("");
  const [messageTextAr, setMessageTextAr] = useState("");
  const [messageTextEn, setMessageTextEn] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { data, isFetched } = useQuery({
    queryKey: ["maintenance"],
    queryFn: () => maintenanceService.getSettings(),
  });

  useEffect(() => {
    if (!isFetched || !data) return;
    setIsEnabled(data.enabled);
    setMessageTitleAr(data.messageTitleAr);
    setMessageTitleEn(data.messageTitleEn);
    setMessageTextAr(data.messageTextAr);
    setMessageTextEn(data.messageTextEn);
  }, [data, isFetched]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!canEdit) return;
    setIsSaving(true);
    try {
      await maintenanceService.saveSettings({
        enabled: isEnabled,
        messageTitleAr,
        messageTitleEn,
        messageTextAr,
        messageTextEn,
      });
      writeMaintenanceCookie(isEnabled);
      await queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      toast.success(t("admin.ui.saved"));
    } catch (error) {
      console.error("Error saving maintenance settings:", error);
      toast.error(t("admin.ui.error") || "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6 pt-4 sm:pt-6 pb-20">
      <fieldset disabled={!canEdit} className="m-0 flex min-w-0 flex-col gap-6 border-0 p-0 disabled:opacity-90">
      <Panel>
        <div className="flex flex-col gap-8">
          
          {/* Enable Toggle Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-[20px] bg-[#F4F4F4] border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm text-gray-400">
                <TriangleAlert className="h-5 w-5" strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-base font-bold text-[#0a0f1d]">
                  {t("admin.maintenance.enableTitle")}
                </span>
                <span className="text-sm font-medium text-[#8c8c8c]">
                  {t("admin.maintenance.enableDesc")}
                </span>
              </div>
            </div>
            
            {/* Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={isEnabled}
              disabled={!canEdit || !isFetched || isSaving}
              onClick={() => setIsEnabled(!isEnabled)}
              className={cn(
                "relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0f1d] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                isEnabled ? "bg-[#17C3B3]" : "bg-gray-200"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  isEnabled ? "translate-x-6 rtl:-translate-x-6" : "translate-x-0"
                )}
              />
            </button>
          </div>

          <hr className="border-gray-100" />

          {/* Form Fields */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label={t("admin.maintenance.messageTitleAr")}>
              <input
                type="text"
                dir="rtl"
                value={messageTitleAr}
                onChange={(e) => setMessageTitleAr(e.target.value)}
                placeholder={t("admin.maintenance.messageTitlePlaceholderAr")}
                className={fieldClass}
              />
            </Field>
            <Field label={t("admin.maintenance.messageTitleEn")}>
              <input
                type="text"
                dir="ltr"
                value={messageTitleEn}
                onChange={(e) => setMessageTitleEn(e.target.value)}
                placeholder={t("admin.maintenance.messageTitlePlaceholderEn")}
                className={`${fieldClass} text-start`}
              />
            </Field>
            <Field label={t("admin.maintenance.messageTextAr")}>
              <textarea
                dir="rtl"
                rows={4}
                value={messageTextAr}
                onChange={(e) => setMessageTextAr(e.target.value)}
                placeholder={t("admin.maintenance.messageTextPlaceholderAr")}
                className={textareaClass}
              />
            </Field>
            <Field label={t("admin.maintenance.messageTextEn")}>
              <textarea
                dir="ltr"
                rows={4}
                value={messageTextEn}
                onChange={(e) => setMessageTextEn(e.target.value)}
                placeholder={t("admin.maintenance.messageTextPlaceholderEn")}
                className={`${textareaClass} text-start`}
              />
            </Field>
          </div>
          
        </div>
      </Panel>

      {canEdit ? (
        <div className="flex justify-end">
          <AdminButton type="submit" disabled={isSaving || !isFetched} className="w-full sm:w-auto px-10">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {t("admin.ui.save")}
          </AdminButton>
        </div>
      ) : null}
      </fieldset>
    </form>
  );
}
