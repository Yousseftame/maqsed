export const SESSION_COOKIE = "maqsed_session";

import type { UserRole } from "@/types/user";

export function getDefaultRedirectPath(role?: UserRole | null): string {
  if (role === "developer") return "/developer/dashboard";
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
