export const PERMISSION_MODULES = ["cities", "projects", "units", "offers", "customers"] as const;
export const PERMISSION_ACTIONS = ["create", "read", "edit", "delete"] as const;

export type PermissionModule = (typeof PERMISSION_MODULES)[number];
export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];
export type ModulePermission = Record<PermissionAction, boolean>;
export type AdminPermissions = Record<PermissionModule, ModulePermission>;

export const MODULE_AVAILABLE_ACTIONS: Record<PermissionModule, PermissionAction[]> = {
  cities: ["create", "read", "delete"],
  projects: ["create", "read", "edit", "delete"],
  units: ["create", "read", "edit", "delete"],
  offers: ["create", "read", "edit"],
  customers: ["read", "edit", "delete"],
};

function emptyModulePermission(): ModulePermission {
  return { create: false, read: false, edit: false, delete: false };
}

export function emptyPermissions(): AdminPermissions {
  return {
    cities: emptyModulePermission(),
    projects: emptyModulePermission(),
    units: emptyModulePermission(),
    offers: emptyModulePermission(),
    customers: emptyModulePermission(),
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
    if ((next[module].create || next[module].edit || next[module].delete) &&
        MODULE_AVAILABLE_ACTIONS[module].includes("read")) {
      next[module].read = true;
    }
  }

  return next;
}
