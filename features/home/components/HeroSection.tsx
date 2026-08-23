"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import Link from "next/link";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";

export function HeroSection() {
  const { t, isRtl } = useLocale();

  return (
    <section className="relative flex min-h-[450px] w-full flex-col lg:flex-row items-center justify-between overflow-hidden bg-[#3E1854]">
      
      {/* Background Graphic */}
      <div 
        className={`absolute top-0 bottom-0 end-0 w-full lg:w-[75%] h-full opacity-50 pointer-events-none z-0 mix-blend-overlay ${!isRtl ? "scale-x-[-1]" : ""}`}
        style={{
          backgroundImage: "url('/Gemini_Generated_Image_kax3jnkax3jnkax3.jpg')",
          backgroundSize: "70%",
          backgroundRepeat: "repeat",
          backgroundPosition: "left top",
          maskImage: "linear-gradient(to right, black 5%, transparent 75%)",
          WebkitMaskImage: "linear-gradient(to right, black 5%, transparent 75%)"
        }}
      />




      <div className="mx-auto w-full max-w-[1400px] flex flex-col lg:flex-row items-center justify-start z-10 relative px-6 py-16 sm:px-12 lg:px-20 lg:py-20">
        <div className="w-full lg:w-[65%] flex flex-col items-center lg:items-start text-center lg:text-start text-white">
          <h1 className="mb-5 text-3xl sm:text-4xl lg:text-[46px] font-bold leading-[1.4] tracking-tight text-white w-full whitespace-pre-line">
            <DiaTextReveal 
              text={t("hero.title")} 
              textColor="#ffffff" 
              colors={["#ffffff"]} 
            />
          </h1>
          
          <div className="mb-8 flex flex-col gap-4 text-sm sm:text-base lg:text-lg text-gray-200 leading-relaxed max-w-2xl">
            <p>{t("hero.subtitle1")}</p>
            <p>{t("hero.subtitle2")}</p>
            <p className="font-bold mt-1 text-white">{t("hero.subtitle3")}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 w-full sm:w-auto">
            <Link 
              href="/about"
              className="w-full sm:w-auto sm:min-w-[160px] lg:min-w-[180px] rounded-xl border-2 border-white/90 text-white hover:bg-white hover:text-[#3E1854] px-8 py-3 text-base font-bold transition-colors text-center"
            >
              {t("hero.secondaryButton")}
            </Link>
            <Link 
              href="/contact"
              className="w-full sm:w-auto sm:min-w-[160px] lg:min-w-[180px] rounded-xl bg-white text-[#3E1854] px-8 py-3 text-base font-bold transition-colors hover:bg-gray-100 text-center border-2 border-white"
            >
              {t("hero.primaryButton")}
            </Link>
          </div>
        </div>
      </div>
      
    </section>
  );
}
