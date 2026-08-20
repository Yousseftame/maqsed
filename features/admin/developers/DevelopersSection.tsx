"use client";

import { Panel } from "@/features/admin/ui/Panel";
import { useLocale } from "@/components/providers/LocaleProvider";

export function DevelopersSection() {
  const { t } = useLocale();

  return (
    <div className="flex flex-col gap-6 pt-4 sm:pt-6 pb-20">
      <Panel title={t("admin.developers.title")}>
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <div className="flex max-w-md flex-col gap-3">
            <h3 className="text-xl font-bold text-[#0a0f1d]">
              {t("admin.developers.title")}
            </h3>
            <p className="text-sm font-medium text-[#8c8c8c]">
              {t("admin.developers.description")}
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
