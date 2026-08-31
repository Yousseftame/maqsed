"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronsLeft, LogOut } from "lucide-react";
import { DEVELOPER_NAV, type DeveloperNavLink } from "@/features/developer/data/nav";
import { useAdminSignOut } from "@/features/admin/hooks/useAdminSignOut";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

const SIDEBAR_EASE = "duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

export function DeveloperSidebar({
  mobileOpen,
  collapsed,
  onMobileClose,
  onToggle,
}: {
  mobileOpen: boolean;
  collapsed: boolean;
  onMobileClose: () => void;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const handleSignOut = useAdminSignOut();
  const { locale, t } = useLocale();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-[#0a0f1d]/30 transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onMobileClose}
        aria-hidden
      />

      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-50 flex h-screen shrink-0 flex-col overflow-x-hidden overflow-y-auto no-scrollbar bg-[#F4F4F4] py-6 transition-[width,transform,padding] lg:sticky lg:top-0",
          SIDEBAR_EASE,
          collapsed ? "lg:w-[76px] lg:px-3" : "lg:w-[340px] lg:px-5",
          "w-[340px] px-5",
          mobileOpen
            ? "max-lg:translate-x-0"
            : "max-lg:-translate-x-full max-lg:rtl:translate-x-full"
        )}
      >
        <div
          className={cn(
            "mb-4 flex items-center",
            collapsed ? "lg:h-11 lg:justify-center" : "h-12 px-3"
          )}
        >
          <Link
            href="/admin/dashboard"
            onClick={onMobileClose}
            className={cn(
              "relative flex shrink-0 items-center justify-center overflow-hidden transition-[width,height]",
              SIDEBAR_EASE,
              collapsed ? "lg:h-11 lg:w-11" : "h-11 w-[120px]"
            )}
            aria-label={t("admin.nav.overview")}
          >
            <Image
              src="/logoadminpanel.png"
              alt="Maqsed"
              width={120}
              height={44}
              priority
              className={cn(
                "h-11 w-[120px] max-w-none object-contain object-left transition-opacity rtl:object-right",
                SIDEBAR_EASE,
                collapsed ? "lg:opacity-0" : "opacity-100"
              )}
            />
            <Image
              src="/icon-removebg-preview.png"
              alt=""
              width={28}
              height={28}
              className={cn(
                "absolute h-7 w-7 object-contain opacity-0 transition-opacity",
                SIDEBAR_EASE,
                collapsed && "lg:opacity-100"
              )}
            />
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {DEVELOPER_NAV.map((entry, index) => {
            if (entry.type === "link") {
              return (
                <NavLink
                  key={entry.href}
                  item={entry}
                  label={t(entry.labelKey)}
                  collapsed={collapsed}
                  active={isNavActive(pathname, entry.href)}
                  onClick={onMobileClose}
                />
              );
            }
            return null;
          })}
        </nav>

        <div className="mt-4 flex flex-col gap-1">
          <button
            type="button"
            onClick={onToggle}
            title={collapsed ? t("admin.expand") : t("admin.collapse")}
            aria-label={collapsed ? t("admin.expand") : t("admin.collapse")}
            className={cn(navItemClass({ collapsed }), "hidden lg:flex")}
          >
            <ChevronsLeft
              className={cn(
                "h-[18px] w-[18px] shrink-0 transition-transform rtl:rotate-180",
                SIDEBAR_EASE,
                collapsed && "lg:rotate-180 rtl:lg:rotate-0"
              )}
              strokeWidth={1.8}
            />
            <SidebarLabel collapsed={collapsed}>
              {collapsed ? t("admin.expand") : t("admin.collapse")}
            </SidebarLabel>
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            title={t("admin.signOut")}
            className={navItemClass({ collapsed })}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0 rtl:-scale-x-100" strokeWidth={1.8} />
            <SidebarLabel collapsed={collapsed}>{t("admin.signOut")}</SidebarLabel>
          </button>
        </div>
      </aside>
    </>
  );
}

function NavLink({
  item,
  label,
  collapsed,
  active,
  onClick,
}: {
  item: DeveloperNavLink;
  label: string;
  collapsed: boolean;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  const danger = item.tone === "danger";

  return (
    <Link
      href={item.href}
      title={label}
      onClick={onClick}
      className={navItemClass({ collapsed, active, danger })}
    >
      <span className="relative shrink-0">
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
        {item.badge ? (
          <span
            className={cn(
              "absolute -end-1.5 -top-1.5 h-4 min-w-4 items-center justify-center rounded-full bg-[#6D5BD0] px-1 text-[9px] font-bold text-white",
              collapsed ? "hidden lg:inline-flex" : "hidden"
            )}
          >
            {item.badge}
          </span>
        ) : null}
      </span>
      <SidebarLabel collapsed={collapsed}>
        <span className="flex items-center gap-2">
          <span>{label}</span>
          {item.badge ? (
            <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#6D5BD0] px-1.5 text-[10px] font-bold text-white">
              {item.badge}
            </span>
          ) : null}
        </span>
      </SidebarLabel>
    </Link>
  );
}

function navItemClass({
  collapsed,
  active = false,
  danger = false,
}: {
  collapsed: boolean;
  active?: boolean;
  danger?: boolean;
}) {
  return cn(
    "flex items-center text-[15px] font-medium transition-[width,height,background-color,color,box-shadow,gap,border-radius]",
    SIDEBAR_EASE,
    collapsed
      ? "gap-3 px-3 py-3 lg:mx-auto lg:h-11 lg:w-11 lg:justify-center lg:gap-0 lg:rounded-2xl lg:px-0 lg:py-0"
      : "w-full gap-3 rounded-2xl px-3 py-3",
    danger
      ? "text-[#FF6A55] hover:bg-[#FFE8E4] hover:text-[#FF6A55]"
      : active
        ? "bg-white font-semibold text-[#0a0f1d] shadow-[0_8px_24px_rgba(10,15,29,0.06)]"
        : "text-[#6B7280] hover:bg-white/70 hover:text-[#0a0f1d]"
  );
}

function isNavActive(pathname: string, href: string) {
  if (href === "/admin/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarLabel({
  collapsed,
  children,
}: {
  collapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "grid min-w-0 transition-[grid-template-columns,opacity]",
        SIDEBAR_EASE,
        collapsed ? "lg:grid-cols-[0fr] lg:opacity-0" : "grid-cols-[1fr] opacity-100"
      )}
    >
      <span className="overflow-hidden whitespace-nowrap">{children}</span>
    </span>
  );
}
