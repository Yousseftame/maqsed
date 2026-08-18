"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();

  return (
    <button
      type="button"
      dir="ltr"
      onClick={() => setLocale(locale === "en" ? "ar" : "en")}
      className={cn(
        "group relative flex h-[40px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#6A2B92] text-white shadow-sm transition-transform hover:scale-105 active:scale-95",
        className
      )}
      aria-label={t("nav.switchLanguage")}
    >
      <div
        className={cn(
          "absolute top-1 bottom-1 w-[34px] rounded-full bg-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          locale === "en" ? "start-1" : "start-[38px]"
        )}
      />
      <div className="relative z-10 flex w-full justify-between px-3 text-[13px] font-bold tracking-wider">
        <span
          className={cn(
            "transition-colors duration-500",
            locale === "en"
              ? "text-[#6A2B92]"
              : "text-gray-400 group-hover:text-white"
          )}
        >
          EN
        </span>
        <span
          className={cn(
            "transition-colors duration-500",
            locale === "ar"
              ? "text-[#6A2B92]"
              : "text-gray-400 group-hover:text-white"
          )}
        >
          AR
        </span>
      </div>
    </button>
  );
}
