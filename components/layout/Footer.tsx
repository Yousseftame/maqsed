"use client";

import Link from "next/link";
import Image from "next/image";
import { Send, ChevronRight, MapPin, Mail, Phone, ArrowUp } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

export function Footer() {
  const { t, isRtl } = useLocale();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer 
      className="relative w-full bg-[#181818] text-white pt-20 pb-8"
      style={{
        backgroundImage: "url('/footer-bg-1.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-20 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-20">
          
          {/* Col 1: Brand & Newsletter */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/lgoogg.png"
                alt="MAQSED Logo"
                width={160}
                height={42}
                className="object-contain"
              />
            </Link>
            
            <div className="flex flex-col gap-4 max-w-sm mt-2">
              <p className="text-white font-bold text-[15px]">{t("footer.newsletter")}</p>
              <div className="relative mt-2 max-w-[280px]">
                <input 
                  type="email" 
                  placeholder={t("footer.emailPlaceholder")}
                  className={cn(
                    "w-full bg-transparent border-b border-gray-600 pb-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors",
                    isRtl ? "ps-8" : "pe-8"
                  )}
                />
                <button className={cn(
                  "absolute bottom-3 text-white hover:text-gray-300 flex items-center justify-center",
                  isRtl ? "left-0" : "right-0"
                )}>
                  <Send className={cn("w-[18px] h-[18px]", isRtl && "-scale-x-100")} />
                </button>
              </div>
            </div>
          </div>

          {/* Col 2: Discover */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h3 className="text-[17px] font-bold">{t("footer.discover")}</h3>
            <div className="flex flex-col gap-4 mt-1">
              {[
                t("search.cities.riyadh"), 
                t("search.cities.jeddah"), 
                t("search.cities.neom"), 
                t("search.cities.dammam"), 
                t("search.cities.khobar"), 
                t("search.cities.mecca")
              ].map((city) => (
                <Link key={city} href="#" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors text-sm">
                  <ChevronRight className={cn("w-3 h-3 shrink-0", isRtl && "rotate-180")} strokeWidth={3} />
                  {city}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <h3 className="text-[17px] font-bold">{t("footer.quickLinks")}</h3>
            <div className="flex flex-col gap-4 mt-1">
              {[
                t("nav.home"), 
                t("nav.properties"), 
                t("nav.sell"), 
                t("nav.contact"), 
                t("footer.latestNews"), 
                t("footer.faqs")
              ].map((link) => (
                <Link key={link} href="#" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors text-sm">
                  <ChevronRight className={cn("w-3 h-3 shrink-0", isRtl && "rotate-180")} strokeWidth={3} />
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 4: Contact Us */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <h3 className="text-[17px] font-bold">{t("footer.contactUs")}</h3>
            <div className="flex flex-col gap-5 mt-1">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-full border border-gray-500 flex items-center justify-center group-hover:border-white transition-colors">
                  <MapPin className="w-5 h-5 text-gray-300" strokeWidth={1.5} />
                </div>
                <p className="text-gray-300 text-sm leading-relaxed pt-1">
                  {t("footer.addressLine1")}<br />{t("footer.addressLine2")}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-full border border-gray-500 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-300" strokeWidth={1.5} />
                </div>
                <a href="mailto:marketing@maqsed.com" className="text-gray-300 hover:text-white transition-colors text-sm">
                  marketing@maqsed.com
                </a>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-11 h-11 rounded-full border border-gray-500 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-gray-300" strokeWidth={1.5} />
                </div>
                <a href="tel:+34123456789" className="text-gray-300 hover:text-white transition-colors text-sm" dir="ltr">
                  (+34) 123-456-789
                </a>
              </div>
            </div>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mt-12 relative">
          
          <p className="text-gray-400 text-sm w-full lg:w-auto text-center lg:text-start">
            {t("footer.rights")}
          </p>

          <div className={cn(
            "flex flex-wrap justify-center lg:justify-end items-center gap-4 md:gap-6 text-[13px] text-gray-300 w-full lg:w-auto",
            isRtl ? "pl-0 lg:pl-16" : "pr-0 lg:pr-16"
          )}>
            <span className="text-white hover:text-gray-300 cursor-pointer transition-colors">{t("footer.currency")}</span>
            
            <span className="text-gray-600 hidden md:inline">|</span>
            
            <div className="flex items-center gap-4 md:gap-6">
              <Link href="#" className="hover:text-white transition-colors">{t("footer.socials.facebook")}</Link>
              <Link href="#" className="hover:text-white transition-colors">{t("footer.socials.linkedin")}</Link>
              <Link href="#" className="hover:text-white transition-colors">{t("footer.socials.youtube")}</Link>
              <Link href="#" className="hover:text-white transition-colors">{t("footer.socials.instagram")}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
