"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CTASection() {
  const { t, isRtl } = useLocale();

  return (
    <section className="relative z-30 w-full bg-white px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-[1400px]">
        <div 
          className="relative flex flex-col items-center justify-center overflow-hidden rounded-[2.5rem] bg-[#0a0f1d] px-6 py-32 text-center shadow-2xl md:px-12"
          style={{
            backgroundImage: "url('/cta-bg-1.jpg')",
            backgroundPosition: "center center",
            backgroundSize: "100% auto",
            backgroundRepeat: "repeat",
            backgroundAttachment: "fixed"
          }}
        >
          {/* Subtle Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-black/20" />

          {/* Content */}
          <div className="relative z-10 flex max-w-4xl flex-col items-center gap-10">
            <h2 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-[4rem]">
              {t("cta.title1")}
              <span className="relative inline-block whitespace-nowrap">
                {t("cta.titleHighlight")}
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 200 16"
                  fill="none"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 5 18 C 80 0, 160 9, 195 9 L 195 11 C 160 11, 80 2, 5 18 Z"
                    fill="white"
                  />
                </svg>
              </span>
              {t("cta.title2")}
            </h2>
            
            <Link
              href="/contact"
              className="group relative mt-6 flex items-center justify-center gap-2.5 rounded-full border-[1.5px] border-white/60 bg-transparent px-8 py-3.5 text-[15px] font-semibold tracking-wide text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white hover:text-[#0a0f1d] sm:px-10"
            >
              <span>{t("cta.button")}</span>
              <ArrowUpRight 
                className={cn(
                  "h-[18px] w-[18px] transition-transform duration-300", 
                  isRtl 
                    ? "-scale-x-100 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" 
                    : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                )} 
                strokeWidth={2.5} 
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
