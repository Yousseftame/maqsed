import {
  LayoutGrid,
  Folder,
  Building2,
  Users,
  FileText,
  ReceiptText,
  type LucideIcon,
} from "lucide-react";

export type DeveloperNavLink = {
  type: "link";
  labelKey: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  tone?: "danger";
};

export type DeveloperNavEntry = DeveloperNavLink;

export const DEVELOPER_NAV: DeveloperNavEntry[] = [
  { type: "link", labelKey: "developer.nav.dashboard", href: "/developer/dashboard", icon: LayoutGrid },
  { type: "link", labelKey: "developer.nav.users", href: "/developer/users", icon: Users },
  { type: "link", labelKey: "developer.nav.projects", href: "/developer/projects", icon: Folder },
  { type: "link", labelKey: "developer.nav.units", href: "/developer/units", icon: Building2 },
  { type: "link", labelKey: "developer.nav.files", href: "/developer/files", icon: FileText },
  { type: "link", labelKey: "developer.nav.invoices", href: "/developer/invoices", icon: ReceiptText },
];

export function getDeveloperNavLinks() {
  return DEVELOPER_NAV.filter((entry): entry is DeveloperNavLink => entry.type === "link");
}

export function getDeveloperPageTitleKey(pathname: string) {
  const match = getDeveloperNavLinks().find((item) =>
    item.href === "/developer/dashboard"
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  if (match) return match.labelKey;
  return "developer.nav.dashboard";
}
