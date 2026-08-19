"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";

export function VisionMissionSection() {
  const { t, isRtl } = useLocale();

  return (
    <section className="relative w-full bg-[#6A2B92] py-16 lg:py-20 overflow-hidden">
      {/* Central Parallax Window */}
      {/* Absolute positioned in the center, spans full height */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[80%] md:w-[50%] lg:w-[40%] h-[400px] md:h-[500px] lg:h-[550px]"
          style={{
            // Creates the sharp angled parallelogram mask matching the screenshot
            clipPath: isRtl 
              ? "polygon(0 0%, 100% 60%, 100% 100%, 0 40%)" // Mirrored for RTL
              : "polygon(0 60%, 100% 0%, 100% 40%, 0 100%)", // Top-Left, Top-Right, Bottom-Right, Bottom-Left
            // Fixed background for parallax effect
            backgroundImage: "url('/visionmission.webp')",
            backgroundAttachment: "fixed",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 lg:px-12 min-h-[450px] md:min-h-[600px] grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Mission Content (Top Left) */}
        <div 
          className="lg:col-span-4 lg:col-start-1 self-start pt-16"
        >
          <h2 className="mb-6 text-4xl sm:text-5xl font-medium tracking-tight text-white">
            <DiaTextReveal text={t("visionMission.mission.title")} textColor="white" colors={["white"]} />
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-gray-300">
            {t("visionMission.mission.description")}
          </p>
        </div>

        {/* Vision Content (Bottom Right) */}
        <div 
          className="lg:col-span-4 lg:col-start-9 self-end mt-48 lg:mt-0" 
        >
          <h2 className="mb-6 text-4xl sm:text-5xl font-medium tracking-tight text-white">
            <DiaTextReveal text={t("visionMission.vision.title")} textColor="white" colors={["white"]} />
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-gray-300">
            {t("visionMission.vision.description")}
          </p>
        </div>

      </div>
    </section>
  );
}
