"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/providers/LocaleProvider";
import { LanguageToggle } from "@/components/layout/LanguageToggle";

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { locale, isRtl, setLocale, t } = useLocale();

  type NavLink = {
    name: string;
    href?: string;
    dropdown?: { name: string; href: string }[];
  };

  const navLinks: NavLink[] = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.about"), href: "/about" },
    { 
      name: isRtl ? "المشاريع" : "Projects", 
      dropdown: [
        { name: isRtl ? "وحدات مستقلة" : "Independent Units", href: "/properties" },
        { name: isRtl ? "وحدات" : "Units", href: "/properties" },
      ]
    },
  ];

  const menuOrigin = isRtl ? "28px 32px" : "calc(100% - 28px) 32px";

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-white">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/svglogo.svg"
                alt="MAQSED Logo"
                width={180}
                height={48}
                className="w-[150px] h-auto object-contain"
                priority
              />
            </Link>
          </div>

          <nav className="hidden items-center gap-5 md:flex">
            {navLinks.map((link) => {
              if (link.dropdown) {
                const isActive = pathname.startsWith("/properties");
                return (
                  <div key={link.name} className="group relative flex h-16 items-center">
                    <div
                      className={cn(
                        "flex cursor-pointer items-center gap-1.5 text-[16px] transition-colors duration-200",
                        isActive
                          ? "font-medium text-[#6A2B92]"
                          : "font-normal text-[#6B7280] group-hover:text-[#6A2B92]"
                      )}
                    >
                      <span className="relative">
                        {link.name}
                        {isActive && (
                          <div className="absolute -bottom-[2px] left-1/2 h-[3px] w-4 -translate-x-1/2 rounded-full bg-[#17C3B3]" />
                        )}
                        {!isActive && (
                          <div className="absolute -bottom-[2px] left-1/2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-[#17C3B3] transition-all duration-300 group-hover:w-full" />
                        )}
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-50 transition-transform group-hover:rotate-180" />
                    </div>
                    
                    <div className="absolute start-0 top-full hidden w-48 flex-col rounded-xl border border-gray-100 bg-white p-2 shadow-lg group-hover:flex">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#6A2B92] hover:font-bold"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <div key={link.name} className="group flex h-16 items-center">
                  <Link
                    href={link.href!}
                    className={cn(
                      "relative flex items-center gap-1.5 text-[16px] transition-colors duration-200",
                      isActive
                        ? "font-medium text-[#6A2B92]"
                        : "font-normal text-[#6B7280] group-hover:text-[#6A2B92]"
                    )}
                  >
                    {link.name}

                    {isActive && (
                      <div className="absolute -bottom-[2px] left-1/2 h-[3px] w-4 -translate-x-1/2 rounded-full bg-[#17C3B3]" />
                    )}

                    {!isActive && (
                      <div className="absolute -bottom-[2px] left-1/2 h-[3px] w-0 -translate-x-1/2 rounded-full bg-[#17C3B3] transition-all duration-300 group-hover:w-full" />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <LanguageToggle />

            <Link
              href="/contact"
              className="rounded-full bg-[#17C3B3] px-6 py-2 text-[16px] font-medium text-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white hover:text-[#17C3B3] hover:ring-1 hover:ring-[#17C3B3]/15"
            >
              {t("nav.contact")}
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-[#6A2B92]"
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
          "fixed inset-0 z-[100] flex flex-col bg-white text-[#6A2B92] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden",
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
              src="/svglogo.svg"
              alt="MAQSED Logo"
              width={180}
              height={48}
              className="w-[150px] h-auto object-contain"
            />
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-gray-400 transition-colors hover:text-[#6A2B92]"
          >
            <X className="h-8 w-8" />
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-center px-6 pb-10 sm:px-10">
          <nav className="flex flex-col gap-5">
            {navLinks.map((link, i) => (
              <div key={link.name} className="overflow-hidden">
                {link.dropdown ? (
                  <div
                    className="flex flex-col gap-2 transition-all duration-500"
                    style={{
                      transform: isMobileMenuOpen ? "translateY(0)" : "translateY(100%)",
                      opacity: isMobileMenuOpen ? 1 : 0,
                      transition: `all 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${isMobileMenuOpen ? 0.2 + i * 0.1 : 0}s`,
                    }}
                  >
                    <div className="flex items-end gap-4 text-[42px] font-light tracking-tighter sm:text-[56px] text-[#6A2B92]">
                      <span className="mb-3 font-mono text-sm text-gray-300 sm:mb-5">0{i + 1}</span>
                      <span className="relative inline-block leading-none pb-2">
                        {link.name}
                        <span className="absolute bottom-0 start-0 h-[3px] w-full bg-[#17C3B3]" />
                      </span>
                    </div>
                    <div className="ms-12 mt-2 flex flex-col gap-4">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-2xl font-light text-gray-500 transition-colors hover:text-[#6A2B92]"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.href!}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "group flex items-end gap-4 text-[42px] font-light tracking-tighter transition-all duration-500 sm:text-[56px]",
                      pathname === link.href ? "text-[#6A2B92]" : "text-gray-400 hover:text-[#6A2B92]"
                    )}
                    style={{
                      transform: isMobileMenuOpen ? "translateY(0)" : "translateY(100%)",
                      opacity: isMobileMenuOpen ? 1 : 0,
                      transition: `all 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${isMobileMenuOpen ? 0.2 + i * 0.1 : 0}s`,
                    }}
                  >
                    <span className="mb-3 font-mono text-sm text-gray-300 transition-colors duration-500 group-hover:text-gray-400 sm:mb-5">
                      0{i + 1}
                    </span>
                    <span className="relative inline-block leading-none pb-2">
                      {link.name}
                      <span
                        className={cn(
                          "absolute bottom-0 start-0 h-[3px] bg-[#17C3B3] transition-all duration-500 ease-out",
                          pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                        )}
                      />
                    </span>
                  </Link>
                )}
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
              dir="ltr"
              onClick={() => setLocale(locale === "en" ? "ar" : "en")}
              className="relative flex h-14 w-full items-center justify-between overflow-hidden rounded-full border border-[#6A2B92] p-1"
            >
              <div
                className={cn(
                  "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-[#6A2B92] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  locale === "en" ? "start-1" : "start-[calc(50%+3px)]"
                )}
              />
              <div
                className={cn(
                  "relative z-10 w-1/2 text-center text-lg font-bold transition-colors duration-500",
                  locale === "en" ? "text-white" : "text-[#6A2B92]"
                )}
              >
                {t("nav.english")}
              </div>
              <div
                className={cn(
                  "relative z-10 w-1/2 text-center text-lg font-bold transition-colors duration-500",
                  locale === "ar" ? "text-white" : "text-[#6A2B92]"
                )}
              >
                {t("nav.arabic")}
              </div>
            </button>

            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full rounded-full bg-[#17C3B3] px-6 py-4 text-center text-lg font-medium text-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white hover:text-[#17C3B3] hover:ring-1 hover:ring-[#17C3B3]/15"
            >
              {t("nav.contact")}
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
