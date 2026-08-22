import {
  Briefcase,
  Building2,
  ClipboardList,
  FileText,
  Folder,
  LayoutGrid,
  Lock,
  Map,
  Settings,
  AppWindow,
  TriangleAlert,
  Users,
  Terminal,
  type LucideIcon,
} from "lucide-react";

export type AdminNavLink = {
  type: "link";
  labelKey: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  tone?: "default" | "danger";
};

export type AdminNavDivider = {
  type: "divider";
};

export type AdminNavHeading = {
  type: "heading";
  labelKey: string;
};

export type AdminNavEntry = AdminNavLink | AdminNavDivider | AdminNavHeading;

export const ADMIN_NAV: AdminNavEntry[] = [
  { type: "link", labelKey: "admin.nav.overview", href: "/admin/dashboard", icon: LayoutGrid },
  { type: "link", labelKey: "admin.nav.cities", href: "/admin/cities", icon: Map },
  { type: "link", labelKey: "admin.nav.projects", href: "/admin/projects", icon: Folder },
  { type: "link", labelKey: "admin.nav.units", href: "/admin/units", icon: Building2 },
  { type: "divider" },
  {
    type: "link",
    labelKey: "admin.nav.customers",
    href: "/admin/customers",
    icon: Users,
    badge: 10,
  },
  { type: "divider" },
  { type: "heading", labelKey: "admin.nav.settingsHeading" },
  { type: "link", labelKey: "admin.nav.company", href: "/admin/company", icon: Briefcase },
  { type: "link", labelKey: "admin.nav.menu", href: "/admin/menu-settings", icon: Settings },
  { type: "link", labelKey: "admin.nav.interface", href: "/admin/interface", icon: AppWindow },
  { type: "link", labelKey: "admin.nav.blog", href: "/admin/blog", icon: FileText },
  { type: "link", labelKey: "admin.nav.additional", href: "/admin/additional-info", icon: ClipboardList },
  {
    type: "link",
    labelKey: "admin.nav.maintenance",
    href: "/admin/maintenance",
    icon: TriangleAlert,
    tone: "danger",
  },
  { type: "link", labelKey: "admin.nav.developers", href: "/admin/developers", icon: Terminal },
];

export function getAdminNavLinks() {
  return ADMIN_NAV.filter((entry): entry is AdminNavLink => entry.type === "link");
}

export function getAdminPageTitleKey(pathname: string) {
  const match = getAdminNavLinks().find((item) =>
    item.href === "/admin/dashboard"
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  if (match) return match.labelKey;
  if (pathname.startsWith("/admin/users")) return "admin.nav.users";
  return "admin.nav.overview";
}
