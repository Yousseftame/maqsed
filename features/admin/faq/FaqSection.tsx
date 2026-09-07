"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Loader2, Plus, Search, Star, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Panel } from "@/features/admin/ui/Panel";
import { Field, textareaClass } from "@/features/admin/ui/Field";
import { AdminButton, fieldClass } from "@/features/admin/ui/AdminButton";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useConfirm } from "@/features/admin/components/ConfirmModal";
import { faqService, FAQ_FEATURED_LIMIT, type FaqItem } from "@/features/faq/faq.service";
import { AddFaqModal } from "@/features/admin/faq/AddFaqModal";
import { cn } from "@/lib/utils";

const inputClass = cn(
  fieldClass,
  "rounded-2xl border border-gray-200 bg-[#F7F5F9] focus:border-[#6A2B92]/25 focus:bg-white"
);

const areaClass = cn(
  textareaClass,
  "min-h-[120px] rounded-2xl border border-gray-200 bg-[#F7F5F9] focus:border-[#6A2B92]/25 focus:bg-white"
);

function itemTitle(item: FaqItem, locale: string) {
  if (locale === "ar") return item.questionAr.trim() || item.questionEn.trim();
  return item.questionEn.trim() || item.questionAr.trim();
}

function FaqEditor({
  item,
  onSaved,
}: {
  item: FaqItem;
  onSaved: () => Promise<void>;
}) {
  const { t, locale } = useLocale();
  const [lang, setLang] = useState<"ar" | "en">(locale === "en" ? "en" : "ar");
  const [draft, setDraft] = useState({
    questionAr: item.questionAr,
    questionEn: item.questionEn,
    answerAr: item.answerAr,
    answerEn: item.answerEn,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDraft({
      questionAr: item.questionAr,
      questionEn: item.questionEn,
      answerAr: item.answerAr,
      answerEn: item.answerEn,
    });
  }, [item.id, item.questionAr, item.questionEn, item.answerAr, item.answerEn]);

  const isDirty =
    draft.questionAr.trim() !== item.questionAr ||
    draft.questionEn.trim() !== item.questionEn ||
    draft.answerAr.trim() !== item.answerAr ||
    draft.answerEn.trim() !== item.answerEn;

  async function handleSave() {
    if (!draft.questionAr.trim() && !draft.questionEn.trim()) {
      toast.error(t("admin.faq.questionRequired"));
      return;
    }

    setIsSaving(true);
    try {
      await faqService.updateItem(item.id, {
        questionAr: draft.questionAr.trim(),
        questionEn: draft.questionEn.trim(),
        answerAr: draft.answerAr.trim(),
        answerEn: draft.answerEn.trim(),
      });
      await onSaved();
      toast.success(t("admin.ui.saved"));
    } catch (error) {
      console.error("Error updating FAQ item:", error);
      toast.error(t("admin.ui.error") || "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  }

  const question = lang === "ar" ? draft.questionAr : draft.questionEn;
  const answer = lang === "ar" ? draft.answerAr : draft.answerEn;

  return (
    <div className="border-t border-gray-100 px-4 py-5 sm:px-5">
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

      <div className="flex flex-col gap-4" dir={lang === "ar" ? "rtl" : "ltr"}>
        <Field label={t("admin.faq.question")}>
          <input
            dir={lang === "ar" ? "rtl" : "ltr"}
            value={question}
            onChange={(event) =>
              setDraft((current) =>
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
            value={answer}
            rows={5}
            onChange={(event) =>
              setDraft((current) =>
                lang === "ar"
                  ? { ...current, answerAr: event.target.value }
                  : { ...current, answerEn: event.target.value }
              )
            }
            placeholder={t("admin.faq.answer")}
            className={cn(areaClass, "min-h-[140px]", lang === "en" && "text-start")}
          />
        </Field>
      </div>

      {isDirty ? (
        <div className="mt-5 flex justify-end">
          <AdminButton type="button" disabled={isSaving} onClick={() => void handleSave()}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {t("admin.ui.save")}
          </AdminButton>
        </div>
      ) : null}
    </div>
  );
}

export function FaqSection() {
  const { t, locale } = useLocale();
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const { data } = useQuery({
    queryKey: ["faqs"],
    queryFn: () => faqService.getItems(),
  });

  const items = data || [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      [item.questionAr, item.questionEn, item.answerAr, item.answerEn].join(" ").toLowerCase().includes(q)
    );
  }, [items, query]);

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ["faqs"] });
  }

  async function toggleFeatured(item: FaqItem) {
    const featuredCount = items.filter((entry) => entry.featured).length;
    if (!item.featured && featuredCount >= FAQ_FEATURED_LIMIT) {
      toast.error(t("admin.faq.featuredLimit"));
      return;
    }
    setBusyId(item.id);
    try {
      await faqService.updateItem(item.id, { featured: !item.featured });
      await refresh();
    } catch (error) {
      console.error("Error updating FAQ featured state:", error);
      toast.error(t("admin.ui.error") || "Failed to save.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(item: FaqItem) {
    const ok = await confirm({
      title: t("admin.faq.deleteTitle"),
      description: t("admin.faq.deleteDescription"),
      confirmLabel: t("admin.ui.delete"),
      cancelLabel: t("admin.cancel"),
      tone: "danger",
    });
    if (!ok) return;
    setBusyId(item.id);
    try {
      await faqService.deleteItem(item.id);
      if (expandedId === item.id) setExpandedId(null);
      await refresh();
      toast.success(t("admin.ui.saved"));
    } catch (error) {
      console.error("Error deleting FAQ item:", error);
      toast.error(t("admin.ui.error") || "Failed to save.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-6 pt-4 sm:pt-6 pb-20">
        <Panel
          title={t("admin.nav.faq")}
          action={
            <AdminButton type="button" onClick={() => setIsAddOpen(true)}>
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              {t("admin.faq.addItem")}
            </AdminButton>
          }
        >
          <p className="mb-5 text-sm font-semibold text-[#8c8c8c]">{t("admin.faq.itemsHint")}</p>

          {items.length > 0 ? (
            <label className="relative mb-5 block max-w-md">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("admin.faq.search")}
                className="h-12 w-full rounded-full bg-[#F4F4F4] pe-4 ps-11 text-sm font-medium text-[#0a0f1d] outline-none placeholder:text-[#8c8c8c]"
              />
            </label>
          ) : null}

          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-[#fcfcfc] px-6 py-12 text-center text-sm font-medium text-[#8c8c8c]">
              {t("admin.faq.empty")}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-[#fcfcfc] px-6 py-10 text-center text-sm font-medium text-[#8c8c8c]">
              {t("admin.faq.empty")}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((item) => {
                const index = items.findIndex((entry) => entry.id === item.id);
                const isBusy = busyId === item.id;
                const isExpanded = expandedId === item.id;
                const preview = itemTitle(item, locale) || t("admin.faq.untitled");

                return (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                  >
                    <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#17C3B3] text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="min-w-0 flex-1 text-start"
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <p className="truncate text-sm font-bold text-[#0a0f1d]">{preview}</p>
                          {item.featured ? (
                            <span className="inline-flex shrink-0 items-center rounded-full bg-[#17C3B3]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#17C3B3]">
                              {t("admin.faq.featured")}
                            </span>
                          ) : null}
                        </span>
                      </button>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => void toggleFeatured(item)}
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                            item.featured
                              ? "bg-[#17C3B3]/10 text-[#17C3B3]"
                              : "text-[#8c8c8c] hover:bg-[#F4F4F4] hover:text-[#0a0f1d]"
                          )}
                          aria-pressed={item.featured}
                          aria-label={t("admin.faq.featured")}
                        >
                          <Star className="h-4 w-4" fill={item.featured ? "currentColor" : "none"} />
                        </button>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => void remove(item)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label={t("admin.ui.delete")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#6A2B92] transition-colors hover:bg-[#F7F5F9]"
                          aria-expanded={isExpanded}
                        >
                          <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
                        </button>
                      </div>
                    </div>

                    {isExpanded ? <FaqEditor item={item} onSaved={refresh} /> : null}
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      </div>

      <AddFaqModal
        isOpen={isAddOpen}
        order={items.length}
        onClose={() => setIsAddOpen(false)}
        onSaved={(id) => {
          setQuery("");
          setExpandedId(id);
          void refresh();
        }}
      />
    </>
  );
}
