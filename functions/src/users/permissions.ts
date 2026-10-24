export const PERMISSION_MODULES = [
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
] as const;

export const PERMISSION_ACTIONS = ["create", "read", "edit", "delete", "sort"] as const;

export type PermissionModule = (typeof PERMISSION_MODULES)[number];
export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];
export type ModulePermission = Record<PermissionAction, boolean>;
export type AdminPermissions = Record<PermissionModule, ModulePermission>;

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

function emptyModulePermission(): ModulePermission {
  return { create: false, read: false, edit: false, delete: false, sort: false };
}

export function emptyPermissions(): AdminPermissions {
  return {
    users: emptyModulePermission(),
    cities: emptyModulePermission(),
    projects: emptyModulePermission(),
    units: emptyModulePermission(),
    offers: emptyModulePermission(),
    customers: emptyModulePermission(),
    blog: emptyModulePermission(),
    faq: emptyModulePermission(),
    additionalInfo: emptyModulePermission(),
    menus: emptyModulePermission(),
    partners: emptyModulePermission(),
    interface: emptyModulePermission(),
    about: emptyModulePermission(),
    company: emptyModulePermission(),
    maintenance: emptyModulePermission(),
    payments: emptyModulePermission(),
  };
}

export function sanitizePermissions(input: unknown): AdminPermissions {
  const source = input && typeof input === "object" ? (input as Record<string, Record<string, unknown>>) : {};
  const next = emptyPermissions();

  for (const module of PERMISSION_MODULES) {
    const current = source[module];
    for (const action of MODULE_AVAILABLE_ACTIONS[module]) {
      next[module][action] = Boolean(current?.[action]);
    }
    const hasWrite =
      next[module].create || next[module].edit || next[module].delete || next[module].sort;
    if (hasWrite && MODULE_AVAILABLE_ACTIONS[module].includes("read")) {
      next[module].read = true;
    }
  }

  return next;
}
