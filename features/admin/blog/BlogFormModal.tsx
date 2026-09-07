"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { BlogEditor } from "@/features/admin/blog/BlogEditor";
import type { BlogPost } from "@/features/blog/blog.service";

export function BlogFormModal({
  isOpen,
  post,
  onClose,
}: {
  isOpen: boolean;
  post?: BlogPost | null;
  onClose: () => void;
}) {
  const { t } = useLocale();

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0a0f1d]/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-[#0a0f1d]/10 px-6 py-5 sm:px-8">
              <h2 className="text-xl font-bold tracking-tight text-[#0a0f1d] sm:text-2xl">
                {post ? t("admin.blog.edit") : t("admin.blog.add")}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a0f1d]/5 text-[#0a0f1d] transition-colors hover:bg-[#0a0f1d]/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
              <BlogEditor
                key={post?.id || "new"}
                post={post}
                showBack={false}
                onSaved={onClose}
              />
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
