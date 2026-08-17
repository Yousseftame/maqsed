export const SESSION_COOKIE = "maqsed_session";
export const AFTER_LOGIN_PATH = "/admin/dashboard";

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

export function getSafeNextPath(next: string | null | undefined) {
  if (
    !next ||
    !next.startsWith("/") ||
    next.startsWith("//") ||
    isAuthPath(next)
  ) {
    return AFTER_LOGIN_PATH;
  }

  return next;
}
