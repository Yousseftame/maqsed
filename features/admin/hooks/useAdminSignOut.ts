"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/AuthProvider";
import { useConfirm } from "@/features/admin/components/ConfirmModal";
import { useLocale } from "@/components/providers/LocaleProvider";

export function useAdminSignOut() {
  const router = useRouter();
  const { signOut } = useAuth();
  const confirm = useConfirm();
  const { t } = useLocale();

  return async () => {
    const ok = await confirm({
      title: t("admin.signOutTitle"),
      description: t("admin.signOutDescription"),
      confirmLabel: t("admin.signOut"),
      cancelLabel: t("admin.stay"),
      tone: "danger",
    });

    if (!ok) return;
    await signOut();
    router.replace("/login");
  };
}
