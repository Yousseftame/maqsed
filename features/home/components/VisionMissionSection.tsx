"use client";

import Image from "next/image";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { CheckCircle2 } from "lucide-react";

export function VisionMissionSection() {
  const { t, locale } = useLocale();

  return (
    <section className="relative w-full bg-white py-24 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/choose-bg.jpg"
          alt="Background pattern"
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12 lg:px-20">
        <div className="flex flex-col gap-24 lg:gap-32">
          
          {/* Mission Section (Image Left, Text Right) */}
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
            {/* Image */}
            <div className="relative w-full lg:w-1/2" data-aos="fade-right">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem]">
                <Image
                  src="/properites/1.webp"
                  alt="Our Mission"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="flex w-full flex-col lg:w-1/2" data-aos="fade-left">
              <div className="mb-6 flex items-center gap-4">
                <div className="relative flex flex-col justify-end h-3 w-12">
                  <div className="absolute top-0 right-0 h-[2px] w-6 bg-[#0a0f1d]/40" />
                  <div className="absolute bottom-0 left-0 h-[2px] w-12 bg-[#0a0f1d]" />
                </div>
                <span className="text-sm font-bold tracking-[0.2em] text-[#0a0f1d] uppercase">
                  {t("visionMission.mission.title")}
                </span>
              </div>
              <h2 className="mb-8 text-4xl font-bold leading-tight tracking-tight text-[#0a0f1d] sm:text-5xl lg:text-6xl">
                <DiaTextReveal
                  key={`mission-title-${locale}`}
                  text={t("visionMission.mission.title")}
                  textColor="#0a0f1d"
                  colors={["#0a0f1d"]}
                />
              </h2>
              <p className="mb-10 text-lg leading-relaxed text-[#6B7280]">
                {t("visionMission.mission.description")}
              </p>
              
              <ul className="flex flex-col gap-4">
                <li className="flex items-center gap-3 text-[#0a0f1d] font-medium">
                  <div className="h-2 w-2 rounded-full bg-[#0a0f1d]" />
                  Innovative Solutions
                </li>
                <li className="flex items-center gap-3 text-[#0a0f1d] font-medium">
                  <div className="h-2 w-2 rounded-full bg-[#0a0f1d]" />
                  Transparent Process
                </li>
                <li className="flex items-center gap-3 text-[#0a0f1d] font-medium">
                  <div className="h-2 w-2 rounded-full bg-[#0a0f1d]" />
                  24/7 Support
                </li>
              </ul>
            </div>
          </div>

          {/* Vision Section (Text Left, Image Right) */}
          <div className="flex flex-col-reverse items-center gap-12 lg:flex-row lg:gap-20">
            {/* Text Content */}
            <div className="flex w-full flex-col lg:w-1/2" data-aos="fade-right">
              <div className="mb-6 flex items-center gap-4">
                <div className="relative flex flex-col justify-end h-3 w-12">
                  <div className="absolute top-0 right-0 h-[2px] w-6 bg-[#0a0f1d]/40" />
                  <div className="absolute bottom-0 left-0 h-[2px] w-12 bg-[#0a0f1d]" />
                </div>
                <span className="text-sm font-bold tracking-[0.2em] text-[#0a0f1d] uppercase">
                  {t("visionMission.vision.title")}
                </span>
              </div>
              <h2 className="mb-8 text-4xl font-bold leading-tight tracking-tight text-[#0a0f1d] sm:text-5xl lg:text-6xl">
                <DiaTextReveal
                  key={`vision-title-${locale}`}
                  text={t("visionMission.vision.title")}
                  textColor="#0a0f1d"
                  colors={["#0a0f1d"]}
                />
              </h2>
              <p className="mb-10 text-lg leading-relaxed text-[#6B7280]">
                {t("visionMission.vision.description")}
              </p>

              <ul className="flex flex-col gap-4">
                <li className="flex items-center gap-3 text-[#0a0f1d] font-medium">
                  <div className="h-2 w-2 rounded-full bg-[#0a0f1d]" />
                  Global Reach
                </li>
                <li className="flex items-center gap-3 text-[#0a0f1d] font-medium">
                  <div className="h-2 w-2 rounded-full bg-[#0a0f1d]" />
                  Industry Leadership
                </li>
                <li className="flex items-center gap-3 text-[#0a0f1d] font-medium">
                  <div className="h-2 w-2 rounded-full bg-[#0a0f1d]" />
                  Cutting-edge Technology
                </li>
              </ul>
            </div>

            {/* Image */}
            <div className="relative w-full lg:w-1/2" data-aos="fade-left">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem]">
                <Image
                  src="/properites/2.webp"
                  alt="Our Vision"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
