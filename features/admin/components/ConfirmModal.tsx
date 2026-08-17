"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale } from "@/components/providers/LocaleProvider";

export type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
};

type ConfirmContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return context.confirm;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((next: ConfirmOptions) => {
    setOptions(next);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const close = useCallback((value: boolean) => {
    resolverRef.current?.(value);
    resolverRef.current = null;
    setOptions(null);
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmModal
        options={options}
        onCancel={() => close(false)}
        onConfirm={() => close(true)}
      />
    </ConfirmContext.Provider>
  );
}

function ConfirmModal({
  options,
  onCancel,
  onConfirm,
}: {
  options: ConfirmOptions | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { t } = useLocale();
  const open = Boolean(options);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {options ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label={t("admin.closeDialog")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[#0a0f1d]/45"
            onClick={onCancel}
          />

          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby={options.description ? "confirm-description" : undefined}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[420px] rounded-[24px] bg-white p-7 shadow-[0_24px_60px_rgba(10,15,29,0.18)] sm:p-8"
          >
            <h2
              id="confirm-title"
              className="text-[1.75rem] font-bold tracking-tight text-[#0a0f1d]"
            >
              {options.title}
            </h2>
            {options.description ? (
              <p
                id="confirm-description"
                className="mt-3 text-base font-medium leading-relaxed text-[#8c8c8c]"
              >
                {options.description}
              </p>
            ) : null}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                ref={cancelRef}
                type="button"
                onClick={onCancel}
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#0a0f1d]/10 px-6 text-sm font-bold text-[#0a0f1d] transition-colors duration-200 hover:bg-[#F4F4F4]"
              >
                {options.cancelLabel ?? t("admin.cancel")}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#0a0f1d] px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#161c2d]"
              >
                {options.confirmLabel ?? t("admin.confirm")}
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
