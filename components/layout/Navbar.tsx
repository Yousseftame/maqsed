"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/providers/LocaleProvider";

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { locale, isRtl, setLocale, t } = useLocale();

  const navLinks = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.properties"), href: "/properties" },
    { name: t("nav.sell"), href: "/sell" },
    { name: t("nav.contact"), href: "/contact" },
  ];

  const menuOrigin = isRtl ? "28px 32px" : "calc(100% - 28px) 32px";

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-white">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/lgoogg.png"
                alt="MAQSED Logo"
                width={120}
                height={32}
                className="object-contain"
                priority
              />
            </Link>
          </div>

          <nav className="hidden items-center gap-5 md:flex">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <div key={link.href} className="group flex h-16 items-center">
                  <Link
                    href={link.href}
                    className={cn(
                      "relative flex items-center gap-1.5 text-[16px] transition-colors duration-200",
                      isActive
                        ? "font-medium text-[#0a0f1d]"
                        : "font-normal text-[#6B7280] group-hover:text-[#0a0f1d]"
                    )}
                  >
                    {link.name}

                    {isActive && (
                      <div className="absolute -bottom-[2px] left-1/2 h-[3px] w-4 -translate-x-1/2 rounded-full bg-[#0a0f1d]" />
                    )}

                    {!isActive && (
                      <div className="absolute -bottom-[2px] left-1/2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-[#0a0f1d] transition-all duration-300 group-hover:w-full" />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <button
              type="button"
              onClick={() => setLocale(locale === "en" ? "ar" : "en")}
              className="group relative flex h-[40px] w-[76px] items-center justify-center overflow-hidden rounded-full bg-[#0a0f1d] text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
              aria-label="Switch language"
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
                      ? "text-[#0a0f1d]"
                      : "text-gray-400 group-hover:text-white"
                  )}
                >
                  EN
                </span>
                <span
                  className={cn(
                    "transition-colors duration-500",
                    locale === "ar"
                      ? "text-[#0a0f1d]"
                      : "text-gray-400 group-hover:text-white"
                  )}
                >
                  AR
                </span>
              </div>
            </button>

            <Link
              href="/login"
              className="rounded-full border border-[#0a0f1d] px-6 py-2 text-[16px] font-medium text-[#0a0f1d] transition-colors duration-300 hover:bg-[#0a0f1d] hover:text-white"
            >
              {t("nav.signIn")}
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-[#0a0f1d]"
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-[100] flex flex-col bg-white text-[#0a0f1d] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden",
          isMobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
        style={{
          WebkitClipPath: isMobileMenuOpen
            ? `circle(150% at ${menuOrigin})`
            : `circle(0% at ${menuOrigin})`,
          clipPath: isMobileMenuOpen
            ? `circle(150% at ${menuOrigin})`
            : `circle(0% at ${menuOrigin})`,
        }}
      >
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Image
              src="/lgoogg.png"
              alt="MAQSED Logo"
              width={120}
              height={32}
              className="object-contain"
            />
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-gray-400 transition-colors hover:text-[#0a0f1d]"
          >
            <X className="h-8 w-8" />
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-center px-6 pb-10 sm:px-10">
          <nav className="flex flex-col gap-5">
            {navLinks.map((link, i) => (
              <div key={link.href} className="overflow-hidden">
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "group flex items-end gap-4 text-[42px] font-light tracking-tighter transition-all duration-500 sm:text-[56px]",
                    pathname === link.href
                      ? "text-[#0a0f1d]"
                      : "text-gray-400 hover:text-[#0a0f1d]"
                  )}
                  style={{
                    transform: isMobileMenuOpen
                      ? "translateY(0)"
                      : "translateY(100%)",
                    opacity: isMobileMenuOpen ? 1 : 0,
                    transition: `all 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${
                      isMobileMenuOpen ? 0.2 + i * 0.1 : 0
                    }s`,
                  }}
                >
                  <span className="mb-3 font-mono text-sm text-gray-300 transition-colors duration-500 group-hover:text-gray-400 sm:mb-5">
                    0{i + 1}
                  </span>
                  <span className="relative inline-block leading-none pb-2">
                    {link.name}
                    <span
                      className={cn(
                        "absolute bottom-0 start-0 h-[3px] bg-[#0a0f1d] transition-all duration-500 ease-out",
                        pathname === link.href
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      )}
                    />
                  </span>
                </Link>
              </div>
            ))}
          </nav>
        </div>

        <div
          className="flex flex-col gap-6 px-6 pb-8 sm:px-10"
          style={{
            transform: isMobileMenuOpen ? "translateY(0)" : "translateY(20px)",
            opacity: isMobileMenuOpen ? 1 : 0,
            transition: `all 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${
              isMobileMenuOpen ? 0.2 + navLinks.length * 0.1 : 0
            }s`,
          }}
        >
          <div className="flex w-full flex-col gap-4 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={() => setLocale(locale === "en" ? "ar" : "en")}
              className="relative flex h-14 w-full items-center justify-between overflow-hidden rounded-full border border-[#0a0f1d] p-1"
            >
              <div
                className={cn(
                  "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-[#0a0f1d] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  locale === "en" ? "start-1" : "start-[calc(50%+3px)]"
                )}
              />
              <div
                className={cn(
                  "relative z-10 w-1/2 text-center text-lg font-bold transition-colors duration-500",
                  locale === "en" ? "text-white" : "text-[#0a0f1d]"
                )}
              >
                {t("nav.english")}
              </div>
              <div
                className={cn(
                  "relative z-10 w-1/2 text-center text-lg font-bold transition-colors duration-500",
                  locale === "ar" ? "text-white" : "text-[#0a0f1d]"
                )}
              >
                {t("nav.arabic")}
              </div>
            </button>

            <Link
              href="/login"
              className="w-full rounded-full border border-[#0a0f1d] px-6 py-4 text-center text-lg font-medium text-[#0a0f1d] transition-colors duration-300 hover:bg-[#0a0f1d] hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("nav.signIn")}
            </Link>
          </div>

          <div className="flex items-center justify-between pt-2 font-mono text-[11px] tracking-widest text-gray-400 uppercase">
            <span>© 2026 MAQSED</span>
            <span>{t("nav.rights")}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
