"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, LogOut, Menu, PanelLeft, Search } from "lucide-react";
import { useAuth } from "@/features/auth/AuthProvider";
import { getAdminPageTitleKey } from "@/features/admin/data/nav";
import { useAdminSignOut } from "@/features/admin/hooks/useAdminSignOut";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { useLocale } from "@/components/providers/LocaleProvider";
import { UserAvatarDropdown } from "@/components/layout/UserAvatarDropdown";

export function AdminHeader({
  collapsed,
  onMobileOpen,
  onToggle,
}: {
  collapsed: boolean;
  onMobileOpen: () => void;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useLocale();
  const handleSignOut = useAdminSignOut();
  const initial = (user?.email?.[0] ?? "M").toUpperCase();
  const current = t(getAdminPageTitleKey(pathname));

  return (
    <header className="flex items-center gap-3 px-4 py-5 md:gap-4 md:px-8">
      <button
        type="button"
        onClick={onMobileOpen}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#0a0f1d] lg:hidden"
        aria-label={t("admin.openMenu")}
      >
        <Menu className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={onToggle}
        className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#0a0f1d] lg:flex"
        aria-label={collapsed ? t("admin.expand") : t("admin.collapse")}
      >
        <PanelLeft className="h-5 w-5 rtl:rotate-180" />
      </button>

      <div className="hidden sm:flex items-center gap-3">
        <h1 className="truncate text-lg font-bold tracking-tight text-[#0a0f1d]">
          {current}
        </h1>
        <span className="inline-flex items-center rounded-full bg-[#3E1854]/10 px-2.5 py-0.5 text-xs font-bold text-[#3E1854]">
          {t("admin.panelName")}
        </span>
      </div>

      <label className="relative ms-auto hidden min-w-0 flex-1 max-w-xl md:block">
        <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c]" />
        <input
          type="search"
          placeholder={t("admin.search")}
          className="h-12 w-full rounded-full bg-white pe-4 ps-11 text-sm font-medium text-[#0a0f1d] outline-none placeholder:text-[#8c8c8c]"
        />
      </label>

      <div className="ms-auto flex items-center gap-2 md:ms-0">
        <Link
          href="/"
          className="hidden h-12 items-center rounded-full bg-[#0a0f1d] px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#161c2d] sm:inline-flex"
        >
          {t("admin.website")}
        </Link>
        <Link
          href="/"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#0a0f1d] text-white sm:hidden"
          aria-label={t("admin.website")}
        >
          <Globe className="h-4 w-4" />
        </Link>

        <LanguageToggle />

        <button
          type="button"
          onClick={handleSignOut}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#FF6A55] transition-colors duration-200 hover:bg-[#FFE8E4]"
          aria-label={t("admin.signOut")}
          title={t("admin.signOut")}
        >
          <LogOut className="h-4 w-4 rtl:-scale-x-100" strokeWidth={1.8} />
        </button>

        <UserAvatarDropdown />
      </div>
    </header>
  );
}
