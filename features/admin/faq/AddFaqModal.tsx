"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { Field, textareaClass } from "@/features/admin/ui/Field";
import { fieldClass } from "@/features/admin/ui/AdminButton";
import { useLocale } from "@/components/providers/LocaleProvider";
import { faqService, type FaqItemInput } from "@/features/faq/faq.service";
import { cn } from "@/lib/utils";

const inputClass = cn(
  fieldClass,
  "rounded-[16px] border border-transparent bg-[#F4F4F4] focus:border-[#0a0f1d]/10 focus:bg-[#EAEAEA]"
);

const areaClass = cn(
  textareaClass,
  "min-h-[140px] rounded-[16px] border border-transparent bg-[#F4F4F4] focus:border-[#0a0f1d]/10 focus:bg-[#EAEAEA]"
);

const emptyForm: FaqItemInput = {
  questionAr: "",
  questionEn: "",
  answerAr: "",
  answerEn: "",
};

export function AddFaqModal({
  isOpen,
  order,
  onClose,
  onSaved,
}: {
  isOpen: boolean;
  order: number;
  onClose: () => void;
  onSaved: (id: string) => void;
}) {
  const { t } = useLocale();
  const [form, setForm] = useState(emptyForm);
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setForm(emptyForm);
    setLang("ar");
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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.questionAr.trim() && !form.questionEn.trim()) {
      toast.error(t("admin.faq.questionRequired"));
      return;
    }

    setIsSaving(true);
    try {
      const id = await faqService.addItem(order, form);
      toast.success(t("admin.ui.saved"));
      onSaved(id);
      onClose();
    } catch (error) {
      console.error("Error adding FAQ item:", error);
      toast.error(t("admin.ui.error") || "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
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
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-[#0a0f1d]/10 px-6 py-5 sm:px-8">
              <h2 className="text-xl font-bold tracking-tight text-[#0a0f1d] sm:text-2xl">
                {t("admin.faq.addModalTitle")}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a0f1d]/5 text-[#0a0f1d] transition-colors hover:bg-[#0a0f1d]/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
                <div className="mb-5 inline-flex rounded-full bg-[#F4F4F4] p-1">
                  <button
                    type="button"
                    onClick={() => setLang("ar")}
                    className={cn(
                      "h-9 rounded-full px-4 text-sm font-bold transition-colors",
                      lang === "ar" ? "bg-white text-[#0a0f1d] shadow-sm" : "text-[#8c8c8c]"
                    )}
                  >
                    {t("admin.faq.langAr")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang("en")}
                    className={cn(
                      "h-9 rounded-full px-4 text-sm font-bold transition-colors",
                      lang === "en" ? "bg-white text-[#0a0f1d] shadow-sm" : "text-[#8c8c8c]"
                    )}
                  >
                    {t("admin.faq.langEn")}
                  </button>
                </div>

                <div className="flex flex-col gap-5" dir={lang === "ar" ? "rtl" : "ltr"}>
                  <Field label={t("admin.faq.question")}>
                    <input
                      dir={lang === "ar" ? "rtl" : "ltr"}
                      value={lang === "ar" ? form.questionAr : form.questionEn}
                      onChange={(event) =>
                        setForm((current) =>
                          lang === "ar"
                            ? { ...current, questionAr: event.target.value }
                            : { ...current, questionEn: event.target.value }
                        )
                      }
                      placeholder={t("admin.faq.question")}
                      className={cn(inputClass, lang === "en" && "text-start")}
                    />
                  </Field>
                  <Field label={t("admin.faq.answer")}>
                    <textarea
                      dir={lang === "ar" ? "rtl" : "ltr"}
                      rows={5}
                      value={lang === "ar" ? form.answerAr : form.answerEn}
                      onChange={(event) =>
                        setForm((current) =>
                          lang === "ar"
                            ? { ...current, answerAr: event.target.value }
                            : { ...current, answerEn: event.target.value }
                        )
                      }
                      placeholder={t("admin.faq.answer")}
                      className={cn(areaClass, lang === "en" && "text-start")}
                    />
                  </Field>
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#0a0f1d]/10 px-6 py-5 sm:px-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-bold text-[#0a0f1d] transition-colors hover:bg-[#F4F4F4]"
                >
                  {t("admin.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#0a0f1d] px-8 text-sm font-bold text-white transition-colors hover:bg-[#161c2d] disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {t("admin.faq.saveAndAdd")}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
