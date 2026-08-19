"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Home, BadgeCheck, Briefcase, ArrowRight, User2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AboutSection() {
  const { isRtl, dictionary: dict } = useLocale();

  return (
    <section className="relative z-30 w-full overflow-hidden bg-[#F9FAFB] px-6 py-24 md:px-12 lg:px-20">
      <div className="mx-auto max-w-[1400px]">
        {/* Top Section */}
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-start">
          <div className="lg:col-span-6 flex flex-col items-start pr-4">
            <div className="mb-5 flex items-center gap-3">
              <span className="text-sm font-bold tracking-widest text-[#6A2B92] uppercase">
                {dict.about.features.pill}
              </span>
              <div className="flex flex-col gap-[3px] w-8">
                <div className="h-[1.5px] w-4 bg-gray-300" />
                <div className="h-[1.5px] w-8 bg-[#17C3B3]" />
              </div>
            </div>
            <h2 className="text-3xl leading-tight font-bold tracking-tight text-[#6A2B92] sm:text-4xl lg:text-[50px]">
              {dict.about.features.title}
            </h2>
          </div>

          <div className="lg:col-span-6 text-gray-500 font-medium leading-relaxed text-sm sm:text-base">
            <p className="mb-6">
              {dict.about.features.description1}
            </p>
            <p>
              {dict.about.features.description2}
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12 items-stretch">
          {/* Left Column (Image + Contact) */}
          <div className="flex flex-col gap-8 lg:col-span-3 h-full justify-between">
            <div className="relative aspect-[4/4.5] w-full overflow-hidden rounded-[2rem]">
              <Image
                src="/geometric/Construction-pana.svg"
                alt="Construction"
                fill
                className="object-contain p-4"
              />
            </div>
            
            <div className="flex items-center gap-4 h-14" data-aos="fade-up" data-aos-delay="400">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                <User2 className="h-7 w-7 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#6A2B92] mb-1">
                  {dict.about.features.callUs}
                </p>
                <p className="text-sm font-bold text-[#17C3B3]">
                  {dict.about.features.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Middle Column (Features + Button) */}
          <div className="flex flex-col gap-10 lg:col-span-3 h-full justify-between">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3" data-aos="fade-up" data-aos-delay="100">
                <div className="flex items-center gap-4">
                  <Home className="h-6 w-6 text-[#17C3B3] shrink-0" />
                  <h3 className="text-base sm:text-lg font-bold text-[#6A2B92]">
                    {dict.about.features.corporate.title}
                  </h3>
                </div>
                <p className="max-w-[340px] text-gray-500 font-medium leading-relaxed mt-1 text-sm">
                  {dict.about.features.corporate.desc}
                </p>
              </div>

              <div className="flex flex-col gap-3" data-aos="fade-up" data-aos-delay="200">
                <div className="flex items-center gap-4">
                  <BadgeCheck className="h-6 w-6 text-[#17C3B3] shrink-0" />
                  <h3 className="text-base sm:text-lg font-bold text-[#6A2B92]">
                    {dict.about.features.experts.title}
                  </h3>
                </div>
                <p className="max-w-[340px] text-gray-500 font-medium leading-relaxed mt-1 text-sm">
                  {dict.about.features.experts.desc}
                </p>
              </div>

              <div className="flex flex-col gap-3" data-aos="fade-up" data-aos-delay="300">
                <div className="flex items-center gap-4">
                  <Briefcase className="h-6 w-6 text-[#17C3B3] shrink-0" />
                  <h3 className="text-base sm:text-lg font-bold text-[#6A2B92]">
                    {dict.about.features.excellence.title}
                  </h3>
                </div>
                <p className="max-w-[340px] text-gray-500 font-medium leading-relaxed mt-1 text-sm">
                  {dict.about.features.excellence.desc}
                </p>
              </div>
            </div>

            <div className="mt-auto flex items-center h-14" data-aos="fade-up" data-aos-delay="500">
              <Link
                href="/about"
                className="group inline-flex w-fit items-center justify-center gap-3 rounded-full bg-[#17C3B3] px-8 h-full font-bold text-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white hover:text-[#17C3B3] hover:ring-1 hover:ring-[#17C3B3]/15 active:scale-[0.98]"
              >
                <span>{dict.about.features.learnMore}</span>
                <ArrowRight className={cn("h-5 w-5 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5", isRtl && "rotate-180 rtl:group-hover:-translate-x-0.5")} strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          {/* Right Column (Large Image) */}
          <div className="lg:col-span-6 h-full min-h-[450px]">
            <div className="relative h-full w-full overflow-hidden rounded-[2.5rem]">
              <Image
                src="/geometric/Construction crane-pana.svg"
                alt="Construction Crane"
                fill
                className="object-contain p-6"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
