"use client";

import { usePathname } from "next/navigation";
import { getAdminPageTitleKey } from "@/features/admin/data/nav";
import { useLocale } from "@/components/providers/LocaleProvider";

export function AdminPagePlaceholder() {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <section className="rounded-[24px] bg-white p-8">
      <h2 className="text-xl font-bold tracking-tight text-[#0a0f1d]">
        {t(getAdminPageTitleKey(pathname))}
      </h2>
      <p className="mt-2 text-sm font-medium text-[#8c8c8c]">{t("admin.comingSoon")}</p>
    </section>
  );
}
