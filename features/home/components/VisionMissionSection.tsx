"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { cn } from "@/lib/utils";
import { ContainedCover } from "@/components/ui/ContainedCover";
import { useAboutContent } from "@/features/about/useAboutContent";

export function VisionMissionSection() {
  const { isRtl } = useLocale();
  const content = useAboutContent();

  return (
    <section className="relative z-30 w-full overflow-hidden bg-[#F9FAFB] px-6 pb-24 pt-8 md:px-12 lg:px-20">
      <div className="mx-auto max-w-[1400px]">
        <div
          className={cn(
            "flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm",
            isRtl ? "lg:flex-row-reverse" : "lg:flex-row"
          )}
        >
          <div className="flex flex-1 flex-col justify-center gap-10 p-8 text-start sm:p-10 lg:p-16">
            <div>
              <h2 className="mb-4 text-3xl font-extrabold text-[#6A2B92] sm:text-4xl">
                {content.missionTitle}
              </h2>
              <p className="max-w-xl text-base font-medium leading-relaxed text-gray-500">
                {content.missionSubtitle}
              </p>
            </div>
            <div>
              <h2 className="mb-4 text-3xl font-extrabold text-[#6A2B92] sm:text-4xl">
                {content.visionTitle}
              </h2>
              <p className="max-w-xl text-base font-medium leading-relaxed text-gray-500">
                {content.visionSubtitle}
              </p>
            </div>
          </div>

          <div className="relative min-h-[280px] flex-1 p-4 sm:min-h-[360px] lg:min-h-[auto] lg:p-6">
            <div className="relative h-full min-h-[280px] w-full overflow-hidden rounded-2xl bg-[#F4F4F4] sm:min-h-[360px] lg:min-h-[400px]">
              <ContainedCover src={content.visionMissionImage} alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
