"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/AuthProvider";
import { clearSessionCookie } from "@/lib/auth/session";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading || user) return;

    const next =
      pathname && pathname !== "/login"
        ? `?next=${encodeURIComponent(pathname)}`
        : "";

    void clearSessionCookie();
    router.replace(`/login${next}`);
  }, [loading, pathname, router, user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0a0f1d]/20 border-t-[#0a0f1d]" />
      </div>
    );
  }

  return children;
}
