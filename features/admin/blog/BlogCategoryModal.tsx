"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { Field } from "@/features/admin/ui/Field";
import { fieldClass } from "@/features/admin/ui/AdminButton";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";
import {
  blogCategoriesService,
  type BlogCategory,
  type BlogCategoryInput,
} from "@/features/blog/blog-categories.service";

const inputClass = cn(
  fieldClass,
  "rounded-[16px] border border-transparent bg-[#F4F4F4] focus:border-[#0a0f1d]/10 focus:bg-[#EAEAEA]"
);

const emptyForm: BlogCategoryInput = {
  labelAr: "",
  labelEn: "",
};

export function BlogCategoryModal({
  isOpen,
  category,
  order,
  onClose,
  onSaved,
}: {
  isOpen: boolean;
  category?: BlogCategory | null;
  order: number;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
}) {
  const { t } = useLocale();
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setForm(
      category
        ? { labelAr: category.labelAr, labelEn: category.labelEn }
        : emptyForm
    );
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
  }, [isOpen, category, onClose]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.labelAr.trim() && !form.labelEn.trim()) {
      toast.error(t("admin.blog.categoryRequired"));
      return;
    }

    setIsSaving(true);
    try {
      if (category) {
        await blogCategoriesService.updateItem(category.id, form);
      } else {
        await blogCategoriesService.addItem(order, form);
      }
      toast.success(t("admin.ui.saved"));
      await onSaved();
      onClose();
    } catch (error) {
      console.error("Error saving blog category:", error);
      toast.error(t("admin.ui.error") || "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
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
            className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-[#0a0f1d]/10 px-6 py-5">
              <h2 className="text-xl font-bold tracking-tight text-[#0a0f1d]">
                {category ? t("admin.blog.editCategory") : t("admin.blog.addCategory")}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a0f1d]/5 text-[#0a0f1d] transition-colors hover:bg-[#0a0f1d]/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-5 px-6 py-6">
                <Field label={t("admin.blog.categoryAr")}>
                  <input
                    dir="rtl"
                    value={form.labelAr}
                    onChange={(event) => setForm((current) => ({ ...current, labelAr: event.target.value }))}
                    placeholder={t("admin.blog.categoryAr")}
                    className={inputClass}
                  />
                </Field>
                <Field label={t("admin.blog.categoryEn")}>
                  <input
                    dir="ltr"
                    value={form.labelEn}
                    onChange={(event) => setForm((current) => ({ ...current, labelEn: event.target.value }))}
                    placeholder={t("admin.blog.categoryEn")}
                    className={`${inputClass} text-start`}
                  />
                </Field>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#0a0f1d]/10 px-6 py-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-11 rounded-full px-5 text-sm font-bold text-[#65676B] transition-colors hover:bg-[#F4F4F4]"
                >
                  {t("admin.cancel") || "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#0a0f1d] px-6 text-sm font-bold text-white transition-colors hover:bg-[#161c2d] disabled:opacity-60"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {t("admin.ui.save")}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
