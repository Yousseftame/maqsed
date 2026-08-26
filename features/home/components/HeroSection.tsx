"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";

export function HeroSection() {
  const { t, isRtl } = useLocale();

  return (
    <section className="relative flex min-h-[600px] sm:min-h-[700px] w-full items-center justify-center overflow-hidden">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: "url('/9.avif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay to ensure text is readable */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 flex flex-col items-center justify-center text-center text-white">
        <h1 className="mb-6 text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.3] tracking-tight text-white w-full whitespace-pre-line drop-shadow-lg">
          <DiaTextReveal 
            text={t("hero.title")} 
            textColor="#ffffff" 
            colors={["#ffffff"]} 
          />
        </h1>
        
        <p className="mb-10 text-lg sm:text-xl lg:text-2xl font-medium text-gray-100 drop-shadow-md">
          {t("hero.subtitle3")}
        </p>
      </div>
      
    </section>
  );
}
