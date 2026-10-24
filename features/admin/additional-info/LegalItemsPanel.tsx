"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Plus, Search, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Panel } from "@/features/admin/ui/Panel";
import { Field, textareaClass } from "@/features/admin/ui/Field";
import { AdminButton, fieldClass } from "@/features/admin/ui/AdminButton";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useConfirm } from "@/features/admin/components/ConfirmModal";
import { legalService, type LegalItem, type LegalPageId } from "@/features/legal/legal.service";
import { AddLegalItemModal } from "@/features/admin/additional-info/AddLegalItemModal";
import { usePermissions } from "@/features/admin/permissions/usePermissions";
import { cn } from "@/lib/utils";

const inputClass = cn(
  fieldClass,
  "rounded-2xl border border-gray-200 bg-[#F7F5F9] focus:border-[#6A2B92]/25 focus:bg-white"
);

const areaClass = cn(
  textareaClass,
  "min-h-[120px] rounded-2xl border border-gray-200 bg-[#F7F5F9] focus:border-[#6A2B92]/25 focus:bg-white"
);

function itemTitle(item: LegalItem, locale: string) {
  if (locale === "ar") return item.questionAr.trim() || item.questionEn.trim();
  return item.questionEn.trim() || item.questionAr.trim();
}

export function LegalItemsPanel({
  page,
  title,
}: {
  page: LegalPageId;
  title: string;
}) {
  const { t, locale } = useLocale();
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const { can } = usePermissions();
  const canCreate = can("additionalInfo", "create");
  const canEdit = can("additionalInfo", "edit");
  const canDelete = can("additionalInfo", "delete");
  const canSort = can("additionalInfo", "sort");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const { data } = useQuery({
    queryKey: ["legal", page],
    queryFn: () => legalService.getItems(page),
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
    await queryClient.invalidateQueries({ queryKey: ["legal", page] });
  }

  async function saveField(
    item: LegalItem,
    field: keyof Pick<LegalItem, "questionAr" | "questionEn" | "answerAr" | "answerEn">,
    value: string
  ) {
    const next = value.trim();
    if (next === item[field]) return;
    try {
      await legalService.updateItem(item.id, { [field]: next });
      await refresh();
    } catch (error) {
      console.error("Error updating legal item:", error);
      toast.error(t("admin.ui.error") || "Failed to save.");
    }
  }

  async function move(item: LegalItem, direction: -1 | 1) {
    const index = items.findIndex((entry) => entry.id === item.id);
    const swapWith = items[index + direction];
    if (index < 0 || !swapWith) return;
    const next = [...items];
    next[index] = swapWith;
    next[index + direction] = item;
    setBusyId(item.id);
    try {
      await legalService.reorderItems(next);
      await refresh();
    } catch (error) {
      console.error("Error reordering legal items:", error);
      toast.error(t("admin.ui.error") || "Failed to save.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(item: LegalItem) {
    const ok = await confirm({
      title: t("admin.additionalInfo.deleteTitle"),
      description: t("admin.additionalInfo.deleteDescription"),
      confirmLabel: t("admin.ui.delete"),
      cancelLabel: t("admin.cancel"),
      tone: "danger",
    });
    if (!ok) return;
    setBusyId(item.id);
    try {
      await legalService.deleteItem(item.id);
      const remaining = items.filter((entry) => entry.id !== item.id);
      if (remaining.length > 0) {
        await legalService.reorderItems(remaining);
      }
      if (expandedId === item.id) setExpandedId(null);
      await refresh();
      toast.success(t("admin.ui.saved"));
    } catch (error) {
      console.error("Error deleting legal item:", error);
      toast.error(t("admin.ui.error") || "Failed to save.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
    <Panel
      title={title}
      action={
        canCreate ? (
          <AdminButton type="button" onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            {t("admin.additionalInfo.addItem")}
          </AdminButton>
        ) : null
      }
    >
      <p className="mb-5 text-sm font-semibold text-[#8c8c8c]">{t("admin.additionalInfo.itemsHint")}</p>

      {items.length > 0 ? (
        <label className="relative mb-5 block max-w-md">
          <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("admin.additionalInfo.search")}
            className="h-12 w-full rounded-full bg-[#F4F4F4] pe-4 ps-11 text-sm font-medium text-[#0a0f1d] outline-none placeholder:text-[#8c8c8c]"
          />
        </label>
      ) : null}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-[#fcfcfc] px-6 py-12 text-center text-sm font-medium text-[#8c8c8c]">
          {t("admin.additionalInfo.empty")}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-[#fcfcfc] px-6 py-10 text-center text-sm font-medium text-[#8c8c8c]">
          {t("admin.additionalInfo.empty")}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200">
          {filtered.map((item) => {
            const index = items.findIndex((entry) => entry.id === item.id);
            const isBusy = busyId === item.id;
            const isExpanded = expandedId === item.id;
            const preview = itemTitle(item, locale) || t("admin.additionalInfo.untitled");

            return (
              <div key={item.id} className="border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#17C3B3] text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="min-w-0 flex-1 text-start"
                  >
                    <p className="truncate text-sm font-bold text-[#0a0f1d]">{preview}</p>
                  </button>
                  <div className="flex shrink-0 items-center gap-1">
                    {canSort ? (
                      <>
                        <button
                          type="button"
                          disabled={isBusy || Boolean(query.trim()) || index <= 0}
                          onClick={() => void move(item, -1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#0a0f1d] transition-colors hover:bg-[#F4F4F4] disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label={t("admin.blog.moveUp")}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={isBusy || Boolean(query.trim()) || index < 0 || index >= items.length - 1}
                          onClick={() => void move(item, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#0a0f1d] transition-colors hover:bg-[#F4F4F4] disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label={t("admin.blog.moveDown")}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </>
                    ) : null}
                    {canDelete ? (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => void remove(item)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={t("admin.ui.delete")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : null}
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

                {isExpanded ? (
                  <div className="grid gap-5 border-t border-gray-100 bg-[#fcfcfc] px-4 py-5 sm:grid-cols-2 sm:px-5">
                    <Field label={t("admin.additionalInfo.questionAr")}>
                      <input
                        dir="rtl"
                        defaultValue={item.questionAr}
                        key={`${item.id}-questionAr-${item.questionAr}`}
                        disabled={!canEdit}
                        onBlur={(event) => canEdit && void saveField(item, "questionAr", event.target.value)}
                        placeholder={t("admin.additionalInfo.questionAr")}
                        className={cn(inputClass, !canEdit && "opacity-70")}
                      />
                    </Field>
                    <Field label={t("admin.additionalInfo.questionEn")}>
                      <input
                        dir="ltr"
                        defaultValue={item.questionEn}
                        key={`${item.id}-questionEn-${item.questionEn}`}
                        disabled={!canEdit}
                        onBlur={(event) => canEdit && void saveField(item, "questionEn", event.target.value)}
                        placeholder={t("admin.additionalInfo.questionEn")}
                        className={cn(inputClass, "text-start", !canEdit && "opacity-70")}
                      />
                    </Field>
                    <Field label={t("admin.additionalInfo.answerAr")}>
                      <textarea
                        dir="rtl"
                        defaultValue={item.answerAr}
                        key={`${item.id}-answerAr-${item.answerAr}`}
                        rows={4}
                        disabled={!canEdit}
                        onBlur={(event) => canEdit && void saveField(item, "answerAr", event.target.value)}
                        placeholder={t("admin.additionalInfo.answerAr")}
                        className={cn(areaClass, !canEdit && "opacity-70")}
                      />
                    </Field>
                    <Field label={t("admin.additionalInfo.answerEn")}>
                      <textarea
                        dir="ltr"
                        defaultValue={item.answerEn}
                        key={`${item.id}-answerEn-${item.answerEn}`}
                        rows={4}
                        disabled={!canEdit}
                        onBlur={(event) => canEdit && void saveField(item, "answerEn", event.target.value)}
                        placeholder={t("admin.additionalInfo.answerEn")}
                        className={cn(areaClass, "text-start", !canEdit && "opacity-70")}
                      />
                    </Field>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </Panel>

    {canCreate ? (
      <AddLegalItemModal
        isOpen={isAddOpen}
        page={page}
        order={items.length}
        onClose={() => setIsAddOpen(false)}
        onSaved={(id) => {
          setQuery("");
          setExpandedId(id);
          void refresh();
        }}
      />
    ) : null}
    </>
  );
}
