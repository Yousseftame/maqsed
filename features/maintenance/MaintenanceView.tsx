"use client";

import { useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import {
  DEFAULT_MAINTENANCE,
  maintenanceService,
  resolveMaintenanceCopy,
  type MaintenanceSettings,
} from "@/features/maintenance/maintenance.service";

export function MaintenanceView({ settings }: { settings: MaintenanceSettings }) {
  const { t, locale } = useLocale();
  const { title, text } = resolveMaintenanceCopy(settings, locale, {
    title: t("maintenancePage.fallbackTitle"),
    text: t("maintenancePage.fallbackText"),
  });

  useEffect(() => {
    document.body.classList.add("is-maintenance");
    return () => document.body.classList.remove("is-maintenance");
  }, []);

  useEffect(() => {
    const lock = () => {
      window.history.pushState(null, "", "/maintenance");
    };
    lock();
    window.addEventListener("popstate", lock);
    return () => window.removeEventListener("popstate", lock);
  }, []);

  return (
    <div data-maintenance-page className="flex min-h-screen flex-col bg-white">
      <header className="flex items-center justify-between px-6 py-6 md:px-12 lg:px-20">
        <BrandLogo className="h-auto w-[140px] object-contain" priority />
        <LanguageToggle />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24 text-center">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-[#17C3B3]/10 text-[#17C3B3]">
          <TriangleAlert className="h-8 w-8" strokeWidth={2} />
        </div>
        <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[#6A2B92] sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl whitespace-pre-line text-base leading-[1.9] text-[#6B7280] sm:text-lg">
          {text}
        </p>
      </main>
    </div>
  );
}

export function MaintenancePageScreen() {
  const [settings, setSettings] = useState<MaintenanceSettings | null>(null);

  useEffect(() => {
    const unsubscribe = maintenanceService.subscribe((next) => {
      if (!next.enabled) {
        window.location.replace("/");
        return;
      }
      setSettings(next);
    });
    const timeout = window.setTimeout(() => {
      setSettings((current) => current ?? { ...DEFAULT_MAINTENANCE, enabled: true });
    }, 2500);
    return () => {
      unsubscribe();
      window.clearTimeout(timeout);
    };
  }, []);

  if (!settings) {
    return <div className="min-h-screen bg-white" />;
  }

  return <MaintenanceView settings={settings} />;
}
