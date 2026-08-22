"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { requestsService, type RequestStatus } from "./requests.service";
import toast from "react-hot-toast";

export function ProcessRequestModal({
  id,
  type,
  currentStatus,
  onClose,
  onSuccess,
}: {
  id: string | null;
  type: "contact" | "sell" | null;
  currentStatus: RequestStatus | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { t } = useLocale();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [status, setStatus] = useState<RequestStatus | null>(currentStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  useEffect(() => {
    if (!id) return;

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
  }, [id, onClose]);

  if (!id || !type || !status) return null;

  const handleSubmit = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      if (type === "contact") {
        await requestsService.updateContactRequestStatus(id, status);
      } else {
        await requestsService.updateSellRequestStatus(id, status);
      }
      toast.success(t("admin.ui.success") || "Updated successfully");
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(t("admin.ui.error") || "Error updating status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statuses: RequestStatus[] = ["new", "contacted", "completed", "cancelled"];

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
          className="relative w-full max-w-[420px] rounded-[24px] bg-white p-7 shadow-[0_24px_60px_rgba(10,15,29,0.18)] sm:p-8"
        >
          <h2 className="mb-2 text-[1.75rem] font-bold tracking-tight text-[#0a0f1d]">
            {t("admin.customers.actions.process") || "Process Request"}
          </h2>
          <p className="mb-6 text-sm text-[#8c8c8c]">
            {t("admin.customers.status") || "Update Status"}
          </p>

          <div className="flex flex-col gap-3">
            {statuses.map((s) => (
              <label
                key={s}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                  status === s
                    ? "border-[#17C3B3] bg-[#17C3B3]/5"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    status === s ? "border-[#17C3B3]" : "border-gray-300"
                  }`}
                >
                  {status === s && (
                    <div className="h-2.5 w-2.5 rounded-full bg-[#17C3B3]" />
                  )}
                </div>
                <input
                  type="radio"
                  name="status"
                  value={s}
                  checked={status === s}
                  onChange={() => setStatus(s)}
                  className="hidden"
                />
                <span className="font-semibold text-[#0a0f1d]">
                  {t(`admin.customers.statuses.${s}`) || s}
                </span>
              </label>
            ))}
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              ref={cancelRef}
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="inline-flex h-12 items-center justify-center rounded-full border border-[#0a0f1d]/10 px-6 text-sm font-bold text-[#0a0f1d] transition-colors duration-200 hover:bg-[#F4F4F4]"
            >
              {t("admin.cancel") || "Cancel"}
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#0a0f1d] px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#161c2d]"
            >
              {isSubmitting ? "..." : t("admin.ui.save") || "Save Changes"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
