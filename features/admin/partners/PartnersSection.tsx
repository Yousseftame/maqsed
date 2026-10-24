"use client";

import { useRef, useState } from "react";
import { ChevronDown, ChevronUp, ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Panel } from "@/features/admin/ui/Panel";
import { AdminButton, fieldClass } from "@/features/admin/ui/AdminButton";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useConfirm } from "@/features/admin/components/ConfirmModal";
import { partnersService, type Partner } from "@/features/partners/partners.service";
import { usePermissions } from "@/features/admin/permissions/usePermissions";
import { cn } from "@/lib/utils";

export function PartnersSection() {
  const { t } = useLocale();
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const { can } = usePermissions();
  const canCreate = can("partners", "create");
  const canEdit = can("partners", "edit");
  const canDelete = can("partners", "delete");
  const canSort = can("partners", "sort");
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data, isFetched } = useQuery({
    queryKey: ["partners"],
    queryFn: () => partnersService.getPartners(),
  });

  const partners = [...(data || [])].sort((a, b) => a.order - b.order);

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ["partners"] });
  }

  async function onFilesSelected(fileList: FileList | null) {
    if (!fileList?.length) return;
    setIsUploading(true);
    try {
      let nextOrder = partners.length;
      for (const file of Array.from(fileList)) {
        const name = file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
        await partnersService.addPartner({ name, file, order: nextOrder });
        nextOrder += 1;
      }
      await refresh();
      toast.success(t("admin.ui.saved"));
    } catch (error) {
      console.error("Error adding partners:", error);
      toast.error(t("admin.ui.error") || "Failed to save.");
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function saveName(partner: Partner, name: string) {
    const next = name.trim();
    if (next === partner.name) return;
    try {
      await partnersService.updatePartner(partner.id, { name: next });
      await refresh();
    } catch (error) {
      console.error("Error updating partner name:", error);
      toast.error(t("admin.ui.error") || "Failed to save.");
    }
  }

  async function move(partner: Partner, direction: -1 | 1) {
    const index = partners.findIndex((item) => item.id === partner.id);
    const swapWith = partners[index + direction];
    if (!swapWith) return;
    const next = [...partners];
    [next[index], next[index + direction]] = [swapWith, partner];
    setBusyId(partner.id);
    try {
      await partnersService.reorderPartners(next);
      await refresh();
    } catch (error) {
      console.error("Error reordering partners:", error);
      toast.error(t("admin.ui.error") || "Failed to save.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(partner: Partner) {
    const ok = await confirm({
      title: t("admin.partners.deleteTitle"),
      description: t("admin.partners.deleteDescription"),
      confirmLabel: t("admin.ui.delete"),
      cancelLabel: t("admin.cancel"),
      tone: "danger",
    });
    if (!ok) return;
    setBusyId(partner.id);
    try {
      await partnersService.deletePartner(partner);
      const remaining = partners.filter((item) => item.id !== partner.id);
      if (remaining.length > 0) {
        await partnersService.reorderPartners(remaining);
      }
      await refresh();
      toast.success(t("admin.ui.saved"));
    } catch (error) {
      console.error("Error deleting partner:", error);
      toast.error(t("admin.ui.error") || "Failed to save.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6 pt-4 sm:pt-6 pb-20">
      <Panel
        title={t("admin.interface.partners")}
        action={
          canCreate ? (
            <AdminButton type="button" disabled={isUploading} onClick={() => fileRef.current?.click()}>
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" strokeWidth={2.5} />}
              <span className="hidden sm:inline">
                {isUploading ? t("admin.partners.uploading") : t("admin.interface.addPartner")}
              </span>
            </AdminButton>
          ) : null
        }
      >
        <p className="mb-6 text-sm font-semibold text-[#8c8c8c]">{t("admin.interface.partnersHint")}</p>
        {canCreate ? (
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            multiple
            className="hidden"
            onChange={(event) => void onFilesSelected(event.target.files)}
          />
        ) : null}

        {isFetched && partners.length === 0 ? (
          canCreate ? (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex min-h-[220px] w-full flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-[#0a0f1d]/15 bg-[#F4F4F4] px-6 text-center"
            >
              <ImagePlus className="h-8 w-8 text-[#8c8c8c]" strokeWidth={1.5} />
              <p className="max-w-md text-sm font-semibold text-[#8c8c8c]">{t("admin.partners.empty")}</p>
            </button>
          ) : (
            <div className="flex min-h-[220px] w-full flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-[#0a0f1d]/15 bg-[#F4F4F4] px-6 text-center">
              <p className="max-w-md text-sm font-semibold text-[#8c8c8c]">{t("admin.partners.empty")}</p>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {partners.map((partner, index) => {
              const isBusy = busyId === partner.id || isUploading;
              return (
                <div
                  key={partner.id}
                  className="group relative flex flex-col overflow-hidden rounded-[24px] bg-[#F4F4F4] p-4"
                >
                  <div className="absolute end-3 top-3 z-10 flex items-center gap-1">
                    {canSort ? (
                      <>
                        <button
                          type="button"
                          disabled={isBusy || index === 0}
                          onClick={() => void move(partner, -1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0a0f1d] shadow-sm transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label={t("admin.partners.moveUp")}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={isBusy || index === partners.length - 1}
                          onClick={() => void move(partner, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0a0f1d] shadow-sm transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label={t("admin.partners.moveDown")}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </>
                    ) : null}
                    {canDelete ? (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => void remove(partner)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-500 shadow-sm transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={t("admin.ui.delete")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>

                  <div className="flex aspect-square items-center justify-center rounded-[18px] bg-white p-5">
                    <img
                      src={partner.logo}
                      alt={partner.name || t("admin.interface.partners")}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[#0a0f1d]">
                      {index + 1}
                    </span>
                    <input
                      defaultValue={partner.name}
                      key={`${partner.id}-${partner.name}`}
                      placeholder={t("admin.partners.namePlaceholder")}
                      disabled={!canEdit}
                      onBlur={(event) => canEdit && void saveName(partner, event.target.value)}
                      className={cn(fieldClass, "h-10 px-4", !canEdit && "opacity-70")}
                    />
                  </div>
                </div>
              );
            })}

            {canCreate ? (
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileRef.current?.click()}
                className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-[24px] border border-dashed border-[#0a0f1d]/20 bg-[#F4F4F4] text-[#8c8c8c] transition-colors hover:border-[#0a0f1d]/40 hover:bg-[#EAEAEA] hover:text-[#0a0f1d] disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Plus className="h-6 w-6" />}
                <span className="text-xs font-bold">{t("admin.interface.addPartner")}</span>
              </button>
            ) : null}
          </div>
        )}
      </Panel>
    </div>
  );
}
