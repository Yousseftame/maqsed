"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function CTASection() {
  const { t } = useLocale();

  return (
    <section className="relative z-30 w-full bg-white px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="relative flex flex-col lg:flex-row items-center justify-between overflow-hidden rounded-[2rem] bg-[#f8f8f8] px-8 py-12 md:px-16 lg:py-20 gap-12 lg:gap-8 border border-gray-100">
          
          <div className="w-full lg:w-1/2 flex flex-col items-start text-start">
            
            {/* Pill */}
            <div className="mb-6 inline-flex items-center justify-center rounded-full border border-[#ea8f35] px-6 py-1.5 text-sm font-semibold text-[#ea8f35]">
              {t("cta.pill")}
            </div>
            
            {/* Title */}
            <h2 className="mb-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2c2c2c]">
              {t("cta.title")}
            </h2>
            
            {/* Subtitle */}
            <p className="mb-10 text-base sm:text-lg lg:text-xl font-medium text-gray-600 leading-relaxed max-w-lg">
              {t("cta.subtitle")}
            </p>
            
            {/* Bullet points */}
            <ul className="mb-12 flex flex-col gap-4">
              {[t("cta.bullet1"), t("cta.bullet2"), t("cta.bullet3")].map((bullet, idx) => (
                <li key={idx} className="flex items-center gap-3 text-[#444444] font-semibold text-base sm:text-lg">
                  <div className="flex-shrink-0 flex items-center justify-center">
                    <Check className="h-5 w-5 text-[#ea8f35]" strokeWidth={3} />
                  </div>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            
            {/* Button */}
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-[#ea8f35] px-10 py-4 text-[16px] font-bold tracking-wide text-white transition-all duration-300 hover:bg-[#d97c23] shadow-md hover:shadow-lg"
            >
              {t("cta.button")}
            </Link>
            
          </div>
          
          <div className="w-full lg:w-[45%] flex items-center justify-center">
            <div className="relative w-full aspect-[4/3] max-w-[600px]">
              <Image
                src="/add_partener.png"
                alt={t("cta.title")}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
