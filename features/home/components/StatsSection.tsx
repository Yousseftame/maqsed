"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import Image from "next/image";

export function StatsSection() {
  const { dictionary, isRtl } = useLocale();

  const stats = dictionary.stats.items;

  return (
    <section className="relative z-30 w-full overflow-hidden bg-[#181a20] px-6 py-16 md:px-12 lg:py-20 border-t border-b border-[#2a2c35]">
      {/* Background Image (Blueprint Pattern) */}
      <div className="absolute inset-0 z-0 opacity-10">
        <Image
          src="/counter-bg.png"
          alt="Background pattern"
          fill
          className="object-cover"
          quality={100}
        />
      </div>

      <div className="relative z-20 mx-auto max-w-[1400px]">
        {/* We use a flex container on desktop to distribute evenly and apply dividers */}
        <div 
          className={`flex flex-col gap-10 md:flex-row md:items-center md:justify-around md:gap-0 md:divide-x md:divide-gray-500 ${isRtl ? 'md:divide-x-reverse' : ''}`}
        >
          {stats.map((stat, i) => (
            <div 
              key={i}
              className="flex w-full flex-col items-center justify-center gap-3 text-center md:w-1/4"
            >
              <div className="flex items-center">
                <span className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-[4rem]">
                  {stat.value}
                </span>
                <span className="text-4xl font-bold text-[#17C3B3] sm:text-5xl lg:text-[3.5rem] ml-1">
                  {stat.suffix}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-300 sm:text-base">
                {stat.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
