"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { ConfirmProvider } from "@/features/admin/components/ConfirmModal";

const SIDEBAR_KEY = "maqsed-admin-sidebar";

export function AdminShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(SIDEBAR_KEY);
    if (stored === "collapsed") setCollapsed(true);
  }, []);

  useEffect(() => {
    document.body.classList.add("is-admin");
    return () => document.body.classList.remove("is-admin");
  }, []);

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
          <main className="flex-1 px-4 pb-8 md:px-8">{children}</main>
        </div>
      </div>
    </ConfirmProvider>
  );
}
