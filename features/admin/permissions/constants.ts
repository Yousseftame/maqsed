import {
  AppWindow,
  Briefcase,
  Building2,
  CircleHelp,
  ClipboardList,
  DollarSign,
  FileSignature,
  FileText,
  Folder,
  Handshake,
  Headphones,
  Info,
  Map,
  Settings,
  TriangleAlert,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { PermissionAction, PermissionModule } from "@/types/user";

export const PERMISSION_MODULES: PermissionModule[] = [
  "users",
  "cities",
  "projects",
  "units",
  "offers",
  "customers",
  "blog",
  "faq",
  "additionalInfo",
  "menus",
  "partners",
  "interface",
  "about",
  "company",
  "maintenance",
  "payments",
];

export const PERMISSION_ACTIONS: PermissionAction[] = [
  "create",
  "read",
  "edit",
  "delete",
  "sort",
];

/**
 * Available actions per module mirror real UI capabilities:
 * - dash (unavailable) when the page has no such control
 * - sort = reorder up/down where that exists
 * - settings-only pages = read + edit
 * - payments = read-only ledger
 */
export const MODULE_AVAILABLE_ACTIONS: Record<PermissionModule, PermissionAction[]> = {
  users: ["create", "read", "edit", "delete"],
  cities: ["create", "read", "delete"],
  projects: ["create", "read", "edit", "delete"],
  units: ["create", "read", "edit", "delete"],
  offers: ["create", "read", "edit", "delete"],
  customers: ["read", "edit", "delete"],
  blog: ["create", "read", "edit", "delete", "sort"],
  faq: ["create", "read", "edit", "delete"],
  additionalInfo: ["create", "read", "edit", "delete", "sort"],
  menus: ["create", "read", "delete"],
  partners: ["create", "read", "edit", "delete", "sort"],
  interface: ["read", "edit"],
  about: ["read", "edit"],
  company: ["read", "edit"],
  maintenance: ["read", "edit"],
  payments: ["read"],
};

export const MODULE_ICONS: Record<PermissionModule, LucideIcon> = {
  users: Users,
  cities: Map,
  projects: Folder,
  units: Building2,
  offers: FileSignature,
  customers: Headphones,
  blog: FileText,
  faq: CircleHelp,
  additionalInfo: ClipboardList,
  menus: Settings,
  partners: Handshake,
  interface: AppWindow,
  about: Info,
  company: Briefcase,
  maintenance: TriangleAlert,
  payments: DollarSign,
};

export const MODULE_NAV_KEYS: Record<PermissionModule, string> = {
  users: "admin.nav.users",
  cities: "admin.nav.cities",
  projects: "admin.nav.projects",
  units: "admin.nav.units",
  offers: "admin.nav.offers",
  customers: "admin.nav.customers",
  blog: "admin.nav.blog",
  faq: "admin.nav.faq",
  additionalInfo: "admin.nav.additional",
  menus: "admin.nav.menu",
  partners: "admin.nav.partners",
  interface: "admin.nav.interface",
  about: "admin.nav.about",
  company: "admin.nav.company",
  maintenance: "admin.nav.maintenance",
  payments: "admin.nav.payments",
};

export const MODULE_HREF: Record<PermissionModule, string> = {
  users: "/admin/developers",
  cities: "/admin/cities",
  projects: "/admin/projects",
  units: "/admin/units",
  offers: "/admin/offers",
  customers: "/admin/customers",
  blog: "/admin/blog",
  faq: "/admin/faq",
  additionalInfo: "/admin/additional-info",
  menus: "/admin/menu-settings",
  partners: "/admin/partners",
  interface: "/admin/interface",
  about: "/admin/about",
  company: "/admin/company",
  maintenance: "/admin/maintenance",
  payments: "/admin/payments",
};

export const ACTION_LABEL: Record<PermissionAction, string> = {
  create: "C",
  read: "R",
  edit: "E",
  delete: "D",
  sort: "S",
};

/** More specific prefixes must come first. */
export const ADMIN_PATH_PERMISSIONS: {
  prefix: string;
  module: PermissionModule;
  action: PermissionAction;
}[] = [
  { prefix: "/admin/offers/create", module: "offers", action: "create" },
  { prefix: "/admin/blog/new", module: "blog", action: "create" },
  { prefix: "/admin/offers", module: "offers", action: "read" },
  { prefix: "/admin/payments", module: "payments", action: "read" },
  { prefix: "/admin/developers", module: "users", action: "read" },
  { prefix: "/admin/cities", module: "cities", action: "read" },
  { prefix: "/admin/projects", module: "projects", action: "read" },
  { prefix: "/admin/units", module: "units", action: "read" },
  { prefix: "/admin/customers", module: "customers", action: "read" },
  { prefix: "/admin/interest-requests", module: "customers", action: "read" },
  { prefix: "/admin/blog", module: "blog", action: "read" },
  { prefix: "/admin/faq", module: "faq", action: "read" },
  { prefix: "/admin/additional-info", module: "additionalInfo", action: "read" },
  { prefix: "/admin/menu-settings", module: "menus", action: "read" },
  { prefix: "/admin/partners", module: "partners", action: "read" },
  { prefix: "/admin/interface", module: "interface", action: "read" },
  { prefix: "/admin/about", module: "about", action: "read" },
  { prefix: "/admin/company", module: "company", action: "read" },
  { prefix: "/admin/maintenance", module: "maintenance", action: "read" },
];
