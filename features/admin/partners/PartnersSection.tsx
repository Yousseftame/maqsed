"use client";

import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { Panel } from "@/features/admin/ui/Panel";
import { AdminButton } from "@/features/admin/ui/AdminButton";
import { useLocale } from "@/components/providers/LocaleProvider";

const MOCK_PARTNERS = [
  { id: "1", name: "MEDHAL" },
  { id: "2", name: "TAMEER" },
  { id: "3", name: "Rakeez" },
  { id: "4", name: "KATHIB" },
  { id: "5", name: "KHAWALID" },
  { id: "6", name: "ISHRAQA" },
  { id: "7", name: "ALBAB" },
];

export function PartnersSection() {
  const { t } = useLocale();

  return (
    <div className="flex flex-col gap-6 pt-4 sm:pt-6 pb-20">
      <Panel
        title={t("admin.interface.partners")}
        action={
          <AdminButton type="button">
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">{t("admin.interface.addPartner")}</span>
          </AdminButton>
        }
      >
        <p className="text-sm font-semibold text-[#8c8c8c] mb-6">
          {t("admin.interface.partnersHint")}
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {MOCK_PARTNERS.map((partner) => (
            <div
              key={partner.id}
              className="group relative flex aspect-square flex-col items-center justify-center rounded-[24px] bg-[#F4F4F4] p-4 transition-all hover:bg-gray-200"
            >
              <div className="flex flex-col items-center gap-3 text-[#8c8c8c] group-hover:text-[#0a0f1d] transition-colors">
                <ImagePlus className="h-8 w-8 opacity-50" strokeWidth={1.5} />
                <span className="text-xs font-bold uppercase tracking-wider">{partner.name}</span>
              </div>

              <button
                type="button"
                className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#8c8c8c] opacity-0 shadow-sm transition-all hover:text-red-500 group-hover:opacity-100"
                aria-label="Delete partner"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
