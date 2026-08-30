"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Phone } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

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
  "flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition-colors duration-300 hover:border-[#17C3B3] hover:text-[#17C3B3] hover:bg-[#17C3B3]/10";

export function Footer() {
  const { t, locale } = useLocale();

  const importantLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.properties"), href: "/properties" },
    { label: t("nav.units"), href: "/units" },
    { label: t("nav.sell"), href: "/sell" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  const legalLinks = [
    { label: t("footer.privacyPolicy"), href: "#" },
    { label: t("footer.termsConditions"), href: "#" },
    { label: t("nav.faq"), href: "/faq" },
  ];

  const contactItems = [
    {
      icon: Phone,
      label: t("contactPage.contactDetails.phone"),
      value: t("footer.phone"),
      href: `tel:${t("footer.phone").replace(/\s/g, "")}`,
      dir: "ltr" as const,
    },
    {
      icon: Mail,
      label: t("contactPage.contactDetails.email"),
      value: t("footer.email"),
      href: `mailto:${t("footer.email")}`,
      dir: "ltr" as const,
    },
    {
      icon: MapPin,
      label: t("contactPage.contactDetails.office"),
      value: t("footer.location"),
      href: undefined,
      dir: undefined,
    },
  ];

  return (
    <footer className="w-full bg-[#0a0f1d] px-6 pt-12 pb-6 lg:px-12 lg:pt-16 lg:pb-8 text-gray-300">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          
          {/* Column 1: Logo & Description */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="w-fit rounded-lg bg-white p-2">
              <Image
                src="/svglogo.svg"
                alt="MAQSED Logo"
                width={150}
                height={40}
                className="h-auto w-[150px] object-contain"
              />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-gray-400">
              {t("footer.description")}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-5">
            <h3 className="text-lg font-bold text-white">
              {t("footer.importantLinks")}
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[...importantLinks, ...legalLinks].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-[#17C3B3]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="flex flex-col gap-5">
            <h3 className="text-lg font-bold text-white">
              {t("footer.contactUs")}
            </h3>
            <ul className="flex flex-col gap-4">
              {contactItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <li key={idx}>
                    {item.href ? (
                      <a href={item.href} className="flex items-start gap-3 transition-colors hover:text-[#17C3B3]">
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#17C3B3]" />
                        <span className="text-sm text-gray-400" dir={item.dir}>{item.value}</span>
                      </a>
                    ) : (
                      <div className="flex items-start gap-3">
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#17C3B3]" />
                        <span className="text-sm text-gray-400" dir={item.dir}>{item.value}</span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 4: Socials */}
          <div className="flex flex-col gap-5">
            <h3 className="text-lg font-bold text-white">
              {locale === 'ar' ? 'تابعنا' : 'Follow Us'}
            </h3>
            <div className="flex items-center gap-3">
              <Link href="#" className={socialIconClass} aria-label={t("footer.socials.linkedin")}>
                <LinkedinIcon className="h-4 w-4" />
              </Link>
              <Link href="#" className={socialIconClass} aria-label={t("footer.socials.facebook")}>
                <FacebookIcon className="h-4 w-4" />
              </Link>
              <Link href="#" className={socialIconClass} aria-label={t("footer.socials.instagram")}>
                <InstagramIcon className="h-4 w-4" />
              </Link>
              <Link href="#" className={socialIconClass} aria-label={t("footer.socials.twitter")}>
                <TwitterIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>

        <hr className="mt-8 mb-6 border-gray-800" />
        
        <div className="text-center text-sm text-gray-500 flex flex-col gap-2">
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
