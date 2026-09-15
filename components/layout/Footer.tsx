"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { useCompanyContent } from "@/features/company/useCompanyContent";
import { cn } from "@/lib/utils";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.743l7.724-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const socialIconClass =
  "flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors duration-300 hover:border-[#17C3B3] hover:text-[#17C3B3] hover:bg-[#17C3B3]/10";

function LicenseButton({
  title,
  value,
  label,
  open,
  onToggle,
}: {
  title: string;
  value: string;
  label: string;
  open: boolean;
  onToggle: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }

    function place() {
      const button = buttonRef.current;
      const popup = popupRef.current;
      if (!button || !popup) return;

      const rect = button.getBoundingClientRect();
      const popupWidth = popup.offsetWidth;
      const popupHeight = popup.offsetHeight;
      const gap = 8;
      const pad = 12;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let top = rect.top - gap - popupHeight;
      if (top < pad) top = rect.bottom + gap;
      if (top + popupHeight > vh - pad) {
        top = Math.max(pad, vh - pad - popupHeight);
      }

      let left = rect.left + rect.width / 2 - popupWidth / 2;
      left = Math.min(Math.max(pad, left), Math.max(pad, vw - pad - popupWidth));

      setCoords({ top, left });
    }

    place();
    const frame = requestAnimationFrame(place);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, value, label]);

  return (
    <li className="relative w-full">
      {open
        ? createPortal(
            <div
              ref={popupRef}
              data-license-popup=""
              className="fixed z-[80] flex max-w-[calc(100vw-24px)] flex-wrap items-center justify-center gap-2 rounded-[16px] bg-[#c8c8c8] px-2.5 py-2 sm:gap-3"
              style={
                coords
                  ? { top: coords.top, left: coords.left }
                  : { top: 0, left: 0, visibility: "hidden" }
              }
            >
              <span className="px-1 text-sm font-bold text-[#2e2e2e]">{label}</span>
              {value ? (
                <span
                  dir="ltr"
                  className="inline-flex min-h-9 max-w-full items-center justify-center break-all rounded-[16px] bg-white px-4 py-1.5 text-sm font-medium text-[#2e2e2e]"
                >
                  {value}
                </span>
              ) : null}
            </div>,
            document.body
          )
        : null}
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full items-center justify-center rounded-[16px] bg-white px-6 py-2.5 text-sm font-semibold text-[#2e2e2e] transition-colors hover:bg-[#17C3B3] hover:text-white"
      >
        {title}
      </button>
    </li>
  );
}

export function Footer() {
  const { t, locale } = useLocale();
  const company = useCompanyContent();
  const [openLicenseId, setOpenLicenseId] = useState<string | null>(null);
  const licensesRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!openLicenseId) return;

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (licensesRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest("[data-license-popup]")) return;
      setOpenLicenseId(null);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenLicenseId(null);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openLicenseId]);

  const importantLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.blog"), href: "/blog" },
    { label: t("nav.properties"), href: "/properties" },
    { label: t("nav.units"), href: "/units" },
    { label: t("nav.sell"), href: "/sell" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  const legalLinks = [
    { label: t("footer.privacyPolicy"), href: "/privacy" },
    { label: t("footer.termsConditions"), href: "/terms" },
    { label: t("nav.faq"), href: "/faq" },
  ];

  const contactItems = [
    {
      icon: Phone,
      label: t("contactPage.contactDetails.phone"),
      value: company.phone,
      href: `tel:${company.phone.replace(/\s/g, "")}`,
      dir: "ltr" as const,
    },
    {
      icon: Mail,
      label: t("contactPage.contactDetails.email"),
      value: company.email,
      href: `mailto:${company.email}`,
      dir: "ltr" as const,
    },
    {
      icon: MapPin,
      label: t("contactPage.contactDetails.office"),
      value: company.location,
      href: undefined,
      dir: undefined,
    },
  ];

  const socialLinks = [
    { href: company.linkedin, label: t("footer.socials.linkedin"), icon: LinkedinIcon },
    { href: company.facebook, label: t("footer.socials.facebook"), icon: FacebookIcon },
    { href: company.instagram, label: t("footer.socials.instagram"), icon: InstagramIcon },
    { href: company.twitter, label: t("footer.socials.twitter"), icon: TwitterIcon },
  ].filter((social) => social.href.startsWith("http"));

  return (
    <footer className="w-full bg-[#6A2B92] px-6 pt-12 pb-6 lg:px-12 lg:pt-16 lg:pb-8 text-white/85">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className={cn("grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-8", company.licenses.length > 0 ? "lg:grid-cols-5" : "lg:grid-cols-4")}>
          
          {/* Column 1: Logo & Description */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="w-fit rounded-lg bg-white p-2" aria-label={t("nav.home")}>
              <BrandLogo className="h-auto w-[150px] object-contain" />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/75">
              {t("footer.description")}
            </p>
          </div>

          {company.licenses.length > 0 ? (
            <div className="flex flex-col gap-5">
              <h2 className="text-lg font-bold text-white">{t("footer.licenses")}</h2>
              <ul ref={licensesRef} className="inline-flex w-max flex-col items-stretch gap-2.5">
                {company.licenses.map((item) => (
                  <LicenseButton
                    key={item.id}
                    title={item.title}
                    value={item.value}
                    label={t("footer.trust")}
                    open={openLicenseId === item.id}
                    onToggle={() =>
                      setOpenLicenseId((current) => (current === item.id ? null : item.id))
                    }
                  />
                ))}
              </ul>
            </div>
          ) : null}

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-bold text-white">
              {t("footer.importantLinks")}
            </h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[...importantLinks, ...legalLinks].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/75 transition-colors hover:text-[#17C3B3]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-bold text-white">
              {t("footer.contactUs")}
            </h2>
            <ul className="flex flex-col gap-4">
              {contactItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <li key={idx}>
                    {item.href ? (
                      <a href={item.href} className="flex items-start gap-3 transition-colors hover:text-[#17C3B3]">
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#17C3B3]" />
                        <span className="text-sm text-white/75" dir={item.dir}>{item.value}</span>
                      </a>
                    ) : (
                      <div className="flex items-start gap-3">
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#17C3B3]" />
                        <span className="text-sm text-white/75" dir={item.dir}>{item.value}</span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 4: Socials */}
          {socialLinks.length > 0 ? (
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-bold text-white">
              {locale === 'ar' ? 'تابعنا' : 'Follow Us'}
            </h2>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className={socialIconClass}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
          ) : null}

        </div>

        <hr className="mt-8 mb-6 border-white/20" />
        
        <div className="text-center text-sm text-white/70 flex flex-col gap-2">
          <p>
            {t("footer.rightsPrefix")}{" "}
            <span className="font-semibold text-white">{t("footer.brand")}</span>{" "}
            {t("footer.rightsSuffix")}
          </p>
          <p className="text-white">
            برمجة وتشغيل وسم الإبداع{" "}
            <a
              href="https://www.cbrand.sa/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#17C3B3] transition-colors underline"
            >
              Cbrand.sa
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
