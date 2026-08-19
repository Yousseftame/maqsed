"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";

export function AuthShell({ children }: { children: React.ReactNode }) {
  const { locale, t } = useLocale();
  const isAr = locale === "ar";

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex min-h-screen flex-1 flex-col overflow-y-auto">
        <div className="flex-shrink-0 flex items-center justify-between px-8 pt-8 pb-0">
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
          <Link 
            href="/" 
            className="group flex items-center gap-2 text-sm font-medium tracking-wide text-[#8c8c8c] transition-colors duration-200 hover:text-[#3E1854]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
            {t("auth.backToWebsite")}
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

      <div className="relative hidden w-[52%] flex-shrink-0 items-center justify-center overflow-hidden bg-[#3E1854] lg:flex">
        
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 w-full h-full opacity-15 mix-blend-overlay"
          style={{
            backgroundImage: "url('/Gemini_Generated_Image_kax3jnkax3jnkax3.jpg')",
            backgroundSize: "70%",
            backgroundRepeat: "repeat",
            backgroundPosition: "left top"
          }}
        />

        {/* Centered Icon */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <img
            src="/iconheroimg.png"
            alt="Maqsed Icon"
            className="h-[350px] w-auto object-contain brightness-[3] contrast-200 grayscale lg:h-[550px] -translate-y-12 lg:-translate-y-24"
          />
        </div>
      </div>
    </div>
  );
}
