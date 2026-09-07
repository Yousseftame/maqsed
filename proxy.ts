import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getDefaultRedirectPath,
  SESSION_COOKIE,
  MAINTENANCE_COOKIE,
  MAINTENANCE_PATH,
  isAuthPath,
  isMaintenanceExemptPath,
  isMaintenancePath,
  isProtectedPath,
} from "@/lib/auth/constants";
import { getMaintenanceEnabled } from "@/lib/maintenance/is-enabled.edge";

function withMaintenanceCookie(response: NextResponse, enabled: boolean) {
  response.cookies.set(MAINTENANCE_COOKIE, enabled ? "1" : "0", {
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    maxAge: 60 * 60 * 24,
  });
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (isProtectedPath(pathname) && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPath(pathname) && hasSession) {
    return NextResponse.redirect(new URL(getDefaultRedirectPath(), request.url));
  }

  if (isMaintenanceExemptPath(pathname) && !isMaintenancePath(pathname)) {
    return NextResponse.next();
  }

  const live = await getMaintenanceEnabled();
  const cookieOn = request.cookies.get(MAINTENANCE_COOKIE)?.value === "1";
  const maintenanceOn = live === null ? cookieOn : live;

  if (maintenanceOn && !isMaintenancePath(pathname)) {
    return withMaintenanceCookie(NextResponse.redirect(new URL(MAINTENANCE_PATH, request.url)), true);
  }

  if (!maintenanceOn && isMaintenancePath(pathname)) {
    return withMaintenanceCookie(NextResponse.redirect(new URL("/", request.url)), false);
  }

  return withMaintenanceCookie(NextResponse.next(), maintenanceOn);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2)$).*)",
  ],
};
