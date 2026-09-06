"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { ConfirmProvider } from "@/features/admin/components/ConfirmModal";
import { usePermissions } from "@/features/admin/permissions/usePermissions";

const SIDEBAR_KEY = "maqsed-admin-sidebar";

export function AdminShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { canAccessPath } = usePermissions();
  const allowed = canAccessPath(pathname);

  useEffect(() => {
    const stored = window.localStorage.getItem(SIDEBAR_KEY);
    if (stored === "collapsed") setCollapsed(true);
  }, []);

  useEffect(() => {
    document.body.classList.add("is-admin");
    return () => document.body.classList.remove("is-admin");
  }, []);

  useEffect(() => {
    if (!allowed) {
      router.replace("/admin/dashboard");
    }
  }, [allowed, router]);

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(SIDEBAR_KEY, next ? "collapsed" : "expanded");
      return next;
    });
  }

  return (
    <ConfirmProvider>
      <div className="flex min-h-screen bg-[#F4F4F4] text-[#0a0f1d]">
        <AdminSidebar
          mobileOpen={mobileOpen}
          collapsed={collapsed}
          onMobileClose={() => setMobileOpen(false)}
          onToggle={toggleCollapsed}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader
            collapsed={collapsed}
            onMobileOpen={() => setMobileOpen(true)}
            onToggle={toggleCollapsed}
          />
          <main className="flex-1 px-4 pb-8 md:px-8">
            {allowed ? children : (
              <div className="flex min-h-[40vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0a0f1d]/20 border-t-[#0a0f1d]" />
              </div>
            )}
          </main>
        </div>
      </div>
    </ConfirmProvider>
  );
}
