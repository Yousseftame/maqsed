"use client";

import { useCallback, useMemo } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import type { PermissionAction, PermissionModule, UserData } from "@/types/user";
import {
  getEffectivePermissions,
  getModuleFromHref,
  getRequiredPathPermission,
  isActionAvailable,
} from "./utils";

export function usePermissions() {
  const { userData } = useAuth();

  const permissions = useMemo(() => getEffectivePermissions(userData), [userData]);
  const isSuperAdmin = userData?.role === "superAdmin";
  const isAdmin = userData?.role === "admin";

  const can = useCallback(
    (module: PermissionModule, action: PermissionAction) => {
      if (!userData) return false;
      if (userData.role === "superAdmin") return true;
      if (userData.role !== "admin") return false;
      if (!isActionAvailable(module, action)) return false;
      return Boolean(permissions[module]?.[action]);
    },
    [permissions, userData]
  );

  const canAccessPath = useCallback(
    (pathname: string) => {
      const required = getRequiredPathPermission(pathname);
      if (!required) return true;
      return can(required.module, required.action);
    },
    [can]
  );

  const isNavLinkVisible = useCallback(
    (href: string) => {
      const module = getModuleFromHref(href);
      if (!module) return true;
      return can(module, "read");
    },
    [can]
  );

  const canManageAccount = useCallback(
    (target: UserData) => {
      if (!userData) return false;
      if (userData.role === "superAdmin") return true;
      return userData.role === "admin" && target.role === "developer";
    },
    [userData]
  );

  return {
    can,
    canAccessPath,
    canManageAccount,
    isAdmin,
    isNavLinkVisible,
    isSuperAdmin,
    permissions,
  };
}
