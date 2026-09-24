"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { InterestRequest } from "@/features/admin/customers/requests.service";

export function ViewInterestModal({
  request,
  onClose,
}: {
  request: InterestRequest | null;
  onClose: () => void;
}) {
  const { t } = useLocale();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!request) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [request, onClose]);

  if (!request) return null;

  const Field = ({
    label,
    value,
    dir,
  }: {
    label: string;
    value: React.ReactNode;
    dir?: string;
  }) => (
    <div className="flex flex-col gap-1 rounded-xl bg-[#F4F4F4] p-4">
      <span className="text-xs font-semibold uppercase tracking-wider text-[#8c8c8c]">
        {label}
      </span>
      <span className="text-sm font-bold text-[#0a0f1d]" dir={dir}>
        {value || "—"}
      </span>
    </div>
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
        <motion.button
          type="button"
          aria-label={t("admin.closeDialog")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-[#0a0f1d]/45"
          onClick={onClose}
        />

        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[600px] max-h-[90vh] overflow-y-auto no-scrollbar rounded-[24px] bg-white p-7 shadow-[0_24px_60px_rgba(10,15,29,0.18)] sm:p-8"
        >
          <h2 className="mb-6 text-[1.75rem] font-bold tracking-tight text-[#0a0f1d]">
            {t("admin.ui.view") || "View Details"}
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label={t("contactPage.form.fullName") || "Name"}
              value={request.fullName}
            />
            <Field
              label={t("contactPage.form.phone") || "Phone"}
              value={request.phone}
              dir="ltr"
            />
            <Field
              label={t("contactPage.form.email") || "Email"}
              value={request.email || "—"}
              dir="ltr"
            />
            <Field
              label={t("admin.interestRequests.source") || "Source"}
              value={
                request.source === "sub_website"
                  ? t("admin.interestRequests.sourceSub") || "Sub website"
                  : request.source || "—"
              }
            />
            <div className="sm:col-span-2">
              <Field
                label={t("contactPage.form.message") || "Message"}
                value={request.message || "—"}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              ref={cancelRef}
              type="button"
              onClick={onClose}
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#0a0f1d] px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#161c2d]"
            >
              {t("admin.closeDialog") || "Close"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
