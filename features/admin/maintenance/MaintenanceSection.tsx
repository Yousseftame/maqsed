"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { TriangleAlert } from "lucide-react";
import { Panel } from "@/features/admin/ui/Panel";
import { Field, textareaClass } from "@/features/admin/ui/Field";
import { AdminButton, fieldClass } from "@/features/admin/ui/AdminButton";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

export function MaintenanceSection() {
  const { t } = useLocale();

  const [isEnabled, setIsEnabled] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageText, setMessageText] = useState("");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    toast.success(t("admin.ui.saved"));
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6 pt-4 sm:pt-6 pb-20">
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
              onClick={() => setIsEnabled(!isEnabled)}
              className={cn(
                "relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0f1d] focus-visible:ring-offset-2",
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
          <div className="flex flex-col gap-6">
            <Field label={t("admin.maintenance.messageTitle")}>
              <input
                type="text"
                value={messageTitle}
                onChange={(e) => setMessageTitle(e.target.value)}
                placeholder={t("admin.maintenance.messageTitlePlaceholder")}
                className={fieldClass}
              />
            </Field>

            <Field label={t("admin.maintenance.messageText")}>
              <textarea
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={t("admin.maintenance.messageTextPlaceholder")}
                className={textareaClass}
              />
            </Field>
          </div>
          
        </div>
      </Panel>

      <div className="flex justify-end">
        <AdminButton type="submit" className="w-full sm:w-auto px-10">
          {t("admin.ui.save")}
        </AdminButton>
      </div>
    </form>
  );
}
