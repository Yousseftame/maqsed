"use client";

import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { PropertySearchBar } from "@/features/home/components/PropertySearchBar";

export function PropertiesHero() {
  return (
    <section className="relative z-30 flex w-full flex-col items-center bg-white px-6 pb-20 pt-16 md:pt-20 lg:pt-24">
      <div className="group mb-8 inline-flex cursor-default items-center gap-2 rounded-full border border-gray-200 px-3.5 py-1.5 transition-colors duration-300 hover:bg-[#0a0f1d]">
        <div className="h-3 w-3 flex-shrink-0 rounded-full bg-[#0a0f1d] transition-colors duration-300 group-hover:bg-white" />
        <span className="text-sm font-medium tracking-wide text-[#0a0f1d] transition-colors duration-300 group-hover:text-white">
          Explore Properties
        </span>
      </div>

      <h1 className="mb-5 flex max-w-5xl flex-col items-center justify-center gap-1 overflow-visible text-center text-[clamp(36px,5.5vw,72px)] font-bold leading-[1.2] tracking-tight text-[#0a0f1d]">
        <DiaTextReveal
          text="Perfect Family Homes for"
          textColor="#0a0f1d"
          colors={["#0a0f1d"]}
          startOnView={false}
          className="leading-[1.2]"
        />
        <DiaTextReveal
          text="Comfort and Togetherness"
          textColor="#0a0f1d"
          colors={["#0a0f1d"]}
          startOnView={false}
          delay={0.12}
          className="leading-[1.2]"
        />
      </h1>

      <p className="mb-16 max-w-2xl text-center text-base font-semibold leading-snug tracking-normal text-[#8c8c8c] sm:text-lg">
        Discover spacious and welcoming family houses designed for a warm,
        secure, and joyful living experience.
      </p>

      <PropertySearchBar />
    </section>
  );
}
