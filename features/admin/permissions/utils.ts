import type {
  AdminPermissions,
  ModulePermission,
  PermissionAction,
  PermissionModule,
  UserData,
} from "@/types/user";
import {
  ADMIN_PATH_PERMISSIONS,
  MODULE_AVAILABLE_ACTIONS,
  MODULE_HREF,
  PERMISSION_ACTIONS,
  PERMISSION_MODULES,
} from "./constants";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

export function emptyModulePermission(): ModulePermission {
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

export function isActionAvailable(module: PermissionModule, action: PermissionAction) {
  return MODULE_AVAILABLE_ACTIONS[module].includes(action);
}

export function applyReadConsistency(permissions: AdminPermissions): AdminPermissions {
  const next = emptyPermissions();

  for (const module of PERMISSION_MODULES) {
    const current = permissions[module] ?? emptyModulePermission();
    const available = MODULE_AVAILABLE_ACTIONS[module];
    const granted = { ...emptyModulePermission() };

    for (const action of available) {
      granted[action] = Boolean(current[action]);
    }

    const hasWrite = granted.create || granted.edit || granted.delete || granted.sort;
    if (hasWrite && available.includes("read")) {
      granted.read = true;
    }

    next[module] = granted;
  }

  return next;
}

export function sanitizePermissions(input: unknown): AdminPermissions {
  const source =
    input && typeof input === "object" ? (input as Partial<AdminPermissions>) : {};
  const next = emptyPermissions();

  for (const module of PERMISSION_MODULES) {
    const current = source[module];
    for (const action of MODULE_AVAILABLE_ACTIONS[module]) {
      next[module][action] = Boolean(current?.[action]);
    }
  }

  return applyReadConsistency(next);
}

export async function persistAdminPermissions(uid: string, permissions: AdminPermissions) {
  await updateDoc(doc(db, "users", uid), {
    permissions: sanitizePermissions(permissions),
  });
}

export function fullPermissions(): AdminPermissions {
  const next = emptyPermissions();
  for (const module of PERMISSION_MODULES) {
    for (const action of MODULE_AVAILABLE_ACTIONS[module]) {
      next[module][action] = true;
    }
  }
  return next;
}

export function getEffectivePermissions(user: UserData | null | undefined): AdminPermissions {
  if (!user) return emptyPermissions();
  if (user.role === "superAdmin") return fullPermissions();
  if (user.role !== "admin") return emptyPermissions();
  if (!user.permissions) return fullPermissions();
  return sanitizePermissions(user.permissions);
}

export function getEditorPermissions(user: UserData | null | undefined): AdminPermissions {
  if (!user || user.role !== "admin") return emptyPermissions();
  if (!user.permissions) return fullPermissions();
  return sanitizePermissions(user.permissions);
}

export function setModuleAction(
  permissions: AdminPermissions,
  module: PermissionModule,
  action: PermissionAction,
  enabled: boolean
): AdminPermissions {
  if (!isActionAvailable(module, action)) return permissions;

  const next: AdminPermissions = {
    ...permissions,
    [module]: {
      ...permissions[module],
      [action]: enabled,
    },
  };

  if (!enabled && action === "read") {
    for (const other of PERMISSION_ACTIONS) {
      if (other !== "read" && isActionAvailable(module, other)) {
        next[module][other] = false;
      }
    }
  }

  return applyReadConsistency(next);
}

export function setModuleAll(
  permissions: AdminPermissions,
  module: PermissionModule,
  enabled: boolean
): AdminPermissions {
  const next: AdminPermissions = {
    ...permissions,
    [module]: { ...emptyModulePermission() },
  };

  if (enabled) {
    for (const action of MODULE_AVAILABLE_ACTIONS[module]) {
      next[module][action] = true;
    }
  }

  return next;
}

export function setAllPermissions(enabled: boolean): AdminPermissions {
  return enabled ? fullPermissions() : emptyPermissions();
}

export function getModuleGrantedCount(permissions: AdminPermissions, module: PermissionModule) {
  return MODULE_AVAILABLE_ACTIONS[module].filter((action) => permissions[module]?.[action]).length;
}

export function isModuleFullyGranted(permissions: AdminPermissions, module: PermissionModule) {
  const available = MODULE_AVAILABLE_ACTIONS[module];
  return available.length > 0 && available.every((action) => permissions[module]?.[action]);
}

export function getPermissionsSummary(
  permissions: AdminPermissions
): "none" | "partial" | "full" {
  let granted = 0;
  let total = 0;

  for (const module of PERMISSION_MODULES) {
    const available = MODULE_AVAILABLE_ACTIONS[module];
    total += available.length;
    granted += available.filter((action) => permissions[module]?.[action]).length;
  }

  if (granted === 0) return "none";
  if (granted === total) return "full";
  return "partial";
}

export function getModuleFromHref(href: string): PermissionModule | null {
  const match = (Object.keys(MODULE_HREF) as PermissionModule[]).find(
    (module) => MODULE_HREF[module] === href
  );
  return match ?? null;
}

export function getRequiredPathPermission(pathname: string) {
  // /admin/blog/:id (edit existing post) — not /admin/blog or /admin/blog/new
  if (/^\/admin\/blog\/(?!new\/?$)[^/]+\/?$/.test(pathname)) {
    return { prefix: pathname, module: "blog" as const, action: "edit" as const };
  }

  return (
    ADMIN_PATH_PERMISSIONS.find(
      (entry) => pathname === entry.prefix || pathname.startsWith(`${entry.prefix}/`)
    ) ?? null
  );
}

export function filterAdminNav<T extends { type: string; href?: string; labelKey?: string }>(
  entries: T[],
  isLinkVisible: (href: string) => boolean
): T[] {
  const withLinks = entries.filter((entry) => entry.type !== "link" || (entry.href ? isLinkVisible(entry.href) : false));
  const result: T[] = [];

  for (let i = 0; i < withLinks.length; i++) {
    const entry = withLinks[i];

    if (entry.type === "divider") {
      if (result.length === 0 || result[result.length - 1].type === "divider") continue;
      result.push(entry);
      continue;
    }

    if (entry.type === "heading") {
      let hasFollowingLink = false;
      for (let j = i + 1; j < withLinks.length; j++) {
        if (withLinks[j].type === "heading") break;
        if (withLinks[j].type === "link") {
          hasFollowingLink = true;
          break;
        }
      }
      if (!hasFollowingLink) continue;
      result.push(entry);
      continue;
    }

    result.push(entry);
  }

  while (result.length && result[result.length - 1].type === "divider") {
    result.pop();
  }

  return result;
}
