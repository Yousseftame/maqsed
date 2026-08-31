import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getDefaultRedirectPath,
  SESSION_COOKIE,
  isAuthPath,
  isProtectedPath,
} from "@/lib/auth/constants";

export function proxy(request: NextRequest) {
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/developer/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
