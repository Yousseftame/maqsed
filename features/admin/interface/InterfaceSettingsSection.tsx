"use client";

import { useRef, useState } from "react";
import { CloudUpload, ImagePlus, Plus, Trash2 } from "lucide-react";
import { Panel } from "@/features/admin/ui/Panel";
import { Field, textareaClass } from "@/features/admin/ui/Field";
import { AdminButton, fieldClass } from "@/features/admin/ui/AdminButton";
import { useLocale } from "@/components/providers/LocaleProvider";
import toast from "react-hot-toast";

const MOCK_PARTNERS = [
  { id: "1", name: "MEDHAL" },
  { id: "2", name: "TAMEER" },
  { id: "3", name: "Rakeez" },
  { id: "4", name: "KATHIB" },
  { id: "5", name: "KHAWALID" },
  { id: "6", name: "ISHRAQA" },
  { id: "7", name: "ALBAB" },
];

export function InterfaceSettingsSection() {
  const { t } = useLocale();
  const fileRef = useRef<HTMLInputElement>(null);
  const [bgImage, setBgImage] = useState<string | null>(null);

  function onImageChange(file: File | undefined) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBgImage(url);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    toast.success(t("admin.ui.saved"));
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6 pt-4 sm:pt-6 pb-20">
      
      {/* Hero Settings Panel */}
      <Panel>
        <div className="flex flex-col gap-6">
          <Field label={t("admin.interface.heroTitle")}>
            <input
              type="text"
              placeholder={t("admin.interface.heroTitlePlaceholder")}
              defaultValue={t("admin.interface.heroTitlePlaceholder")}
              className={fieldClass}
            />
          </Field>

          <Field label={t("admin.interface.heroSubtitle")}>
            <textarea
              rows={3}
              placeholder={t("admin.interface.heroSubtitlePlaceholder")}
              defaultValue={t("admin.interface.heroSubtitlePlaceholder")}
              className={textareaClass}
            />
          </Field>

          <div className="flex flex-col gap-2 mt-2">
            <span className="text-sm font-semibold text-[#8c8c8c]">
              {t("admin.interface.bgImage")}
            </span>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="group relative flex h-[240px] w-full items-center justify-center overflow-hidden rounded-[24px] bg-[#F4F4F4]"
            >
              {bgImage ? (
                <img
                  src={bgImage}
                  alt="Background preview"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 transition-opacity group-hover:opacity-30"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1682687982501-1e58f813f228?q=80&w=2070&auto=format&fit=crop')" }}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center gap-3 text-center p-6 transition-transform group-hover:scale-105">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm text-[#0a0f1d]">
                  <CloudUpload className="h-6 w-6" strokeWidth={2.2} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-[#0a0f1d] drop-shadow-sm bg-white/80 px-3 py-1 rounded-full">
                    {t("admin.interface.bgImageUpload")}
                  </span>
                  <span className="text-xs font-bold text-[#0a0f1d] drop-shadow-sm bg-white/80 px-3 py-1 rounded-full mt-1">
                    {t("admin.interface.bgImageHint")}
                  </span>
                </div>
              </div>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onImageChange(e.target.files?.[0])}
            />
          </div>
        </div>
      </Panel>

      {/* Partners Section Panel */}
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
              {/* Dummy Logo Placeholder */}
              <div className="flex flex-col items-center gap-3 text-[#8c8c8c] group-hover:text-[#0a0f1d] transition-colors">
                <ImagePlus className="h-8 w-8 opacity-50" strokeWidth={1.5} />
                <span className="text-xs font-bold uppercase tracking-wider">{partner.name}</span>
              </div>
              
              {/* Delete Overlay */}
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

      <div className="flex justify-end">
        <AdminButton type="submit" className="w-full sm:w-auto px-10">
          {t("admin.ui.save")}
        </AdminButton>
      </div>

    </form>
  );
}
