import {
  Building2,
  FileSignature,
  Folder,
  Headphones,
  Map,
  type LucideIcon,
} from "lucide-react";
import type { PermissionAction, PermissionModule } from "@/types/user";

export const PERMISSION_MODULES: PermissionModule[] = [
  "cities",
  "projects",
  "units",
  "offers",
  "customers",
];

export const PERMISSION_ACTIONS: PermissionAction[] = [
  "create",
  "read",
  "edit",
  "delete",
];

export const MODULE_AVAILABLE_ACTIONS: Record<PermissionModule, PermissionAction[]> = {
  cities: ["create", "read", "delete"],
  projects: ["create", "read", "edit", "delete"],
  units: ["create", "read", "edit", "delete"],
  offers: ["create", "read", "edit", "delete"],
  customers: ["read", "edit", "delete"],
};

export const MODULE_ICONS: Record<PermissionModule, LucideIcon> = {
  cities: Map,
  projects: Folder,
  units: Building2,
  offers: FileSignature,
  customers: Headphones,
};

export const MODULE_NAV_KEYS: Record<PermissionModule, string> = {
  cities: "admin.nav.cities",
  projects: "admin.nav.projects",
  units: "admin.nav.units",
  offers: "admin.nav.offers",
  customers: "admin.nav.customers",
};

export const MODULE_HREF: Record<PermissionModule, string> = {
  cities: "/admin/cities",
  projects: "/admin/projects",
  units: "/admin/units",
  offers: "/admin/offers",
  customers: "/admin/customers",
};

export const ACTION_LABEL: Record<PermissionAction, string> = {
  create: "C",
  read: "R",
  edit: "E",
  delete: "D",
};

export const ADMIN_PATH_PERMISSIONS: {
  prefix: string;
  module: PermissionModule;
  action: PermissionAction;
}[] = [
  { prefix: "/admin/offers/create", module: "offers", action: "create" },
  { prefix: "/admin/payments", module: "offers", action: "read" },
  { prefix: "/admin/offers", module: "offers", action: "read" },
  { prefix: "/admin/cities", module: "cities", action: "read" },
  { prefix: "/admin/projects", module: "projects", action: "read" },
  { prefix: "/admin/units", module: "units", action: "read" },
  { prefix: "/admin/customers", module: "customers", action: "read" },
  { prefix: "/admin/interest-requests", module: "customers", action: "read" },
];
