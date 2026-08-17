"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

export function AuthShell({ children }: { children: React.ReactNode }) {
  const { locale, t } = useLocale();
  const isAr = locale === "ar";

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex min-h-screen flex-1 flex-col overflow-y-auto">
        <div className="flex-shrink-0 px-8 pt-8 pb-0">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/lgoogg.png"
              alt="Maqsed"
              width={110}
              height={28}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-8 py-12">
          {children}
        </div>

        <p
          className={cn(
            "flex-shrink-0 px-8 pb-6 text-center text-[11px] text-gray-300",
            isAr ? "tracking-normal" : "font-mono uppercase tracking-widest"
          )}
        >
          {t("auth.copyright")}
        </p>
      </div>

      <div className="relative hidden w-[52%] flex-shrink-0 items-center justify-center overflow-hidden bg-[#0a0f1d] p-12 lg:flex">
        <div className="absolute inset-0">
          <Image
            src="/herosectionimg.avif"
            alt={t("auth.imageAlt")}
            fill
            className="object-cover opacity-50 mix-blend-luminosity"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/20 to-transparent" />
        </div>

        <div className="absolute end-0 top-0 h-[40rem] w-[40rem] translate-x-1/3 -translate-y-1/2 rounded-full bg-white/5 blur-[100px] rtl:-translate-x-1/3" />
        <div className="absolute start-0 bottom-0 h-[30rem] w-[30rem] -translate-x-1/3 translate-y-1/3 rounded-full bg-blue-500/10 blur-[120px] rtl:translate-x-1/3" />

        <div className="relative z-10 w-full max-w-lg">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            <span
              className={cn(
                "text-xs font-bold text-white",
                isAr ? "tracking-normal" : "tracking-widest uppercase"
              )}
            >
              {t("auth.panelBadge")}
            </span>
          </div>

          <h2
            className={cn(
              "mb-8 text-[3.5rem] font-bold tracking-tight text-white",
              isAr ? "leading-[1.25]" : "leading-[1.1]"
            )}
          >
            {t("auth.panelTitle1")} <br />
            {t("auth.panelTitle2")}
          </h2>

          <div className="group relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-8 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

            <p className="relative z-10 mb-8 text-lg leading-relaxed text-white/90">
              {t("auth.panelQuote")}
            </p>

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10">
                  <span className="text-lg font-bold text-white">
                    {isAr ? "ر" : "C"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{t("auth.panelRole")}</p>
                  <p className="text-xs text-white/50">{t("auth.panelCompany")}</p>
                </div>
              </div>

              <div className="absolute bottom-0 end-4 translate-y-4 select-none font-serif text-8xl leading-none text-white/10">
                &ldquo;
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute end-0 top-1/2 origin-center translate-x-[40%] -translate-y-1/2 -rotate-90 select-none rtl:-translate-x-[40%] rtl:rotate-90">
          <h2 className="whitespace-nowrap text-[18vh] leading-none font-black tracking-tighter text-white/5">
            {isAr ? "مقصد" : "MAQSED"}
          </h2>
        </div>
      </div>
    </div>
  );
}
