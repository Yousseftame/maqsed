"use client";

import { useLayoutEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  isMaintenanceExemptPath,
  MAINTENANCE_PATH,
  readMaintenanceCookie,
  writeMaintenanceCookie,
} from "@/lib/auth/constants";
import { maintenanceService } from "@/features/maintenance/maintenance.service";

export function PublicRouteLock({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [blocked, setBlocked] = useState(false);

  useLayoutEffect(() => {
    if (isMaintenanceExemptPath(pathname)) return;
    if (readMaintenanceCookie()) {
      document.documentElement.classList.add("maintenance-pending");
      setBlocked(true);
      window.location.replace(MAINTENANCE_PATH);
      return;
    }

    let cancelled = false;
    void maintenanceService.getSettings().then((settings) => {
      if (cancelled || !settings.enabled) return;
      writeMaintenanceCookie(true);
      document.documentElement.classList.add("maintenance-pending");
      setBlocked(true);
      window.location.replace(MAINTENANCE_PATH);
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useLayoutEffect(() => {
    if (isMaintenanceExemptPath(pathname)) return;
    return maintenanceService.subscribe((settings) => {
      if (!settings.enabled) return;
      writeMaintenanceCookie(true);
      document.documentElement.classList.add("maintenance-pending");
      setBlocked(true);
      window.location.replace(MAINTENANCE_PATH);
    });
  }, [pathname]);

  if (blocked) {
    return <div className="min-h-screen bg-white" />;
  }

  return children;
}
