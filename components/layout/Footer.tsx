"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export function Footer() {
  const { t } = useLocale();
  
  return (
    <footer className="relative w-full bg-[#0a0f1d] text-white pt-16 pb-8 border-t border-gray-700 rounded-t-[4rem]">
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-20 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Col 1: Brand & Description */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/lgoogg.png"
                alt="MAQSED Logo"
                width={160}
                height={42}
                className="object-contain"
              />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm font-medium">
              {t("footer.description")}
            </p>
          </div>

          {/* Col 2: Contact Us */}
          <div className="flex flex-col gap-5 lg:pe-12">
            <h3 className="text-lg font-bold">{t("footer.contactUs")}</h3>
            <hr className="border-gray-700" />
            <div className="flex flex-col gap-4">
              <a href="mailto:marketing@maqsed.com" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors text-sm w-fit">
                <Mail className="w-4 h-4 shrink-0" />
                <span dir="ltr">marketing@maqsed.com</span>
              </a>
              <div className="flex items-center gap-3 text-gray-300 text-sm w-fit">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{t("footer.location")}</span>
              </div>
              
              <div className="flex items-center gap-4 mt-2">
                <Link href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:bg-white hover:text-[#0a0f1d] transition-all" aria-label={t("footer.socials.linkedin")}>
                  <LinkedinIcon className="w-4 h-4" />
                </Link>
                <Link href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:bg-white hover:text-[#0a0f1d] transition-all" aria-label={t("footer.socials.twitter")}>
                  <TwitterIcon className="w-4 h-4" />
                </Link>
                <Link href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:bg-white hover:text-[#0a0f1d] transition-all" aria-label={t("footer.socials.facebook")}>
                  <FacebookIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Col 3: Important Links */}
          <div className="flex flex-col gap-5 lg:pe-12">
            <h3 className="text-lg font-bold">{t("footer.importantLinks")}</h3>
            <hr className="border-gray-700" />
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-4 mt-1">
              {[
                { label: t("nav.home"), href: "#" },
                { label: t("nav.contact"), href: "#" },
                { label: t("nav.about"), href: "#" },
                { label: t("nav.faq"), href: "#" },
                { label: t("nav.properties"), href: "#" },
                { label: t("nav.blog"), href: "#" },
              ].map((link, idx) => (
                <Link key={idx} href={link.href} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm">
                  <div className="w-1.5 h-1.5 bg-gray-500 shrink-0" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
        </div>

        <hr className="border-gray-700 mb-6" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-sm font-medium">
            {t("footer.rights")}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400 font-medium">
            <Link href="#" className="hover:text-white transition-colors">{t("footer.privacyPolicy")}</Link>
            <Link href="#" className="hover:text-white transition-colors">{t("footer.termsConditions")}</Link>
            <Link href="#" className="hover:text-white transition-colors">{t("footer.techSupport")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
