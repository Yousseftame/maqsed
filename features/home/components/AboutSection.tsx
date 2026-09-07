"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { Sparkles, ShieldCheck, Target, Users, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAboutContent } from "@/features/about/useAboutContent";

const FEATURE_ICONS = [Sparkles, ShieldCheck, Target, Users];

export function AboutSection() {
  const { isRtl } = useLocale();
  const content = useAboutContent();

  return (
    <section className="relative z-30 w-full overflow-hidden bg-[#F9FAFB] px-6 py-24 md:px-12 lg:px-20">
      <div className="mx-auto max-w-[1400px]">
        <div className={cn(
          "flex flex-col rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden",
          isRtl ? "lg:flex-row-reverse" : "lg:flex-row"
        )}>
          
          {/* Text Content Side */}
          <div className="flex-1 flex flex-col justify-center p-10 lg:p-16 text-start">
            <div className="mb-6 rounded-full bg-[#17C3B3]/10 px-5 py-2 text-sm font-bold text-[#17C3B3] border border-[#17C3B3]/20 w-fit">
              {content.badge}
            </div>
            
            <h2 className="mb-3 text-4xl font-extrabold text-[#6A2B92] sm:text-5xl">
              {content.title}
            </h2>
            
            <h3 className="mb-8 text-2xl font-bold text-[#0a0f1d] sm:text-3xl">
              {content.subtitle}
            </h3>
            
            <p className="mb-12 text-base leading-relaxed text-gray-500 font-medium max-w-2xl">
              {content.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.features.map((feature, index) => {
                const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length];
                return (
                  <div
                    key={`${feature}-${index}`}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 p-4 bg-white transition-colors hover:border-[#17C3B3] hover:shadow-sm"
                  >
                    <Icon className="h-5 w-5 text-[#17C3B3]" />
                    <span className="text-sm font-bold text-gray-700">
                      {feature}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex">
              <a
                href={content.profilePdf}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#6A2B92] px-8 py-3.5 text-base font-bold text-white transition-all hover:bg-[#522070] hover:scale-105 shadow-md hover:shadow-lg"
              >
                <Download className="h-5 w-5" />
                <span>{content.buttonText}</span>
              </a>
            </div>
          </div>

          {/* Image Side */}
          <div className="flex-1 relative min-h-[400px] lg:min-h-[auto] p-4 lg:p-6">
            <div className="relative h-full w-full rounded-2xl overflow-hidden min-h-[400px]">
              <img
                src={content.aboutImage}
                alt={content.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
