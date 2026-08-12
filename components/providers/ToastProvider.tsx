"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";

type ToastItem = {
  id: number;
  title: string;
  description?: string;
};

type ToastInput = {
  title: string;
  description?: string;
};

type ToastContextValue = {
  toast: (input: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((input: ToastInput) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, ...input }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-20 z-[99999] flex flex-col items-center gap-3 px-4 sm:inset-x-auto sm:right-8 sm:top-24 sm:items-end sm:px-0">
        <AnimatePresence mode="popLayout">
          {toasts.map((item) => (
            <ToastCard key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: number) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(item.id), 4200);
    return () => clearTimeout(timer);
  }, [item.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-auto flex w-full max-w-[420px] items-start gap-4 rounded-2xl bg-[#0a0f1d] px-5 py-4 text-white shadow-[0_20px_50px_rgba(10,15,29,0.35)] ring-1 ring-white/10"
      role="status"
      aria-live="polite"
    >
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#0a0f1d]">
        <Check className="h-4 w-4" strokeWidth={2.5} />
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-base font-bold tracking-tight">{item.title}</p>
        {item.description ? (
          <p className="mt-1 text-sm font-medium leading-snug text-[#8c8c8c]">
            {item.description}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        className="mt-0.5 rounded-full p-1 text-white/50 transition-colors duration-200 hover:bg-white/10 hover:text-white"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" strokeWidth={2} />
      </button>
    </motion.div>
  );
}
