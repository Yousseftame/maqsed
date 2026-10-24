"use client";

import { useMemo, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useConfirm } from "@/features/admin/components/ConfirmModal";
import { AdminButton } from "@/features/admin/ui/AdminButton";
import { Panel } from "@/features/admin/ui/Panel";
import { cn } from "@/lib/utils";
import { AddMenuItemModal } from "./AddMenuItemModal";
import { usePermissions } from "@/features/admin/permissions/usePermissions";
import { categoriesForScope, type MenuCategoryKey, type MenuScope } from "./data";
import { menuOptionsService } from "./menu-options.service";
import { useMenuOptions } from "./useMenuOptions";

export function MenuSettingsSection() {
  const { locale, t } = useLocale();
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const { can } = usePermissions();
  const canCreate = can("menus", "create");
  const canDelete = can("menus", "delete");
  const { of, isPending } = useMenuOptions();

  const [scope, setScope] = useState<MenuScope>("project");
  const [addingCategory, setAddingCategory] = useState<MenuCategoryKey | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const categories = useMemo(() => categoriesForScope(scope), [scope]);

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ["menuOptions"] });
  }

  async function handleDelete(id: string) {
    const ok = await confirm({
      title: t("admin.menus.deleteTitle"),
      description: t("admin.menus.deleteDescription"),
      confirmLabel: t("admin.ui.delete"),
      cancelLabel: t("admin.cancel"),
      tone: "danger",
    });
    if (!ok) return;

    setBusyId(id);
    try {
      await menuOptionsService.deleteItem(id);
      await refresh();
      toast.success(t("admin.ui.saved"));
    } catch (error) {
      console.error("Error deleting menu option:", error);
      toast.error(t("admin.ui.error") || "Failed to save.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-6 pt-4 sm:pt-6 pb-20">
        <div className="inline-flex w-fit rounded-full bg-white p-1 shadow-sm border border-gray-100">
          {(["project", "unit"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setScope(tab)}
              className={cn(
                "h-11 rounded-full px-5 text-sm font-bold transition-colors",
                scope === tab ? "bg-[#0a0f1d] text-white" : "text-[#6B7280] hover:text-[#0a0f1d]"
              )}
            >
              {tab === "project" ? t("admin.menus.tabProjects") : t("admin.menus.tabUnits")}
            </button>
          ))}
        </div>

        <p className="text-sm font-semibold text-[#8c8c8c]">
          {scope === "project" ? t("admin.menus.hintProjects") : t("admin.menus.hintUnits")}
        </p>

        {isPending ? (
          <div className="flex items-center justify-center rounded-2xl bg-white py-16">
            <Loader2 className="h-6 w-6 animate-spin text-[#8c8c8c]" />
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {categories.map((category) => {
              const categoryItems = of(scope, category);
              return (
                <Panel
                  key={category}
                  title={t(`admin.menus.${category}`)}
                  action={
                    canCreate ? (
                      <AdminButton type="button" onClick={() => setAddingCategory(category)} className="h-10 px-4">
                        <Plus className="h-4 w-4" strokeWidth={2.5} />
                        {t("admin.menus.addButton")}
                      </AdminButton>
                    ) : null
                  }
                >
                  {categoryItems.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {categoryItems.map((item) => {
                        const label =
                          locale === "ar"
                            ? item.labelAr.trim() || item.labelEn.trim()
                            : item.labelEn.trim() || item.labelAr.trim();
                        const isBusy = busyId === item.id;

                        return (
                          <div
                            key={item.id}
                            className="group flex items-center gap-3 rounded-2xl border border-gray-100 bg-[#F9F9F9] px-4 py-3"
                          >
                            <span className="text-sm font-semibold text-[#0a0f1d]">{label}</span>
                            {canDelete ? (
                              <button
                                type="button"
                                onClick={() => handleDelete(item.id)}
                                disabled={isBusy}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                                aria-label={t("admin.ui.delete")}
                              >
                                {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                              </button>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-[#fcfcfc] px-6 py-10 text-center text-sm font-medium text-[#8c8c8c]">
                      {t("admin.menus.emptyCategory")}
                    </div>
                  )}
                </Panel>
              );
            })}
          </div>
        )}
      </div>

      {canCreate ? (
        <AddMenuItemModal
          isOpen={Boolean(addingCategory)}
          scope={scope}
          category={addingCategory}
          categoryLabel={addingCategory ? t(`admin.menus.${addingCategory}`) : ""}
          order={addingCategory ? of(scope, addingCategory).length : 0}
          onClose={() => setAddingCategory(null)}
          onSaved={refresh}
        />
      ) : null}
    </>
  );
}
