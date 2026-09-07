"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import {
  isMaintenanceExemptPath,
  isMaintenancePath,
  MAINTENANCE_PATH,
  readMaintenanceCookie,
  writeMaintenanceCookie,
} from "@/lib/auth/constants";
import { maintenanceService } from "@/features/maintenance/maintenance.service";

export function MaintenanceGuard() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (readMaintenanceCookie() && !isMaintenanceExemptPath(pathname)) {
      document.documentElement.classList.add("maintenance-pending");
      window.location.replace(MAINTENANCE_PATH);
    }
  }, [pathname]);

  useLayoutEffect(() => {
    return maintenanceService.subscribe((settings) => {
      writeMaintenanceCookie(settings.enabled);
      if (settings.enabled && !isMaintenanceExemptPath(pathname)) {
        document.documentElement.classList.add("maintenance-pending");
        window.location.replace(MAINTENANCE_PATH);
        return;
      }
      if (!settings.enabled && isMaintenancePath(pathname)) {
        document.documentElement.classList.remove("maintenance-pending");
        window.location.replace("/");
      }
    });
  }, [pathname]);

  return null;
}
