export const SESSION_COOKIE = "maqsed_session";

import type { UserRole } from "@/types/user";

export function isDeveloperPanelRole(role?: UserRole | null): boolean {
  return role === "developer" || role === "employee";
}

export function getDefaultRedirectPath(role?: UserRole | null): string {
  if (isDeveloperPanelRole(role)) return "/developer/dashboard";
  // Default to admin for now, or you could do "/login" if no role
  return "/admin/dashboard";
}

export const PROTECTED_PREFIXES = ["/admin", "/developer"] as const;
export const AUTH_PATHS = ["/login", "/register", "/forgot-password"] as const;

export function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isAuthPath(pathname: string) {
  return AUTH_PATHS.some((path) => pathname === path);
}

export const MAINTENANCE_PATH = "/maintenance";
export const MAINTENANCE_COOKIE = "maqsed_maintenance";

export function isMaintenancePath(pathname: string) {
  return pathname === MAINTENANCE_PATH || pathname.startsWith(`${MAINTENANCE_PATH}/`);
}

export function isMaintenanceExemptPath(pathname: string) {
  if (isMaintenancePath(pathname)) return true;
  if (isProtectedPath(pathname)) return true;
  if (pathname === "/login" || pathname === "/forgot-password") return true;
  if (pathname.startsWith("/api/")) return true;
  return false;
}

export function writeMaintenanceCookie(enabled: boolean) {
  if (typeof document === "undefined") return;
  document.cookie = `${MAINTENANCE_COOKIE}=${enabled ? "1" : "0"}; path=/; max-age=86400; samesite=lax`;
}

export function readMaintenanceCookie(): boolean {
  if (typeof document === "undefined") return false;
  return new RegExp(`(?:^|; )${MAINTENANCE_COOKIE}=1(?:;|$)`).test(document.cookie);
}

export function getSafeNextPath(next: string | null | undefined, role?: UserRole | null) {
  if (
    !next ||
    !next.startsWith("/") ||
    next.startsWith("//") ||
    isAuthPath(next)
  ) {
    return getDefaultRedirectPath(role);
  }

  return next;
}
