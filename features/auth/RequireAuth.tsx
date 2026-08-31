"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/AuthProvider";
import { clearSessionCookie } from "@/lib/auth/session";
import { getDefaultRedirectPath } from "@/lib/auth/constants";
import type { UserRole } from "@/types/user";

export function RequireAuth({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: UserRole[];
}) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading || (user && userData === undefined)) return;

    if (!user) {
      const next =
        pathname && pathname !== "/login"
          ? `?next=${encodeURIComponent(pathname)}`
          : "";

      void clearSessionCookie();
      router.replace(`/login${next}`);
      return;
    }

    if (allowedRoles && userData && !allowedRoles.includes(userData.role)) {
      // User is logged in but doesn't have the required role
      router.replace(getDefaultRedirectPath(userData.role));
      return;
    }
  }, [loading, pathname, router, user, userData, allowedRoles]);

  if (loading || !user || (user && !userData)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0a0f1d]/20 border-t-[#0a0f1d]" />
      </div>
    );
  }

  return children;
}
